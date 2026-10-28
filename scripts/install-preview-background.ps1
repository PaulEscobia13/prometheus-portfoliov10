param(
    [string]$Source = (Join-Path $HOME 'Downloads/Moody Red, Cream, and Teal Waves.png')
)
$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath $Source -PathType Leaf)) {
    throw "Background not found: $Source. Pass its location with -Source."
}
$bytes = [System.IO.File]::ReadAllBytes((Resolve-Path -LiteralPath $Source).Path)
if ($bytes.Length -lt 8 -or [System.BitConverter]::ToString($bytes, 0, 8) -ne '89-50-4E-47-0D-0A-1A-0A') {
    throw 'The selected file is not a PNG image.'
}
$directory = Join-Path $PSScriptRoot '../public/backgrounds'
New-Item -ItemType Directory -Force -Path $directory | Out-Null
$destination = Join-Path $directory 'prometheus-waves.png'
if (Test-Path -LiteralPath $destination) {
    $existingHash = (Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash
    $sourceHash = (Get-FileHash -LiteralPath $Source -Algorithm SHA256).Hash
    if ($existingHash -ne $sourceHash) {
        throw "A different background already exists at $destination. Move it aside before installing another."
    }
} else {
    Copy-Item -LiteralPath $Source -Destination $destination
}
Write-Host 'Background installed. Open /prometheus on your local development server.'
