'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orden', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      date_use: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      status_concierge: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0 // 0=Incompleto, 1=Completo
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
      aula_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Aula',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      curso_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Curso',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      recepcionista_entrega_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Recepcionista',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      recepcionista_recibe_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Recepcionista',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.addIndex('Orden', ['date_use']);
    await queryInterface.addIndex('Orden', ['status_concierge']);
    await queryInterface.addIndex('Orden', ['catedratico_id']);
    await queryInterface.addIndex('Orden', ['aula_id']);
    await queryInterface.addIndex('Orden', ['curso_id']);
    await queryInterface.addIndex('Orden', ['recepcionista_entrega_id']);
    await queryInterface.addIndex('Orden', ['recepcionista_recibe_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orden');
  }
};