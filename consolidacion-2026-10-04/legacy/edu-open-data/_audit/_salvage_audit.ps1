# Auditoria de rescate: que hay en cada clon duplicado que NO este en el repo final.
# Para cada clon: fetch, commits sin subir, ramas locales, stash, archivos ignorados utiles.
$ErrorActionPreference = "SilentlyContinue"

$clones = @(
  @("lingua-aberta","C:\Users\USER\belentani-repos-master\lingua-aberta","duck","CANONICO"),
  @("lingua-aberta","C:\Users\USER\repos\lingua-aberta","duck","SPARE"),
  @("lingua-aberta","C:\Users\USER\belentani-unified-master\repos\lingua-aberta","duck","SPARE"),
  @("linguaforge","C:\Users\USER\belentani-repos-master\linguaforge","main","CANONICO"),
  @("linguaforge","C:\Users\USER\repos\linguaforge","main","SPARE"),
  @("ManosAbiertas","C:\Users\USER\belentani-repos-master\ManosAbiertas","main","CANONICO"),
  @("ManosAbiertas","C:\Users\USER\repos\ManosAbiertas","main","SPARE"),
  @("ManosAbiertas","C:\Users\USER\belentani-unified-master\repos\ManosAbiertas","main","SPARE"),
  @("secure-t-university","C:\Users\USER\belentani-repos-master\secure-t-university","main","CANONICO"),
  @("secure-t-university","C:\Users\USER\belentani-unified-master\repos\secure-t-university","main","SPARE"),
  @("ux-academy","C:\Users\USER\belentani-repos-master\ux-academy-professional-program","main","CANONICO"),
  @("ux-academy","C:\Users\USER\repos\ux-academy-professional-program","main","SPARE"),
  @("ux-academy","C:\Users\USER\belentani-unified-master\repos\ux-academy-professional-program","main","SPARE"),
  @("open-school","C:\Users\USER\belentani-repos-master\open-school","main","CANONICO"),
  @("open-school","C:\Users\USER\belentani-unified-master\repos\open-school","main","SPARE"),
  @("aprende-brasil","C:\Users\USER\belentani-unified-master\repos\aprende-brasil","main","CANONICO")
)

foreach ($c in $clones) {
  $portal = $c[0]; $path = $c[1]; $branch = $c[2]; $rol = $c[3]
  if (-not (Test-Path (Join-Path $path ".git"))) { continue }
  git -C $path fetch --all --quiet 2>$null

  $unpushed = 0
  $revs = git -C $path rev-list --count "origin/$branch..HEAD" 2>$null
  if ($revs) { $unpushed = [int]$revs }

  $dirtyList = git -C $path status --porcelain 2>$null
  $nDirty = 0
  if ($dirtyList) { $nDirty = ($dirtyList | Measure-Object).Count }

  $localBranches = @(git -C $path for-each-ref --format="%(refname:short)" refs/heads 2>$null)
  $remoteBranches = @(git -C $path for-each-ref --format="%(refname:short)" refs/remotes/origin 2>$null)

  $soloLocal = @()
  foreach ($b in $localBranches) {
    if ($remoteBranches -notcontains "origin/$b") { $soloLocal += $b }
  }

  $stash = @(git -C $path stash list 2>$null)

  # Archivos ignorados que podrian tener valor (fuera de node_modules/.next/dist/.venv)
  $ignorados = @()
  $ig = git -C $path status --ignored --porcelain 2>$null
  foreach ($line in $ig) {
    if ($line -match "^!! ") {
      $f = $line.Substring(3).Trim()
      if ($f -match "node_modules|\.next|dist|build|\.venv|__pycache__|\.cache|coverage|\.turbo|\.vercel/output") { continue }
      $ignorados += $f
    }
  }

  Write-Output ("{0}|{1}|{2}|head={3}|sin_subir={4}|sucio={5}|ramas_solo_local=[{6}]|stash={7}|ignorados={8}" -f `
    $rol, $portal, $path, (git -C $path rev-parse --short HEAD 2>$null), $unpushed, $nDirty, ($soloLocal -join ","), $stash.Count, ($ignorados.Count))
  if ($ignorados.Count -gt 0) {
    foreach ($f in ($ignorados | Select-Object -First 12)) { Write-Output ("      ign: {0}" -f $f) }
  }
  if ($nDirty -gt 0) {
    foreach ($f in ($dirtyList | Select-Object -First 12)) { Write-Output ("      dio: {0}" -f $f) }
  }
  if ($soloLocal.Count -gt 0) {
    foreach ($b in $soloLocal) { Write-Output ("      rama: {0} -> {1}" -f $b, (git -C $path rev-parse --short $b 2>$null)) }
  }
  if ($stash.Count -gt 0) {
    foreach ($s in $stash) { Write-Output ("      stash: {0}" -f $s) }
  }
  if ($unpushed -gt 0) {
    Write-Output "      --- commits sin subir ---"
    git -C $path log --oneline "origin/$branch..HEAD" 2>$null | Select-Object -First 15 | ForEach-Object { Write-Output ("      {0}" -f $_) }
    Write-Output "      --- archivos tocados ---"
    git -C $path diff --name-status "origin/$branch..HEAD" 2>$null | Select-Object -First 25 | ForEach-Object { Write-Output ("      {0}" -f $_) }
  }
}
