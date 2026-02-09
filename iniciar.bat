@echo off
echo Iniciando Sistema de Gestion para Residencia...
echo.

:: Abrir el navegador en la direccion local
start http://localhost:5173

:: Ejecutar el servidor de desarrollo y la API
npm run dev
