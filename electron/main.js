const electron = require('electron');
const { app, BrowserWindow, ipcMain, dialog } = electron;
const path = require('path');
const fs = require('fs');
const os = require('os');
const express = require('express');
const cors = require('cors');

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

// Servidor Express embebido
const serverApp = express();
const PORT = 3001;

serverApp.use(cors());
serverApp.use(express.json());

// Las rutas se cargarán dinámicamente dentro de startApp

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
    backgroundColor: '#0f172a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
    },
    title: 'Sistema de Gestión - Residencia'
  });

  mainWindow.setMenu(null);

  const isDevMode = !app.isPackaged || process.env.NODE_ENV === 'development';

  if (isDevMode) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    const appPath = app.getAppPath();
    const indexPath = path.join(appPath, 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      mainWindow.loadFile(indexPath);
    } else {
      const fallbackPath = path.join(__dirname, '..', 'dist', 'index.html');
      mainWindow.loadFile(fallbackPath);
    }
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

async function ensureDatabasePath() {
  const userDataConfig = path.join(app.getPath('userData'), 'config.json');
  let dbPath = '';

  const setupMarker = path.join(app.getPath('userData'), '.first_run_completed');

  // 1. SOLO cargamos automáticamente si existe configuración Y no es un reset
  if (fs.existsSync(userDataConfig) && fs.existsSync(setupMarker) && process.env.RESET_DB_CONFIG !== 'true') {
    try {
      const config = JSON.parse(fs.readFileSync(userDataConfig, 'utf8'));
      if (config.dbPath && fs.existsSync(config.dbPath)) {
        dbPath = config.dbPath;
      }
    } catch (e) {
      console.error('Error al leer configuración de usuario:', e);
    }
  }

  // 2. Si es la primera vez (no hay dbPath guardado), PREGUNTAMOS SÍ O SÍ
  if (!dbPath) {
    console.log('Iniciando diálogo de configuración inicial...');
    const choice = dialog.showMessageBoxSync({
      type: 'question',
      buttons: ['Crear Nueva Base de Datos', 'Seleccionar Base de Datos Existente'],
      defaultId: 1,
      cancelId: -1,
      title: 'Configuración de Datos - Residencia',
      message: 'Base de Datos no configurada',
      detail: 'Para trabajar en red o sincronizado, selecciona el archivo en tu carpeta compartida.\n\nPC 1: Elige "Crear" dentro de tu OneDrive.\nPC 2: Elige "Seleccionar" y busca el archivo que creó el PC 1.'
    });

    if (choice === 0) {
      // OPCIÓN: CREAR
      dbPath = dialog.showSaveDialogSync({
        title: 'Guardar Nueva Base de Datos',
        defaultPath: path.join(app.getPath('documents'), 'database.sqlite'),
        filters: [{ name: 'SQLite Database', extensions: ['sqlite', 'db'] }]
      });
      if (dbPath && !fs.existsSync(dbPath)) {
        try {
          fs.writeFileSync(dbPath, ''); // Crear archivo vacío inicial físicamente
        } catch (err) {
          console.error('Error al crear archivo físico:', err);
        }
      }
    } else if (choice === 1) {
      // OPCIÓN: SELECCIONAR
      const result = dialog.showOpenDialogSync({
        title: 'Seleccionar Base de Datos Existente',
        properties: ['openFile'],
        filters: [{ name: 'SQLite Database', extensions: ['sqlite', 'db'] }]
      });
      if (result && result.length > 0) dbPath = result[0];
    }

    // Si cancela la primera vez, no podemos continuar
    if (!dbPath) {
      dialog.showErrorBox('Error', 'Se requiere una base de datos para iniciar el sistema.');
      app.quit();
      process.exit(1);
    }

    // Guardar la elección para que no vuelva a preguntar la próxima vez
    fs.writeFileSync(userDataConfig, JSON.stringify({ dbPath }));

    // Crear marcador de "ya configurado" para este equipo
    const setupMarker = path.join(app.getPath('userData'), '.first_run_completed');
    fs.writeFileSync(setupMarker, 'done');
  }

  global.customDbPath = dbPath;
  console.log('Sistema cargado con base de datos en:', dbPath);
}

async function startApp() {
  await ensureDatabasePath();

  // IMPORTANTE: Los requiere de rutas deben ir AQUÍ DENTRO
  // para que cojan la ruta de la base de datos correcta al inicializarse
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

  const db = require('../server/database/connection');
  const bcrypt = require('bcryptjs');

  try {
    await db.sequelize.sync({ alter: true });
    console.log('Base de datos SQLite inicializada');

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
    }

    createWindow();
  } catch (err) {
    fs.appendFileSync('server_error.log', '\nError main.js: ' + err.stack);
    console.error('Error al inicializar base de datos:', err);
    dialog.showErrorBox('Error de Base de Datos', 'No se pudo conectar con el archivo seleccionado.');
    app.quit();
  }
}

app.whenReady().then(startApp);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('get-app-path', () => app.getPath('userData'));
ipcMain.handle('get-version', () => app.getVersion());
ipcMain.handle('get-server-ip', () => LOCAL_IP);

async function showDatabaseSelection() {
  const choice = dialog.showMessageBoxSync({
    type: 'question',
    buttons: ['Crear Nueva Base de Datos', 'Seleccionar Base de Datos Existente'],
    defaultId: 1,
    title: 'Configuración de Datos - Residencia',
    message: '¿Cómo desea configurar la base de datos?',
    detail: 'Seleccione un archivo en su carpeta sincronizada (OneDrive/Dropbox) para trabajar en red.'
  });

  let dbPath = '';
  if (choice === 0) {
    dbPath = dialog.showSaveDialogSync({
      title: 'Guardar Nueva Base de Datos',
      defaultPath: path.join(app.getPath('documents'), 'database.sqlite'),
      filters: [{ name: 'SQLite Database', extensions: ['sqlite', 'db'] }]
    });
  } else {
    const result = dialog.showOpenDialogSync({
      title: 'Seleccionar Base de Datos Existente',
      properties: ['openFile'],
      filters: [{ name: 'SQLite Database', extensions: ['sqlite', 'db'] }]
    });
    if (result && result.length > 0) dbPath = result[0];
  }

  if (dbPath) {
    fs.writeFileSync(configFile, JSON.stringify({ dbPath }));
    global.customDbPath = dbPath;
    // Reiniciar conexión de base de datos o requerir reinicio de app
    return dbPath;
  }
  return null;
}

ipcMain.handle('select-database', async () => {
  return await showDatabaseSelection();
});
