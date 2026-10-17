from __future__ import annotations

import sys
from collections.abc import Callable, Iterable
from pathlib import Path
from typing import Any

BACKEND_ROOT = str(Path(__file__).resolve().parents[1] / "backend")
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)

from app.main import app as backend_app

StartResponse = Callable[[str, list[tuple[str, str]], Any], None]


def route_app(path: str) -> Callable[..., Iterable[bytes]]:
    """Adapt the shared WSGI application to one file-based Vercel route."""

    def application(environ: dict[str, Any], start_response: StartResponse) -> Iterable[bytes]:
        routed_environ = dict(environ)
        routed_environ["PATH_INFO"] = path
        return backend_app(routed_environ, start_response)

    return application
