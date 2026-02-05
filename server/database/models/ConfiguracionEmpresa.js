const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ConfiguracionEmpresa = sequelize.define('ConfiguracionEmpresa', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        cif: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        direccion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        telefono: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        logo_path: {
            type: DataTypes.STRING(500),
            allowNull: true
        }
    }, {
        tableName: 'configuracion_empresa',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updated_at'
    });

    return ConfiguracionEmpresa;
};
