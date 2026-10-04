import io, json, os, collections
INTAKE = r"C:\Users\USER\edu-open-data\registry\_intake"
rep = json.load(io.open(os.path.join(INTAKE, "probe_report.json"), encoding="utf-8"))
E = rep["entries"]

print("=== FALLOS DE SEMILLAS CURADAS (arreglables) ===")
f = [r for r in E if r["source"] == "catalogs" and r["verdict"] != "accept"]
print("total:", len(f))
for r in sorted(f, key=lambda x: (x["area"], x["reason"])):
    ev = r["evidence"]
    extra = (ev.get("head") or ev.get("error") or "")[:70]
    print("  {:<18} {:<30} {:<24} {:<5} {:<28} {}".format(
        r["area"], r["id"][:30], r["reason"], str(ev.get("status")),
        (ev.get("ctype") or "")[:28], extra))

print()
print("=== json_parse_error (todos, para ver si es bug mio) ===")
jp = [r for r in E if r["reason"] == "json_parse_error"]
print("total:", len(jp))
for r in jp:
    ev = r["evidence"]
    print("  {:<18} {:<30} enc={:<8} bytes={:<7} {}".format(
        r["area"], r["id"][:30], str(ev.get("ctype"))[:8], ev.get("bytes"),
        (ev.get("head") or ev.get("error") or "")[:90]))

print()
print("=== network_or_timeout: hosts ===")
to = [r for r in E if r["reason"] == "network_or_timeout"]
print("total:", len(to))
print(" errores:", collections.Counter(r["evidence"].get("error") for r in to).most_common(10))
hosts = collections.Counter(r["probe_url"].split("/")[2] for r in to if "//" in r["probe_url"])
for h, n in hosts.most_common(25):
    print("  {:<42} {}".format(h, n))

print()
print("=== html_not_api: origen ===")
ha = [r for r in E if r["reason"] == "html_not_api"]
print(" total:", len(ha), " curadas:", sum(1 for r in ha if r["source"] == "catalogs"),
      " public-apis:", sum(1 for r in ha if r["source"] == "public-apis"))
print(" por area:", dict(collections.Counter(r["area"] for r in ha)))
