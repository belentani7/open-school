import io, json, os, collections
INTAKE = r"C:\Users\USER\edu-open-data\registry\_intake"
rep = json.load(io.open(os.path.join(INTAKE, "probe_report.json"), encoding="utf-8"))
E = rep["entries"]

print("== SEMILLAS CURADAS (source=catalogs) que fallaron ==")
fails = [r for r in E if r["source"] == "catalogs" and r["verdict"] != "accept"]
print("total fallos curados:", len(fails))
by_area = collections.Counter(r["area"] for r in fails)
print("por area:", dict(by_area))
for r in fails:
    print("  {:<20} {:<34} {:<26} {}".format(
        r["area"], r["id"][:34], r["reason"], str(r["evidence"].get("status")) + " " + str(r["evidence"].get("error") or r["evidence"].get("ctype") or "")[:40]))

print()
print("== SEMILLAS CURADAS OK, maquina-legibles ==")
ok = [r for r in E if r["source"] == "catalogs" and r["verdict"] == "accept" and not r["portal_only"]]
print("total:", len(ok))
for r in sorted(ok, key=lambda x: x["area"]):
    print("  {:<20} {:<34} recs={}".format(r["area"], r["id"][:34], r.get("records")))

print()
print("== TIMEOUTS: por host, top 30 ==")
to = [r for r in E if r["reason"] == "network_or_timeout"]
hosts = collections.Counter(r["probe_url"].split("/")[2] if "//" in r["probe_url"] else r["probe_url"] for r in to)
print("total:", len(to))
for h, n in hosts.most_common(30):
    print("  {:<40} {}".format(h, n))
print("  errores:", collections.Counter(r["evidence"].get("error") for r in to).most_common(8))

print()
print("== html_not_api: por area (candidatas a reclasificar como portal) ==")
ha = [r for r in E if r["reason"] == "html_not_api"]
print("total:", len(ha), "por area:", dict(collections.Counter(r["area"] for r in ha)))
print("  de origen curado:", sum(1 for r in ha if r["source"] == "catalogs"))

print()
print("== too_small / json_parse_error (detalle) ==")
for r in E:
    if r["reason"] in ("too_small", "json_parse_error", "not_html", "not_xml", "html_not_xml"):
        print("  {:<22} {:<34} {:<18} bytes={} {}".format(
            r["area"], r["id"][:34], r["reason"], r["evidence"].get("bytes"),
            (r["evidence"].get("head") or r["evidence"].get("error") or "")[:50]))
