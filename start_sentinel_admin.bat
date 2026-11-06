@echo off
:: Check for Admin privileges
NET SESSION >nul 2>&1
if %errorLevel% == 0 (
    echo [SUCCESS] Running with Administrator Privileges.
) else (
    echo [ERROR] This script MUST be run as Administrator to control system processes.
    echo Please right-click this file and select 'Run as Administrator'.
    pause
    exit /b
)

:: Switch to E drive and project directory
E:
cd "E:\Pushkar\Personal Projects\Ovi"

:: Activate virtual environment
if exist venv\Scripts\activate (
    call venv\Scripts\activate
) else (
    echo [WARNING] Virtual environment not found. Running with system Python...
)

echo Starting O.V.I. System Sentinel Core...
python -m core.main
pause

