const { Orden, Catedratico, Recepcionista, Aula, Curso, OrderItem, Equipo } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const ordenController = {
  // GET /api/ordenes - Obtener todas las órdenes
  async getAll(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status_concierge, 
        date_use,
        catedratico_id 
      } = req.query;
      const offset = (page - 1) * limit;
      
      const whereCondition = {};
      if (status_concierge !== undefined) whereCondition.status_concierge = status_concierge;
      if (date_use) whereCondition.date_use = date_use;
      if (catedratico_id) whereCondition.catedratico_id = catedratico_id;

      const ordenes = await Orden.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: Catedratico,
            as: 'catedratico',
            attributes: ['id', 'first_name', 'last_name', 'phone']
          },
          {
            model: Recepcionista,
            as: 'recepcionista_entrega',
            attributes: ['id', 'first_name', 'last_name', 'phone'],
            required: false
          },
          {
            model: Recepcionista,
            as: 'recepcionista_recibe',
            attributes: ['id', 'first_name', 'last_name', 'phone'],
            required: false
          },
          {
            model: Aula,
            as: 'aula',
            attributes: ['id', 'name', 'description']
          },
          {
            model: Curso,
            as: 'curso',
            attributes: ['id', 'name']
          },
          {
            model: OrderItem,
            as: 'items',
            include: [{
              model: Equipo,
              as: 'equipo',
              attributes: ['id', 'name', 'available_quantity']
            }]
          }
        ],
        limit: parseInt(limit),
        offset: offset,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: ordenes.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: ordenes.count,
          pages: Math.ceil(ordenes.count / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener órdenes',
        error: error.message
      });
    }
  },

  // GET /api/ordenes/:id - Obtener una orden por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const orden = await Orden.findByPk(id, {
        include: [
          {
            model: Catedratico,
            as: 'catedratico',
            attributes: ['id', 'first_name', 'last_name', 'phone']
          },
          {
            model: Recepcionista,
            as: 'recepcionista_entrega',
            attributes: ['id', 'first_name', 'last_name', 'phone'],
            required: false
          },
          {
            model: Recepcionista,
            as: 'recepcionista_recibe',
            attributes: ['id', 'first_name', 'last_name', 'phone'],
            required: false
          },
          {
            model: Aula,
            as: 'aula',
            attributes: ['id', 'name', 'description']
          },
          {
            model: Curso,
            as: 'curso',
            attributes: ['id', 'name'],
            include: [{
              model: Carrera,
              as: 'carrera',
              attributes: ['id', 'name']
            }]
          },
          {
            model: OrderItem,
            as: 'items',
            include: [{
              model: Equipo,
              as: 'equipo',
              attributes: ['id', 'name', 'available_quantity', 'current_quantity']
            }]
          }
        ]
      });

      if (!orden) {
        return res.status(404).json({
          success: false,
          message: 'Orden no encontrada'
        });
      }

      res.json({
        success: true,
        data: orden
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener la orden',
        error: error.message
      });
    }
  },

  // POST /api/ordenes - Crear una nueva orden
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { items, equipos, ...reqData } = req.body;
      
      // Mapear campos del español al inglés si es necesario
      const ordenData = {
        ...reqData,
        note: reqData.note || reqData.observaciones,
        date_use: reqData.date_use || reqData.fecha_uso,
        start_time: reqData.start_time || reqData.hora_inicio,
        end_time: reqData.end_time || reqData.hora_fin,
        recepcionista_entrega_id: reqData.recepcionista_entrega_id || reqData.recepcionista1_id,
        recepcionista_recibe_id: reqData.recepcionista_recibe_id || reqData.recepcionista2_id
      };
      
      // Asegurar que las horas tengan formato completo HH:MM:SS
      if (ordenData.start_time && !ordenData.start_time.includes(':00', 5)) {
        ordenData.start_time += ':00';
      }
      if (ordenData.end_time && !ordenData.end_time.includes(':00', 5)) {
        ordenData.end_time += ':00';
      }
      
      // Usar equipos o items (ambos nombres soportados)
      const orderItems = items || equipos;

        // Validar disponibilidad de equipos
        if (orderItems && orderItems.length > 0) {
          for (const item of orderItems) {
            const equipo = await Equipo.findByPk(item.equipo_id);
            if (!equipo) {
              return res.status(404).json({
                success: false,
                message: `Equipo con ID ${item.equipo_id} no encontrado`
              });
            }
            if (equipo.available_quantity < item.quantity) {
              return res.status(400).json({
                success: false,
                message: `Cantidad insuficiente para el equipo ${equipo.name}. Disponible: ${equipo.available_quantity}, Solicitado: ${item.quantity}`
              });
            }
          }
        }      // Crear la orden
      const orden = await Orden.create(ordenData);

        // Crear los items de la orden
        if (orderItems && orderItems.length > 0) {
          const orderItemsData = orderItems.map(item => ({
            ...item,
            orden_id: orden.id
          }));
          await OrderItem.bulkCreate(orderItemsData);
        }      // Obtener la orden completa con sus relaciones
      const ordenCompleta = await Orden.findByPk(orden.id, {
        include: [
          {
            model: Catedratico,
            as: 'catedratico',
            attributes: ['id', 'first_name', 'last_name']
          },
          {
            model: Aula,
            as: 'aula',
            attributes: ['id', 'name']
          },
          {
            model: Curso,
            as: 'curso',
            attributes: ['id', 'name']
          },
          {
            model: OrderItem,
            as: 'items',
            include: [{
              model: Equipo,
              as: 'equipo',
              attributes: ['id', 'name']
            }]
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Orden creada exitosamente',
        data: ordenCompleta
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear la orden',
        error: error.message
      });
    }
  },

  // PUT /api/ordenes/:id - Actualizar una orden
  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { items, ...ordenData } = req.body;

      // Actualizar la orden
      const [updated] = await Orden.update(ordenData, {
        where: { id }
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Orden no encontrada'
        });
      }

        // Si se proporcionan items, actualizar
        if (items) {
          // Eliminar items existentes
          await OrderItem.destroy({ where: { orden_id: id } });
          
          // Crear nuevos items
          if (items.length > 0) {
            const orderItems = items.map(item => ({
              ...item,
              orden_id: id
            }));
            await OrderItem.bulkCreate(orderItems);
          }
        }      // Obtener la orden actualizada
      const updatedOrden = await Orden.findByPk(id, {
        include: [
          {
            model: Catedratico,
            as: 'catedratico',
            attributes: ['id', 'first_name', 'last_name']
          },
          {
            model: Recepcionista,
            as: 'recepcionista_entrega',
            attributes: ['id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Recepcionista,
            as: 'recepcionista_recibe',
            attributes: ['id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Aula,
            as: 'aula',
            attributes: ['id', 'name']
          },
          {
            model: Curso,
            as: 'curso',
            attributes: ['id', 'name']
          },
          {
            model: OrderItem,
            as: 'items',
            include: [{
              model: Equipo,
              as: 'equipo',
              attributes: ['id', 'name']
            }]
          }
        ]
      });

      res.json({
        success: true,
        message: 'Orden actualizada exitosamente',
        data: updatedOrden
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar la orden',
        error: error.message
      });
    }
  },

  // PUT /api/ordenes/:id/status - Actualizar estado de la orden
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status_concierge, recepcionista_entrega_id, recepcionista_recibe_id } = req.body;

      const updateData = {};
      if (status_concierge !== undefined) updateData.status_concierge = status_concierge;
      if (recepcionista_entrega_id !== undefined) updateData.recepcionista_entrega_id = recepcionista_entrega_id;
      if (recepcionista_recibe_id !== undefined) updateData.recepcionista_recibe_id = recepcionista_recibe_id;

      const [updated] = await Orden.update(updateData, {
        where: { id }
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Orden no encontrada'
        });
      }

      const updatedOrden = await Orden.findByPk(id, {
        include: [
          {
            model: Catedratico,
            as: 'catedratico',
            attributes: ['id', 'first_name', 'last_name']
          },
          {
            model: Recepcionista,
            as: 'recepcionista_entrega',
            attributes: ['id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Recepcionista,
            as: 'recepcionista_recibe',
            attributes: ['id', 'first_name', 'last_name'],
            required: false
          }
        ]
      });

      res.json({
        success: true,
        message: 'Estado de la orden actualizado exitosamente',
        data: updatedOrden
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el estado de la orden',
        error: error.message
      });
    }
  },

  // DELETE /api/ordenes/:id - Cancelar una orden
  async cancel(req, res) {
    try {
      const { id } = req.params;
      
      // Marcar la orden como eliminada (soft delete)
      const orden = await Orden.findByPk(id);
      if (!orden) {
        return res.status(404).json({
          success: false,
          message: 'Orden no encontrada'
        });
      }

      // Eliminar la orden
      await orden.destroy();

      res.json({
        success: true,
        message: 'Orden cancelada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al cancelar la orden',
        error: error.message
      });
    }
  }
};

module.exports = ordenController;