const http = require('http');

// Token obtenido del login
let authToken = '';

function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      defaultHeaders['Authorization'] = `Bearer ${authToken}`;
    }
    
    if (postData) {
      defaultHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: `/api${path}`,
      method: method,
      headers: { ...defaultHeaders, ...headers }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

async function testEndpoints() {
  console.log('🧪 Iniciando pruebas de endpoints...\n');

  try {
    // 1. Login
    console.log('1️⃣ Probando LOGIN...');
    const loginResponse = await makeRequest('POST', '/auth/login', {
      username: 'admin',
      password: 'password123'
    });
    
    if (loginResponse.status === 200) {
      authToken = loginResponse.data.data.token;
      console.log('✅ Login exitoso');
      console.log(`   Token: ${authToken.substring(0, 20)}...`);
    } else {
      console.log('❌ Login falló');
      return;
    }

    // 2. Health Check
    console.log('\n2️⃣ Probando HEALTH CHECK...');
    const healthResponse = await makeRequest('GET', '/health');
    console.log(`Status: ${healthResponse.status}`);
    console.log(`Response: ${JSON.stringify(healthResponse.data, null, 2)}`);

    // 3. Usuarios
    console.log('\n3️⃣ Probando GET /usuarios...');
    const usuariosResponse = await makeRequest('GET', '/usuarios');
    console.log(`Status: ${usuariosResponse.status}`);
    if (usuariosResponse.data.success) {
      console.log(`✅ ${usuariosResponse.data.data.length} usuarios obtenidos`);
    }

    // 4. Equipos
    console.log('\n4️⃣ Probando GET /equipos...');
    const equiposResponse = await makeRequest('GET', '/equipos');
    console.log(`Status: ${equiposResponse.status}`);
    if (equiposResponse.data.success) {
      console.log(`✅ ${equiposResponse.data.data.length} equipos obtenidos`);
      console.log(`   Primer equipo: ${equiposResponse.data.data[0]?.name}`);
    }

    // 5. Órdenes
    console.log('\n5️⃣ Probando GET /ordenes...');
    const ordenesResponse = await makeRequest('GET', '/ordenes');
    console.log(`Status: ${ordenesResponse.status}`);
    if (ordenesResponse.data.success) {
      console.log(`✅ ${ordenesResponse.data.data.length} órdenes obtenidas`);
    }

    // 6. Catedráticos
    console.log('\n6️⃣ Probando GET /catedraticos...');
    const catedraticosResponse = await makeRequest('GET', '/catedraticos');
    console.log(`Status: ${catedraticosResponse.status}`);
    if (catedraticosResponse.data.success) {
      console.log(`✅ ${catedraticosResponse.data.data.length} catedráticos obtenidos`);
    }

    // 7. Recepcionistas
    console.log('\n7️⃣ Probando GET /recepcionistas...');
    const recepcionistasResponse = await makeRequest('GET', '/recepcionistas');
    console.log(`Status: ${recepcionistasResponse.status}`);
    if (recepcionistasResponse.data.success) {
      console.log(`✅ ${recepcionistasResponse.data.data.length} recepcionistas obtenidos`);
    }

    // 8. Aulas
    console.log('\n8️⃣ Probando GET /aulas...');
    const aulasResponse = await makeRequest('GET', '/aulas');
    console.log(`Status: ${aulasResponse.status}`);
    if (aulasResponse.data.success) {
      console.log(`✅ ${aulasResponse.data.data.length} aulas obtenidas`);
    }

    // 9. Carreras
    console.log('\n9️⃣ Probando GET /carreras...');
    const carrerasResponse = await makeRequest('GET', '/carreras');
    console.log(`Status: ${carrerasResponse.status}`);
    if (carrerasResponse.data.success) {
      console.log(`✅ ${carrerasResponse.data.data.length} carreras obtenidas`);
    }

    // 10. Cursos
    console.log('\n🔟 Probando GET /cursos...');
    const cursosResponse = await makeRequest('GET', '/cursos');
    console.log(`Status: ${cursosResponse.status}`);
    if (cursosResponse.data.success) {
      console.log(`✅ ${cursosResponse.data.data.length} cursos obtenidos`);
    }

    // 11. Roles
    console.log('\n1️⃣1️⃣ Probando GET /roles...');
    const rolesResponse = await makeRequest('GET', '/roles');
    console.log(`Status: ${rolesResponse.status}`);
    if (rolesResponse.data.success) {
      console.log(`✅ ${rolesResponse.data.data.length} roles obtenidos`);
      rolesResponse.data.data.forEach(rol => {
        console.log(`     - ${rol.name}: ${rol.description}`);
      });
    }

    // 12. Logout
    console.log('\n1️⃣2️⃣ Probando LOGOUT...');
    const logoutResponse = await makeRequest('POST', '/auth/logout');
    console.log(`Status: ${logoutResponse.status}`);
    if (logoutResponse.data.success) {
      console.log('✅ Logout exitoso');
    }

    console.log('\n🎉 Todas las pruebas completadas!');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
  }
}

testEndpoints();