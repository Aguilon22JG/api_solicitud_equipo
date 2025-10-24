const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Catedratico = sequelize.define('Catedratico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: true,
    validate: {
      len: [0, 15]
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
  tableName: 'catedratico',
  timestamps: true,
  indexes: [
    {
      fields: ['first_name', 'last_name']
    },
    {
      fields: ['phone']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Catedratico;