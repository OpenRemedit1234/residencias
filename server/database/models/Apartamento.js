const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Apartamento = sequelize.define('Apartamento', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        numero: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        habitaciones: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        banos: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        metros_cuadrados: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        precio_mes: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        precio_noche: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        estado: {
            type: DataTypes.ENUM('disponible', 'ocupado', 'limpieza', 'mantenimiento', 'fuera_servicio'),
            defaultValue: 'disponible'
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        servicios: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'apartamentos',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Apartamento;
};
