const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const ordenController = require('../controllers/ordenController');
const validationRules = require('../middleware/validation');
const { authenticateToken, authorize, authorizeCatedratico, authorizeRecepcionista } = require('../middleware/auth');

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
router.get('/', authorize(['Administrador', 'Recepcionista', 'Catedrático']), ordenController.getAll);

// GET /api/ordenes/:id - Obtener una orden por ID (con verificación de propiedad para catedráticos)
router.get('/:id', authorize(['Administrador', 'Recepcionista', 'Catedrático']), ordenController.getById);

// POST /api/ordenes - Crear una nueva orden (solo catedráticos y administradores)
router.post('/', 
  authorize(['Administrador', 'Catedrático']), 
  validationRules.orden, 
  handleValidationErrors, 
  ordenController.create
);

// PUT /api/ordenes/:id - Actualizar una orden (solo catedráticos propietarios y administradores)
router.put('/:id', 
  authorize(['Administrador', 'Catedrático']), 
  validationRules.orden, 
  handleValidationErrors, 
  ordenController.update
);

// PUT /api/ordenes/:id/status - Actualizar estado de la orden (recepcionistas y administradores)
router.put('/:id/status', 
  authorize(['Administrador', 'Recepcionista']), 
  validationRules.ordenStatus, 
  handleValidationErrors, 
  ordenController.updateStatus
);

// DELETE /api/ordenes/:id - Cancelar una orden (catedráticos propietarios y administradores)
router.delete('/:id', 
  authorize(['Administrador', 'Catedrático']), 
  ordenController.cancel
);

module.exports = router;