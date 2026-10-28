$ErrorActionPreference = 'Stop'
$fontDirectory = Join-Path $PSScriptRoot '../public/fonts'
New-Item -ItemType Directory -Force -Path $fontDirectory | Out-Null
$baseUrl = 'https://cdn.prod.website-files.com/65647bbe0d57c8abad78e939/'
$fonts = @(
    @{ Remote = '68ff3721c2bed2aa33a80a83_Gordita-Regular.woff2'; Local = 'Gordita-Regular.woff2'; Magic = 'wOF2' },
    @{ Remote = '68ff3614f18b504c3644a371_Gordita-Medium.woff2'; Local = 'Gordita-Medium.woff2'; Magic = 'wOF2' },
    @{ Remote = '68ff38225526a22dc86eb5f4_Gordita-Bold.woff2'; Local = 'Gordita-Bold.woff2'; Magic = 'wOF2' },
    @{ Remote = '67ea6fff045ae114b81bf213_LibreBaskerville-Italic.ttf'; Local = 'LibreBaskerville-Italic.ttf'; Magic = '00010000' }
)
foreach ($font in $fonts) {
    $destination = Join-Path $fontDirectory $font.Local
    $temporary = "$destination.download"
    try {
        Invoke-WebRequest -UseBasicParsing -Uri ($baseUrl + $font.Remote) -OutFile $temporary
        $bytes = [System.IO.File]::ReadAllBytes($temporary)
        if ($bytes.Length -lt 12) { throw "Invalid font response: $($font.Local)" }
        $signature = [System.Text.Encoding]::ASCII.GetString($bytes, 0, 4)
        if ($font.Magic -eq '00010000') {
            $signature = [System.BitConverter]::ToString($bytes, 0, 4).Replace('-', '')
        }
        if ($signature -ne $font.Magic) { throw "Unexpected font format: $($font.Local)" }
        Move-Item -Force -Path $temporary -Destination $destination
        Write-Host "Downloaded $($font.Local)"
    } finally {
        if (Test-Path $temporary) { Remove-Item $temporary }
    }
}
Write-Host 'Reference fonts installed. Refresh localhost. Use Ctrl+0 in both comparison tabs.'
