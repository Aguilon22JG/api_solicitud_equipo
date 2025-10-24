const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  equipo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Equipo',
      key: 'id'
    }
  },
  orden_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Orden',
      key: 'id'
    }
  }
}, {
  tableName: 'order_item',
  timestamps: true,
  indexes: [
    {
      fields: ['equipo_id']
    },
    {
      fields: ['orden_id']
    },
    {
      unique: true,
      fields: ['equipo_id', 'orden_id'] // Un equipo no puede aparecer dos veces en la misma orden
    }
  ]
});

module.exports = OrderItem;