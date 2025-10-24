'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Order_Item', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      equipo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Equipo',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      orden_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Orden',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.addIndex('Order_Item', ['equipo_id']);
    await queryInterface.addIndex('Order_Item', ['orden_id']);
    await queryInterface.addIndex('Order_Item', ['equipo_id', 'orden_id'], {
      unique: true,
      name: 'order_items_equipo_orden_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Order_Item');
  }
};