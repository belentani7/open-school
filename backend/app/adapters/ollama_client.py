from __future__ import annotations

import http.client
import json
import os


class OllamaClient:
    """Cliente para Ollama, normalmente alojado junto al backend.

    El host y el modelo solo proceden de configuración del servidor; nunca
    de la petición del estudiante. No se envía contenido a un proveedor de
    IA externo ni se necesita una API key.
    """

    API_PATH = "/api/chat"
    MAX_RESPONSE_BYTES = 1_048_576

    def __init__(
        self,
        host: str | None = None,
        port: int | None = None,
        model: str | None = None,
    ) -> None:
        self.host = host or os.environ.get("OLLAMA_HOST", "127.0.0.1")
        raw_port = port if port is not None else os.environ.get("OLLAMA_PORT", "11434")
        try:
            self.port = int(raw_port)
        except (TypeError, ValueError) as exc:
            raise RuntimeError("OLLAMA_PORT must be an integer") from exc
        if not 1 <= self.port <= 65535:
            raise RuntimeError("OLLAMA_PORT must be between 1 and 65535")

        self.model = model or os.environ.get("OLLAMA_MODEL", "llama3.2:3b")
        if not self.host or not self.model:
            raise RuntimeError("Ollama host and model must be configured")

    def chat_completion(self, messages: list[dict[str, str]], max_tokens: int = 500) -> str:
        if not isinstance(max_tokens, int) or not 1 <= max_tokens <= 4096:
            raise ValueError("max_tokens must be between 1 and 4096")

        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False,
            "options": {"num_predict": max_tokens},
        }
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        conn = http.client.HTTPConnection(self.host, self.port, timeout=30)
        try:
            conn.request(
                "POST",
                self.API_PATH,
                body=body,
                headers={"Content-Type": "application/json"},
            )
            response = conn.getresponse()
            if response.status != 200:
                raise RuntimeError(f"Ollama HTTP error: {response.status}")
            data = response.read(self.MAX_RESPONSE_BYTES + 1)
            if len(data) > self.MAX_RESPONSE_BYTES:
                raise RuntimeError("Ollama response exceeded the size limit")
        except OSError as exc:
            raise RuntimeError(f"Ollama connection error: {exc}") from exc
        finally:
            conn.close()

        try:
            decoded = json.loads(data.decode("utf-8"))
            content = decoded["message"]["content"]
        except (KeyError, IndexError, TypeError, UnicodeDecodeError, json.JSONDecodeError) as exc:
            raise RuntimeError("Invalid response from Ollama") from exc
        if not isinstance(content, str):
            # Malformed upstream data is a server error, not bad user input.
            raise RuntimeError("Invalid response from Ollama")  # noqa: TRY004
        return content
