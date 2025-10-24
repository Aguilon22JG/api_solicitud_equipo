'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Usuario', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: true,
        unique: true
      },
      rol_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Rol',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      catedratico_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Catedratico',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      recepcionista_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Recepcionista',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Crear índices
    await queryInterface.addIndex('Usuario', ['username']);
    await queryInterface.addIndex('Usuario', ['email']);
    await queryInterface.addIndex('Usuario', ['rol_id']);
    await queryInterface.addIndex('Usuario', ['catedratico_id']);
    await queryInterface.addIndex('Usuario', ['recepcionista_id']);
    await queryInterface.addIndex('Usuario', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Usuario');
  }
};