const { Catedratico } = require('../models');
const { validationResult } = require('express-validator');

const catedraticoController = {
  // GET /api/catedraticos - Obtener todos los catedráticos
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const offset = (page - 1) * limit;
      
      const whereCondition = {};
      if (status !== undefined) {
        whereCondition.status = status;
      }

      const catedraticos = await Catedratico.findAndCountAll({
        where: whereCondition,
        limit: parseInt(limit),
        offset: offset,
        order: [['first_name', 'ASC'], ['last_name', 'ASC']]
      });

      res.json({
        success: true,
        data: catedraticos.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: catedraticos.count,
          pages: Math.ceil(catedraticos.count / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener catedráticos',
        error: error.message
      });
    }
  },

  // GET /api/catedraticos/:id - Obtener un catedrático por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const catedratico = await Catedratico.findByPk(id, {
        include: [
          {
            association: 'cursos',
            where: { status: 1 },
            required: false
          },
          {
            association: 'ordenes',
            required: false
          }
        ]
      });

      if (!catedratico) {
        return res.status(404).json({
          success: false,
          message: 'Catedrático no encontrado'
        });
      }

      res.json({
        success: true,
        data: catedratico
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener el catedrático',
        error: error.message
      });
    }
  },

  // POST /api/catedraticos - Crear un nuevo catedrático
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

      const catedratico = await Catedratico.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Catedrático creado exitosamente',
        data: catedratico
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear el catedrático',
        error: error.message
      });
    }
  },

  // PUT /api/catedraticos/:id - Actualizar un catedrático
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
      const [updated] = await Catedratico.update(req.body, {
        where: { id }
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Catedrático no encontrado'
        });
      }

      const updatedCatedratico = await Catedratico.findByPk(id);

      res.json({
        success: true,
        message: 'Catedrático actualizado exitosamente',
        data: updatedCatedratico
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el catedrático',
        error: error.message
      });
    }
  },

  // DELETE /api/catedraticos/:id - Eliminar un catedrático (soft delete)
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Soft delete - cambiar status a 0
      const [updated] = await Catedratico.update(
        { status: 0 },
        { where: { id } }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Catedrático no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Catedrático eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el catedrático',
        error: error.message
      });
    }
  }
};

module.exports = catedraticoController;