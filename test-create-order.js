const http = require('http');

console.log('🧪 Probando creación de orden con formato español...');

function makeRequest(path, method = 'GET', token = null, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
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

async function testCreateOrder() {
  try {
    // Login como catedrático
    console.log('\n🔐 Login catedrático...');
    const login = await makeRequest('/api/auth/login', 'POST', null, {
      username: 'prof.perez', password: 'password123'
    });

    if (login.status !== 200) {
      console.log('❌ Error login:', login.data);
      return;
    }

    console.log(`✅ Login OK - Usuario: ${login.data.data.user.username}`);
    const token = login.data.data.token;

    // Probar creación de orden con formato español
    console.log('\n📋 Creando orden con formato español...');
    const orderBody = {
      "catedratico_id": 1,
      "aula_id": 1,
      "curso_id": 1,
      "recepcionista1_id": 1,
      "fecha_uso": "2025-10-30",
      "hora_inicio": "08:00",
      "hora_fin": "10:00",
      "observaciones": "Clase de programación básica",
      "equipos": [
        {
          "equipo_id": 1,
          "quantity": 1
        },
        {
          "equipo_id": 3,
          "quantity": 2
        }
      ]
    };

    const createOrder = await makeRequest('/api/ordenes', 'POST', token, orderBody);
    
    console.log(`Status: ${createOrder.status}`);
    if (createOrder.status === 201) {
      console.log('✅ Orden creada exitosamente!');
      console.log(`   ID de orden: ${createOrder.data.data.id}`);
      console.log(`   Fecha uso: ${createOrder.data.data.date_use}`);
      console.log(`   Horario: ${createOrder.data.data.start_time} - ${createOrder.data.data.end_time}`);
      console.log(`   Items: ${createOrder.data.data.items?.length || 0}`);
    } else {
      console.log('❌ Error al crear orden:');
      console.log(JSON.stringify(createOrder.data, null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCreateOrder();