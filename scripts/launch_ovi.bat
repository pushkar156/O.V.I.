@echo off
title O.V.I. Launcher
echo Initializing O.V.I. Core...

:: Change to the project directory
cd /d "%~dp0.."

:: Check if virtual environment exists
if exist venv (
    echo Activating environment...
    call venv\Scripts\activate
)

:: Run the tray application
echo Starting O.V.I. Tray Service...
python core/desktop/tray.py

pause
