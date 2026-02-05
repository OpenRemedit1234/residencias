# Sistema de Gestión para Residencia

Aplicación de escritorio para gestión integral de residencia tipo pensión con apartamentos.

## 🚀 Características

- ✅ Gestión de residentes, habitaciones y apartamentos
- ✅ Calendario mensual con gestión de festivos
- ✅ Sistema de reservas con check-in/check-out
- ✅ Control de pagos y facturas proforma
- ✅ Generación de PDFs automáticos
- ✅ Sistema de emails
- ✅ Panel de administración completo
- ✅ Copias de seguridad automáticas
- ✅ Base de datos local SQLite

## 🛠️ Tecnologías

- **Frontend:** React 18 + TypeScript + TailwindCSS
- **Desktop:** Electron
- **Backend:** Node.js + Express (embebido)
- **Base de Datos:** SQLite + Sequelize
- **Documentos:** PDFKit
- **Emails:** Nodemailer

## 📦 Instalación

### Requisitos Previos

- Node.js 18+ y npm
- Windows (principalmente)

### Pasos

1. Clonar el repositorio:
```bash
git clone [URL_REPOSITORIO]
cd residencias
```

2. Instalar dependencias:
```bash
npm install
```

3. Inicializar base de datos con datos de ejemplo:
```bash
node server/database/seeds.js
```

## 🏃 Ejecución

### Modo Desarrollo

```bash
npm run dev
```

Esto iniciará:
- Vite dev server en `http://localhost:5173`
- Electron con la aplicación
- API Express en `http://localhost:3001`

### Credenciales por Defecto

- **Usuario:** admin
- **Contraseña:** admin123

## 🔨 Build

### Generar Instalador

```bash
npm run build:electron
```

El instalador se generará en la carpeta `dist-electron/`.

## 📁 Estructura del Proyecto

```
residencias/
├── electron/              # Proceso principal de Electron
├── server/                # API Express embebida
│   ├── database/         # Modelos y configuración SQLite
│   └── routes/           # Rutas API
├── src/                  # Aplicación React
│   ├── components/       # Componentes reutilizables
│   ├── pages/            # Páginas principales
│   ├── context/          # Context API
│   └── styles/           # Estilos globales
└── docs/                 # Documentación del proyecto
```

## 📚 Documentación

- [Plan de Implementación](docs/implementation_plan.md)
- [Documento Técnico](docs/documento_tecnico.md)
- [Manual de Usuario](docs/manual_usuario.md)
- [Requisitos](docs/requisitos.md)
- [Reglas del Proyecto](docs/reglas.md)

## 🎨 Diseño

La aplicación utiliza una paleta de **colores claros** para una interfaz luminosa y profesional:
- Fondos: Blancos y grises muy claros
- Acentos: Azul claro, verde menta
- Estados: Verde (disponible), Rojo suave (ocupado), Amarillo (pendiente)

## 🔐 Seguridad

- Autenticación con JWT
- Contraseñas hasheadas con bcrypt
- Roles de usuario (Administrador, Recepcionista, Contable, Mantenimiento)
- Base de datos local protegida

## 📝 Licencia

MIT

## 👨‍💻 Autor

Programador Jefe - Sistema de Gestión para Residencia

---

**Versión:** 1.0.0  
**Última actualización:** 2026-02-05