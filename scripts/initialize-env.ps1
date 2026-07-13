$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$templatePath = Join-Path $projectRoot ".env.example"
$envPath = Join-Path $projectRoot ".env"

if (-not (Test-Path -LiteralPath $envPath)) {
  Copy-Item -LiteralPath $templatePath -Destination $envPath
}

$content = Get-Content -LiteralPath $envPath -Raw
$secretMatch = [regex]::Match($content, '(?m)^BETTER_AUTH_SECRET="?([^"\r\n]*)"?\s*$')
$currentSecret = if ($secretMatch.Success) { $secretMatch.Groups[1].Value } else { "" }
$needsSecret = $currentSecret.Length -lt 32 -or $currentSecret.StartsWith("replace-with-") -or $currentSecret.StartsWith("local-docker-secret-")

if ($needsSecret) {
  $bytes = New-Object byte[] 48
  $generator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  try {
    $generator.GetBytes($bytes)
  }
  finally {
    $generator.Dispose()
  }
  $secret = [Convert]::ToBase64String($bytes)
  $setting = 'BETTER_AUTH_SECRET="' + $secret + '"'
  if ($secretMatch.Success) {
    $content = [regex]::Replace($content, '(?m)^BETTER_AUTH_SECRET=.*$', $setting)
  }
  else {
    $content = $content.TrimEnd() + [Environment]::NewLine + $setting + [Environment]::NewLine
  }
  [System.IO.File]::WriteAllText($envPath, $content, [System.Text.UTF8Encoding]::new($false))
}
