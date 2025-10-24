const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Orden = sequelize.define('Orden', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date_use: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/ // Formato HH:MM:SS
    }
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/ // Formato HH:MM:SS
    }
  },
  status_concierge: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isIn: [[0, 1]] // 0: Incompleto, 1: Completo
    }
  },
  catedratico_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Catedratico',
      key: 'id'
    }
  },
  aula_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Aula',
      key: 'id'
    }
  },
  curso_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Curso',
      key: 'id'
    }
  },
  recepcionista_entrega_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Recepcionista',
      key: 'id'
    }
  },
  recepcionista_recibe_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Recepcionista',
      key: 'id'
    }
  }
}, {
  tableName: 'orden',
  timestamps: true,
  indexes: [
    {
      fields: ['date_use']
    },
    {
      fields: ['status_concierge']
    },
    {
      fields: ['catedratico_id']
    },
    {
      fields: ['aula_id']
    },
    {
      fields: ['curso_id']
    },
    {
      fields: ['recepcionista_entrega_id']
    },
    {
      fields: ['recepcionista_recibe_id']
    }
  ]
});

module.exports = Orden;