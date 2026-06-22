@echo off
:: Runs the PowerShell update script silently in the background
powershell -WindowStyle Hidden -ExecutionPolicy Bypass -File "%~dp0update-encube.ps1"
