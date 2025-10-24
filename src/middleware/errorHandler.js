const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de validación de Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Error de clave foránea
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Error de referencia: El registro referenciado no existe o está siendo utilizado'
    });
  }

  // Error de clave única
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Error: Ya existe un registro con esos datos únicos'
    });
  }

  // Error de conexión a la base de datos
  if (err.name === 'SequelizeConnectionError') {
    return res.status(500).json({
      success: false,
      message: 'Error de conexión a la base de datos'
    });
  }

  // Error genérico del servidor
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
};

const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
};

module.exports = {
  errorHandler,
  notFound
};