@echo off
setlocal
cd /d "%~dp0"

where docker >nul 2>nul
if errorlevel 1 (
  echo [ikAnimeList] Docker was not found. Install or start Docker Desktop and try again.
  pause
  exit /b 1
)

docker info >nul 2>nul
if errorlevel 1 (
  echo [ikAnimeList] Docker Desktop is not running. Start it and try again.
  pause
  exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\initialize-env.ps1"
if errorlevel 1 (
  echo [ikAnimeList] Could not initialize secure local settings.
  pause
  exit /b 1
)
echo [ikAnimeList] Local settings are ready in .env

echo [ikAnimeList] Building and starting the website...
docker compose up --build --detach
if errorlevel 1 (
  echo [ikAnimeList] Startup failed. Recent container logs:
  docker compose logs --tail 80
  pause
  exit /b 1
)

echo [ikAnimeList] Waiting for the health check...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$deadline=(Get-Date).AddMinutes(3); do { try { $response=Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3000/api/health' -TimeoutSec 3; if ($response.StatusCode -eq 200) { exit 0 } } catch {}; Start-Sleep -Seconds 2 } while ((Get-Date) -lt $deadline); exit 1"
if errorlevel 1 (
  echo [ikAnimeList] The containers started, but the website did not become healthy.
  docker compose ps
  docker compose logs --tail 80 app
  pause
  exit /b 1
)

echo [ikAnimeList] Ready at http://localhost:3000
if /I not "%IKANIMELIST_NO_OPEN%"=="1" start "" http://localhost:3000
exit /b 0
