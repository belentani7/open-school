# Compara arbol de archivos SOBRANTE vs CANONICO: que existe solo en el sobrante
# y que archivos difieren en tamano. Excluye .git y directorios pesados generados.
$ErrorActionPreference = "SilentlyContinue"

$EXCL = '\\\.git\\|\\node_modules\\|\\\.next\\|\\dist\\|\\build\\|\\\.venv\\|\\__pycache__\\|\\\.cache\\|\\coverage\\|\\\.turbo\\|\\\.vercel\\output\\'

$pares = @(
  @("lingua-aberta","C:\Users\USER\repos\lingua-aberta","C:\Users\USER\belentani-repos-master\lingua-aberta"),
  @("lingua-aberta","C:\Users\USER\belentani-unified-master\repos\lingua-aberta","C:\Users\USER\belentani-repos-master\lingua-aberta"),
  @("linguaforge","C:\Users\USER\repos\linguaforge","C:\Users\USER\belentani-repos-master\linguaforge"),
  @("ManosAbiertas","C:\Users\USER\repos\ManosAbiertas","C:\Users\USER\belentani-repos-master\ManosAbiertas"),
  @("ManosAbiertas","C:\Users\USER\belentani-unified-master\repos\ManosAbiertas","C:\Users\USER\belentani-repos-master\ManosAbiertas"),
  @("secure-t-university","C:\Users\USER\belentani-unified-master\repos\secure-t-university","C:\Users\USER\belentani-repos-master\secure-t-university"),
  @("ux-academy","C:\Users\USER\repos\ux-academy-professional-program","C:\Users\USER\belentani-repos-master\ux-academy-professional-program"),
  @("ux-academy","C:\Users\USER\belentani-unified-master\repos\ux-academy-professional-program","C:\Users\USER\belentani-repos-master\ux-academy-professional-program"),
  @("open-school","C:\Users\USER\belentani-unified-master\repos\open-school","C:\Users\USER\belentani-repos-master\open-school")
)

foreach ($p in $pares) {
  $portal = $p[0]; $spare = $p[1]; $canon = $p[2]
  if (-not (Test-Path $spare)) { continue }
  if (-not (Test-Path $canon)) { continue }

  $a = Get-ChildItem $spare -Recurse -File -Force |
       Where-Object { $_.FullName -notmatch $EXCL } |
       ForEach-Object { $_.FullName.Substring($spare.Length + 1) }
  $b = Get-ChildItem $canon -Recurse -File -Force |
       Where-Object { $_.FullName -notmatch $EXCL } |
       ForEach-Object { $_.FullName.Substring($canon.Length + 1) }

  $soloSpare = Compare-Object -ReferenceObject $b -DifferenceObject $a -PassThru | Where-Object { $_.SideIndicator -eq "=>" }
  $soloCanon = Compare-Object -ReferenceObject $b -DifferenceObject $a -PassThru | Where-Object { $_.SideIndicator -eq "<=" }

  Write-Output ("=== {0} : SOBRANTE {1} vs CANONICO {2}" -f $portal, $spare, $canon)
  Write-Output ("    archivos spare={0} canonico={1} solo_en_spare={2} solo_en_canonico={3}" -f `
    ($a | Measure-Object).Count, ($b | Measure-Object).Count, ($soloSpare | Measure-Object).Count, ($soloCanon | Measure-Object).Count)
  if ($soloSpare) {
    foreach ($f in ($soloSpare | Select-Object -First 30)) { Write-Output ("    SOLO-EN-SOBRANTE: {0}" -f $f) }
  }
}
