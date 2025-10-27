const http = require('http');

console.log('🧪 Probando sistema de autorización por ID...');

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

async function test() {
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

    console.log(`✅ Login OK - Rol ID: ${login.data.data.user.rol_id}`);
    const token = login.data.data.token;

    // Probar usuarios
    console.log('\n👥 Probando /api/usuarios...');
    const usuarios = await makeRequest('/api/usuarios', 'GET', token);
    
    console.log(`Status: ${usuarios.status}`);
    if (usuarios.status === 200) {
      console.log('✅ Autorización exitosa!');
      console.log(`   Usuarios: ${usuarios.data.data?.length || 0}`);
    } else {
      console.log('❌ Error de autorización:');
      console.log(usuarios.data);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();