import io
import json
from app.adapters.memory_catalog import InMemoryCourseRepository
from app.application.catalog_service import CatalogService
from app.interfaces.wsgi import create_app

def call(origin=None, fetch_site=None):
    calls = []
    class Stub:
        def generate_reply(self, messages):
            calls.append("called")
            return "ok"
    app = create_app(CatalogService(InMemoryCourseRepository()), tutor_factory=lambda: Stub())
    data = json.dumps({"messages": [{"role": "user", "content": "hola"}]}).encode()
    env = {"PATH_INFO": "/api/tutor", "REQUEST_METHOD": "POST", "HTTP_HOST": "school.example", "CONTENT_LENGTH": str(len(data)), "wsgi.input": io.BytesIO(data)}
    if origin is not None: env["HTTP_ORIGIN"] = origin
    if fetch_site is not None: env["HTTP_SEC_FETCH_SITE"] = fetch_site
    captured = {}
    def start_response(status, headers, exc_info=None):
        captured.update(status=status, headers=dict(headers))
    result = json.loads(b"".join(app(env, start_response)))
    return captured, result, calls

def test_browser_cross_origin_and_opaque_origin_rejected_without_ai():
    for origin, site in [("https://evil.example", "cross-site"), ("null", None), ("https://evil.example", None), (None, "cross-site"), ("http://evil.example", "same-origin")]:
        response, body, calls = call(origin, site)
        assert response["status"] == "403 Forbidden"
        assert body["error"] == "origin_forbidden"
        assert calls == []
        assert response["headers"]["Cache-Control"] == "private, no-store, max-age=0"

def test_same_origin_and_non_browser_clients_continue_to_work():
    for origin, site in [("https://school.example", "same-origin"), (None, None)]:
        response, body, calls = call(origin, site)
        assert response["status"] == "200 OK"
        assert body == {"reply": "ok"}
        assert calls == ["called"]
        assert response["headers"]["X-Content-Type-Options"] == "nosniff"
        assert response["headers"]["X-Frame-Options"] == "DENY"
        assert "default-src 'none'" in response["headers"]["Content-Security-Policy"]
