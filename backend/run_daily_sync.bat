@echo off
REM ═══════════════════════════════════════════════════════════
REM  GovGrant Tracker — Daily Scheme Sync (Windows Scheduler)
REM  Run this via Task Scheduler at 6:00 AM daily
REM ═══════════════════════════════════════════════════════════

echo [%date% %time%] Starting daily scheme sync...

cd /d "%~dp0"

REM Activate Python environment if using venv
REM call venv\Scripts\activate.bat

python daily_scheme_sync.py

echo [%date% %time%] Sync completed with exit code: %errorlevel%
pause
