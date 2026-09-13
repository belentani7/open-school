from __future__ import annotations

from dataclasses import asdict
from typing import Any

from app.domain.catalog import CourseRepository


class CatalogService:
    def __init__(self, repository: CourseRepository) -> None:
        self._repository = repository

    def list_catalog(self) -> list[dict[str, Any]]:
        return [asdict(course) for course in self._repository.list_courses()]

    def get_course(self, course_id: str) -> dict[str, Any] | None:
        course = self._repository.get_course(course_id)
        return asdict(course) if course else None
