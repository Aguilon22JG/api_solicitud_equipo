const { Equipo } = require('../models');
const { validationResult } = require('express-validator');

const equipoController = {
  // GET /api/equipos - Obtener todos los equipos
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const offset = (page - 1) * limit;
      
      const whereCondition = {};
      if (status !== undefined) {
        whereCondition.status = status;
      }

      const equipos = await Equipo.findAndCountAll({
        where: whereCondition,
        limit: parseInt(limit),
        offset: offset,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: equipos.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: equipos.count,
          pages: Math.ceil(equipos.count / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener equipos',
        error: error.message
      });
    }
  },

  // GET /api/equipos/:id - Obtener un equipo por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const equipo = await Equipo.findByPk(id);

      if (!equipo) {
        return res.status(404).json({
          success: false,
          message: 'Equipo no encontrado'
        });
      }

      res.json({
        success: true,
        data: equipo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener el equipo',
        error: error.message
      });
    }
  },

  // POST /api/equipos - Crear un nuevo equipo
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

      const equipo = await Equipo.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Equipo creado exitosamente',
        data: equipo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear el equipo',
        error: error.message
      });
    }
  },

  // PUT /api/equipos/:id - Actualizar un equipo
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
      const [updated] = await Equipo.update(req.body, {
        where: { id }
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Equipo no encontrado'
        });
      }

      const updatedEquipo = await Equipo.findByPk(id);

      res.json({
        success: true,
        message: 'Equipo actualizado exitosamente',
        data: updatedEquipo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el equipo',
        error: error.message
      });
    }
  },

  // DELETE /api/equipos/:id - Eliminar un equipo (soft delete)
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Soft delete - cambiar status a 0
      const [updated] = await Equipo.update(
        { status: 0 },
        { where: { id } }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Equipo no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Equipo eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el equipo',
        error: error.message
      });
    }
  }
};

module.exports = equipoController;