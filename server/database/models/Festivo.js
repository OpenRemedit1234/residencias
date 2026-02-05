const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Festivo = sequelize.define('Festivo', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            unique: true
        },
        nombre: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        tipo: {
            type: DataTypes.ENUM('nacional', 'local', 'personalizado'),
            defaultValue: 'personalizado'
        },
        anio: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'festivos',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    return Festivo;
};
