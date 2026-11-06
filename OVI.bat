@echo off
SETLOCAL EnableDelayedExpansion
:: Ensure we are in the project directory (important when running as Admin)
cd /d "%~dp0"

TITLE O.V.I. Master Ignition

:: Check for Admin Privileges
net session >nul 2>&1
if %errorLevel% NEQ 0 (
    echo [!] Requesting Administrative Privileges...
    powershell -Command "Start-Process '%~0' -Verb RunAs"
    exit /b
)

echo ==========================================
echo   O.V.I. SYSTEM: MASTER IGNITION
echo ==========================================
echo.

:: Cleanup existing hung processes on O.V.I. ports (3000, 8000)
echo [0/2] Clearing ports 3000 and 8000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
echo      ^> Ports cleared.

:: FFmpeg Check
ffmpeg -version >nul 2>&1
if %errorLevel% NEQ 0 (
    echo [WARNING] FFmpeg not found in PATH. Voice transcription will fail.
    echo           Please install FFmpeg and add the 'bin' folder to your Windows PATH.
    echo.
)


:: 0. Check for venv
if not exist venv (
    echo [!] Virtual environment not found. Creating it...
    python -m venv venv
    echo [SUCCESS] Venv created.
)

:: 1. Sync Dependencies (Silent & Fast)
call venv\Scripts\python.exe scripts\sync_deps.py
if %errorLevel% NEQ 0 (
    echo [ERROR] Dependency sync failed.
    pause
    exit /b
)

:: 2. Launch Electron (The Master)
echo [IGNITION] Launching O.V.I. Desktop Sentinel...
echo Close this window to keep O.V.I. running in background.
echo.

:: We use 'start' to run it detached so this window can be closed if desired,
:: but npm run electron usually keeps the terminal open for logs.
:: Let's run it directly so the user sees the logs if they want.
npm run electron

echo.
echo [DONE] O.V.I. has been deployed.
pause
