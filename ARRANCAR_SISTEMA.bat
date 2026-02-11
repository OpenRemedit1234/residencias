@echo off
title Lanzador de Sistema de Residencias
echo ==========================================
echo   INICIANDO SISTEMA DE GESTION
echo ==========================================
echo.
echo 1. Iniciando servidor y base de datos...
echo 2. Preparando interfaz web...
echo.

:: Ejecutar el servidor y vite en ventanas visibles para ver errores
start "API SERVER" cmd /c "node server/index.js & pause"
start "FRONTEND" cmd /c "npm run dev:vite & pause"

echo.
echo Esperando a que el servidor arranque (10 segundos)...
timeout /t 10 /nobreak > nul

echo.
echo 3. Abriendo el sistema en el navegador...
start http://localhost:5173

echo.
echo ==========================================
echo   SISTEMA ACTIVO
echo ==========================================
echo.
echo NOTA: No cierres esta ventana negra. 
echo Si la cierras, el sistema dejara de funcionar.
echo.
pause
