const http = require('http');

function testLogin() {
  const postData = JSON.stringify({
    username: 'admin',
    password: 'password123'
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

  console.log('🔐 Probando login...');

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      try {
        const response = JSON.parse(data);
        if (res.statusCode === 200) {
          console.log('✅ Login exitoso!');
        } else {
          console.log('❌ Error en login:');
        }
        console.log('Response:', JSON.stringify(response, null, 2));
      } catch (e) {
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error:', error.message);
  });

  req.write(postData);
  req.end();
}

testLogin();