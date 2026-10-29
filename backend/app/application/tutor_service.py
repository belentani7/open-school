from __future__ import annotations

from typing import ClassVar

from app.adapters.ollama_client import OllamaClient


class TutorService:
    SYSTEM_PROMPT: ClassVar[str] = (
        "Eres el tutor educativo de Open School. Responde con amabilidad, "
        "en el idioma de la persona y en menos de 200 palabras. No pidas "
        "datos personales. No inventes rutas, certificados ni información "
        "legal; si falta contexto o no sabes algo, dilo con claridad."
    )
    MAX_MESSAGES = 20
    MAX_MESSAGE_LENGTH = 2000
    # Solo roles conversacionales. "system" queda fuera a proposito: el
    # cliente es usuario anonimo y un system prompt suyo seria inyeccion
    # de instrucciones sobre el tutor ( OWASP A03/A05 ) — la instruccion
    # de sistema, si la hubiera, la fija el servidor, nunca el navegador.
    ALLOWED_ROLES: ClassVar[set[str]] = {"user", "assistant"}

    def __init__(self, client: OllamaClient) -> None:
        self.client = client

    def generate_reply(self, messages: list[dict[str, str]]) -> str:
        self.validate_messages(messages)
        conversation = [{"role": "system", "content": self.SYSTEM_PROMPT}, *messages]
        return self.client.chat_completion(conversation, max_tokens=500)

    # De clase y publico a proposito: la capa HTTP lo llama ANTES de
    # construir el cliente, para que un payload malformado se rechace con
    # 400 antes de conectar con el modelo local.
    @classmethod
    def validate_messages(cls, messages: list[dict[str, str]]) -> None:
        if not isinstance(messages, list):
            raise TypeError("messages must be a list")
        if len(messages) > cls.MAX_MESSAGES:
            raise ValueError(f"Too many messages: max {cls.MAX_MESSAGES}")
        for msg in messages:
            if not isinstance(msg, dict):
                raise TypeError("Each message must be an object")
            if set(msg) - {"role", "content"}:
                raise ValueError("Message may contain only role and content")
            role = msg.get("role")
            content = msg.get("content")
            if role not in cls.ALLOWED_ROLES:
                raise ValueError(f"Invalid role: {role}")
            if not isinstance(content, str) or len(content) > cls.MAX_MESSAGE_LENGTH:
                raise ValueError("Message content must be a string with max 2000 chars")
