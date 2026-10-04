# GitHub Cleanup - READ-ONLY DRY RUN (belentani7)

**STATUS: NOTHING EXECUTED.** No repo was archived, edited, renamed, or deleted. This is evidence + proposal only.

- **Generated (local):** `2026-09-13 09:52:50 +0200`
- **Account:** `belentani7` (gh CLI, active keyring profile; token scopes include `repo`, `delete_repo`)
- **Evidence artifacts:** `C:\Users\USER\edu-open-data\_audit\repos_utf8.json` (UTF-8+BOM, 113,125 bytes) and `repos.json` (same payload, PowerShell default UTF-16LE). All numbers below are derived from these files.

## 0. Exact commands executed

```powershell
gh auth status

gh repo list belentani7 --limit 1000 --json name,description,isArchived,isPrivate,primaryLanguage,pushedAt,stargazerCount,diskUsage > "C:\Users\USER\edu-open-data\_audit\repos.json"

gh repo list belentani7 --limit 1000 --json name,description,isArchived,isPrivate,primaryLanguage,pushedAt,stargazerCount,diskUsage | Out-File -FilePath "C:\Users\USER\edu-open-data\_audit\repos_utf8.json" -Encoding utf8

python "C:\Users\USER\edu-open-data\_audit\_report.py"   # read-only analysis + render
```

> Only `gh repo list` (read-only) was ever called. No `gh repo archive` / `edit` / `rename` / `delete` was issued.

---

## 1. Headline counts

| Metric | Count |
|---|---:|
| Total repositories | **501** |
| Already archived | **183** (36.5%) |
| Not archived (live) | **318** |
| Private | **376** |
| Public | **125** |
| `stargazerCount > 0` | **0** |
| Empty/null description | **189** (37.7%) |
| Description = `Backup local PC 2026-08-29` | **109** |
| Total `diskUsage` | **12936544 KB** (~12.3 GB) |
| Repos > 100 MB | **19** |

**Repos with `stargazerCount > 0`:** **NONE - all 501 repos have exactly 0 stars.**

---

## 2a. BACKUPS / ARCHIVES / EXPORTS

Regex `backup|copia|snapshot|export|archiv|respaldo|archive` applied case-insensitively to **name** and **description**.

| Bucket | Count |
|---|---:|
| Description exactly `Backup local PC 2026-08-29` | **109** |
| ...of those, already archived | **109** |
| ...of those, still live (TO ARCHIVE) | **0** |
| ...of those, private | **109** |
| Name matches backup pattern | **25** |
| Description matches backup pattern | **138** |
| UNION (name OR description) | **140** |
| UNION minus the `Backup local PC 2026-08-29` cohort | **31** |

**Key correction to the prior estimate:** the ~109 local-PC backups are **already 100% archived** (109/109, all private, 0 live). There is nothing left to archive in that cohort - a prior pass already did it. The real remaining backup-shaped targets are the **18** explicitly-named archive/export repos below.

### A.1 - `Backup local PC 2026-08-29` cohort: 109 repos, ALL already archived, ALL private

Shown for completeness (verifies the earlier cleanup pass). None are actionable.

```text
ace-step-extra, agent-browser-mcp, agenticseek, agentmail-mcp, agentmail-python, agentmail-toolkit
ai-film-lab, aider-project-extra, aios, anything-llm, argo, base-profesional, belentani-01_proyectos
belentani-1000-canciones, belentani-curated-portfolio-2026-08-07, belentani-master-spec-2026-08-07
belentani-omega-os-codex-07-31, belentani-video-lab, belentani_omega-belentani7, belentani_omega_backup
bellacore-lead-engine, bellacore-tools, betanix-browser, browser-use, carquidec-2, carquidec-3
carquidec-4, claudecode-ritheshh, clon-manosabiertas, codemachine-cli, codex-mesh, comfyui
computer-agent, cv-ai-launch, deepseek-reasonix, depth-anything, duck-2000, duck-2000-2, duck-2026-2
duck-full-studio-pro-2, duck-portfolio, duck-repo-final, duck-stdio, duck-unified-master-2
duck-zion-premium-2, ecc, echomimic, failure-memory-graph, free-claude-code-alishahryar1
free-claude-code-simplesunny, grok-cli, hermes-cli, heyduck-2, heyduck-3, heyduck-4, heyduck-belentani7
heyduck-github-12scripts, jaaz, judas-omega-static-repo, kohya_ss, local-agent-2, local-agent-3
manaflow, manos-abiertas, manos-abiertas-release-netlify-20260812, manos_abiertas_course_modules
manosabiertas-38d5f, manosabiertas-optimizacion-2, manosabiertas-repo, manosabiertas-vercel-20260813
mesmo-carquidec-proyecto, meta-design-skill, mimocode-workspace-backup, natalia-marinho
natalia-marinho-2, natalia-marinho-3, nataliamarinho-2, nataliamarinho-3, nataliamarinho-4, obscura
omega-core, omnipap-news, omniroute, opencodex, openmanus, pedro-audio, pedro-free-tools-2026, pi
plandex, powershell-session-bus, raco-patricia-premium, reclamacion-openai-tokens-20260809, rife
rotakey, rvc, spaci-ai, stable-diffusion.cpp, steven-renovation-2, steven-renovation-3
superpowers-extra, swe-agent, tender-words-connect-main, twenty, unipic
universal-web-architecture-template, voice-assistant, voicebot-saas, voicerestore, whatsapp-ai-simulator
```

### A.2 - Explicit archive/export/snapshot/backup-named repos (31, excluding cohort)

