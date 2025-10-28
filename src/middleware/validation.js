const { body } = require('express-validator');

const validationRules = {
  // Validaciones para Equipo
  equipo: [
    body('name')
      .notEmpty()
      .withMessage('El nombre es requerido')
      .isLength({ min: 1, max: 255 })
      .withMessage('El nombre debe tener entre 1 y 255 caracteres'),
    body('current_quantity')
      .isInt({ min: 0 })
      .withMessage('La cantidad actual debe ser un número entero mayor o igual a 0'),
    body('available_quantity')
      .isInt({ min: 0 })
      .withMessage('La cantidad disponible debe ser un número entero mayor o igual a 0'),
    body('status')
      .optional()
      .isIn([0, 1])
      .withMessage('El estado debe ser 0 (inactivo) o 1 (activo)')
  ],

  // Validaciones para Catedrático
  catedratico: [
    body('first_name')
      .notEmpty()
      .withMessage('El nombre es requerido')
      .isLength({ min: 1, max: 100 })
      .withMessage('El nombre debe tener entre 1 y 100 caracteres'),
    body('last_name')
      .notEmpty()
      .withMessage('El apellido es requerido')
      .isLength({ min: 1, max: 100 })
      .withMessage('El apellido debe tener entre 1 y 100 caracteres'),
    body('phone')
      .notEmpty()
      .withMessage('El teléfono es requerido')
      .isLength({ min: 8, max: 15 })
      .withMessage('El teléfono debe tener entre 8 y 15 dígitos')
      .isNumeric()
      .withMessage('El teléfono debe contener solo números'),
    body('status')
      .optional()
      .isIn([0, 1])
      .withMessage('El estado debe ser 0 (inactivo) o 1 (activo)')
  ],

  // Validaciones para Recepcionista
  recepcionista: [
    body('first_name')
      .notEmpty()
      .withMessage('El nombre es requerido')
      .isLength({ min: 1, max: 100 })
      .withMessage('El nombre debe tener entre 1 y 100 caracteres'),
    body('last_name')
      .notEmpty()
      .withMessage('El apellido es requerido')
      .isLength({ min: 1, max: 100 })
      .withMessage('El apellido debe tener entre 1 y 100 caracteres'),
    body('phone')
      .notEmpty()
      .withMessage('El teléfono es requerido')
      .isLength({ min: 8, max: 15 })
      .withMessage('El teléfono debe tener entre 8 y 15 dígitos')
      .isNumeric()
      .withMessage('El teléfono debe contener solo números'),
    body('status')
      .optional()
      .isIn([0, 1])
      .withMessage('El estado debe ser 0 (inactivo) o 1 (activo)')
  ],

  // Validaciones para Aula
  aula: [
    body('name')
      .notEmpty()
      .withMessage('El nombre del aula es requerido')
      .isLength({ min: 1, max: 100 })
      .withMessage('El nombre debe tener entre 1 y 100 caracteres'),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('La descripción no puede exceder 500 caracteres'),
    body('status')
      .optional()
      .isIn([0, 1])
      .withMessage('El estado debe ser 0 (inactivo) o 1 (activo)')
  ],

  // Validaciones para Carrera
  carrera: [
    body('name')
      .notEmpty()
      .withMessage('El nombre de la carrera es requerido')
      .isLength({ min: 1, max: 150 })
      .withMessage('El nombre debe tener entre 1 y 150 caracteres'),
    body('status')
      .optional()
      .isIn([0, 1])
      .withMessage('El estado debe ser 0 (inactivo) o 1 (activo)')
  ],

  // Validaciones para Curso
  curso: [
    body('name')
      .notEmpty()
      .withMessage('El nombre del curso es requerido')
      .isLength({ min: 1, max: 150 })
      .withMessage('El nombre debe tener entre 1 y 150 caracteres'),
    body('carrera_id')
      .notEmpty()
      .withMessage('El ID de la carrera es requerido')
      .isInt({ min: 1 })
      .withMessage('El ID de la carrera debe ser un número entero positivo'),
    body('catedratico_id')
      .notEmpty()
      .withMessage('El ID del catedrático es requerido')
      .isInt({ min: 1 })
      .withMessage('El ID del catedrático debe ser un número entero positivo'),
    body('status')
      .optional()
      .isIn([0, 1])
      .withMessage('El estado debe ser 0 (inactivo) o 1 (activo)')
  ],

  // Validaciones para Orden
  orden: [
    // Validación para nota/observaciones
    body('note')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('La nota no puede exceder 1000 caracteres'),
    body('observaciones')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Las observaciones no pueden exceder 1000 caracteres'),
    
    // Validaciones de fecha (ambos formatos)
    body('date_use')
      .if(body('fecha_uso').not().exists())
      .notEmpty()
      .withMessage('La fecha de uso es requerida')
      .isDate()
      .withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
      .custom((value) => {
        // Obtener fecha de hoy en formato YYYY-MM-DD
        const today = new Date();
        const todayString = today.getFullYear() + '-' + 
          String(today.getMonth() + 1).padStart(2, '0') + '-' + 
          String(today.getDate()).padStart(2, '0');
        
        // Comparar directamente las cadenas de fecha
        if (value < todayString) {
          throw new Error('La fecha de uso no puede ser anterior a hoy');
        }
        return true;
      }),
    body('fecha_uso')
      .if(body('date_use').not().exists())
      .notEmpty()
      .withMessage('La fecha de uso es requerida')
      .isDate()
      .withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
      .custom((value) => {
        // Obtener fecha de hoy en formato YYYY-MM-DD
        const today = new Date();
        const todayString = today.getFullYear() + '-' + 
          String(today.getMonth() + 1).padStart(2, '0') + '-' + 
          String(today.getDate()).padStart(2, '0');
        
        // Comparar directamente las cadenas de fecha
        if (value < todayString) {
          throw new Error('La fecha de uso no puede ser anterior a hoy');
        }
        return true;
      }),
    
    // Validaciones de hora inicio (ambos formatos)
    body('start_time')
      .if(body('hora_inicio').not().exists())
      .notEmpty()
      .withMessage('La hora de inicio es requerida')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
      .withMessage('La hora de inicio debe tener formato HH:MM o HH:MM:SS'),
    body('hora_inicio')
      .if(body('start_time').not().exists())
      .notEmpty()
      .withMessage('La hora de inicio es requerida')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
      .withMessage('La hora de inicio debe tener formato HH:MM o HH:MM:SS'),
    
    // Validaciones de hora fin (ambos formatos)
    body('end_time')
      .if(body('hora_fin').not().exists())
      .notEmpty()
      .withMessage('La hora de fin es requerida')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
      .withMessage('La hora de fin debe tener formato HH:MM o HH:MM:SS')
      .custom((value, { req }) => {
        const startTime = req.body.start_time;
        if (startTime && value <= startTime) {
          throw new Error('La hora de fin debe ser posterior a la hora de inicio');
        }
        return true;
      }),
    body('hora_fin')
      .if(body('end_time').not().exists())
      .notEmpty()
      .withMessage('La hora de fin es requerida')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
      .withMessage('La hora de fin debe tener formato HH:MM o HH:MM:SS')
      .custom((value, { req }) => {
        const startTime = req.body.hora_inicio;
        if (startTime && value <= startTime) {
          throw new Error('La hora de fin debe ser posterior a la hora de inicio');
        }
        return true;
      }),
    body('catedratico_id')
      .notEmpty()
      .withMessage('El ID del catedrático es requerido')
      .isInt({ min: 1 })
      .withMessage('El ID del catedrático debe ser un número entero positivo'),
    // Validaciones de aula (ambos formatos)
    body('aula_id')
      .if(body('classroom_id').not().exists())
      .notEmpty()
      .withMessage('El ID del aula es requerido')
      .isInt({ min: 1 })
      .withMessage('El ID del aula debe ser un número entero positivo'),
    body('classroom_id')
      .if(body('aula_id').not().exists())
      .notEmpty()
      .withMessage('El ID del aula es requerido')
      .isInt({ min: 1 })
      .withMessage('El ID del aula debe ser un número entero positivo'),
    
    // Validaciones de curso (ambos formatos)
    body('curso_id')
      .if(body('course_id').not().exists())
      .notEmpty()
      .withMessage('El ID del curso es requerido')
      .isInt({ min: 1 })
      .withMessage('El ID del curso debe ser un número entero positivo'),
    body('course_id')
      .if(body('curso_id').not().exists())
      .notEmpty()
      .withMessage('El ID del curso es requerido')
      .isInt({ min: 1 })
      .withMessage('El ID del curso debe ser un número entero positivo'),
    body('recepcionista_entrega_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del recepcionista de entrega debe ser un número entero positivo'),
    body('recepcionista_recibe_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del recepcionista que recibe debe ser un número entero positivo'),
    body('status_concierge')
      .optional()
      .isIn([0, 1])
      .withMessage('El estado de conserje debe ser 0 (Incompleto) o 1 (Completo)'),
    body('items')
      .optional()
      .isArray()
      .withMessage('Los items deben ser un arreglo'),
    body('items.*.equipo_id')
      .if(body('items').exists())
      .notEmpty()
      .withMessage('El ID del equipo es requerido')
      .isInt({ min: 1 })
      .withMessage('El ID del equipo debe ser un número entero positivo'),
    body('items.*.quantity')
      .if(body('items').exists())
      .notEmpty()
      .withMessage('La cantidad es requerida')
      .isInt({ min: 1 })
      .withMessage('La cantidad debe ser un número entero positivo')
  ],

  // Validaciones para actualización de estado de orden
  ordenStatus: [
    body('status_concierge')
      .optional()
      .isIn([0, 1])
      .withMessage('El estado de conserje debe ser 0 (Incompleto) o 1 (Completo)'),
    body('recepcionista_entrega_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del recepcionista de entrega debe ser un número entero positivo'),
    body('recepcionista_recibe_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del recepcionista que recibe debe ser un número entero positivo')
  ],

  // Validaciones para autenticación
  login: [
    body('username')
      .notEmpty()
      .withMessage('El nombre de usuario es requerido')
      .isLength({ min: 3, max: 100 })
      .withMessage('El nombre de usuario debe tener entre 3 y 100 caracteres'),
    body('password')
      .notEmpty()
      .withMessage('La contraseña es requerida')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres')
  ],

  // Validaciones para registro de usuario
  register: [
    body('username')
      .notEmpty()
      .withMessage('El nombre de usuario es requerido')
      .isLength({ min: 3, max: 100 })
      .withMessage('El nombre de usuario debe tener entre 3 y 100 caracteres')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
    body('password')
      .notEmpty()
      .withMessage('La contraseña es requerida')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('El email debe tener un formato válido')
      .isLength({ max: 150 })
      .withMessage('El email no puede exceder 150 caracteres'),
    body('rol_id')
      .notEmpty()
      .withMessage('El ID del rol es requerido')
      .isInt({ min: 1 })
      .withMessage('El ID del rol debe ser un número entero positivo'),
    body('catedratico_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del catedrático debe ser un número entero positivo'),
    body('recepcionista_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del recepcionista debe ser un número entero positivo')
  ],

  // Validaciones para cambio de contraseña
  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('La contraseña actual es requerida'),
    body('newPassword')
      .notEmpty()
      .withMessage('La nueva contraseña es requerida')
      .isLength({ min: 6 })
      .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
      .custom((value, { req }) => {
        if (value === req.body.currentPassword) {
          throw new Error('La nueva contraseña debe ser diferente a la actual');
        }
        return true;
      })
  ],

  // Validaciones para Rol
  rol: [
    body('name')
      .notEmpty()
      .withMessage('El nombre del rol es requerido')
      .isLength({ min: 1, max: 50 })
      .withMessage('El nombre debe tener entre 1 y 50 caracteres'),
    body('description')
      .optional()
      .isLength({ max: 255 })
      .withMessage('La descripción no puede exceder 255 caracteres')
  ],

  // Validaciones para Usuario
  usuario: [
    body('username')
      .notEmpty()
      .withMessage('El nombre de usuario es requerido')
      .isLength({ min: 3, max: 100 })
      .withMessage('El nombre de usuario debe tener entre 3 y 100 caracteres')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('El email debe tener un formato válido')
      .isLength({ max: 150 })
      .withMessage('El email no puede exceder 150 caracteres'),
    body('password')
      .optional() // Solo en actualizaciones
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('rol_id')
      .notEmpty()
      .withMessage('El ID del rol es requerido')
      .isInt({ min: 1 })
      .withMessage('El ID del rol debe ser un número entero positivo'),
    body('catedratico_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del catedrático debe ser un número entero positivo'),
    body('recepcionista_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del recepcionista debe ser un número entero positivo'),
    body('status')
      .optional()
      .isIn([0, 1])
      .withMessage('El estado debe ser 0 (Inactivo) o 1 (Activo)')
  ]
};

module.exports = validationRules;