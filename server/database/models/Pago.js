const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Pago = sequelize.define('Pago', {
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
        reserva_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'reservas',
                key: 'id'
            }
        },
        monto: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        metodo_pago: {
            type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia', 'bizum', 'otro'),
            allowNull: false
        },
        fecha_pago: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        concepto: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        estado: {
            type: DataTypes.ENUM('pendiente', 'completado', 'cancelado'),
            defaultValue: 'completado'
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'pagos',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Pago;
};
