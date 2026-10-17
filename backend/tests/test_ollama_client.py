from __future__ import annotations

import json
from typing import ClassVar

import pytest

from app.adapters.ollama_client import OllamaClient


class FakeResponse:
    def __init__(self, status: int, payload: bytes) -> None:
        self.status = status
        self._payload = payload

    def read(self, limit: int) -> bytes:
        return self._payload[:limit]


class FakeConnection:
    response: ClassVar[FakeResponse] = FakeResponse(200, b'{"message":{"content":"Respuesta local"}}')
    instances: ClassVar[list[FakeConnection]] = []

    def __init__(self, host: str, port: int, timeout: float) -> None:
        self.host = host
        self.port = port
        self.timeout = timeout
        self.request_data: tuple[str, str, bytes, dict[str, str]] | None = None
        self.closed = False
        self.__class__.instances.append(self)

    def request(self, method: str, path: str, body: bytes, headers: dict[str, str]) -> None:
        self.request_data = (method, path, body, headers)

    def getresponse(self) -> FakeResponse:
        return self.response

    def close(self) -> None:
        self.closed = True


def test_ollama_client_uses_configured_local_endpoint_and_parses_reply(monkeypatch):
    FakeConnection.instances.clear()
    FakeConnection.response = FakeResponse(200, b'{"message":{"content":"Respuesta local"}}')
    monkeypatch.setattr("app.adapters.ollama_client.http.client.HTTPConnection", FakeConnection)
    client = OllamaClient(host="ollama", port=11434, model="llama3.2:3b")
    messages = [{"role": "system", "content": "Tutor"}, {"role": "user", "content": "Hola"}]

    assert client.chat_completion(messages, max_tokens=250) == "Respuesta local"

    connection = FakeConnection.instances[-1]
    assert (connection.host, connection.port, connection.timeout) == ("ollama", 11434, 30)
    assert connection.request_data is not None
    method, path, body, headers = connection.request_data
    assert (method, path) == ("POST", "/api/chat")
    assert headers["Content-Type"] == "application/json"
    payload = json.loads(body)
    assert payload["model"] == "llama3.2:3b"
    assert payload["messages"] == messages
    assert payload["stream"] is False
    assert payload["options"]["num_predict"] == 250
    assert connection.closed


def test_ollama_client_fails_closed_for_upstream_errors(monkeypatch):
    FakeConnection.response = FakeResponse(503, b"unavailable")
    monkeypatch.setattr("app.adapters.ollama_client.http.client.HTTPConnection", FakeConnection)
    client = OllamaClient()

    with pytest.raises(RuntimeError, match="Ollama HTTP error: 503"):
        client.chat_completion([{"role": "user", "content": "Hola"}])


def test_ollama_client_rejects_invalid_output_size(monkeypatch):
    FakeConnection.response = FakeResponse(200, b"x" * (OllamaClient.MAX_RESPONSE_BYTES + 1))
    monkeypatch.setattr("app.adapters.ollama_client.http.client.HTTPConnection", FakeConnection)
    client = OllamaClient()

    with pytest.raises(RuntimeError, match="size limit"):
        client.chat_completion([{"role": "user", "content": "Hola"}])


def test_ollama_client_validates_port_and_token_budget():
    with pytest.raises(RuntimeError, match="OLLAMA_PORT"):
        OllamaClient(port=65536)

    client = OllamaClient()
    with pytest.raises(ValueError, match="max_tokens"):
        client.chat_completion([{"role": "user", "content": "Hola"}], max_tokens=0)
