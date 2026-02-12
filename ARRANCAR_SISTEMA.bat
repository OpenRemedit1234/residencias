@echo off
title Lanzador de Sistema de Residencias - MODO ESCRITORIO
:menu
cls
echo ==========================================
echo   INICIANDO SISTEMA DE GESTION (MODO APP)
echo ==========================================
echo.
echo 1. Iniciar Sistema Normal
echo 2. FORZAR SELECCION DE BASE DE DATOS (Nube/Red)
echo 3. Salir
echo.
set /p opt="Seleccione una opcion: "

if "%opt%"=="1" goto start
if "%opt%"=="2" goto reset
if "%opt%"=="3" exit
goto menu

:reset
set RESET_DB_CONFIG=true
goto start

:start
echo.
echo Preparando entorno...
:: Ejecutar Vite en segundo plano
start "FRONTEND" /min cmd /c "npm run dev:vite"

echo Esperando a que el entorno este listo (5 segundos)...
timeout /t 5 /nobreak > nul

:: Ejecutar Electron
echo Lanzando aplicacion de escritorio...
npm run dev:electron

echo.
echo ==========================================
echo   SISTEMA CERRADO
echo ==========================================
pause
