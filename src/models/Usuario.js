const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [3, 100]
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 255]
    }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
      len: [0, 150]
    }
  },
  rol_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Rol',
      key: 'id'
    }
  },
  catedratico_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Catedratico',
      key: 'id'
    }
  },
  recepcionista_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Recepcionista',
      key: 'id'
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
  tableName: 'usuario',
  timestamps: true,
  indexes: [
    {
      fields: ['username']
    },
    {
      fields: ['email']
    },
    {
      fields: ['rol_id']
    },
    {
      fields: ['catedratico_id']
    },
    {
      fields: ['recepcionista_id']
    },
    {
      fields: ['status']
    }
  ],
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.password) {
        usuario.password = await bcrypt.hash(usuario.password, 12);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('password')) {
        usuario.password = await bcrypt.hash(usuario.password, 12);
      }
    }
  }
});

// Método para validar contraseña
Usuario.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Método para obtener datos públicos del usuario (sin password)
Usuario.prototype.toAuthJSON = function() {
  return {
    id: this.id,
    username: this.username,
    email: this.email,
    rol_id: this.rol_id,
    catedratico_id: this.catedratico_id,
    recepcionista_id: this.recepcionista_id,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = Usuario;