const { Rol } = require('../models');

const rolController = {
  // Obtener todos los roles
  async getAll(req, res) {
    try {
      const roles = await Rol.findAll({
        order: [['name', 'ASC']]
      });

      res.json({
        success: true,
        data: roles,
        message: 'Roles obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener roles:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener rol por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const rol = await Rol.findByPk(id);

      if (!rol) {
        return res.status(404).json({
          success: false,
          message: 'Rol no encontrado'
        });
      }

      res.json({
        success: true,
        data: rol,
        message: 'Rol obtenido exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener rol:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Crear nuevo rol
  async create(req, res) {
    try {
      const { name, description } = req.body;

      // Verificar si el rol ya existe
      const existingRol = await Rol.findOne({
        where: { name }
      });

      if (existingRol) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un rol con ese nombre'
        });
      }

      const newRol = await Rol.create({
        name,
        description
      });

      res.status(201).json({
        success: true,
        data: newRol,
        message: 'Rol creado exitosamente'
      });
    } catch (error) {
      console.error('Error al crear rol:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Actualizar rol
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const rol = await Rol.findByPk(id);

      if (!rol) {
        return res.status(404).json({
          success: false,
          message: 'Rol no encontrado'
        });
      }

      // Verificar si el nuevo nombre ya existe (excluyendo el rol actual)
      if (name && name !== rol.name) {
        const existingRol = await Rol.findOne({
          where: { name }
        });

        if (existingRol) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe un rol con ese nombre'
          });
        }
      }

      await rol.update({
        name: name || rol.name,
        description: description !== undefined ? description : rol.description
      });

      res.json({
        success: true,
        data: rol,
        message: 'Rol actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Eliminar rol
  async delete(req, res) {
    try {
      const { id } = req.params;

      const rol = await Rol.findByPk(id);

      if (!rol) {
        return res.status(404).json({
          success: false,
          message: 'Rol no encontrado'
        });
      }

      // Verificar si el rol tiene usuarios asociados
      const { Usuario } = require('../models');
      const usuariosCount = await Usuario.count({
        where: { rol_id: id }
      });

      if (usuariosCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'No se puede eliminar el rol porque tiene usuarios asociados'
        });
      }

      await rol.destroy();

      res.json({
        success: true,
        message: 'Rol eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar rol:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
};

module.exports = rolController;