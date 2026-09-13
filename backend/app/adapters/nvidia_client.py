from __future__ import annotations

import http.client
import json
import os
from typing import Any


class NvidiaClient:
    # Destino fijo, nunca derivado de input del usuario (anti-SSRF).
    API_HOST = "integrate.api.nvidia.com"
    API_PATH = "/v1/chat/completions"
    MODEL = "deepseek-ai/deepseek-v4-flash-0731"

    def __init__(self, api_key: str | None = None) -> None:
        self.api_key = api_key or os.environ.get("NVIDIA_API_KEY")
        if not self.api_key:
            raise RuntimeError("NVIDIA_API_KEY environment variable is not set")

    def chat_completion(self, messages: list[dict[str, str]], max_tokens: int = 500) -> str:
        payload = {
            "model": self.MODEL,
            "messages": messages,
            "max_tokens": max_tokens,
        }
        body = json.dumps(payload)
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        conn = http.client.HTTPSConnection(self.API_HOST, timeout=30)
        try:
            conn.request("POST", self.API_PATH, body=body, headers=headers)
            resp = conn.getresponse()
            data = resp.read().decode("utf-8")
            if resp.status != 200:
                raise RuntimeError(f"Upstream HTTP error: {resp.status} {resp.reason}")
        except OSError as e:
            raise RuntimeError(f"Upstream connection error: {e}") from e
        finally:
            conn.close()

        try:
            response = json.loads(data)
            content = response["choices"][0]["message"]["content"]
        except (KeyError, IndexError, json.JSONDecodeError) as e:
            raise RuntimeError("Invalid response from upstream") from e
        return content
