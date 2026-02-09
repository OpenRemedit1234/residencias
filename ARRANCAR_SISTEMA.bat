@echo off
title Lanzador de Sistema de Residencias
echo ==========================================
echo   INICIANDO SISTEMA DE GESTION
echo ==========================================
echo.
echo 1. Iniciando servidor y base de datos...
echo 2. Preparando interfaz web...
echo.

:: Ejecutar el servidor y vite en segundo plano usando concurrently
:: Usamos commonjs para el servidor
start /b cmd /c "npm run dev:vite"
start /b cmd /c "node server/index.js"

echo Esperando a que el sistema este listo (5 segundos)...
timeout /t 5 /nobreak > nul

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
