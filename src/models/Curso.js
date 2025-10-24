const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Curso = sequelize.define('Curso', {
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
  },
  carrera_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Carrera',
      key: 'id'
    }
  },
  catedratico_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Catedratico',
      key: 'id'
    }
  }
}, {
  tableName: 'curso',
  timestamps: true,
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['status']
    },
    {
      fields: ['carrera_id']
    },
    {
      fields: ['catedratico_id']
    }
  ]
});

module.exports = Curso;