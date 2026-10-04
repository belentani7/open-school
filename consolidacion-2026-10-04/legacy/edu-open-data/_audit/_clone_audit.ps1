$ErrorActionPreference = "SilentlyContinue"
$names = @(
  "lingua-aberta","linguaforge","ManosAbiertas","secure-t-university",
  "ux-academy-professional-program","open-school","williamschool","william-game","aprende-brasil"
)
$roots = @(
  "C:\Users\USER\belentani-repos-master",
  "C:\Users\USER\repos",
  "C:\Users\USER\belentani-unified-master\repos",
  "C:\Users\USER\Desktop"
)
foreach ($n in $names) {
  foreach ($r in $roots) {
    $p = Join-Path $r $n
    if (-not (Test-Path (Join-Path $p ".git"))) { continue }
    $remote = (git -C $p remote get-url origin) 2>$null
    $branch = (git -C $p rev-parse --abbrev-ref HEAD) 2>$null
    $head = (git -C $p rev-parse --short HEAD) 2>$null
    $dirty = (git -C $p status --porcelain) 2>$null
    $nDirty = 0
    if ($dirty) { $nDirty = ($dirty | Measure-Object).Count }
    $up = (git -C $p rev-list --left-right --count "origin/$branch...HEAD" 2>$null)
    Write-Output ("{0}|{1}|{2}|{3}|{4}|dirty={5}|ahead={6}" -f $n, $p, $remote, $branch, $head, $nDirty, $up)
  }
}