| Repo | State | Visibility | diskUsage KB | Description |
|---|---|---|---:|---|
| `aion-acquisition-engine-audited` | **LIVE** | private | 302 | AION Acquisition Engine - snapshot auditado del sistema de |
| `archivo-fabi-privado` | **LIVE** | private | 3110 | Archivo privado Fabi - preservacion personal (acceso restr |
| `aurea3d-premium-archivo` | **LIVE** | private | 301 | Private archive of Aurea3D Premium source, audit, versions |
| `backup-no-tocar-2026-09-10` | **LIVE** | private | 53 | BACKUP NO TOCAR - cierre ecosistema 2026-09-10. Contiene m |
| `belentani-artist-site-archive` | **LIVE** | private | 571 | Archivo del sitio artista Belentani - versiones historicas |
| `BELENTANI-BUILDAI-HTML-Y-FOTOS` | **LIVE** | private | 285777 | Archivo visual/source Belentani - HTML e imagenes original |
| `belentani-chat-archive-2026` | **LIVE** | private | 18563 | Private archive of the Belentani project, generated assets |
| `belentani-complete-archive` | **LIVE** | private | 24737 | BELENTANI complete private archive: project files, version |
| `belentani-estudi-digital-archive` | **LIVE** | private | 834 | Archivo del Estudi Digital Belentani - materiales historic |
| `BELENTANI-FULLSTACK-2026-08-08` | **LIVE** | private | 167487 | Snapshot full-stack del ecosistema Belentani (2026-08-08)  |
| `belentani-judas-era-export` | archived | private | 22121 | Exportacion de la era JUDAS - activos y codigo del proyect |
| `belentani-the-judas-experience-archive` | archived | **PUBLIC** | 37836 | Archivo oficial de The Judas Experience - experiencia musi |
| `cassandra-belentani-complex` | **LIVE** | private | 292 | Archivo editorial Cassandra Belentani Complex — código, do |
| `ctg-psicologia-archive-2026` | **LIVE** | private | 38606 | Archivo CTG Psicologia 2026 - materiales y sitio preservad |
| `duck-belentani-os-audited-2026-08-23` | **LIVE** | **PUBLIC** | 387 | DUCK Belentani OS - snapshot auditado 2026-08-23 del siste |
| `duck-producao-musical-chat-archive-2026-08-22` | **LIVE** | private | 25736 | Archivo de chat de producao musical DUCK (2026-08-22) - co |
| `duck-studio-maker-export` | **LIVE** | private | 61943 | Duck Studio Maker - exportacion del generador de estudios  |
| `duck-zion-apex-public` | **LIVE** | **PUBLIC** | 540 | DUCK ZION Apex — professional vocal production platform; a |
| `duckweb-belentani-export` | **LIVE** | private | 22487 | DuckWeb Belentani - exportacion web del universo DUCK. |
| `ecosistema-ia-pro-max-export-2026` | **LIVE** | private | 732 | Exportación privada del Ecosistema IA Pro Max: código, his |
| `fileforge-studio-export-20260822204142` | **LIVE** | private | 6301 | FileForge Studio - exportacion empaquetada del proyecto (s |
| `infinita-visual-archive-10x` | **LIVE** | private | 276 | _empty_ |
| `lios-complete-conversation-archive` | **LIVE** | private | 197 | Complete private archive of the LIOS project conversation, |
| `local-agent` | **LIVE** | **PUBLIC** | 158 | Archived reference: Windows OpenManus/Ollama setup. Preser |
| `ManosAbiertas-backup-v1` | archived | **PUBLIC** | 12503 | Plataforma educativa multilingue con cursos gratuitos, CV  |
| `manus-auditoria-chat-export-2026-08-21` | **LIVE** | private | 62 | Auditoria ManuS - exportacion de chat con hallazgos (2026- |
| `mimo-lh-archivo-completo` | **LIVE** | private | 2060 | Archivo privado de la conversación, documentos y proyecto  |
| `oracle-openclaw-chat-archive-2026` | **LIVE** | private | 5 | Private archive of Oracle Cloud and OpenClaw chat material |
| `prometheus-omega-backup` | **LIVE** | private | 351 | Prometheus Omega - respaldo versionado del nucleo del ecos |
| `replay` | **LIVE** | private | 27 | Replay — session replay and AI conversation archive |
| `secure-t-archive` | archived | private | 2584 | Backup archivado de secure-t |

---

## 2b. DUPLICATE FAMILIES

Detection = curated case-insensitive regex rules (the 16 supplied families + auto-detected extras with >= 2 members). Canonical = **most stars > most recent push > shortest name**. Flag legend: `arch`=archived, `live`=active, `priv`/`PUBLIC`, `CANON`=keep candidate, `nodesc`=no description.

**57 families detected, covering 225 of 501 repos** (276 singletons).

**Caveat on canonical picks:** **29 of the 57 canonicals land on an already-archived member.** The supplied rule (`stars > push > shortest name`) has no live-preference, and since all 501 repos have 0 stars, recency alone decides. Treat an `arch` canonical as KEEP-VERIFY: prefer the newest `live` member of that family when the canonical is archived.

| Family | Kind | n | Canonical (keep) | Rec | Members (flags) |
|---|---|---:|---|---|---|
| **belentani-omega** | known | 15 | `belentani-omega-template-v2` | KEEP 1 / ARCH 6 live | `belentani-Omega`(arch,priv,nodesc), `belentani-omega-core`(arch,priv,nodesc), `belentani-omega-immersive-portal`(live,PUBLIC), `belentani-omega-master`(live,priv,nodesc), `belentani-omega-os-codex-07-31`(arch,priv), `belentani-omega-portal`(live,PUBLIC), `belentani-omega-template`(live,PUBLIC), `belentani-omega-template-audited`(arch,priv,nodesc), `belentani-omega-template-v2`(arch,priv,CANON,nodesc), `belentani-omega-tool`(arch,priv), `belentani-omega-ultra`(live,priv,nodesc), `belentani_Omega`(live,PUBLIC), `belentani_Omega-audited`(arch,priv,nodesc), `belentani_omega-belentani7`(arch,priv), `belentani_omega_backup`(arch,priv) |
| **manosabiertas** | known | 14 | `maos-abertas-linguaforge` | KEEP 1 / ARCH 2 live | `abrazo-tender-words`(arch,PUBLIC), `manos-abiertas`(arch,priv), `manos-abiertas-2026`(live,PUBLIC,nodesc), `manos-abiertas-docs`(arch,priv,nodesc), `manos-abiertas-release-netlify-20260812`(arch,priv), `manos_abiertas_course_modules`(arch,priv), `ManosAbiertas`(live,PUBLIC), `manosabiertas-38d5f`(arch,priv), `ManosAbiertas-backup-v1`(arch,PUBLIC), `manosabiertas-components`(arch,priv,nodesc), `manosabiertas-optimizacion-2`(arch,priv), `manosabiertas-repo`(arch,priv), `manosabiertas-vercel-20260813`(arch,priv), `maos-abertas-linguaforge`(live,priv,CANON) |
| **belentani-judas** | known | 9 | `BELENTANI-JUDAS-ERA-FULLSTACK` | KEEP 1 / ARCH 6 live | `belentani-judas`(live,PUBLIC), `belentani-judas-era-export`(arch,priv), `BELENTANI-JUDAS-ERA-FULLSTACK`(arch,priv,CANON,nodesc), `belentani-judas-era-omega`(arch,PUBLIC), `belentani-judas-escape-mobile`(live,priv,nodesc), `belentani-judas-evolved`(live,priv,nodesc), `belentani-judas-experience`(live,PUBLIC,nodesc), `belentani-judas-monograph`(live,priv), `belentani-judas-web`(live,PUBLIC) |
| **duck-zion** | known | 9 | `duck-zion-studio-os` | KEEP 1 / ARCH 4 live | `duck-zion-apex-public`(live,PUBLIC), `duck-zion-ecosystem`(arch,priv,nodesc), `DUCK-ZION-GITHUB`(live,priv,nodesc), `duck-zion-portal-clientes`(arch,priv,nodesc), `DUCK-ZION-PREMIUM`(live,PUBLIC), `duck-zion-premium-2`(arch,priv), `DUCK-ZION-PREMIUM-audited`(arch,priv,nodesc), `duck-zion-studio`(live,priv,nodesc), `duck-zion-studio-os`(arch,priv,CANON,nodesc) |
| **natalia-marinho** | CLIENT | 9 | `natalia-manus-repo` | **DO NOT TOUCH** | `natalia-manus-repo`(live,priv,CANON,nodesc), `natalia-marinho`(arch,priv), `natalia-marinho-2`(arch,priv), `natalia-marinho-3`(arch,priv), `natalia-marinho-business`(live,priv,nodesc), `nataliamarinho`(live,priv), `nataliamarinho-2`(arch,priv), `nataliamarinho-3`(arch,priv), `nataliamarinho-4`(arch,priv) |
| **duck-studio** | known | 8 | `duck-studio-suite` | KEEP 1 / ARCH 6 live | `duck-studio-delivery`(live,priv,nodesc), `DUCK-STUDIO-LOCAL-WIN11`(arch,priv,nodesc), `duck-studio-maker-export`(live,priv), `duck-studio-os-protected`(live,priv,nodesc), `duck-studio-os-v2`(live,priv,nodesc), `duck-studio-suite`(live,PUBLIC,CANON), `duck-studio-unified`(live,priv), `DUCK-STUDIO-WIN11`(live,priv,nodesc) |
| **judas (non-belentani)** | extra | 8 | `judas-omega-static-repo` | KEEP 1 / ARCH 6 live | `judas-access`(live,priv,nodesc), `judas-experience`(live,priv), `judas-experience-galactic`(live,PUBLIC), `judas-omega-static`(live,PUBLIC), `judas-omega-static-repo`(arch,priv,CANON), `judas-scifi-experience`(live,PUBLIC,nodesc), `the-judas-experience`(arch,PUBLIC,nodesc), `UIJUDAS`(live,PUBLIC) |
| **noiacore (broad)** | extra | 8 | `noiacore-revenue-pipeline` | KEEP 1 / ARCH 7 live | `NOIACORE`(live,PUBLIC), `noiacore-art-lab`(live,priv,nodesc), `noiacore-model-guard`(live,priv,nodesc), `noiacore-os`(live,priv,nodesc), `noiacore-registry`(live,priv,nodesc), `noiacore-revenue-pipeline`(live,priv,CANON,nodesc), `noiacore-theme`(live,priv,nodesc), `noiacore-turbo-v2`(live,PUBLIC) |
| **heyduck** | known | 7 | `heyduck-belentani7` | KEEP 1 / ARCH 2 live | `heyduck`(live,PUBLIC), `heyduck-2`(arch,priv), `heyduck-3`(arch,priv), `heyduck-4`(arch,priv), `heyduck-belentani7`(arch,priv,CANON), `heyduck-github-12scripts`(arch,priv), `heyduck-rebuild`(live,priv,nodesc) |
| **secure-t** | extra | 7 | `securetea` | KEEP 1 / ARCH 3 live | `secure-t`(live,PUBLIC), `secure-t-app`(arch,PUBLIC), `secure-t-archive`(arch,priv), `secure-t-platform`(live,priv,nodesc), `secure-t-university`(live,priv,nodesc), `secure-t-v2`(arch,priv), `securetea`(live,PUBLIC,CANON) |
| **aion** | extra | 6 | `aion-compliance` | KEEP 1 / ARCH 5 live | `08-AION-WORKFORCE`(live,priv,nodesc), `aion`(live,priv,nodesc), `aion-acquisition-engine-audited`(live,priv), `aion-compliance`(arch,priv,CANON,nodesc), `aion-showcase`(live,priv), `aion-workforce-enterprise`(live,priv) |
| **carquidec** | CLIENT | 6 | `mesmo-carquidec-proyecto` | **DO NOT TOUCH** | `CARQUIDEC`(live,PUBLIC), `carquidec-2`(arch,priv), `carquidec-3`(arch,priv), `carquidec-4`(arch,priv), `CARQUIDEC-ULTRA`(arch,priv,nodesc), `mesmo-carquidec-proyecto`(arch,priv,CANON) |
| **voice-bot-saas** | known | 6 | `voice-bot-saas-v2` | KEEP 1 / ARCH 1 live | `voice-ai-agency`(live,priv,nodesc), `voice-assistant`(arch,priv), `voice-bot-saas`(arch,priv,nodesc), `voice-bot-saas-v2`(arch,priv,CANON,nodesc), `voicebot-saas`(arch,priv), `voicerestore`(arch,priv) |
| **artequeveste** | CLIENT | 4 | `arte-que-veste` | **DO NOT TOUCH** | `arte-que-veste`(live,PUBLIC,CANON), `ArteQueVeste-Entrega-2026`(live,priv), `artequeveste-store-audited`(live,priv,nodesc), `ArteQueVeste-v2`(live,priv,nodesc) |
| **belentani7 profile** | extra | 4 | `belentani7-gestaltAI` | KEEP 1 / ARCH 3 live | `belentani7`(live,PUBLIC), `belentani7-gestaltAI`(arch,PUBLIC,CANON,nodesc), `belentani7-profile`(live,priv,nodesc), `belentani7.github.io`(live,PUBLIC) |
| **cruzando-el-charco** | known | 4 | `cruzando-el-charco-web` | KEEP 1 / ARCH 1 live | `clon-manosabiertas`(arch,priv), `Cruzando-el-charco`(live,PUBLIC), `cruzando-el-charco-v2`(arch,priv,nodesc), `cruzando-el-charco-web`(arch,priv,CANON,nodesc) |
| **noiacore-lab** | known | 4 | `noiacore-labs` | KEEP 1 / ARCH 2 live | `noiacore-lab`(live,priv), `noiacore-lab-audited`(arch,priv), `noiacore-lab-consciousness`(live,priv,nodesc), `noiacore-labs`(live,priv,CANON,nodesc) |
| **omega-*** | extra | 4 | `omega-core` | KEEP 1 / ARCH 3 live | `omega-core`(arch,priv,CANON), `omega-infinite-os`(live,PUBLIC,nodesc), `omega-infinite-v4`(live,PUBLIC,nodesc), `omega-max-duck`(live,PUBLIC) |
| **belentani-studio** | known | 3 | `belentani-studio` | KEEP 1 / ARCH 1 live | `belentani-studio`(arch,priv,CANON), `belentani-studio-motion`(live,priv), `belentani-studio-v2`(arch,priv,nodesc) |
| **belentani-the** | extra | 3 | `belentani-the-experience` | KEEP 1 / ARCH 1 live | `belentani-the-experience`(live,priv,CANON,nodesc), `belentani-the-judas-experience`(live,PUBLIC,nodesc), `belentani-the-judas-experience-archive`(arch,PUBLIC) |
| **belentani-video** | extra | 3 | `belentani-video-forge-audited` | KEEP 1 / ARCH 1 live | `belentani-video-forge`(live,PUBLIC), `belentani-video-forge-audited`(arch,priv,CANON,nodesc), `belentani-video-lab`(arch,priv) |
| **claude-skills** | extra | 3 | `claude-skills-pack` | KEEP 1 / ARCH 2 live | `claude-skills`(live,priv,nodesc), `claude-skills-full`(live,priv,nodesc), `claude-skills-pack`(live,PUBLIC,CANON) |
| **duck-ecosystem** | extra | 3 | `duck-ecosystem-inspect` | KEEP 1 / ARCH 1 live | `duck-ecosystem`(live,PUBLIC), `duck-ecosystem-inspect`(arch,priv,CANON,nodesc), `duck-ecosystem-v2`(arch,priv,nodesc) |
| **duck-unified-master** | known | 3 | `duck-unified-master-audited` | KEEP 1 / ARCH 0 live | `duck-unified-master`(arch,PUBLIC), `duck-unified-master-2`(arch,priv), `duck-unified-master-audited`(arch,priv,CANON,nodesc) |
| **local-agent** | extra | 3 | `local-agent` | KEEP 1 / ARCH 0 live | `local-agent`(live,PUBLIC,CANON), `local-agent-2`(arch,priv), `local-agent-3`(arch,priv) |
| **meta-skill packs** | extra | 3 | `meta-design-skill` | KEEP 1 / ARCH 2 live | `meta-design-skill`(arch,priv,CANON), `meta-skill`(live,PUBLIC), `MetaSkill`(live,PUBLIC) |
| **music-os** | known | 3 | `music-os-interface` | KEEP 1 / ARCH 2 live | `music-os-interface`(live,priv,CANON), `music-os-interface-v2`(live,priv,nodesc), `music-os-pedro-belentani`(live,priv) |
| **newbelentani** | extra | 3 | `newbelentani` | KEEP 1 / ARCH 2 live | `newbelentani`(live,PUBLIC,CANON), `newbelentani1`(live,PUBLIC), `newbelentani11`(live,PUBLIC) |
| **platform1/2/3** | extra | 3 | `platform3-engine` | KEEP 1 / ARCH 2 live | `platform1-app`(live,priv,nodesc), `platform2-web`(live,priv,nodesc), `platform3-engine`(live,priv,CANON,nodesc) |
| **pvc-u** | extra | 3 | `metricool-pvcu-dashboard-audited` | KEEP 1 / ARCH 2 live | `metricool-pvcu-dashboard-audited`(live,priv,CANON,nodesc), `pvc-u-core`(live,PUBLIC), `pvc-u-frontend`(live,PUBLIC) |
| **steven-renovation** | CLIENT | 3 | `steven-renovation-2` | **DO NOT TOUCH** | `Steven-renovation`(live,PUBLIC), `steven-renovation-2`(arch,priv,CANON), `steven-renovation-3`(arch,priv) |
| **tender-words** | known | 3 | `tender-words-connect-main` | KEEP 1 / ARCH 1 live | `tender-words-connect`(live,PUBLIC), `tender-words-connect-main`(arch,priv,CANON), `tender-words-connect-v2`(arch,priv,nodesc) |
| **william** | extra | 3 | `william-game` | KEEP 1 / ARCH 2 live | `william-game`(live,PUBLIC,CANON,nodesc), `william.game`(live,priv), `WILLIAMSCHOOL`(live,PUBLIC) |
| **03-duck-web** | extra | 2 | `03-DUCK-WEB-build-everything` | KEEP 1 / ARCH 0 live | `03-DUCK-WEB-build-everything`(arch,priv,CANON,nodesc), `03-DUCK-WEB-build-everything-drive`(arch,priv,nodesc) |
| **aurea3d-premium** | extra | 2 | `aurea3d-premium` | KEEP 1 / ARCH 1 live | `aurea3d-premium`(arch,priv,CANON), `aurea3d-premium-archivo`(live,priv) |
| **belentani-cv-ai** | extra | 2 | `Belentani.cv-ai-audited` | KEEP 1 / ARCH 1 live | `Belentani.cv-ai`(live,PUBLIC), `Belentani.cv-ai-audited`(arch,priv,CANON,nodesc) |
| **belentani-ecosystem** | extra | 2 | `belentani-ecosystem-control` | KEEP 1 / ARCH 1 live | `belentani-ecosystem-assets`(live,priv,nodesc), `belentani-ecosystem-control`(live,priv,CANON,nodesc) |
| **belentani-java** | extra | 2 | `belentani-java-lite` | KEEP 1 / ARCH 1 live | `belentani-java-lite`(live,priv,CANON,nodesc), `belentani-java-platform`(live,PUBLIC) |
| **belentani-unified** | extra | 2 | `belentani-unified` | KEEP 1 / ARCH 1 live | `belentani-unified`(live,priv,CANON), `belentani-unified-map`(live,priv,nodesc) |
| **ctg-psicologia** | extra | 2 | `ctg-psicologia-next` | KEEP 1 / ARCH 1 live | `ctg-psicologia-archive-2026`(live,priv), `ctg-psicologia-next`(arch,priv,CANON,nodesc) |
| **duck-2000** | extra | 2 | `duck-2000` | KEEP 1 / ARCH 0 live | `duck-2000`(arch,priv,CANON), `duck-2000-2`(arch,priv) |
| **duck-2026** | extra | 2 | `duck-2026-2` | KEEP 1 / ARCH 1 live | `duck-2026`(live,PUBLIC), `duck-2026-2`(arch,priv,CANON) |
| **duck-apps** | extra | 2 | `duck-apps` | KEEP 1 / ARCH 1 live | `duck-apps`(live,PUBLIC,CANON), `duck-apps-web`(live,PUBLIC) |
| **duck-full-studio-pro** | extra | 2 | `duck-full-studio-pro-2` | KEEP 1 / ARCH 1 live | `duck-full-studio-pro`(live,PUBLIC), `duck-full-studio-pro-2`(arch,priv,CANON) |
| **duck-lab** | extra | 2 | `duck-lab` | KEEP 1 / ARCH 1 live | `duck-lab`(arch,PUBLIC,CANON), `duck-lab-music-creator`(live,priv,nodesc) |
| **duck-music** | extra | 2 | `duck-music-lab` | KEEP 1 / ARCH 1 live | `duck-music-lab`(live,PUBLIC,CANON), `DUCK-MUSIC-PRODUCER-v1.0.0`(live,priv,nodesc) |
| **duck-producao** | extra | 2 | `duck-producao-musical` | KEEP 1 / ARCH 1 live | `duck-producao-musical`(live,priv,CANON), `duck-producao-musical-chat-archive-2026-08-22`(live,priv) |
| **free-claude-code** | extra | 2 | `free-claude-code-alishahryar1` | KEEP 1 / ARCH 0 live | `free-claude-code-alishahryar1`(arch,priv,CANON), `free-claude-code-simplesunny`(arch,priv) |
| **lingua-aberta** | extra | 2 | `lingua-aberta-empresa` | KEEP 1 / ARCH 1 live | `lingua-aberta`(live,priv), `lingua-aberta-empresa`(live,PUBLIC,CANON,nodesc) |
| **linguaforge** | known | 2 | `linguaforge-v2` | KEEP 1 / ARCH 1 live | `linguaforge`(live,PUBLIC), `linguaforge-v2`(arch,priv,CANON,nodesc) |
| **marcia/cuidar** | CLIENT | 2 | `cuidar-conecta-marcia` | **DO NOT TOUCH** | `cuidar-conecta-marcia`(live,priv,CANON,nodesc), `marcia-os-v2`(live,priv) |
| **nexus-workforce** | extra | 2 | `nexus-workforce-enterprise` | KEEP 1 / ARCH 1 live | `nexus-workforce`(live,priv,nodesc), `nexus-workforce-enterprise`(live,priv,CANON) |
| **pedro-belentani-blog** | extra | 2 | `pedro-belentani-blog` | KEEP 1 / ARCH 1 live | `pedro-belentani-blog`(live,priv,CANON,nodesc), `pedro-belentani-blog-neural`(live,priv,nodesc) |
| **premium-effects** | extra | 2 | `premium-effects` | KEEP 1 / ARCH 1 live | `premium-effects`(live,priv,CANON,nodesc), `premium-effects-registry`(live,PUBLIC) |
| **rh-fiscal** | extra | 2 | `rh-fiscal-ultra-elite` | KEEP 1 / ARCH 1 live | `rh-fiscal-ultra-elite`(live,PUBLIC,CANON), `rh-fiscal-ultra-web`(live,priv) |
| **skills-registry** | extra | 2 | `skills-registry` | KEEP 1 / ARCH 1 live | `skills-marketplace`(live,priv,nodesc), `skills-registry`(live,PUBLIC,CANON) |
| **superpowers** | extra | 2 | `superpowers-extra` | KEEP 1 / ARCH 1 live | `superpowers`(live,priv,nodesc), `superpowers-extra`(arch,priv,CANON) |

---

## 2c. NO-DESCRIPTION REPOS

Exact count: **189 of 501 (37.7%)** have an empty or null description.

First 60 (alphabetical) with `primaryLanguage`:

| # | Repo | primaryLanguage | Archived | Private |
|---:|---|---|---|---|
| 1 | `03-DUCK-WEB-build-everything` | - | Y | Y |
| 2 | `03-DUCK-WEB-build-everything-drive` | - | Y | Y |
| 3 | `08-AION-WORKFORCE` | HTML | - | Y |
| 4 | `11-PORTAL-CLIENTES-audited` | HTML | - | Y |
| 5 | `20-demos` | HTML | - | Y |
| 6 | `agent-control-plane` | TypeScript | - | Y |
| 7 | `agent-orchestration-machine` | Python | - | Y |
| 8 | `ai-music-production-lab-commerce-os` | Python | - | Y |
| 9 | `aion` | TypeScript | - | Y |
| 10 | `aion-compliance` | Python | Y | Y |
| 11 | `artequeveste-store-audited` | TypeScript | - | Y |
| 12 | `ArteQueVeste-v2` | HTML | - | Y |
| 13 | `automations` | HTML | - | Y |
| 14 | `autonomous-flow` | TypeScript | - | Y |
| 15 | `backend` | Python | - | Y |
| 16 | `belentaini-titan-os` | HTML | - | Y |
| 17 | `belentani-artista-unified` | HTML | - | PUBLIC |
| 18 | `belentani-brain` | Python | - | Y |
| 19 | `BELENTANI-CENTRO-MANUS-AI` | - | Y | Y |
| 20 | `belentani-code-windows` | Python | - | Y |
| 21 | `belentani-core` | TypeScript | Y | Y |
| 22 | `belentani-ecosystem-assets` | PowerShell | - | Y |
| 23 | `belentani-ecosystem-control` | Python | - | Y |
| 24 | `belentani-java-lite` | Java | - | Y |
| 25 | `BELENTANI-JUDAS-ERA-FULLSTACK` | TypeScript | Y | Y |
| 26 | `belentani-judas-escape-mobile` | HTML | - | Y |
| 27 | `belentani-judas-evolved` | TypeScript | - | Y |
| 28 | `belentani-judas-experience` | TypeScript | - | PUBLIC |
| 29 | `belentani-local` | TypeScript | - | Y |
| 30 | `belentani-Omega` | HTML | Y | Y |
| 31 | `belentani-omega-core` | TypeScript | Y | Y |
| 32 | `belentani-omega-master` | HTML | - | Y |
| 33 | `belentani-omega-template-audited` | HTML | Y | Y |
| 34 | `belentani-omega-template-v2` | HTML | Y | Y |
| 35 | `belentani-omega-ultra` | TypeScript | - | Y |
| 36 | `belentani-os` | HTML | Y | Y |
| 37 | `BELENTANI-SEPARACION` | - | - | Y |
| 38 | `belentani-studio-v2` | TypeScript | Y | Y |
| 39 | `belentani-the-experience` | CSS | - | Y |
| 40 | `belentani-the-judas-experience` | Python | - | PUBLIC |
| 41 | `belentani-unified-map` | Python | - | Y |
| 42 | `belentani-v2` | CSS | Y | PUBLIC |
| 43 | `belentani-video-forge-audited` | Python | Y | Y |
| 44 | `belentani-voz` | Jupyter Notebook | Y | Y |
| 45 | `Belentani.cv-ai-audited` | TypeScript | Y | Y |
| 46 | `belentani7-gestaltAI` | - | Y | PUBLIC |
| 47 | `belentani7-profile` | TypeScript | - | Y |
| 48 | `belentani_Omega-audited` | JavaScript | Y | Y |
| 49 | `Belentanislide` | HTML | - | PUBLIC |
| 50 | `boutique-catalogo` | TypeScript | Y | Y |
| 51 | `bportal` | HTML | - | Y |
| 52 | `build-everything` | HTML | Y | Y |
| 53 | `capacity-gate-autopilot` | TypeScript | - | Y |
| 54 | `CARQUIDEC-ULTRA` | - | Y | Y |
| 55 | `cassandra-complex` | Python | Y | Y |
| 56 | `catalonia-booking` | HTML | Y | Y |
| 57 | `caveman-skill` | JavaScript | - | Y |
| 58 | `circuit-ai-support` | TypeScript | - | Y |
| 59 | `claude-skills` | Python | - | Y |
| 60 | `claude-skills-full` | - | - | Y |

*(remaining 129 no-description repos omitted for length; full set in `repos_utf8.json`)*

---

## 3. PROPOSED ACTIONS - **NOT EXECUTED**

> Nothing below has been run. These are review candidates only.

### 3a. Backups - `gh repo archive` candidate list

The 109-repo local-PC cohort is **already archived**, so its proposed-archive count is **0**.

Candidate rule: repo is **live** AND (name **or** description matches the backup regex) AND **not** client-flagged AND **not** the canonical of any family (canonicals are the keep targets, so they are excluded to avoid contradicting 3b). That yields **25** repos, of which **23 are private** and **2 are PUBLIC** (public ones are flagged below - see 4a).

**Count: 25**

```powershell
gh repo archive aion-acquisition-engine-audited
gh repo archive archivo-fabi-privado
gh repo archive aurea3d-premium-archivo
gh repo archive belentani-artist-site-archive
gh repo archive BELENTANI-BUILDAI-HTML-Y-FOTOS
gh repo archive belentani-chat-archive-2026
gh repo archive belentani-complete-archive
gh repo archive belentani-estudi-digital-archive
gh repo archive BELENTANI-FULLSTACK-2026-08-08
gh repo archive cassandra-belentani-complex
gh repo archive ctg-psicologia-archive-2026
gh repo archive duck-belentani-os-audited-2026-08-23   # PUBLIC - visible
gh repo archive duck-producao-musical-chat-archive-2026-08-22
gh repo archive duck-studio-maker-export
gh repo archive duck-zion-apex-public   # PUBLIC - visible
gh repo archive duckweb-belentani-export
gh repo archive ecosistema-ia-pro-max-export-2026
gh repo archive fileforge-studio-export-20260822204142
gh repo archive infinita-visual-archive-10x
gh repo archive lios-complete-conversation-archive
gh repo archive manus-auditoria-chat-export-2026-08-21
gh repo archive mimo-lh-archivo-completo
gh repo archive oracle-openclaw-chat-archive-2026
gh repo archive prometheus-omega-backup
gh repo archive replay
```

Held back by the client / explicit-hold guard (1): `backup-no-tocar-2026-09-10`

### 3b. Family recommendations (keep / merge / archive)

Per-family recommendations are in the **Rec** column of the 2b table above: **52** families are `KEEP 1 / ARCH n live` (keep the canonical, archive the redundant live copies after diffing history first), **5** are **DO NOT TOUCH** client families. Nothing was executed.

### 3c. Descriptions can be regenerated

The **189** no-description repos and the **109** `Backup local PC 2026-08-29` cohort need no manual writing. A generator pass over each repo's manifest/README can emit `gh repo edit --description`, a text-only reversible metadata change. Suggested sequencing: (1) archive backup-shaped repos, (2) collapse families, (3) batch-regenerate descriptions for survivors, (4) archive the emptied shells. Do each step as a separate reviewed batch, never a single scripted sweep.

---

## 4. RISKS

### 4a. PUBLIC repos - archiving is publicly visible

**125 public / 376 private / 501 total.** Archiving a public repo flips a visible archived badge and drops it from search and profile listings. Its content stays reachable, so this is low-data-risk but high-visibility.

Full public list (125), comma-separated:

```text
BELENTANI.UX, Belentani, Belentani.cad, Belentani.cv-ai, Belentanislide, CARQUIDEC, CODEX-OMEGA-SKILL
Cruzando-el-charco, DUCK-ZION-PREMIUM, Duck-Deck, Duck-Omega, DuckHTML, ManosAbiertas
ManosAbiertas-backup-v1, MetaSkill, Myopenhands, NOIACORE, Netlify, Oculus-Tv, Steven-renovation, UI
UIJUDAS, WILLIAMSCHOOL, abrazo-tender-words, agentbox, agentguard, ai-command-center-level10
arte-que-veste, bELENTANIBROS, belentani-alibaba-integration, belentani-artista-unified
belentani-design-hub, belentani-infrastructure-core, belentani-java-platform, belentani-judas
belentani-judas-era-omega, belentani-judas-experience, belentani-judas-web, belentani-monorepo
belentani-omega-immersive-portal, belentani-omega-portal, belentani-omega-template
belentani-the-judas-experience, belentani-the-judas-experience-archive, belentani-v2
belentani-video-forge, belentani3dfactory, belentani7, belentani7-gestaltAI, belentani7.github.io
belentani_Omega, belentaniexperience, cinematic-prompt-formatter, claude-skills-pack, cli-coder-patterns
comfyui-json-compiler, deepseek-fix-verify, duck-2026, duck-apps, duck-apps-web
duck-belentani-os-audited-2026-08-23, duck-docs, duck-ecosystem, duck-full-studio-pro, duck-hub
duck-lab, duck-music-lab, duck-studio-suite, duck-unified-master, duck-zion-apex-public
entrenador-jorge-bcn, evidence-ledger, fashion-stylist-ai, gpu-cost-optimizer, hack-visual, harmonia-hub
heyduck, judas-experience-galactic, judas-omega-static, judas-scifi-experience, la-alquitara
latent-consistency-bench, lingua-aberta-empresa, linguaforge, llm-vfx-orchestrator, local-agent
manos-abiertas-2026, manus-ai-skill-pack, meta-skill, michelle-relayze-web, mimo-companion
nebula-cosmos, newbelentani, newbelentani1, newbelentani11, nexus-os, noiacore-turbo-v2
omega-infinite-os, omega-infinite-v4, omega-max-duck, omniagent, open-school, openclaw-workspace
oss-compass, pbr-validator, portfolio, power, premium-effects-registry, proofmesh, pvc-u-core
pvc-u-frontend, qbp-core, registro-proyectos-2026, rh-fiscal-ultra-elite, secure-t, secure-t-app
securetea, skillforge, skills-registry, temporal-artifact-detector, tender-words-connect
the-judas-experience, ux-academy-professional-program, william-game, win11-workspace
```

**66 of those public repos sit inside a duplicate family** (archive here = most visible action):

```text
Belentani.cv-ai, CARQUIDEC, Cruzando-el-charco, DUCK-ZION-PREMIUM, ManosAbiertas
ManosAbiertas-backup-v1, MetaSkill, NOIACORE, Steven-renovation, UIJUDAS, WILLIAMSCHOOL
abrazo-tender-words, arte-que-veste, belentani-java-platform, belentani-judas, belentani-judas-era-omega
belentani-judas-experience, belentani-judas-web, belentani-omega-immersive-portal
belentani-omega-portal, belentani-omega-template, belentani-the-judas-experience
belentani-the-judas-experience-archive, belentani-video-forge, belentani7, belentani7-gestaltAI
belentani7.github.io, belentani_Omega, claude-skills-pack, duck-2026, duck-apps, duck-apps-web
duck-ecosystem, duck-full-studio-pro, duck-lab, duck-music-lab, duck-studio-suite, duck-unified-master
duck-zion-apex-public, heyduck, judas-experience-galactic, judas-omega-static, judas-scifi-experience
lingua-aberta-empresa, linguaforge, local-agent, manos-abiertas-2026, meta-skill, newbelentani
newbelentani1, newbelentani11, noiacore-turbo-v2, omega-infinite-os, omega-infinite-v4, omega-max-duck
premium-effects-registry, pvc-u-core, pvc-u-frontend, rh-fiscal-ultra-elite, secure-t, secure-t-app
securetea, skills-registry, tender-words-connect, the-judas-experience, william-game
```

### 4b. CLIENT repos - never touch

Matched by `natalia* | carquidex* | carquide* | steven* | michelle* | relayze* | artequeveste | sabons* | marcia* | cuidar*` plus the literal `no-tocar` hold. **27 repos.** Several are deliverable/client sites. Do not archive, rename, edit, or delete any of them.

| Repo | Archived | Visibility | Why flagged |
|---|---|---|---|
| `arte-que-veste` | no | **PUBLIC** | client name pattern |
| `ArteQueVeste-Entrega-2026` | no | private | client name pattern |
| `artequeveste-store-audited` | no | private | client name pattern |
| `ArteQueVeste-v2` | no | private | client name pattern |
| `backup-no-tocar-2026-09-10` | no | private | explicit `no-tocar` hold |
| `CARQUIDEC` | no | **PUBLIC** | client name pattern |
| `carquidec-2` | Y | private | client name pattern |
| `carquidec-3` | Y | private | client name pattern |
| `carquidec-4` | Y | private | client name pattern |
| `CARQUIDEC-ULTRA` | Y | private | client name pattern |
| `cuidar-conecta-marcia` | no | private | client name pattern |
| `marcia-os-v2` | no | private | client name pattern |
| `mesmo-carquidec-proyecto` | Y | private | client name pattern |
| `michelle-relayze-web` | Y | **PUBLIC** | client name pattern |
| `natalia-manus-repo` | no | private | client name pattern |
| `natalia-marinho` | Y | private | client name pattern |
| `natalia-marinho-2` | Y | private | client name pattern |
| `natalia-marinho-3` | Y | private | client name pattern |
| `natalia-marinho-business` | no | private | client name pattern |
| `nataliamarinho` | no | private | client name pattern |
| `nataliamarinho-2` | Y | private | client name pattern |
| `nataliamarinho-3` | Y | private | client name pattern |
| `nataliamarinho-4` | Y | private | client name pattern |
| `sabons-alejandra-site` | no | private | client name pattern |
| `Steven-renovation` | no | **PUBLIC** | client name pattern |
| `steven-renovation-2` | Y | private | client name pattern |
| `steven-renovation-3` | Y | private | client name pattern |

Exposure: **4** client-flagged repos are currently PUBLIC.

### 4c. Disk usage outliers

Top 14 by `diskUsage` (KB). 19 repos exceed 100 MB; account total **12936544 KB (~12.3 GB)**. Space is recovered by collapsing the big redundant families, not by archiving tiny shells.

| diskUsage KB | Repo | Visibility | State |
|---:|---|---|---|
| 1914086 | `belentaniobjetos` | priv | live |
| 1364691 | `twenty` | priv | archived |
| 1121725 | `belentani-os` | priv | archived |
| 1050656 | `belentani-Omega` | priv | archived |
| 517520 | `CARQUIDEC` | **PUBLIC** | live |
| 517513 | `carquidec-2` | priv | archived |
| 517513 | `carquidec-4` | priv | archived |
| 517506 | `carquidec-3` | priv | archived |
| 517504 | `mesmo-carquidec-proyecto` | priv | archived |
| 397028 | `obscura` | priv | archived |
| 285777 | `BELENTANI-BUILDAI-HTML-Y-FOTOS` | priv | live |
| 243615 | `depth-anything` | priv | archived |
| 208009 | `DUCK-ZION-PREMIUM` | **PUBLIC** | live |
| 208000 | `duck-zion-premium-2` | priv | archived |

Note the `carquidec` cluster: 5 near-identical ~517 MB copies (CLIENT - do not touch). `belentani-Omega` (1,050 MB) and `belentani-os` (1,121 MB) are both already archived, so their size is retained, not freed, by archiving.

### 4d. Other cautions

- `backup-no-tocar-2026-09-10` is a literal "do not touch" hold - excluded from every proposed list.
- `archivo-fabi-privado` and `cuidamar-privacidad-portable` imply third-party personal data - treat as sensitive even though private.
- `mimocode-workspace-backup`, `prometheus-omega-backup`, `belentani_omega_backup`, `secure-t-archive` are named backups of live work - confirm the live counterpart exists and is newer before archiving.
- **183 repos are already archived**; they will likely dominate any `gh repo list` you eyeball, which is why raw counts mislead.
- Family regexes are heuristic: a few singleton repos with shared brand prefixes (e.g. `belentani-never-listed`) may belong to families not captured here. Review the member lists above before acting.

---

## 5. Summary

- **501** repos; **183** archived; **318** live; **376** private; **125** public; **0** with any stars.
- Backups: cohort `Backup local PC 2026-08-29` = **109**, all already archived, 0 actionable. Live backup-shaped repos (name or description) = **27** (proposed archive count = **25** after excluding client holds and family canonicals).
- Families: **57** detected covering **225** repos; **5** include client repos that must never be touched.
- **189** repos have no description (regenerable via `gh repo edit`).
- **NOTHING WAS EXECUTED.** Confirmed no mutating `gh repo` subcommand was invoked.
