@echo off
TITLE O.V.I. Master Ignition System
SETLOCAL EnableDelayedExpansion

:: --- CONFIGURATION ---
SET PROJECT_DRIVE=E:
SET PROJECT_DIR=E:\Pushkar\Personal Projects\Ovi
SET VENV_PATH=%PROJECT_DIR%\venv
SET DASHBOARD_DIR=%PROJECT_DIR%\dashboard

:: --- 1. ADMIN CHECK ---
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [SUCCESS] Running with Administrator Privileges.
) else (
    echo [ERROR] Please right-click this file and select "Run as Administrator".
    pause
    exit /b
)

echo.
echo ============================================================
echo   O.V.I. SYSTEM SENTINEL: MASTER IGNITION SEQUENCE
echo ============================================================
echo.

:: --- 2. OLLAMA CHECK ---
echo [1/4] Checking Ollama Neural Engine...
tasklist /FI "IMAGENAME eq ollama.exe" 2>NUL | find /I /N "ollama.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo      ^> Ollama is already running.
) else (
    echo      ^> Starting Ollama...
    start "" "ollama" serve
    timeout /t 5 >nul
)

:: --- 3. START BACKEND (PYTHON CORE) ---
echo [2/4] Starting O.V.I. Brain (Python Core)...
%PROJECT_DRIVE%
cd "%PROJECT_DIR%"
call "%VENV_PATH%\Scripts\activate"
:: Start backend in a new minimized window
start "OVI_CORE" /min python -m core.main
timeout /t 3 >nul

:: --- 4. START DASHBOARD (NEXT.JS) ---
echo [3/4] Starting O.V.I. HUD (Dashboard)...
cd "%DASHBOARD_DIR%"
:: Start dashboard in a new minimized window
start "OVI_DASHBOARD" /min npm run dev
timeout /t 5 >nul

:: --- 5. START UI (ELECTRON) ---
echo [4/4] Launching O.V.I. Desktop Sentinel...
cd "%PROJECT_DIR%"
npm run electron

echo.
echo [FINAL] Ignition Sequence Complete.
echo All systems are running in the background.
echo To stop everything, close this window or use Task Manager.
echo.
pause
