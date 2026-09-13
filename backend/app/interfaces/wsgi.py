from __future__ import annotations

import json
from collections.abc import Callable, Iterable
from typing import Any

from app.application.catalog_service import CatalogService

StartResponse = Callable[[str, list[tuple[str, str]], Any], None]


def _json_response(start_response: StartResponse, status: str, payload: dict[str, Any]) -> Iterable[bytes]:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    start_response(
        status,
        [("Content-Type", "application/json; charset=utf-8"), ("Content-Length", str(len(body)))],
    )
    return [body]


def create_app(catalog: CatalogService) -> Callable[..., Iterable[bytes]]:
    def app(environ: dict[str, Any], start_response: StartResponse) -> Iterable[bytes]:
        method = environ.get("REQUEST_METHOD", "GET").upper()
        path = environ.get("PATH_INFO", "/")
        if method != "GET":
            return _json_response(start_response, "405 Method Not Allowed", {"error": "method_not_allowed"})
        if path == "/health":
            return _json_response(start_response, "200 OK", {"status": "ok"})
        if path == "/api/v1/catalog":
            return _json_response(start_response, "200 OK", {"items": catalog.list_catalog()})
        return _json_response(start_response, "404 Not Found", {"error": "not_found"})

    return app
