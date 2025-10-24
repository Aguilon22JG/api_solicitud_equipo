const express = require('express');
const router = express.Router();
const { recepcionistaController } = require('../controllers/basicControllers');
const validationRules = require('../middleware/validation');

// GET /api/recepcionistas - Obtener todos los recepcionistas
router.get('/', recepcionistaController.getAll);

// GET /api/recepcionistas/:id - Obtener un recepcionista por ID
router.get('/:id', recepcionistaController.getById);

// POST /api/recepcionistas - Crear un nuevo recepcionista
router.post('/', validationRules.recepcionista, recepcionistaController.create);

// PUT /api/recepcionistas/:id - Actualizar un recepcionista
router.put('/:id', validationRules.recepcionista, recepcionistaController.update);

// DELETE /api/recepcionistas/:id - Eliminar un recepcionista (soft delete)
router.delete('/:id', recepcionistaController.delete);

module.exports = router;