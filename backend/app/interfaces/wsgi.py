from __future__ import annotations

import json
import os
from collections.abc import Callable, Iterable
from typing import Any

from app.application.catalog_service import CatalogService
from app.application.tutor_service import TutorService
from app.adapters.nvidia_client import NvidiaClient

StartResponse = Callable[[str, list[tuple[str, str]], Any], None]


def _json_response(start_response: StartResponse, status: str, payload: dict[str, Any]) -> Iterable[bytes]:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    start_response(
        status,
        [("Content-Type", "application/json; charset=utf-8"), ("Content-Length", str(len(body)))],
    )
    return [body]


def _read_body(environ: dict[str, Any]) -> bytes:
    try:
        content_length = int(environ.get("CONTENT_LENGTH", "0"))
    except ValueError:
        content_length = 0
    if content_length <= 0:
        return b""
    return environ["wsgi.input"].read(content_length)


def create_app(
    catalog: CatalogService,
    tutor_factory: Callable[[], TutorService] | None = None,
) -> Callable[..., Iterable[bytes]]:
    if tutor_factory is None:
        def tutor_factory() -> TutorService:
            return TutorService(NvidiaClient())

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
            try:
                body = _read_body(environ)
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
                except ValueError as e:
                    return _json_response(start_response, "400 Bad Request", {"error": str(e)})
                except RuntimeError:
                    return _json_response(start_response, "502 Bad Gateway", {"error": "upstream_error"})
                return _json_response(start_response, "200 OK", {"reply": reply})
            except Exception:
                return _json_response(start_response, "500 Internal Server Error", {"error": "internal_error"})

        return _json_response(start_response, "405 Method Not Allowed", {"error": "method_not_allowed"})

    return app
