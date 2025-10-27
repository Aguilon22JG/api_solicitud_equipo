const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const ordenController = require('../controllers/ordenController');
const validationRules = require('../middleware/validation');
const { authenticateToken, authorize, authorizeCatedratico, authorizeRecepcionista, ROLES } = require('../middleware/auth');

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

// GET /api/ordenes - Obtener todas las órdenes (admin y recepcionistas ven todas, catedráticos solo las suyas)
router.get('/', authorize(ROLES.ADMINISTRADOR, ROLES.RECEPCIONISTA, ROLES.CATEDRATICO), ordenController.getAll);

// GET /api/ordenes/:id - Obtener una orden por ID (con verificación de propiedad para catedráticos)
router.get('/:id', authorize(ROLES.ADMINISTRADOR, ROLES.RECEPCIONISTA, ROLES.CATEDRATICO), ordenController.getById);

// POST /api/ordenes - Crear una nueva orden (solo catedráticos y administradores)
router.post('/', 
  authorize(ROLES.ADMINISTRADOR, ROLES.CATEDRATICO), 
  validationRules.orden, 
  handleValidationErrors, 
  ordenController.create
);

// PUT /api/ordenes/:id - Actualizar una orden (solo catedráticos propietarios y administradores)
router.put('/:id', 
  authorize(ROLES.ADMINISTRADOR, ROLES.CATEDRATICO), 
  validationRules.orden, 
  handleValidationErrors, 
  ordenController.update
);

// PUT /api/ordenes/:id/status - Actualizar estado de la orden (recepcionistas y administradores)
router.put('/:id/status', 
  authorize(ROLES.ADMINISTRADOR, ROLES.RECEPCIONISTA), 
  validationRules.ordenStatus, 
  handleValidationErrors, 
  ordenController.updateStatus
);

// DELETE /api/ordenes/:id - Cancelar una orden (catedráticos propietarios y administradores)
router.delete('/:id', 
  authorize(ROLES.ADMINISTRADOR, ROLES.CATEDRATICO), 
  ordenController.cancel
);

module.exports = router;