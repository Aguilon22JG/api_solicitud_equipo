const http = require('http');

console.log('🧪 Probando endpoint de órdenes...');

function makeRequest(path, method = 'GET', token = null, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: path,
      method: method,
      headers: { 'Content-Type': 'application/json' }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testOrdenes() {
  try {
    // Login admin
    console.log('\n🔐 Login admin...');
    const login = await makeRequest('/api/auth/login', 'POST', null, {
      username: 'admin', password: 'password123'
    });

    if (login.status !== 200) {
      console.log('❌ Error login:', login.data);
      return;
    }

    console.log(`✅ Login OK - Usuario: ${login.data.data.user.username}`);
    const token = login.data.data.token;

    // Probar órdenes
    console.log('\n📋 Probando GET /api/ordenes...');
    const ordenes = await makeRequest('/api/ordenes', 'GET', token);
    
    console.log(`Status: ${ordenes.status}`);
    if (ordenes.status === 200) {
      console.log('✅ Órdenes obtenidas exitosamente!');
      console.log(`   Total órdenes: ${ordenes.data.data?.count || 0}`);
      console.log(`   Órdenes en página: ${ordenes.data.data?.rows?.length || 0}`);
      
      if (ordenes.data.data?.rows?.length > 0) {
        const firstOrder = ordenes.data.data.rows[0];
        console.log('\n📄 Primera orden:');
        console.log(`   ID: ${firstOrder.id}`);
        console.log(`   Fecha uso: ${firstOrder.date_use}`);
        console.log(`   Catedrático: ${firstOrder.catedratico?.first_name} ${firstOrder.catedratico?.last_name}`);
        console.log(`   Recepcionista entrega: ${firstOrder.recepcionista_entrega ? firstOrder.recepcionista_entrega.first_name + ' ' + firstOrder.recepcionista_entrega.last_name : 'No asignado'}`);
        console.log(`   Recepcionista recibe: ${firstOrder.recepcionista_recibe ? firstOrder.recepcionista_recibe.first_name + ' ' + firstOrder.recepcionista_recibe.last_name : 'No asignado'}`);
        console.log(`   Items: ${firstOrder.items?.length || 0}`);
      }
    } else {
      console.log('❌ Error al obtener órdenes:');
      console.log(JSON.stringify(ordenes.data, null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testOrdenes();