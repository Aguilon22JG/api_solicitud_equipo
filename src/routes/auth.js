const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const validationRules = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

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

// Rutas de autenticación (públicas)
router.post('/login', validationRules.login, handleValidationErrors, authController.login);
router.post('/register', validationRules.register, handleValidationErrors, authController.register);
router.post('/refresh', authController.refresh);

// Rutas protegidas (requieren autenticación)
router.use(authenticateToken);

router.post('/change-password', validationRules.changePassword, handleValidationErrors, authController.changePassword);
router.get('/me', authController.me);
router.post('/logout', authController.logout);

module.exports = router;