// Controladores para entidades simples: Recepcionista, Aula, Carrera, Curso

const { Recepcionista, Aula, Carrera, Curso, Catedratico } = require('../models');
const { validationResult } = require('express-validator');

// Función genérica para crear controladores CRUD básicos
const createBasicController = (Model, entityName) => {
  return {
    async getAll(req, res) {
      try {
        const { page = 1, limit = 10, status } = req.query;
        const offset = (page - 1) * limit;
        
        const whereCondition = {};
        if (status !== undefined) {
          whereCondition.status = status;
        }

        // Incluir asociaciones según el modelo
        let include = [];
        if (Model === Curso) {
          include = [
            {
              model: Carrera,
              as: 'carrera',
              attributes: ['id', 'name']
            },
            {
              model: Catedratico,
              as: 'catedratico',
              attributes: ['id', 'first_name', 'last_name']
            }
          ];
        }

        const items = await Model.findAndCountAll({
          where: whereCondition,
          include,
          limit: parseInt(limit),
          offset: offset,
          order: [['createdAt', 'DESC']]
        });

        res.json({
          success: true,
          data: items.rows,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: items.count,
            pages: Math.ceil(items.count / limit)
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: `Error al obtener ${entityName}s`,
          error: error.message
        });
      }
    },

    async getById(req, res) {
      try {
        const { id } = req.params;
        
        let include = [];
        if (Model === Curso) {
          include = [
            {
              model: Carrera,
              as: 'carrera',
              attributes: ['id', 'name']
            },
            {
              model: Catedratico,
              as: 'catedratico',
              attributes: ['id', 'first_name', 'last_name']
            }
          ];
        }

        const item = await Model.findByPk(id, { include });

        if (!item) {
          return res.status(404).json({
            success: false,
            message: `${entityName} no encontrado`
          });
        }

        res.json({
          success: true,
          data: item
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: `Error al obtener el ${entityName}`,
          error: error.message
        });
      }
    },

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

        const item = await Model.create(req.body);

        res.status(201).json({
          success: true,
          message: `${entityName} creado exitosamente`,
          data: item
        });
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(400).json({
            success: false,
            message: `Ya existe un ${entityName} con ese nombre`
          });
        }

        res.status(500).json({
          success: false,
          message: `Error al crear el ${entityName}`,
          error: error.message
        });
      }
    },

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
        const [updated] = await Model.update(req.body, {
          where: { id }
        });

        if (!updated) {
          return res.status(404).json({
            success: false,
            message: `${entityName} no encontrado`
          });
        }

        const updatedItem = await Model.findByPk(id);

        res.json({
          success: true,
          message: `${entityName} actualizado exitosamente`,
          data: updatedItem
        });
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(400).json({
            success: false,
            message: `Ya existe un ${entityName} con ese nombre`
          });
        }

        res.status(500).json({
          success: false,
          message: `Error al actualizar el ${entityName}`,
          error: error.message
        });
      }
    },

    async delete(req, res) {
      try {
        const { id } = req.params;
        
        // Soft delete - cambiar status a 0
        const [updated] = await Model.update(
          { status: 0 },
          { where: { id } }
        );

        if (!updated) {
          return res.status(404).json({
            success: false,
            message: `${entityName} no encontrado`
          });
        }

        res.json({
          success: true,
          message: `${entityName} eliminado exitosamente`
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: `Error al eliminar el ${entityName}`,
          error: error.message
        });
      }
    }
  };
};

// Exportar controladores específicos
module.exports = {
  recepcionistaController: createBasicController(Recepcionista, 'Recepcionista'),
  aulaController: createBasicController(Aula, 'Aula'),
  carreraController: createBasicController(Carrera, 'Carrera'),
  cursoController: createBasicController(Curso, 'Curso')
};