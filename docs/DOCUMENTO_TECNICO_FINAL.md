# 📘 Documento Técnico - Sistema de Gestión de Residencia

> **Versión:** 1.0 (Desktop)  
> **Arquitectura:** Electron + React + Node.js (Servidor Interno)

Este documento detalla la arquitectura y especificaciones técnicas de la aplicación de escritorio.

---

## 1. Stack Tecnológico
La aplicación es una solución **Single Executable Desktop App** basada en:
- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite.
- **Runtime:** Electron 28 (permite ejecutar la app en Windows como programa nativo).
- **Backend (Embedded):** Servidor local Express.js corriendo internamente.
- **Base de Datos:** SQLite con Sequelize ORM.

---

## 2. Arquitectura de Datos
La base de datos se almacena localmente en la carpeta de datos del usuario (`%APPDATA%`), asegurando que los datos persistan entre actualizaciones del programa.

### Entidades Principales:
- `Usuario`: Gestión de acceso y roles.
- `Residente`: Datos personales y contacto.
- `Habitacion / Apartamento`: Inventario de alojamientos.
- `Reserva`: Vinculación residente-alojamiento-fechas.
- `Pago`: Control de transacciones y estados de cobro.

---

## 3. Seguridad y Acceso
- **Autenticación:** Sistema basado en JWT (JSON Web Tokens) gestionado localmente.
- **Encriptación:** Contraseñas protegidas mediante Bcrypt (10 rounds).
- **Aislamiento:** La lógica de base de datos no es accesible desde el navegador, solo a través del proceso principal de Electron.

---

## 4. Instalación y Despliegue
### 4.1 Generación del Ejecutable
El proyecto utiliza `electron-builder` para generar el instalador.
- **Archivo de salida:** `Sistema de Gestión - Residencia.exe`
- **Ubicación post-compilación:** `dist-electron/win-unpacked/`

### 4.2 Requisitos de Sistema (Windows)
- Windows 10 o superior (64 bits).
- 4GB RAM mínimo.
- 200MB de espacio en disco (más almacenamiento para la BD).

---

## 5. Mantenimiento
- **Ruta de la Base de Datos:** Los datos se guardan en `AppData/Roaming/residencias-app/database.sqlite`.
- **Copias de Seguridad:** La aplicación incluye un módulo de backups para exportar la base de datos completa.

---

**Desarrollado por:** Antigravity AI  
**Repositorio:** `https://github.com/OpenRemedit1234/residencias.git`
