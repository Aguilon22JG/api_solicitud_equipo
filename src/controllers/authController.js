const jwt = require('jsonwebtoken');
const { Usuario, Rol, Catedratico, Recepcionista } = require('../models');
const { validationResult } = require('express-validator');

const authController = {
  // POST /api/auth/login - Iniciar sesión
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { username, password } = req.body;

      // Buscar usuario con sus relaciones
      const usuario = await Usuario.findOne({
        where: { username, status: 1 },
        include: [
          {
            model: Rol,
            as: 'rol',
            attributes: ['id', 'name', 'description']
          },
          {
            model: Catedratico,
            as: 'catedratico',
            attributes: ['id', 'first_name', 'last_name', 'phone'],
            required: false
          },
          {
            model: Recepcionista,
            as: 'recepcionista',
            attributes: ['id', 'first_name', 'last_name', 'phone'],
            required: false
          }
        ]
      });

      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Verificar contraseña
      const isValidPassword = await usuario.validPassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Generar JWT
      const token = jwt.sign(
        {
          id: usuario.id,
          username: usuario.username,
          rol_id: usuario.rol_id,
          rol_name: usuario.rol.name,
          catedratico_id: usuario.catedratico_id,
          recepcionista_id: usuario.recepcionista_id
        },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );

      // Generar refresh token
      const refreshToken = jwt.sign(
        { id: usuario.id },
        process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          user: usuario.toAuthJSON(),
          rol: usuario.rol,
          catedratico: usuario.catedratico,
          recepcionista: usuario.recepcionista,
          token,
          refreshToken
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error en el servidor',
        error: error.message
      });
    }
  },

  // POST /api/auth/register - Registrar nuevo usuario (solo administradores)
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { username, password, email, rol_id, catedratico_id, recepcionista_id } = req.body;

      // Verificar que el rol existe
      const rol = await Rol.findByPk(rol_id);
      if (!rol) {
        return res.status(400).json({
          success: false,
          message: 'El rol especificado no existe'
        });
      }

      // Verificar relaciones según el rol
      if (rol.name === 'Catedrático' && !catedratico_id) {
        return res.status(400).json({
          success: false,
          message: 'Debe especificar un catedrático válido para este rol'
        });
      }

      if (rol.name === 'Recepcionista' && !recepcionista_id) {
        return res.status(400).json({
          success: false,
          message: 'Debe especificar un recepcionista válido para este rol'
        });
      }

      // Crear usuario
      const usuario = await Usuario.create({
        username,
        password,
        email,
        rol_id,
        catedratico_id: rol.name === 'Catedrático' ? catedratico_id : null,
        recepcionista_id: rol.name === 'Recepcionista' ? recepcionista_id : null
      });

      // Obtener usuario completo con relaciones
      const usuarioCompleto = await Usuario.findByPk(usuario.id, {
        include: [
          {
            model: Rol,
            as: 'rol',
            attributes: ['id', 'name', 'description']
          },
          {
            model: Catedratico,
            as: 'catedratico',
            attributes: ['id', 'first_name', 'last_name', 'phone'],
            required: false
          },
          {
            model: Recepcionista,
            as: 'recepcionista',
            attributes: ['id', 'first_name', 'last_name', 'phone'],
            required: false
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: usuarioCompleto.toAuthJSON(),
          rol: usuarioCompleto.rol,
          catedratico: usuarioCompleto.catedratico,
          recepcionista: usuarioCompleto.recepcionista
        }
      });

    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'El nombre de usuario o email ya están en uso'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al registrar usuario',
        error: error.message
      });
    }
  },

  // POST /api/auth/refresh - Renovar token
  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token requerido'
        });
      }

      // Verificar refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret'
      );

      // Buscar usuario
      const usuario = await Usuario.findByPk(decoded.id, {
        include: [
          {
            model: Rol,
            as: 'rol',
            attributes: ['id', 'name', 'description']
          }
        ]
      });

      if (!usuario || usuario.status !== 1) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no válido'
        });
      }

      // Generar nuevo token
      const token = jwt.sign(
        {
          id: usuario.id,
          username: usuario.username,
          rol_id: usuario.rol_id,
          rol_name: usuario.rol.name,
          catedratico_id: usuario.catedratico_id,
          recepcionista_id: usuario.recepcionista_id
        },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Token renovado exitosamente',
        data: { token }
      });

    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Refresh token inválido'
      });
    }
  },

  // POST /api/auth/change-password - Cambiar contraseña
  async changePassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Buscar usuario
      const usuario = await Usuario.findByPk(userId);
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Verificar contraseña actual
      const isValidPassword = await usuario.validPassword(currentPassword);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'Contraseña actual incorrecta'
        });
      }

      // Actualizar contraseña
      await usuario.update({ password: newPassword });

      res.json({
        success: true,
        message: 'Contraseña actualizada exitosamente'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al cambiar contraseña',
        error: error.message
      });
    }
  },

  // GET /api/auth/me - Obtener datos del usuario autenticado
  async me(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.user.id, {
        include: [
          {
            model: Rol,
            as: 'rol',
            attributes: ['id', 'name', 'description']
          },
          {
            model: Catedratico,
            as: 'catedratico',
            attributes: ['id', 'first_name', 'last_name', 'phone'],
            required: false
          },
          {
            model: Recepcionista,
            as: 'recepcionista',
            attributes: ['id', 'first_name', 'last_name', 'phone'],
            required: false
          }
        ]
      });

      res.json({
        success: true,
        data: {
          user: usuario.toAuthJSON(),
          rol: usuario.rol,
          catedratico: usuario.catedratico,
          recepcionista: usuario.recepcionista
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener datos del usuario',
        error: error.message
      });
    }
  },

  // POST /api/auth/logout - Cerrar sesión
  async logout(req, res) {
    try {
      // En una implementación real, aquí invalidarías el token
      // Por ahora, simplemente confirmamos el logout
      res.json({
        success: true,
        message: 'Logout exitoso. Token invalidado del lado del cliente.',
        data: null
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al hacer logout',
        error: error.message
      });
    }
  }
};

module.exports = authController;