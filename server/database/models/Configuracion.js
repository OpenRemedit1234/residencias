const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Configuracion = sequelize.define('Configuracion', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        empresa_nombre: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        empresa_direccion: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        empresa_cif: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        smtp_host: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        smtp_port: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        smtp_user: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        smtp_pass: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        smtp_secure: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        smtp_from: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        tableName: 'configuracion',
        timestamps: true,
        freezeTableName: true
    });

    return Configuracion;
};
