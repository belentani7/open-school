from __future__ import annotations

from typing import Any

from app.adapters.nvidia_client import NvidiaClient


class TutorService:
    MAX_MESSAGES = 20
    MAX_MESSAGE_LENGTH = 2000
    ALLOWED_ROLES = {"system", "user", "assistant"}

    def __init__(self, client: NvidiaClient) -> None:
        self.client = client

    def generate_reply(self, messages: list[dict[str, str]]) -> str:
        self._validate_messages(messages)
        return self.client.chat_completion(messages, max_tokens=500)

    def _validate_messages(self, messages: list[dict[str, str]]) -> None:
        if not isinstance(messages, list):
            raise ValueError("messages must be a list")
        if len(messages) > self.MAX_MESSAGES:
            raise ValueError(f"Too many messages: max {self.MAX_MESSAGES}")
        for msg in messages:
            if not isinstance(msg, dict):
                raise ValueError("Each message must be an object")
            role = msg.get("role")
            content = msg.get("content")
            if role not in self.ALLOWED_ROLES:
                raise ValueError(f"Invalid role: {role}")
            if not isinstance(content, str) or len(content) > self.MAX_MESSAGE_LENGTH:
                raise ValueError("Message content must be a string with max 2000 chars")
