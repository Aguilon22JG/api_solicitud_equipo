const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../models');

// Middleware para verificar JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Buscar usuario en base de datos para verificar que sigue activo
    const usuario = await Usuario.findByPk(decoded.id, {
      include: [{
        model: Rol,
        as: 'rol',
        attributes: ['name']
      }]
    });

    if (!usuario || usuario.status !== 1) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no válido o inactivo'
      });
    }

    // Agregar datos del usuario al request
    req.user = {
      id: usuario.id,
      username: usuario.username,
      rol_id: usuario.rol_id,
      rol_name: usuario.rol.name,
      catedratico_id: usuario.catedratico_id,
      recepcionista_id: usuario.recepcionista_id
    };

    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error de autenticación',
      error: error.message
    });
  }
};

// Middleware para verificar roles específicos
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    if (!roles.includes(req.user.rol_name)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción',
        requiredRoles: roles,
        userRole: req.user.rol_name
      });
    }

    next();
  };
};

// Middleware para verificar que el usuario es propietario del recurso
const authorizeOwner = (req, res, next) => {
  const resourceUserId = req.params.userId || req.body.userId;
  
  if (req.user.rol_name === 'Administrador') {
    return next(); // Los administradores pueden acceder a todo
  }

  if (req.user.id !== parseInt(resourceUserId)) {
    return res.status(403).json({
      success: false,
      message: 'Solo puedes acceder a tus propios recursos'
    });
  }

  next();
};

// Middleware para verificar que el catedrático solo accede a sus recursos
const authorizeCatedratico = (req, res, next) => {
  if (req.user.rol_name === 'Administrador') {
    return next(); // Los administradores pueden acceder a todo
  }

  if (req.user.rol_name === 'Catedrático') {
    // El catedrático solo puede acceder a sus propias órdenes
    const catedraticoId = req.params.catedraticoId || req.body.catedratico_id;
    
    if (catedraticoId && req.user.catedratico_id !== parseInt(catedraticoId)) {
      return res.status(403).json({
        success: false,
        message: 'Solo puedes acceder a tus propias órdenes'
      });
    }
  }

  next();
};

// Middleware para verificar que el recepcionista puede gestionar entregas
const authorizeRecepcionista = (req, res, next) => {
  if (req.user.rol_name === 'Administrador') {
    return next(); // Los administradores pueden acceder a todo
  }

  if (req.user.rol_name === 'Recepcionista') {
    // Los recepcionistas pueden gestionar entregas y recepciones
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Solo los recepcionistas pueden gestionar entregas y recepciones'
  });
};

// Middleware opcional de autenticación (no requiere token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      const usuario = await Usuario.findByPk(decoded.id, {
        include: [{
          model: Rol,
          as: 'rol',
          attributes: ['name']
        }]
      });

      if (usuario && usuario.status === 1) {
        req.user = {
          id: usuario.id,
          username: usuario.username,
          rol_id: usuario.rol_id,
          rol_name: usuario.rol.name,
          catedratico_id: usuario.catedratico_id,
          recepcionista_id: usuario.recepcionista_id
        };
      }
    }

    next();

  } catch (error) {
    // Si hay error con el token opcional, continuamos sin usuario
    next();
  }
};

module.exports = {
  authenticateToken,
  authorize,
  authorizeOwner,
  authorizeCatedratico,
  authorizeRecepcionista,
  optionalAuth
};