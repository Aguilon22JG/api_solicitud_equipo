const express = require('express');
const router = express.Router();
const catedraticoController = require('../controllers/catedraticoController');
const validationRules = require('../middleware/validation');

// GET /api/catedraticos - Obtener todos los catedráticos
router.get('/', catedraticoController.getAll);

// GET /api/catedraticos/:id - Obtener un catedrático por ID
router.get('/:id', catedraticoController.getById);

// POST /api/catedraticos - Crear un nuevo catedrático
router.post('/', validationRules.catedratico, catedraticoController.create);

// PUT /api/catedraticos/:id - Actualizar un catedrático
router.put('/:id', validationRules.catedratico, catedraticoController.update);

// DELETE /api/catedraticos/:id - Eliminar un catedrático (soft delete)
router.delete('/:id', catedraticoController.delete);

module.exports = router;