'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Usar los modelos directamente para evitar problemas con nombres de tabla
    const { Rol, Carrera, Catedratico, Recepcionista, Aula, Curso, Equipo, Usuario } = require('../models');
    const bcrypt = require('bcryptjs');
    
    try {
      console.log('🔄 Insertando roles...');
      await Rol.bulkCreate([
        {
          id: 1,
          name: 'Administrador',
          description: 'Acceso completo al sistema. Puede gestionar usuarios, equipos y todas las operaciones.'
        },
        {
          id: 2,
          name: 'Recepcionista',
          description: 'Puede gestionar equipos, aprobar/rechazar órdenes y administrar préstamos.'
        },
        {
          id: 3,
          name: 'Catedrático',
          description: 'Puede crear órdenes de préstamo y consultar sus propias órdenes.'
        }
      ]);

      console.log('🔄 Insertando carreras...');
      await Carrera.bulkCreate([
        { id: 1, name: 'Ingeniería en Sistemas', status: 1 },
        { id: 2, name: 'Ingeniería Industrial', status: 1 },
        { id: 3, name: 'Administración de Empresas', status: 1 }
      ]);

      console.log('🔄 Insertando catedráticos...');
      await Catedratico.bulkCreate([
        { id: 1, first_name: 'Juan Carlos', last_name: 'Pérez García', phone: '22334455', status: 1 },
        { id: 2, first_name: 'María Elena', last_name: 'López Martínez', phone: '33445566', status: 1 }
      ]);

      console.log('🔄 Insertando recepcionistas...');
      await Recepcionista.bulkCreate([
        { id: 1, first_name: 'Ana Patricia', last_name: 'Rodríguez Sánchez', phone: '44556677', status: 1 },
        { id: 2, first_name: 'Carlos Eduardo', last_name: 'Morales Jiménez', phone: '55667788', status: 1 }
      ]);

      console.log('🔄 Insertando aulas...');
      await Aula.bulkCreate([
        { id: 1, name: 'Aula Magna', description: 'Aula principal para conferencias y eventos', status: 1 },
        { id: 2, name: 'Laboratorio A', description: 'Laboratorio de computación', status: 1 },
        { id: 3, name: 'Salón 101', description: 'Salón de clases regular', status: 1 }
      ]);

      console.log('🔄 Insertando cursos...');
      await Curso.bulkCreate([
        { id: 1, name: 'Programación I', carrera_id: 1, catedratico_id: 1, status: 1 },
        { id: 2, name: 'Base de Datos', carrera_id: 1, catedratico_id: 2, status: 1 },
        { id: 3, name: 'Contabilidad General', carrera_id: 3, catedratico_id: 2, status: 1 }
      ]);

      console.log('🔄 Insertando equipos...');
      await Equipo.bulkCreate([
        { id: 1, name: 'Proyector Epson', current_quantity: 10, available_quantity: 8, status: 1 },
        { id: 2, name: 'Laptop Dell', current_quantity: 15, available_quantity: 12, status: 1 },
        { id: 3, name: 'Extensión Eléctrica', current_quantity: 20, available_quantity: 18, status: 1 },
        { id: 4, name: 'Micrófono Inalámbrico', current_quantity: 5, available_quantity: 4, status: 1 }
      ]);

      console.log('🔄 Insertando usuarios...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await Usuario.bulkCreate([
        {
          id: 1,
          username: 'admin',
          email: 'admin@universidad.edu',
          password: hashedPassword,
          rol_id: 1,
          status: 1
        },
        {
          id: 2,
          username: 'recepcionista1',
          email: 'ana.rodriguez@universidad.edu',
          password: hashedPassword,
          rol_id: 2,
          recepcionista_id: 1,
          status: 1
        },
        {
          id: 3,
          username: 'recepcionista2',
          email: 'carlos.morales@universidad.edu',
          password: hashedPassword,
          rol_id: 2,
          recepcionista_id: 2,
          status: 1
        },
        {
          id: 4,
          username: 'prof.perez',
          email: 'juan.perez@universidad.edu',
          password: hashedPassword,
          rol_id: 3,
          catedratico_id: 1,
          status: 1
        },
        {
          id: 5,
          username: 'prof.lopez',
          email: 'maria.lopez@universidad.edu',
          password: hashedPassword,
          rol_id: 3,
          catedratico_id: 2,
          status: 1
        }
      ]);

      console.log('✅ Datos iniciales insertados exitosamente');
    } catch (error) {
      console.error('❌ Error insertando datos:', error.message);
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    const { Rol, Carrera, Catedratico, Recepcionista, Aula, Curso, Equipo, Usuario } = require('../models');
    
    await Usuario.destroy({ where: {}, truncate: true });
    await Equipo.destroy({ where: {}, truncate: true });
    await Curso.destroy({ where: {}, truncate: true });
    await Aula.destroy({ where: {}, truncate: true });
    await Recepcionista.destroy({ where: {}, truncate: true });
    await Catedratico.destroy({ where: {}, truncate: true });
    await Carrera.destroy({ where: {}, truncate: true });
    await Rol.destroy({ where: {}, truncate: true });
  }
};