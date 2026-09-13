from app.adapters.memory_catalog import InMemoryCourseRepository
from app.application.catalog_service import CatalogService
from app.interfaces.wsgi import create_app


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
