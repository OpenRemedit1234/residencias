const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Habitacion = sequelize.define('Habitacion', {
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
        tipo: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        capacidad: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        precio_noche: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM('disponible', 'ocupada', 'limpieza', 'mantenimiento', 'fuera_servicio'),
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
        tableName: 'habitaciones',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Habitacion;
};
