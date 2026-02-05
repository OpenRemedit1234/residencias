const { Sequelize } = require('sequelize');
const path = require('path');

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
const dbPath = isDev
    ? path.join(__dirname, '../../database.sqlite')
    : path.join(app.getPath('userData'), 'database.sqlite');

// Crear instancia de Sequelize con SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: isDev ? console.log : false,
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
    }
});

// Importar modelos
const Usuario = require('./models/Usuario')(sequelize);
const Residente = require('./models/Residente')(sequelize);
const Habitacion = require('./models/Habitacion')(sequelize);
const Apartamento = require('./models/Apartamento')(sequelize);
const Reserva = require('./models/Reserva')(sequelize);
const Pago = require('./models/Pago')(sequelize);
const Festivo = require('./models/Festivo')(sequelize);
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
    ConfiguracionEmpresa,
    ConfiguracionSistema,
    Backup
};
