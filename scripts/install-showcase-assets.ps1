param(
    [string]$SourceDirectory = (Join-Path $HOME 'Downloads/showcase')
)
$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath $SourceDirectory -PathType Container)) {
    throw "Put your 8-16 generated images in $SourceDirectory, or pass -SourceDirectory."
}
$files = @(Get-ChildItem -LiteralPath $SourceDirectory -File | Where-Object { $_.Extension -match '^\.(png|jpe?g|webp|avif)$' } | Sort-Object Name)
if ($files.Count -lt 8 -or $files.Count -gt 16) { throw 'The source folder must contain 8 to 16 PNG, JPEG, WebP, or AVIF images.' }
$destination = Join-Path $PSScriptRoot '../public/showcase'
if (Test-Path -LiteralPath $destination) {
    $existing = @(Get-ChildItem -LiteralPath $destination -File | Where-Object { $_.Name -match '^sheet-\d{2}\.(png|jpe?g|webp|avif)$' })
    if ($existing.Count -gt 0) { throw "Showcase images already exist in $destination. Move them aside before installing a new collection." }
}
New-Item -ItemType Directory -Force -Path $destination | Out-Null
for ($index = 0; $index -lt $files.Count; $index++) {
    $name = 'sheet-{0:D2}{1}' -f ($index + 1), $files[$index].Extension.ToLowerInvariant()
    Copy-Item -LiteralPath $files[$index].FullName -Destination (Join-Path $destination $name)
    Write-Host "Installed $name"
}
Write-Host 'Showcase images installed in filename order. Restart the dev server, or rebuild production, then open /prometheus#showcase.'
