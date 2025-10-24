const { Sequelize } = require('sequelize');
require('dotenv').config();

async function createDatabase() {
  // Conectar sin especificar base de datos
  const sequelize = new Sequelize(
    '',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mariadb',
      logging: false
    }
  );

  try {
    console.log('🔗 Conectando a MariaDB...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida');

    const dbName = process.env.DB_NAME || 'equipo_universidad';
    console.log(`📊 Creando base de datos: ${dbName}`);
    
    await sequelize.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    
    console.log('✅ Base de datos creada o ya existe');
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await sequelize.close();
    process.exit(1);
  }
}

createDatabase();