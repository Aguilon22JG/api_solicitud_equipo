const { Usuario, Rol, Catedratico, Recepcionista } = require('../models');
const bcrypt = require('bcryptjs');

const usuarioController = {
  // Obtener todos los usuarios
  async getAll(req, res) {
    try {
      const usuarios = await Usuario.findAll({
        include: [
          {
            model: Rol,
            attributes: ['id', 'name', 'description']
          },
          {
            model: Catedratico,
            attributes: ['id', 'first_name', 'last_name', 'phone']
          },
          {
            model: Recepcionista,
            attributes: ['id', 'first_name', 'last_name', 'phone']
          }
        ],
        attributes: { exclude: ['password'] },
        order: [['username', 'ASC']]
      });

      res.json({
        success: true,
        data: usuarios,
        message: 'Usuarios obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener usuario por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const usuario = await Usuario.findByPk(id, {
        include: [
          {
            model: Rol,
            attributes: ['id', 'name', 'description']
          },
          {
            model: Catedratico,
            attributes: ['id', 'first_name', 'last_name', 'phone']
          },
          {
            model: Recepcionista,
            attributes: ['id', 'first_name', 'last_name', 'phone']
          }
        ],
        attributes: { exclude: ['password'] }
      });

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: usuario,
        message: 'Usuario obtenido exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Crear nuevo usuario
  async create(req, res) {
    try {
      const { username, email, password, rol_id, catedratico_id, recepcionista_id, status = 1 } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await Usuario.findOne({
        where: { username }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un usuario con ese nombre de usuario'
        });
      }

      // Verificar si el email ya existe (si se proporciona)
      if (email) {
        const existingEmail = await Usuario.findOne({
          where: { email }
        });

        if (existingEmail) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe un usuario con ese email'
          });
        }
      }

      // Verificar que el rol existe
      const rol = await Rol.findByPk(rol_id);
      if (!rol) {
        return res.status(400).json({
          success: false,
          message: 'El rol especificado no existe'
        });
      }

      // Verificar catedrático si se proporciona
      if (catedratico_id) {
        const catedratico = await Catedratico.findByPk(catedratico_id);
        if (!catedratico) {
          return res.status(400).json({
            success: false,
            message: 'El catedrático especificado no existe'
          });
        }
      }

      // Verificar recepcionista si se proporciona
      if (recepcionista_id) {
        const recepcionista = await Recepcionista.findByPk(recepcionista_id);
        if (!recepcionista) {
          return res.status(400).json({
            success: false,
            message: 'El recepcionista especificado no existe'
          });
        }
      }

      const newUsuario = await Usuario.create({
        username,
        email,
        password,
        rol_id,
        catedratico_id,
        recepcionista_id,
        status
      });

      // Obtener el usuario creado con las relaciones
      const usuario = await Usuario.findByPk(newUsuario.id, {
        include: [
          {
            model: Rol,
            attributes: ['id', 'name', 'description']
          },
          {
            model: Catedratico,
            attributes: ['id', 'first_name', 'last_name', 'phone']
          },
          {
            model: Recepcionista,
            attributes: ['id', 'first_name', 'last_name', 'phone']
          }
        ],
        attributes: { exclude: ['password'] }
      });

      res.status(201).json({
        success: true,
        data: usuario,
        message: 'Usuario creado exitosamente'
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Actualizar usuario
  async update(req, res) {
    try {
      const { id } = req.params;
      const { username, email, password, rol_id, catedratico_id, recepcionista_id, status } = req.body;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Verificar si el nuevo username ya existe (excluyendo el usuario actual)
      if (username && username !== usuario.username) {
        const existingUser = await Usuario.findOne({
          where: { username }
        });

        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe un usuario con ese nombre de usuario'
          });
        }
      }

      // Verificar si el nuevo email ya existe (excluyendo el usuario actual)
      if (email && email !== usuario.email) {
        const existingEmail = await Usuario.findOne({
          where: { email }
        });

        if (existingEmail) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe un usuario con ese email'
          });
        }
      }

      // Verificar que el rol existe si se proporciona
      if (rol_id && rol_id !== usuario.rol_id) {
        const rol = await Rol.findByPk(rol_id);
        if (!rol) {
          return res.status(400).json({
            success: false,
            message: 'El rol especificado no existe'
          });
        }
      }

      // Preparar datos de actualización
      const updateData = {
        username: username || usuario.username,
        email: email !== undefined ? email : usuario.email,
        rol_id: rol_id || usuario.rol_id,
        catedratico_id: catedratico_id !== undefined ? catedratico_id : usuario.catedratico_id,
        recepcionista_id: recepcionista_id !== undefined ? recepcionista_id : usuario.recepcionista_id,
        status: status !== undefined ? status : usuario.status
      };

      // Si se proporciona nueva contraseña, hashearla
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      await usuario.update(updateData);

      // Obtener el usuario actualizado con las relaciones
      const usuarioActualizado = await Usuario.findByPk(id, {
        include: [
          {
            model: Rol,
            attributes: ['id', 'name', 'description']
          },
          {
            model: Catedratico,
            attributes: ['id', 'first_name', 'last_name', 'phone']
          },
          {
            model: Recepcionista,
            attributes: ['id', 'first_name', 'last_name', 'phone']
          }
        ],
        attributes: { exclude: ['password'] }
      });

      res.json({
        success: true,
        data: usuarioActualizado,
        message: 'Usuario actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Eliminar usuario
  async delete(req, res) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      await usuario.destroy();

      res.json({
        success: true,
        message: 'Usuario eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Activar/desactivar usuario
  async toggleStatus(req, res) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      await usuario.update({
        status: usuario.status === 1 ? 0 : 1
      });

      res.json({
        success: true,
        data: { status: usuario.status },
        message: `Usuario ${usuario.status === 1 ? 'activado' : 'desactivado'} exitosamente`
      });
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
};

module.exports = usuarioController;