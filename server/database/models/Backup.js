const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Backup = sequelize.define('Backup', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_archivo: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        ruta: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        tamano_bytes: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        tipo: {
            type: DataTypes.ENUM('automatico', 'manual'),
            defaultValue: 'manual'
        }
    }, {
        tableName: 'backups',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    return Backup;
};
