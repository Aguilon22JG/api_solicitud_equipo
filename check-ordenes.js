const { sequelize, Orden, Catedratico, Recepcionista } = require('./src/models');

async function checkOrdenesData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // Verificar si hay órdenes
    const ordenesCount = await Orden.count();
    console.log(`\n📋 Total de órdenes en la base de datos: ${ordenesCount}`);

    if (ordenesCount === 0) {
      console.log('\n📝 Creando orden de ejemplo...');
      
      // Crear una orden de ejemplo
      const orden = await Orden.create({
        note: 'Orden de ejemplo para pruebas',
        date_use: '2025-10-27',
        start_time: '08:00:00',
        end_time: '10:00:00',
        status_concierge: 0,
        catedratico_id: 1, // Asumiendo que existe
        aula_id: 1,        // Asumiendo que existe
        curso_id: 1,       // Asumiendo que existe
        recepcionista_entrega_id: null,
        recepcionista_recibe_id: null
      });
      
      console.log(`✅ Orden creada con ID: ${orden.id}`);
    } else {
      console.log('\n📋 Órdenes existentes:');
      const ordenes = await Orden.findAll({
        limit: 3,
        attributes: ['id', 'date_use', 'start_time', 'end_time', 'status_concierge']
      });
      
      ordenes.forEach(orden => {
        console.log(`   - ID: ${orden.id}, Fecha: ${orden.date_use}, Horario: ${orden.start_time}-${orden.end_time}`);
      });
    }

    // Verificar asociaciones
    console.log('\n🔍 Probando consulta con asociaciones...');
    const ordenConAsociaciones = await Orden.findOne({
      include: [
        {
          model: Catedratico,
          as: 'catedratico',
          attributes: ['id', 'first_name', 'last_name'],
          required: false
        },
        {
          model: Recepcionista,
          as: 'recepcionista_entrega',
          attributes: ['id', 'first_name', 'last_name'],
          required: false
        },
        {
          model: Recepcionista,
          as: 'recepcionista_recibe',
          attributes: ['id', 'first_name', 'last_name'],
          required: false
        }
      ]
    });

    if (ordenConAsociaciones) {
      console.log('✅ Consulta con asociaciones exitosa');
      console.log(`   Orden ID: ${ordenConAsociaciones.id}`);
      console.log(`   Catedrático: ${ordenConAsociaciones.catedratico ? ordenConAsociaciones.catedratico.first_name : 'No asignado'}`);
      console.log(`   Entrega: ${ordenConAsociaciones.recepcionista_entrega ? ordenConAsociaciones.recepcionista_entrega.first_name : 'No asignado'}`);
      console.log(`   Recibe: ${ordenConAsociaciones.recepcionista_recibe ? ordenConAsociaciones.recepcionista_recibe.first_name : 'No asignado'}`);
    } else {
      console.log('❌ No se encontraron órdenes');
    }

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkOrdenesData();