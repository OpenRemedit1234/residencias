const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ConfiguracionSistema = sequelize.define('ConfiguracionSistema', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        clave: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        valor: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        tipo: {
            type: DataTypes.ENUM('string', 'number', 'boolean', 'json'),
            defaultValue: 'string'
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'configuracion_sistema',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updated_at'
    });

    return ConfiguracionSistema;
};
