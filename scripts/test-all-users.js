const http = require('http');

function testLogin(username, password, userType) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      username: username,
      password: password
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log(`\n🔐 Probando login para ${userType}: ${username}`);

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 200) {
            console.log(`✅ ${userType} - Login exitoso`);
            console.log(`   Rol: ${response.data.rol.name}`);
            console.log(`   Email: ${response.data.user.email}`);
          } else {
            console.log(`❌ ${userType} - Error en login:`, response.message);
          }
          resolve(response);
        } catch (e) {
          console.log(`❌ ${userType} - Error parsing response:`, data);
          reject(e);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ ${userType} - Error:`, error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function testAllUsers() {
  console.log('🧪 Probando todos los tipos de usuarios...\n');
  
  try {
    // Probar Administrador
    await testLogin('admin', 'password123', 'Administrador');
    
    // Probar Recepcionistas
    await testLogin('recepcionista1', 'password123', 'Recepcionista 1');
    await testLogin('recepcionista2', 'password123', 'Recepcionista 2');
    
    // Probar Catedráticos
    await testLogin('prof.perez', 'password123', 'Catedrático 1');
    await testLogin('prof.lopez', 'password123', 'Catedrático 2');
    
    // Probar credenciales incorrectas
    await testLogin('admin', 'wrongpassword', 'Admin con contraseña incorrecta');
    
    console.log('\n🎉 Pruebas de login completadas!');
    
  } catch (error) {
    console.error('Error durante las pruebas:', error.message);
  }
}

testAllUsers();