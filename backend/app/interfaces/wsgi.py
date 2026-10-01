from __future__ import annotations

import json
import logging
import time
from collections.abc import Callable, Iterable
from typing import Any

from app.adapters.nvidia_client import NvidiaClient
from app.application.catalog_service import CatalogService
from app.application.tutor_service import TutorService

StartResponse = Callable[[str, list[tuple[str, str]], Any], None]

logger = logging.getLogger(__name__)

# Tope de cuerpo: el maximo valido son 20 mensajes x 2000 caracteres
# (~40 KB de texto). 512 KiB deja margen holgado para el JSON con
# escapes unicode y, aun asi, impide que un CONTENT_LENGTH mentiroso
# obligue a leer memoria sin limite (DoS por allocation).
MAX_BODY_BYTES = 512 * 1024

# Cuantas claves (IPs) recordamos a la vez. El limite por clave protege
# contra abuso; este limite protege la memoria del propio contenedor.
RATE_LIMIT_MAX_KEYS = 4096


class RateLimiter:
    """Ventana fija de tiempo por clave (IP). Sin dependencias ni estado
    compartido entre procesos: en un despliegue multi-instancia cada una
    cuenta lo suyo, que sigue cortando el abuso sostenido."""

    def __init__(
        self,
        limit: int = 30,
        window: float = 60.0,
        clock: Callable[[], float] = time.monotonic,
    ) -> None:
        self.limit = limit
        self.window = window
        self.clock = clock
        self._hits: dict[str, list[float]] = {}

    def allow(self, key: str) -> bool:
        now = self.clock()
        hits = [t for t in self._hits.get(key, ()) if now - t < self.window]
        if len(hits) >= self.limit:
            self._hits[key] = hits
            return False
        hits.append(now)
        self._hits[key] = hits
        if len(self._hits) > RATE_LIMIT_MAX_KEYS:
            # Poda: sin esto, una lista infinita de claves seria el
            # propio vector de DoS que este modulo intenta evitar.
            self._hits = {k: v for k, v in self._hits.items() if v}
        return True


def _json_response(
    start_response: StartResponse,
    status: str,
    payload: dict[str, Any],
    extra_headers: list[tuple[str, str]] | None = None,
) -> Iterable[bytes]:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    headers = [
        ("Content-Type", "application/json; charset=utf-8"),
        ("Content-Length", str(len(body))),
        # Sin esto, un navegador podria intentar "snifear" la respuesta
        # como si fuera HTML/JS en vez de JSON.
        ("X-Content-Type-Options", "nosniff"),
    ]
    if extra_headers:
        headers.extend(extra_headers)
    start_response(status, headers)
    return [body]


def _read_body(environ: dict[str, Any]) -> bytes | None:
    try:
        content_length = int(environ.get("CONTENT_LENGTH", "0"))
    except ValueError:
        content_length = 0
    if content_length <= 0:
        return b""
    if content_length > MAX_BODY_BYTES:
        # Devolvemos None sin llegar a llamar a read(): la negativa tiene
        # que ocurrir antes de tocar el buffer.
        return None
    return environ["wsgi.input"].read(content_length)


def create_app(
    catalog: CatalogService,
    tutor_factory: Callable[[], TutorService] | None = None,
    limiter: RateLimiter | None = None,
) -> Callable[..., Iterable[bytes]]:
    if tutor_factory is None:
        def tutor_factory() -> TutorService:
            return TutorService(NvidiaClient())

    # Una instancia por app: las pruebas quedan aisladas entre si.
    if limiter is None:
        limiter = RateLimiter()

    def app(environ: dict[str, Any], start_response: StartResponse) -> Iterable[bytes]:
        method = environ.get("REQUEST_METHOD", "GET").upper()
        path = environ.get("PATH_INFO", "/")

        if method == "GET":
            if path == "/health":
                return _json_response(start_response, "200 OK", {"status": "ok"})
            if path == "/api/v1/catalog":
                return _json_response(start_response, "200 OK", {"items": catalog.list_catalog()})
            return _json_response(start_response, "404 Not Found", {"error": "not_found"})

        if method == "POST" and path == "/api/tutor":
            # Antes de leer nada ni tocar el modelo: cada llamada aqui
            # consume creditos de NVIDIA, asi que el corte es lo primero.
            if not limiter.allow(environ.get("REMOTE_ADDR", "unknown")):
                return _json_response(
                    start_response,
                    "429 Too Many Requests",
                    {"error": "rate_limited"},
                    extra_headers=[("Retry-After", str(int(limiter.window)))],
                )
            try:
                body = _read_body(environ)
                if body is None:
                    return _json_response(
                        start_response, "413 Payload Too Large", {"error": "payload_too_large"}
                    )
                if not body:
                    return _json_response(start_response, "400 Bad Request", {"error": "empty_body"})
                try:
                    data = json.loads(body)
                except json.JSONDecodeError:
                    return _json_response(start_response, "400 Bad Request", {"error": "invalid_json"})
                if not isinstance(data, dict) or "messages" not in data:
                    return _json_response(start_response, "400 Bad Request", {"error": "missing_messages"})
                messages = data["messages"]
                tutor = tutor_factory()
                try:
                    reply = tutor.generate_reply(messages)
                except (ValueError, TypeError) as e:
                    return _json_response(start_response, "400 Bad Request", {"error": str(e)})
                except RuntimeError:
                    return _json_response(start_response, "502 Bad Gateway", {"error": "upstream_error"})
                return _json_response(start_response, "200 OK", {"reply": reply})
            except Exception:
                logger.exception("fallo no controlado en POST /api/tutor")
                return _json_response(start_response, "500 Internal Server Error", {"error": "internal_error"})

        return _json_response(start_response, "405 Method Not Allowed", {"error": "method_not_allowed"})

    return app
