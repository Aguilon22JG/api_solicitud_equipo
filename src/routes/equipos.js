const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const equipoController = require('../controllers/equipoController');
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

// GET /api/equipos - Obtener todos los equipos (cualquier usuario autenticado)
router.get('/', equipoController.getAll);

// GET /api/equipos/:id - Obtener un equipo por ID (cualquier usuario autenticado)
router.get('/:id', equipoController.getById);

// Las siguientes rutas requieren permisos de administrador o recepcionista
router.use(authorize(['Administrador', 'Recepcionista']));

// POST /api/equipos - Crear un nuevo equipo
router.post('/', validationRules.equipo, handleValidationErrors, equipoController.create);

// PUT /api/equipos/:id - Actualizar un equipo
router.put('/:id', validationRules.equipo, handleValidationErrors, equipoController.update);

// DELETE /api/equipos/:id - Eliminar un equipo (soft delete)
router.delete('/:id', equipoController.delete);

module.exports = router;