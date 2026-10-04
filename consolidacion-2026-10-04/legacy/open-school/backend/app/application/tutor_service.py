from __future__ import annotations

from typing import ClassVar

from app.adapters.nvidia_client import NvidiaClient


class TutorService:
    MAX_MESSAGES = 20
    MAX_MESSAGE_LENGTH = 2000
    # Solo roles conversacionales. "system" queda fuera a proposito: el
    # cliente es usuario anonimo y un system prompt suyo seria inyeccion
    # de instrucciones sobre el tutor ( OWASP A03/A05 ) — la instruccion
    # de sistema, si la hubiera, la fija el servidor, nunca el navegador.
    ALLOWED_ROLES: ClassVar[set[str]] = {"user", "assistant"}

    def __init__(self, client: NvidiaClient) -> None:
        self.client = client

    def generate_reply(self, messages: list[dict[str, str]]) -> str:
        self.validate_messages(messages)
        return self.client.chat_completion(messages, max_tokens=500)

    # De clase y publico a proposito: la capa HTTP lo llama ANTES de
    # construir el cliente, para que un payload malformado se rechace con
    # 400 sin necesidad de NVIDIA_API_KEY y sin gastar un solo credito.
    @classmethod
    def validate_messages(cls, messages: list[dict[str, str]]) -> None:
        if not isinstance(messages, list):
            raise TypeError("messages must be a list")
        if len(messages) > cls.MAX_MESSAGES:
            raise ValueError(f"Too many messages: max {cls.MAX_MESSAGES}")
        for msg in messages:
            if not isinstance(msg, dict):
                raise TypeError("Each message must be an object")
            role = msg.get("role")
            content = msg.get("content")
            if role not in cls.ALLOWED_ROLES:
                raise ValueError(f"Invalid role: {role}")
            if not isinstance(content, str) or len(content) > cls.MAX_MESSAGE_LENGTH:
                raise ValueError("Message content must be a string with max 2000 chars")
