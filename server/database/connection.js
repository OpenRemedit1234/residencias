const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Intentar importar Electron solo si está disponible
let app;
try {
    app = require('electron').app;
} catch (e) {
    // Electron no disponible (modo Node.js directo)
    app = null;
}

// Determinar ruta de la base de datos
const isDev = process.env.NODE_ENV === 'development' || !app;

// Soporte para ruta de base de datos personalizada vía global o config
let dbPath = global.customDbPath;

if (!dbPath) {
    // Encontrar la carpeta de AppData/userData para el config.json
    const configPath = (app && typeof app.getPath === 'function')
        ? path.join(app.getPath('userData'), 'config.json')
        : path.join(process.cwd(), 'config.json');

    if (fs.existsSync(configPath)) {
        try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            if (config.dbPath && fs.existsSync(config.dbPath)) {
                dbPath = config.dbPath;
            }
        } catch (e) {
            console.error('Error al cargar config.json remoto');
        }
    }
}

if (!dbPath) {
    // Si llegamos aquí sin dbPath, es que no hay configuración de usuario.
    // No creamos una por defecto para obligar a que el proceso principal (main.js)
    // muestre primero el menú de selección de nube/red.
    console.error('CRÍTICO: No se ha seleccionado ninguna base de datos.');
    // En producción esto lanzará un error que capturaremos en main.js 
    // para mostrar el diálogo de selección.
}

// Crear instancia de Sequelize con SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: isDev ? console.log : false,
    // Ajustes para mejorar sincronización en nube
    dialectOptions: {
        mode: 2, // Read/Write
    },
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
    }
});

// Forzar modo de diario compatible con OneDrive/Dropbox
sequelize.addHook('afterConnect', async (connection) => {
    await connection.run('PRAGMA journal_mode = DELETE;');
    await connection.run('PRAGMA synchronous = NORMAL;');
});

// Importar modelos
const Usuario = require('./models/Usuario')(sequelize);
const Residente = require('./models/Residente')(sequelize);
const Habitacion = require('./models/Habitacion')(sequelize);
const Apartamento = require('./models/Apartamento')(sequelize);
const Reserva = require('./models/Reserva')(sequelize);
const Pago = require('./models/Pago')(sequelize);
const Festivo = require('./models/Festivo')(sequelize);
const Configuracion = require('./models/Configuracion')(sequelize);
const ConfiguracionEmpresa = require('./models/ConfiguracionEmpresa')(sequelize);
const ConfiguracionSistema = require('./models/ConfiguracionSistema')(sequelize);
const Backup = require('./models/Backup')(sequelize);

// Definir relaciones
Residente.hasMany(Reserva, { foreignKey: 'residente_id', as: 'reservas' });
Reserva.belongsTo(Residente, { foreignKey: 'residente_id', as: 'residente' });

Habitacion.hasMany(Reserva, { foreignKey: 'habitacion_id', as: 'reservas' });
Reserva.belongsTo(Habitacion, { foreignKey: 'habitacion_id', as: 'habitacion' });

Apartamento.hasMany(Reserva, { foreignKey: 'apartamento_id', as: 'reservas' });
Reserva.belongsTo(Apartamento, { foreignKey: 'apartamento_id', as: 'apartamento' });

Residente.hasMany(Pago, { foreignKey: 'residente_id', as: 'pagos' });
Pago.belongsTo(Residente, { foreignKey: 'residente_id', as: 'residente' });

Reserva.hasMany(Pago, { foreignKey: 'reserva_id', as: 'pagos' });
Pago.belongsTo(Reserva, { foreignKey: 'reserva_id', as: 'reserva' });

// Exportar sequelize y modelos
module.exports = {
    sequelize,
    Usuario,
    Residente,
    Habitacion,
    Apartamento,
    Reserva,
    Pago,
    Festivo,
    Configuracion,
    ConfiguracionEmpresa,
    ConfiguracionSistema,
    Backup
};
