const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'equipo_universidad',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mariadb',
    logging: console.log
  }
);

async function checkTables() {
  try {
    const results = await sequelize.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'equipo_universidad'}' 
      AND TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME;
    `, {
      type: Sequelize.QueryTypes.SELECT
    });
    
    console.log('📋 Tablas creadas en la base de datos:');
    if (results.length === 0) {
      console.log('   ⚠️  No se encontraron tablas');
    } else {
      results.forEach(table => {
        console.log(`   - ${table.TABLE_NAME}`);
      });
    }
    
    console.log(`\n🔍 Total de tablas: ${results.length}`);
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await sequelize.close();
  }
}

checkTables();