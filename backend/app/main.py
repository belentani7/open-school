from __future__ import annotations

import os
from wsgiref.simple_server import make_server

from app.adapters.memory_catalog import InMemoryCourseRepository
from app.application.catalog_service import CatalogService
from app.interfaces.wsgi import create_app


repository = InMemoryCourseRepository()
service = CatalogService(repository)
app = create_app(service)


if __name__ == "__main__":
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "8001"))
    with make_server(host, port, app) as server:
        print(f"Open School Python backend: http://{host}:{port}", flush=True)
        server.serve_forever()
