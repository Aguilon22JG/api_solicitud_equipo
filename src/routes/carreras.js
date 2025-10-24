const express = require('express');
const router = express.Router();
const { carreraController } = require('../controllers/basicControllers');
const validationRules = require('../middleware/validation');

// GET /api/carreras - Obtener todas las carreras
router.get('/', carreraController.getAll);

// GET /api/carreras/:id - Obtener una carrera por ID
router.get('/:id', carreraController.getById);

// POST /api/carreras - Crear una nueva carrera
router.post('/', validationRules.carrera, carreraController.create);

// PUT /api/carreras/:id - Actualizar una carrera
router.put('/:id', validationRules.carrera, carreraController.update);

// DELETE /api/carreras/:id - Eliminar una carrera (soft delete)
router.delete('/:id', carreraController.delete);

module.exports = router;