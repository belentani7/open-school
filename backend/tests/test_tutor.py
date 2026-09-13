import json
import pytest

from app.interfaces.wsgi import create_app
from app.application.tutor_service import TutorService
from app.adapters.nvidia_client import NvidiaClient


class FakeNvidiaClient:
    def __init__(self, reply="Hola, ¿en qué te ayudo?"):
        self.reply = reply

    def chat_completion(self, messages, max_tokens=500):
        return self.reply


class DummyCatalog:
    def list_catalog(self):
        return []


def make_app(reply="Hola, ¿en qué te ayudo?"):
    catalog = DummyCatalog()
    tutor_factory = lambda: TutorService(FakeNvidiaClient(reply))
    return create_app(catalog, tutor_factory)


def call_app(app, method, path, body=None):
    captured = {}

    def start_response(status, headers, exc_info=None):
        captured["status"] = status
        captured["headers"] = headers

    environ = {
        "REQUEST_METHOD": method,
        "PATH_INFO": path,
        "CONTENT_LENGTH": str(len(body or b"")),
        "wsgi.input": type("Input", (), {"read": lambda self, n: body or b""})(),
    }
    result = app(environ, start_response)
    data = b"".join(result).decode("utf-8")
    return captured["status"], json.loads(data) if data else {}


def test_tutor_returns_reply():
    app = make_app("Respuesta de prueba")
    status, payload = call_app(app, "POST", "/api/tutor", json.dumps({
        "messages": [{"role": "user", "content": "Hola"}]
    }).encode("utf-8"))
    assert status == "200 OK"
    assert payload["reply"] == "Respuesta de prueba"


def test_tutor_validation_error():
    app = make_app()
    status, payload = call_app(app, "POST", "/api/tutor", json.dumps({
        "messages": [{"role": "invalid", "content": "Hola"}]
    }).encode("utf-8"))
    assert status == "400 Bad Request"
    assert "error" in payload


def test_tutor_upstream_error():
    class FailingClient:
        def chat_completion(self, messages, max_tokens=500):
            raise RuntimeError("upstream down")

    catalog = DummyCatalog()
    tutor_factory = lambda: TutorService(FailingClient())
    app = create_app(catalog, tutor_factory)
    status, payload = call_app(app, "POST", "/api/tutor", json.dumps({
        "messages": [{"role": "user", "content": "Hola"}]
    }).encode("utf-8"))
    assert status == "502 Bad Gateway"
    assert payload["error"] == "upstream_error"
