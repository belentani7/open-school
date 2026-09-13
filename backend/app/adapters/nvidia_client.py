from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from typing import Any


class NvidiaClient:
    API_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
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
        data = json.dumps(payload).encode("utf-8")
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        req = urllib.request.Request(self.API_URL, data=data, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                body = resp.read().decode("utf-8")
        except urllib.error.HTTPError as e:
            raise RuntimeError(f"Upstream HTTP error: {e.code} {e.reason}") from e
        except urllib.error.URLError as e:
            raise RuntimeError(f"Upstream connection error: {e.reason}") from e

        try:
            response = json.loads(body)
            content = response["choices"][0]["message"]["content"]
        except (KeyError, IndexError, json.JSONDecodeError) as e:
            raise RuntimeError("Invalid response from upstream") from e
        return content
