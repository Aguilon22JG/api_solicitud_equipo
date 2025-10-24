const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const rolController = require('../controllers/rolController');
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

// Obtener todos los roles (cualquier usuario autenticado)
router.get('/', rolController.getAll);

// Obtener un rol por ID (cualquier usuario autenticado)
router.get('/:id', rolController.getById);

// Las siguientes rutas requieren permisos de administrador
router.use(authorize(['Administrador']));

// Crear rol
router.post('/', validationRules.rol, handleValidationErrors, rolController.create);

// Actualizar rol
router.put('/:id', validationRules.rol, handleValidationErrors, rolController.update);

// Eliminar rol
router.delete('/:id', rolController.delete);

module.exports = router;