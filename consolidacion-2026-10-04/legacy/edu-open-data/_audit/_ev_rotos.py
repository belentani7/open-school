"""Lista todos los enlaces rotos detectados, agrupados por host y patron."""
from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).parent
rep = json.loads((ROOT / "coverage_report.json").read_text(encoding="utf-8"))

por_host: Counter = Counter()
for portal, d in rep.items():
    for u in d.get("enlaces_rotos", []):
        host = u.split("//")[-1].split("/")[0]
        por_host[host] += 1

print("enlaces rotos por host:")
for host, n in por_host.most_common():
    print(f"  {n:>3}  {host}")

print("\nmuestra por portal:")
for portal, d in rep.items():
    rotos = d.get("enlaces_rotos", [])
    if rotos:
        print(f"  {portal} ({len(rotos)}): {rotos[0]}")

total = sum(len(d.get("enlaces_rotos", [])) for d in rep.values())
print(f"\ntotal rotos = {total}")
