const sequelize = require('../config/database');

// Importar todos los modelos
const Equipo = require('./Equipo');
const Catedratico = require('./Catedratico');
const Recepcionista = require('./Recepcionista');
const Aula = require('./Aula');
const Carrera = require('./Carrera');
const Curso = require('./Curso');
const Orden = require('./Orden');
const OrderItem = require('./OrderItem');
const Rol = require('./Rol');
const Usuario = require('./Usuario');

// Definir asociaciones

// Carrera -> Curso (One to Many)
Carrera.hasMany(Curso, {
  foreignKey: 'carrera_id',
  as: 'cursos'
});
Curso.belongsTo(Carrera, {
  foreignKey: 'carrera_id',
  as: 'carrera'
});

// Catedratico -> Curso (One to Many)
Catedratico.hasMany(Curso, {
  foreignKey: 'catedratico_id',
  as: 'cursos'
});
Curso.belongsTo(Catedratico, {
  foreignKey: 'catedratico_id',
  as: 'catedratico'
});

// Catedratico -> Orden (One to Many)
Catedratico.hasMany(Orden, {
  foreignKey: 'catedratico_id',
  as: 'ordenes'
});
Orden.belongsTo(Catedratico, {
  foreignKey: 'catedratico_id',
  as: 'catedratico'
});

// Recepcionista entrega -> Orden (One to Many)
Recepcionista.hasMany(Orden, {
  foreignKey: 'recepcionista_entrega_id',
  as: 'ordenes_entrega'
});
Orden.belongsTo(Recepcionista, {
  foreignKey: 'recepcionista_entrega_id',
  as: 'recepcionista_entrega'
});

// Recepcionista recibe -> Orden (One to Many)
Recepcionista.hasMany(Orden, {
  foreignKey: 'recepcionista_recibe_id',
  as: 'ordenes_recibe'
});
Orden.belongsTo(Recepcionista, {
  foreignKey: 'recepcionista_recibe_id',
  as: 'recepcionista_recibe'
});

// Aula -> Orden (One to Many)
Aula.hasMany(Orden, {
  foreignKey: 'aula_id',
  as: 'ordenes'
});
Orden.belongsTo(Aula, {
  foreignKey: 'aula_id',
  as: 'aula'
});

// Curso -> Orden (One to Many)
Curso.hasMany(Orden, {
  foreignKey: 'curso_id',
  as: 'ordenes'
});
Orden.belongsTo(Curso, {
  foreignKey: 'curso_id',
  as: 'curso'
});

// Orden -> OrderItem (One to Many)
Orden.hasMany(OrderItem, {
  foreignKey: 'orden_id',
  as: 'items'
});
OrderItem.belongsTo(Orden, {
  foreignKey: 'orden_id',
  as: 'orden'
});

// Equipo -> OrderItem (One to Many)
Equipo.hasMany(OrderItem, {
  foreignKey: 'equipo_id',
  as: 'orderItems'
});
OrderItem.belongsTo(Equipo, {
  foreignKey: 'equipo_id',
  as: 'equipo'
});

// Many-to-Many: Orden <-> Equipo through OrderItem
Orden.belongsToMany(Equipo, {
  through: OrderItem,
  foreignKey: 'orden_id',
  otherKey: 'equipo_id',
  as: 'equipos'
});
Equipo.belongsToMany(Orden, {
  through: OrderItem,
  foreignKey: 'equipo_id',
  otherKey: 'orden_id',
  as: 'ordenes'
});

// Rol -> Usuario (One to Many)
Rol.hasMany(Usuario, {
  foreignKey: 'rol_id',
  as: 'usuarios'
});
Usuario.belongsTo(Rol, {
  foreignKey: 'rol_id',
  as: 'rol'
});

// Catedratico -> Usuario (One to One)
Catedratico.hasOne(Usuario, {
  foreignKey: 'catedratico_id',
  as: 'usuario'
});
Usuario.belongsTo(Catedratico, {
  foreignKey: 'catedratico_id',
  as: 'catedratico'
});

// Recepcionista -> Usuario (One to One)
Recepcionista.hasOne(Usuario, {
  foreignKey: 'recepcionista_id',
  as: 'usuario'
});
Usuario.belongsTo(Recepcionista, {
  foreignKey: 'recepcionista_id',
  as: 'recepcionista'
});

module.exports = {
  sequelize,
  Equipo,
  Catedratico,
  Recepcionista,
  Aula,
  Carrera,
  Curso,
  Orden,
  OrderItem,
  Rol,
  Usuario
};