#!/usr/bin/env node

/**
 * Script para configurar la base de datos
 * Ejecuta migraciones y seeders
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando configuración de la base de datos...\n');

try {
  // Ejecutar migraciones
  console.log('📋 Ejecutando migraciones...');
  execSync('npx sequelize-cli db:migrate', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ Migraciones completadas\n');

  // Ejecutar seeders
  console.log('🌱 Ejecutando seeders...');
  execSync('npx sequelize-cli db:seed:all', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ Seeders completados\n');

  console.log('🎉 ¡Base de datos configurada exitosamente!');
  console.log('\n📝 Usuarios creados:');
  console.log('   👤 admin / password123 (Administrador)');
  console.log('   👤 recepcionista1 / password123 (Recepcionista)');
  console.log('   👤 recepcionista2 / password123 (Recepcionista)');
  console.log('   👤 prof.perez / password123 (Catedrático)');
  console.log('   👤 prof.lopez / password123 (Catedrático)');
  console.log('\n🔐 Todos los usuarios tienen la contraseña: password123');

} catch (error) {
  console.error('❌ Error durante la configuración:', error.message);
  process.exit(1);
}