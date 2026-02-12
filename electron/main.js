const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;

console.log('Electron API check:', {
  hasApp: !!app,
  appType: typeof app,
  electronKeys: Object.keys(electron)
});
const path = require('path');
const fs = require('fs');

// Determinar ruta de logs fuera del ASAR
const isDev = !app.isPackaged;
const logDir = isDev ? path.join(__dirname, '..') : app.getPath('userData');
const logFile = path.join(logDir, 'electron_logs.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Redirigir consola a archivo
console.log = (...args) => {
  const msg = `[${new Date().toISOString()}] LOG: ${args.join(' ')}\n`;
  logStream.write(msg);
  process.stdout.write(msg);
};
console.error = (...args) => {
  const msg = `[${new Date().toISOString()}] ERROR: ${args.join(' ')}\n`;
  logStream.write(msg);
  process.stderr.write(msg);
};

const express = require('express');
const cors = require('cors');

// Servidor Express embebido
const serverApp = express();
const PORT = 3001;

serverApp.use(cors());
serverApp.use(express.json());

// Importar rutas del servidor
const authRoutes = require('../server/routes/auth');
const residentesRoutes = require('../server/routes/residentes');
const habitacionesRoutes = require('../server/routes/habitaciones');
const apartamentosRoutes = require('../server/routes/apartamentos');
const reservasRoutes = require('../server/routes/reservas');
const pagosRoutes = require('../server/routes/pagos');
const configuracionRoutes = require('../server/routes/configuracion');
const festivosRoutes = require('../server/routes/festivos');
const backupsRoutes = require('../server/routes/backups');
const reportesRoutes = require('../server/routes/reportes');

// Rutas API
serverApp.use('/api/auth', authRoutes);
serverApp.use('/api/residentes', residentesRoutes);
serverApp.use('/api/habitaciones', habitacionesRoutes);
serverApp.use('/api/apartamentos', apartamentosRoutes);
serverApp.use('/api/reservas', reservasRoutes);
serverApp.use('/api/pagos', pagosRoutes);
serverApp.use('/api/configuracion', configuracionRoutes);
serverApp.use('/api/festivos', festivosRoutes);
serverApp.use('/api/backups', backupsRoutes);
serverApp.use('/api/reportes', reportesRoutes);

const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

const LOCAL_IP = getLocalIP();

// Iniciar servidor Express en 0.0.0.0 para acceso LAN
serverApp.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor API corriendo en http://localhost:${PORT}`);
  console.log(`Acceso LAN habilitado en http://${LOCAL_IP}:${PORT}`);
});

let mainWindow;

function createWindow() {
  console.log('Creando ventana principal...');
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#0f172a', // Fondo oscuro inicial para evitar el destello blanco
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false // Permitir carga de recursos locales
    },
    title: 'Sistema de Gestión - Residencia'
  });

  mainWindow.setMenu(null);

  const isDevMode = !app.isPackaged || process.env.NODE_ENV === 'development';

  if (isDevMode) {
    console.log('Modo Desarrollo: Cargando desde puerto 5173');
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools();
  } else {
    // RUTA DEFINITIVA PARA PRODUCCIÓN
    const appPath = app.getAppPath();
    const indexPath = path.join(appPath, 'dist', 'index.html');

    console.log('Modo Producción: Cargando archivo:', indexPath);

    if (fs.existsSync(indexPath)) {
      mainWindow.loadFile(indexPath).catch(err => {
        console.error('Error al cargar index.html:', err);
      });
    } else {
      console.error('ERROR CRÍTICO: No se encontró index.html en:', indexPath);
      // Failsafe: intentar ruta relativa al ejecutable
      const fallbackPath = path.join(__dirname, '..', 'dist', 'index.html');
      mainWindow.loadFile(fallbackPath);
    }

    // DevTools desactivadas para la versión final
    // mainWindow.webContents.openDevTools();
  }

  // Detectar fallos de carga en el renderer
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(`Fallo de carga: ${errorCode} - ${errorDescription}`);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Inicializar base de datos
const db = require('../server/database/connection');
const bcrypt = require('bcryptjs');

db.sequelize.sync({ alter: true })
  .then(async () => {
    console.log('Base de datos SQLite inicializada');

    // Asegurar usuario administrador
    const [admin, created] = await db.Usuario.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        password_hash: await bcrypt.hash('admin123', 10),
        email: 'admin@residencia.com',
        rol: 'administrador',
        activo: true
      }
    });

    if (!created) {
      await admin.update({
        password_hash: await bcrypt.hash('admin123', 10),
        activo: true,
        rol: 'administrador'
      });
      console.log('Usuario administrador actualizado: admin / admin123');
    } else {
      console.log('Usuario administrador creado: admin / admin123');
    }
  })
  .catch(err => {
    const fs = require('fs');
    fs.appendFileSync('server_error.log', '\nError main.js: ' + err.stack);
    console.error('Error al inicializar base de datos:', err);
  });

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

async function performBackup() {
  try {
    const userDataPath = app.getPath('userData');
    const backupsBaseDir = path.join(userDataPath, 'backups');

    // Carpeta con fecha y hora
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(backupsBaseDir, timestamp);

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // 1. Backup de Base de Datos
    const sourceDb = path.join(userDataPath, 'database.sqlite');
    if (fs.existsSync(sourceDb)) {
      fs.copyFileSync(sourceDb, path.join(backupDir, 'database.sqlite'));
    }

    // 2. Backup de otras configuraciones (si existen)
    // Ejemplo: archivos JSON de config o carpetas de recursos del usuario
    console.log(`Backup automático completado en: ${backupDir}`);
    return backupDir;
  } catch (err) {
    console.error('Error en backup automático:', err);
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async (event) => {
  // Realizar backup antes de cerrar
  console.log('Iniciando backup antes de cerrar...');
  await performBackup();
});

// IPC Handlers para comunicación con el renderer
ipcMain.handle('get-app-path', () => {
  return app.getPath('userData');
});

ipcMain.handle('get-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-server-ip', () => {
  return LOCAL_IP;
});
