# Puerta de seguridad previa al borrado.
# 1) Cada canonico debe estar LIMPIO y exactamente en origin/<rama>.
# 2) Cada sobrante debe estar detras de origin (todos sus commits ya en el remoto).
# 3) La rama local respaldo-commit-voz no debe aportar nada unico.
$ErrorActionPreference = "SilentlyContinue"

$canonicos = @(
  @("lingua-aberta","C:\Users\USER\belentani-repos-master\lingua-aberta","duck"),
  @("linguaforge","C:\Users\USER\belentani-repos-master\linguaforge","main"),
  @("ManosAbiertas","C:\Users\USER\belentani-repos-master\ManosAbiertas","main"),
  @("secure-t-university","C:\Users\USER\belentani-repos-master\secure-t-university","main"),
  @("ux-academy","C:\Users\USER\belentani-repos-master\ux-academy-professional-program","main"),
  @("open-school","C:\Users\USER\belentani-repos-master\open-school","main")
)

$ok = $true
Write-Output "===== CANONICOS ====="
foreach ($c in $canonicos) {
  $p = $c[1]; $b = $c[2]
  git -C $p fetch origin --quiet 2>$null
  $head = git -C $p rev-parse HEAD 2>$null
  $orig = git -C $p rev-parse "origin/$b" 2>$null
  $dirty = git -C $p status --porcelain 2>$null
  $nDirty = 0; if ($dirty) { $nDirty = ($dirty | Measure-Object).Count }
  $igual = ($head -eq $orig)
  if (-not $igual) { $ok = $false }
  if ($nDirty -gt 0) { $ok = $false }
  Write-Output ("{0}|head={1}|origin={2}|identico={3}|sucio={4}" -f $c[0], $head.Substring(0,7), $orig.Substring(0,7), $igual, $nDirty)
}

Write-Output "===== SOBRANTES (deben estar DETRAS de origin) ====="
$sobrantes = @(
  @("lingua-aberta","C:\Users\USER\repos\lingua-aberta","duck"),
  @("lingua-aberta","C:\Users\USER\belentani-unified-master\repos\lingua-aberta","duck"),
  @("linguaforge","C:\Users\USER\repos\linguaforge","main"),
  @("ManosAbiertas","C:\Users\USER\repos\ManosAbiertas","main"),
  @("ManosAbiertas","C:\Users\USER\belentani-unified-master\repos\ManosAbiertas","main"),
  @("secure-t-university","C:\Users\USER\belentani-unified-master\repos\secure-t-university","main"),
  @("ux-academy","C:\Users\USER\repos\ux-academy-professional-program","main"),
  @("ux-academy","C:\Users\USER\belentani-unified-master\repos\ux-academy-professional-program","main"),
  @("open-school","C:\Users\USER\belentani-unified-master\repos\open-school","main")
)
foreach ($s in $sobrantes) {
  $p = $s[1]; $b = $s[2]
  if (-not (Test-Path $p)) { Write-Output ("FALTA|{0}" -f $p); continue }
  git -C $p fetch origin --quiet 2>$null
  $adelante = git -C $p rev-list --count "origin/$b..HEAD" 2>$null
  $detras = git -C $p rev-list --count "HEAD..origin/$b" 2>$null
  $dirty = git -C $p status --porcelain 2>$null
  $nDirty = 0; if ($dirty) { $nDirty = ($dirty | Measure-Object).Count }
  if ($adelante -ne "0") { $ok = $false }
  if ($nDirty -gt 0) { $ok = $false }
  Write-Output ("{0}|{1}|adelante={2}|detras={3}|sucio={4}" -f $s[0], $p, $adelante, $detras, $nDirty)
}

Write-Output "===== RAMA LOCAL respaldo-commit-voz ====="
$rp = "C:\Users\USER\belentani-repos-master\secure-t-university"
$diff = git -C $rp diff --stat "respaldo-commit-voz..main" 2>$null
if ($diff) { $diff | Select-Object -Last 6 | ForEach-Object { Write-Output ("  {0}" -f $_) } } else { Write-Output "  sin diferencias con main" }
$unico = git -C $rp rev-list --count "main..respaldo-commit-voz" 2>$null
Write-Output ("  commits solo en respaldo = {0}" -f $unico)

Write-Output ""
if ($ok) { Write-Output "VEREDICTO: SEGURO BORRAR (canonicos limpios y en origin; sobrantes detras, sin sucio)" }
else { Write-Output "VEREDICTO: NO BORRAR - revisar lineas anteriores" }
