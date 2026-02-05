const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Residente = sequelize.define('Residente', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        apellidos: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        dni: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        telefono: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
            validate: {
                isEmail: true
            }
        },
        fecha_nacimiento: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        direccion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        contacto_emergencia: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'residentes',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Residente;
};
