from app.adapters.memory_catalog import InMemoryCourseRepository
from app.application.catalog_service import CatalogService
from app.interfaces.wsgi import MAX_BODY_BYTES, create_app


def call(app, path: str, method: str = "GET"):
    captured = {}

    def start_response(status, headers, exc_info=None):
        captured["status"] = status
        captured["headers"] = headers

    body = b"".join(app({"PATH_INFO": path, "REQUEST_METHOD": method}, start_response))
    return captured["status"], dict(captured["headers"]), body


def make_app():
    return create_app(CatalogService(InMemoryCourseRepository()))


def test_health_is_stable():
    status, headers, body = call(make_app(), "/health")
    assert status == "200 OK"
    assert headers["Content-Type"].startswith("application/json")
    assert body == b'{"status": "ok"}'


def test_catalog_is_empty_until_content_is_added():
    status, _, body = call(make_app(), "/api/v1/catalog")
    assert status == "200 OK"
    assert body == b'{"items": []}'


def test_unknown_route_does_not_raise():
    status, _, body = call(make_app(), "/does-not-exist")
    assert status == "404 Not Found"
    assert b"not_found" in body


def test_non_get_is_rejected():
    status, _, body = call(make_app(), "/health", "POST")
    assert status == "405 Method Not Allowed"
    assert b"method_not_allowed" in body


def test_json_responses_carry_nosniff():
    _, headers, _ = call(make_app(), "/health")
    assert headers["X-Content-Type-Options"] == "nosniff"


def test_oversized_body_is_rejected_without_reading_the_buffer():
    class ExplodingInput:
        def read(self, n):  # pragma: no cover - solo se ejecuta si falla el tope
            raise AssertionError("read() no debe llamarse con un cuerpo por encima del tope")

    captured = {}

    def start_response(status, headers, exc_info=None):
        captured["status"] = status

    environ = {
        "REQUEST_METHOD": "POST",
        "PATH_INFO": "/api/tutor",
        "CONTENT_LENGTH": str(MAX_BODY_BYTES + 1),
        "wsgi.input": ExplodingInput(),
    }
    payload = b"".join(make_app()(environ, start_response))

    assert captured["status"] == "413 Payload Too Large"
    assert b"payload_too_large" in payload


def test_body_under_the_tope_is_read_normally():
    body = b'{"messages": []}'
    calls = {"read": 0}

    class TrackingInput:
        def read(self, n):
            calls["read"] += 1
            return body

    captured = {}

    def start_response(status, headers, exc_info=None):
        captured["status"] = status

    environ = {
        "REQUEST_METHOD": "POST",
        "PATH_INFO": "/api/tutor",
        "CONTENT_LENGTH": str(len(body)),
        "wsgi.input": TrackingInput(),
    }
    b"".join(make_app()(environ, start_response))

    assert calls["read"] == 1
    assert captured["status"] != "413 Payload Too Large"


def test_tutor_rejects_non_list_messages_as_400_not_500():
    app = make_app()
    body = b'{"messages": "no-es-una-lista"}'
    captured = {}

    def start_response(status, headers, exc_info=None):
        captured["status"] = status

    environ = {
        "REQUEST_METHOD": "POST",
        "PATH_INFO": "/api/tutor",
        "CONTENT_LENGTH": str(len(body)),
        "wsgi.input": type("Input", (), {"read": lambda self, n: body})(),
    }
    payload = b"".join(app(environ, start_response))
    assert captured["status"] == "400 Bad Request"
    assert b"list" in payload


def test_tutor_rejects_non_dict_message_as_400_not_500():
    app = make_app()
    body = b'{"messages": ["texto-suelto"]}'
    captured = {}

    def start_response(status, headers, exc_info=None):
        captured["status"] = status

    environ = {
        "REQUEST_METHOD": "POST",
        "PATH_INFO": "/api/tutor",
        "CONTENT_LENGTH": str(len(body)),
        "wsgi.input": type("Input", (), {"read": lambda self, n: body})(),
    }
    payload = b"".join(app(environ, start_response))
    assert captured["status"] == "400 Bad Request"
    assert b"object" in payload
