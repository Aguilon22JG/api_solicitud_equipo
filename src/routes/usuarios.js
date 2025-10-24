const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const usuarioController = require('../controllers/usuarioController');
const validationRules = require('../middleware/validation');
const { authenticateToken, authorize } = require('../middleware/auth');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    });
  }
  next();
};

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Las siguientes rutas requieren permisos de administrador
router.use(authorize(['Administrador']));

// Obtener todos los usuarios
router.get('/', usuarioController.getAll);

// Obtener un usuario por ID
router.get('/:id', usuarioController.getById);

// Crear usuario
router.post('/', validationRules.usuario, handleValidationErrors, usuarioController.create);

// Actualizar usuario
router.put('/:id', validationRules.usuario, handleValidationErrors, usuarioController.update);

// Eliminar usuario
router.delete('/:id', usuarioController.delete);

// Activar/desactivar usuario
router.patch('/:id/status', usuarioController.toggleStatus);

module.exports = router;