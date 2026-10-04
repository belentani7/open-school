# Borra los 9 clones duplicados verificados. Guarda de seguridad por clon:
#   - debe existir
#   - debe estar LIMPIO (git status --porcelain vacio)
#   - debe estar DETRAS de origin (0 commits sin subir)
# Si una sola guarda falla, NO se borra y se informa.
$ErrorActionPreference = "Stop"

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

$totalMB = 0
$borrados = 0

foreach ($s in $sobrantes) {
  $portal = $s[0]; $path = $s[1]; $branch = $s[2]
  if (-not (Test-Path $path)) { Write-Output ("OMITIDO  {0} (no existe)" -f $path); continue }

  $adelante = git -C $path rev-list --count "origin/$branch..HEAD" 2>$null
  $dirty = git -C $path status --porcelain 2>$null
  $nDirty = 0; if ($dirty) { $nDirty = ($dirty | Measure-Object).Count }

  if ($adelante -ne "0" -or $nDirty -gt 0) {
    Write-Output ("BLOQUEADO {0} sin_subir={1} sucio={2} -> NO BORRADO" -f $path, $adelante, $nDirty)
    continue
  }

  $mb = [Math]::Round((Get-ChildItem $path -Recurse -File -Force -ErrorAction SilentlyContinue |
        Measure-Object -Property Length -Sum).Sum / 1MB, 1)
  Remove-Item $path -Recurse -Force
  if (Test-Path $path) {
    Write-Output ("FALLO    {0} sigue existiendo" -f $path)
  } else {
    $totalMB += $mb
    $borrados++
    Write-Output ("BORRADO  {0} ({1} MB) [{2}]" -f $path, $mb, $portal)
  }
}

Write-Output ""
Write-Output ("borrados={0}/9  liberado={1} MB" -f $borrados, [Math]::Round($totalMB, 0))

Write-Output ""
Write-Output "===== QUEDAN ====="
Get-ChildItem "C:\Users\USER\repos" -Directory -Force | Select-Object -ExpandProperty Name |
  ForEach-Object { Write-Output ("repos\$_") }
