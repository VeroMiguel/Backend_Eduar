const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pago = sequelize.define('Pago', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orden_id: {           // ✅ ADD THIS
        type: DataTypes.INTEGER,
        allowNull: false
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    metodo_pago: {
        type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia', 'yape', 'plin', 'deposito'),
        defaultValue: 'efectivo'
    },
    referencia: {
        type: DataTypes.STRING(100)
    },
    observaciones: {
        type: DataTypes.TEXT
    },
    usuario_registro_id: {    // ✅ ADD THIS
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'pagos',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en'
});

module.exports = Pago;