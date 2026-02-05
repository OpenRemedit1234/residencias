const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Reserva = sequelize.define('Reserva', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        residente_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'residentes',
                key: 'id'
            }
        },
        habitacion_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'habitaciones',
                key: 'id'
            }
        },
        apartamento_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'apartamentos',
                key: 'id'
            }
        },
        fecha_entrada: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        fecha_salida: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        numero_personas: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        precio_total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM('pendiente', 'activa', 'completada', 'cancelada'),
            defaultValue: 'pendiente'
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'reservas',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Reserva;
};
