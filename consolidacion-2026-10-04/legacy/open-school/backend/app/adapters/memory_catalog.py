from __future__ import annotations

from collections.abc import Sequence

from app.domain.catalog import Course


class InMemoryCourseRepository:
    """Repositorio vacío por defecto: la estructura no inventa contenido educativo."""

    def __init__(self, courses: Sequence[Course] = ()) -> None:
        self._courses = tuple(courses)

    def list_courses(self) -> tuple[Course, ...]:
        return self._courses

    def get_course(self, course_id: str) -> Course | None:
        return next((course for course in self._courses if course.id == course_id), None)
