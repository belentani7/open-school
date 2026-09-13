from __future__ import annotations

from dataclasses import dataclass, field
from typing import Protocol, Sequence


@dataclass(frozen=True, slots=True)
class Module:
    id: str
    title: str = ""
    position: int = 0


@dataclass(frozen=True, slots=True)
class Course:
    id: str
    title: str = ""
    description: str = ""
    modules: tuple[Module, ...] = field(default_factory=tuple)


class CourseRepository(Protocol):
    def list_courses(self) -> Sequence[Course]: ...

    def get_course(self, course_id: str) -> Course | None: ...
