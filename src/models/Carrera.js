const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Carrera = sequelize.define('Carrera', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1,
    validate: {
      isIn: [[0, 1]] // 0: Inactivo, 1: Activo
    }
  }
}, {
  tableName: 'carrera',
  timestamps: true,
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Carrera;