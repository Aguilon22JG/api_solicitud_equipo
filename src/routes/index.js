const express = require('express');
const router = express.Router();

// Importar todas las rutas
const authRoutes = require('./auth');
const rolesRoutes = require('./roles');
const usuariosRoutes = require('./usuarios');
const equiposRoutes = require('./equipos');
const catedraticosRoutes = require('./catedraticos');
const recepcionistasRoutes = require('./recepcionistas');
const aulasRoutes = require('./aulas');
const carrerasRoutes = require('./carreras');
const cursosRoutes = require('./cursos');
const ordenesRoutes = require('./ordenes');

// Configurar rutas
router.use('/auth', authRoutes);
router.use('/roles', rolesRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/equipos', equiposRoutes);
router.use('/catedraticos', catedraticosRoutes);
router.use('/recepcionistas', recepcionistasRoutes);
router.use('/aulas', aulasRoutes);
router.use('/carreras', carrerasRoutes);
router.use('/cursos', cursosRoutes);
router.use('/ordenes', ordenesRoutes);

// Ruta de información de la API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API REST para Gestión de Préstamos de Equipos Universitarios',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      roles: '/api/roles',
      usuarios: '/api/usuarios',
      equipos: '/api/equipos',
      catedraticos: '/api/catedraticos',
      recepcionistas: '/api/recepcionistas',
      aulas: '/api/aulas',
      carreras: '/api/carreras',
      cursos: '/api/cursos',
      ordenes: '/api/ordenes'
    },
    documentation: {
      swagger: '/api/docs',
      postman: '/api/postman'
    }
  });
});

module.exports = router;