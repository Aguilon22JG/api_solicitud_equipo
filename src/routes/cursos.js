const express = require('express');
const router = express.Router();
const { cursoController } = require('../controllers/basicControllers');
const validationRules = require('../middleware/validation');

// GET /api/cursos - Obtener todos los cursos
router.get('/', cursoController.getAll);

// GET /api/cursos/:id - Obtener un curso por ID
router.get('/:id', cursoController.getById);

// POST /api/cursos - Crear un nuevo curso
router.post('/', validationRules.curso, cursoController.create);

// PUT /api/cursos/:id - Actualizar un curso
router.put('/:id', validationRules.curso, cursoController.update);

// DELETE /api/cursos/:id - Eliminar un curso (soft delete)
router.delete('/:id', cursoController.delete);

module.exports = router;