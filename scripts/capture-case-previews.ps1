$ErrorActionPreference = 'Stop'
$browserCandidates = @(
    (Join-Path $env:ProgramFiles 'Google/Chrome/Application/chrome.exe'),
    (Join-Path ${env:ProgramFiles(x86)} 'Google/Chrome/Application/chrome.exe'),
    (Join-Path $env:LOCALAPPDATA 'Google/Chrome/Application/chrome.exe'),
    (Join-Path $env:ProgramFiles 'Microsoft/Edge/Application/msedge.exe'),
    (Join-Path ${env:ProgramFiles(x86)} 'Microsoft/Edge/Application/msedge.exe')
)
$browser = $browserCandidates | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf } | Select-Object -First 1
if (-not $browser) { throw 'Chrome or Edge was not found in its standard Windows installation directory.' }
$destination = Join-Path $PSScriptRoot '../public/cases'
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$cases = @(
    @{ Name = 'furniture-odyssey'; Url = 'https://furniture-odyssey-catalog-website.vercel.app/' },
    @{ Name = 'piercing-corner'; Url = 'https://piercing-corner.vercel.app/' }
)
foreach ($case in $cases) {
    $output = Join-Path $destination ($case.Name + '.png')
    if (Test-Path -LiteralPath $output) {
        Write-Host "Keeping existing $output. Move it aside if you want a new capture."
        continue
    }
    $temporaryDirectory = Join-Path ([System.IO.Path]::GetTempPath()) ('prometheus-case-' + [guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Path $temporaryDirectory | Out-Null
    try {
        $capture = Join-Path $temporaryDirectory 'capture.png'
        $profile = Join-Path $temporaryDirectory 'profile'
        $arguments = @('--headless=new', '--hide-scrollbars', '--window-size=1440,1000', '--virtual-time-budget=7000', "--user-data-dir=`"$profile`"", "--screenshot=`"$capture`"", $case.Url)
        $process = Start-Process -FilePath $browser -ArgumentList $arguments -PassThru
        if (-not $process.WaitForExit(60000)) {
            $process.Kill()
            throw "Capture timed out for $($case.Url)"
        }
        if ($process.ExitCode -ne 0 -or -not (Test-Path -LiteralPath $capture)) {
            throw "Browser capture failed for $($case.Url). You can instead place a screenshot at $output."
        }
        $bytes = [System.IO.File]::ReadAllBytes($capture)
        if ($bytes.Length -lt 24 -or [System.BitConverter]::ToString($bytes, 0, 8) -ne '89-50-4E-47-0D-0A-1A-0A') {
            throw "Browser did not produce a PNG for $($case.Url)"
        }
        Copy-Item -LiteralPath $capture -Destination $output
        Write-Host "Saved $output"
    } finally {
        Remove-Item -LiteralPath $temporaryDirectory -Recurse -Force -ErrorAction SilentlyContinue
    }
}
Write-Host 'Captures saved. Check that they show the websites, then restart npm run dev and refresh /prometheus#works.'
