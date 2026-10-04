import json

from app.adapters.memory_catalog import InMemoryCourseRepository
from app.application.catalog_service import CatalogService
from app.application.tutor_service import TutorService
from app.interfaces.wsgi import RateLimiter, create_app


class FakeNvidiaClient:
    def chat_completion(self, messages, max_tokens=500):
        return "ok"


class FakeClock:
    def __init__(self, start: float = 0.0) -> None:
        self.now = start

    def __call__(self) -> float:
        return self.now


def make_app(limiter: RateLimiter):
    catalog = InMemoryCourseRepository()

    def tutor_factory():
        return TutorService(FakeNvidiaClient())

    return create_app(CatalogService(catalog), tutor_factory, limiter=limiter)


def post(app, ip: str = "203.0.113.7"):
    body = json.dumps({"messages": [{"role": "user", "content": "hola"}]}).encode("utf-8")
    captured = {}

    def start_response(status, headers, exc_info=None):
        captured["status"] = status
        captured["headers"] = dict(headers)

    environ = {
        "REQUEST_METHOD": "POST",
        "PATH_INFO": "/api/tutor",
        "CONTENT_LENGTH": str(len(body)),
        "REMOTE_ADDR": ip,
        "wsgi.input": type("Input", (), {"read": lambda self, n: body})(),
    }
    b"".join(app(environ, start_response))
    return captured["status"], captured["headers"]


def test_rate_limit_cuts_off_after_the_limit_for_one_ip():
    limiter = RateLimiter(limit=3, window=60.0, clock=FakeClock())
    app = make_app(limiter)

    statuses = [post(app)[0] for _ in range(4)]

    assert statuses[:3] == ["200 OK"] * 3
    assert statuses[3] == "429 Too Many Requests"


def test_rate_limit_response_advises_when_to_retry():
    app = make_app(RateLimiter(limit=1, window=60.0, clock=FakeClock()))
    post(app)
    status, headers = post(app)

    assert status == "429 Too Many Requests"
    assert headers["Retry-After"] == "60"


def test_rate_limit_window_resets_when_it_expires():
    clock = FakeClock()
    app = make_app(RateLimiter(limit=1, window=60.0, clock=clock))

    assert post(app)[0] == "200 OK"
    assert post(app)[0] == "429 Too Many Requests"

    clock.now = 61.0
    assert post(app)[0] == "200 OK"


def test_rate_limit_is_per_ip_not_global():
    app = make_app(RateLimiter(limit=1, window=60.0, clock=FakeClock()))

    assert post(app, "198.51.100.1")[0] == "200 OK"
    assert post(app, "198.51.100.1")[0] == "429 Too Many Requests"
    assert post(app, "198.51.100.2")[0] == "200 OK"


def test_get_endpoints_are_never_rate_limited():
    app = make_app(RateLimiter(limit=1, window=60.0, clock=FakeClock()))
    captured = {}

    def start_response(status, headers, exc_info=None):
        captured["status"] = status

    environ = {"REQUEST_METHOD": "GET", "PATH_INFO": "/health"}
    for _ in range(10):
        b"".join(app(environ, start_response))

    assert captured["status"] == "200 OK"
