param(
    [string]$SourceDirectory = (Join-Path $HOME 'Downloads')
)
$ErrorActionPreference = 'Stop'
$directory = Join-Path $PSScriptRoot '../public/favicons'
$assets = @(
    @{ Source = 'Maroon Flame on Cream Gradient.png'; Destination = 'prometheus-cream.png' },
    @{ Source = 'redlojo (4).png'; Destination = 'prometheus-red.png' }
)
foreach ($asset in $assets) {
    $source = Join-Path $SourceDirectory $asset.Source
    if (-not (Test-Path -LiteralPath $source -PathType Leaf)) {
        throw "Favicon image not found: $source. Use -SourceDirectory if saved elsewhere."
    }
    $bytes = [System.IO.File]::ReadAllBytes((Resolve-Path -LiteralPath $source).Path)
    if ($bytes.Length -lt 24 -or [System.BitConverter]::ToString($bytes, 0, 8) -ne '89-50-4E-47-0D-0A-1A-0A') {
        throw "Not a valid PNG header: $source"
    }
    $destination = Join-Path $directory $asset.Destination
    if (Test-Path -LiteralPath $destination) {
        if ((Get-FileHash -LiteralPath $source).Hash -ne (Get-FileHash -LiteralPath $destination).Hash) {
            throw "A different image exists at $destination. Move it aside before replacing it."
        }
    }
}
New-Item -ItemType Directory -Force -Path $directory | Out-Null
foreach ($asset in $assets) {
    $source = Join-Path $SourceDirectory $asset.Source
    $destination = Join-Path $directory $asset.Destination
    if (-not (Test-Path -LiteralPath $destination)) {
        Copy-Item -LiteralPath $source -Destination $destination
    }
    Write-Host "Installed $($asset.Destination)"
}
Write-Host 'Favicon sources installed. Refresh /prometheus: rounded icons alternate every four seconds.'
