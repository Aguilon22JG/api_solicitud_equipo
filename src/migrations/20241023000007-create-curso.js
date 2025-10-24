'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Curso', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1
      },
      carrera_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Carrera',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      catedratico_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Catedratico',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
    await queryInterface.addIndex('Curso', ['name']);
    await queryInterface.addIndex('Curso', ['status']);
    await queryInterface.addIndex('Curso', ['carrera_id']);
    await queryInterface.addIndex('Curso', ['catedratico_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Curso');
  }
};