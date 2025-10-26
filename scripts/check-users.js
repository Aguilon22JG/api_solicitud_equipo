const { sequelize, Usuario, Rol } = require('../src/models');

async function checkUsers() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // Verificar usuarios
    const usuarios = await Usuario.findAll({
      include: [{
        model: Rol,
        as: 'rol',
        attributes: ['name']
      }],
      attributes: ['id', 'username', 'email', 'rol_id', 'status']
    });

    console.log('\n👥 Usuarios en la base de datos:');
    if (usuarios.length === 0) {
      console.log('   ❌ No hay usuarios en la base de datos');
    } else {
      usuarios.forEach(user => {
        console.log(`   - ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Rol: ${user.rol?.name}, Status: ${user.status}`);
      });
    }

    // Verificar roles
    const roles = await Rol.findAll();
    console.log('\n🔐 Roles disponibles:');
    roles.forEach(rol => {
      console.log(`   - ID: ${rol.id}, Nombre: ${rol.name}`);
    });

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUsers();