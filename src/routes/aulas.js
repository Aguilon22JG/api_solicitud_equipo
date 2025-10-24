const express = require('express');
const router = express.Router();
const { aulaController } = require('../controllers/basicControllers');
const validationRules = require('../middleware/validation');

// GET /api/aulas - Obtener todas las aulas
router.get('/', aulaController.getAll);

// GET /api/aulas/:id - Obtener un aula por ID
router.get('/:id', aulaController.getById);

// POST /api/aulas - Crear una nueva aula
router.post('/', validationRules.aula, aulaController.create);

// PUT /api/aulas/:id - Actualizar un aula
router.put('/:id', validationRules.aula, aulaController.update);

// DELETE /api/aulas/:id - Eliminar un aula (soft delete)
router.delete('/:id', aulaController.delete);

module.exports = router;