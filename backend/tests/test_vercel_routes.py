from __future__ import annotations

import json
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from api._shared import route_app


def call(app, method: str, path: str, body: bytes = b""):
    captured = {}

    def start_response(status, headers, exc_info=None):
        captured["status"] = status
        captured["headers"] = dict(headers)

    environ = {
        "REQUEST_METHOD": method,
        "PATH_INFO": path,
        "CONTENT_LENGTH": str(len(body)),
        "REMOTE_ADDR": "203.0.113.9",
        "wsgi.input": type("Input", (), {"read": lambda self, n: body})(),
    }
    response = b"".join(app(environ, start_response))
    return captured["status"], captured["headers"], response


def test_vercel_health_route_reaches_shared_wsgi_application():
    status, _, body = call(route_app("/health"), "GET", "/api/health")
    assert status == "200 OK"
    assert json.loads(body) == {"status": "ok"}


def test_vercel_catalog_route_reaches_shared_wsgi_application():
    status, _, body = call(route_app("/api/v1/catalog"), "GET", "/api/v1/catalog")
    assert status == "200 OK"
    assert json.loads(body) == {"items": []}


def test_vercel_tutor_route_reaches_validation_without_calling_model():
    status, _, body = call(route_app("/api/tutor"), "POST", "/api/tutor")
    assert status == "400 Bad Request"
    assert json.loads(body) == {"error": "empty_body"}
