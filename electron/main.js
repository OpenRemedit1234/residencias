const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;

console.log('Electron API check:', {
  hasApp: !!app,
  appType: typeof app,
  electronKeys: Object.keys(electron)
});
const path = require('path');
const fs = require('fs');
const logFile = path.join(__dirname, '../electron_logs.log');
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

// Iniciar servidor Express
serverApp.listen(PORT, () => {
  console.log(`Servidor API corriendo en http://localhost:${PORT}`);
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/icon.png'),
    title: 'Sistema de Gestión - Residencia'
  });

  // En desarrollo, cargar desde Vite
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // En producción, cargar desde build
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers para comunicación con el renderer
ipcMain.handle('get-app-path', () => {
  return app.getPath('userData');
});

ipcMain.handle('get-version', () => {
  return app.getVersion();
});
