# Guía de Autenticación JWT

Esta guía explica cómo utilizar el sistema de autenticación JWT implementado en la API.

## Sistema de Autenticación

El sistema utiliza JSON Web Tokens (JWT) para la autenticación y autorización de usuarios. Incluye tokens de acceso y refresh tokens para mayor seguridad.

## Configuración Inicial

### Variables de Entorno Required
```env
JWT_SECRET=tu_clave_secreta_super_segura_minimo_32_caracteres
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
```

### Usuarios Predeterminados
```
admin / password123 (Administrador)
recepcionista1 / password123 (Recepcionista)  
recepcionista2 / password123 (Recepcionista)
prof.perez / password123 (Catedrático)
prof.lopez / password123 (Catedrático)
```

## Endpoints de Autenticación

### 1. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@universidad.edu",
      "rol": {
        "name": "Administrador",
        "description": "Acceso completo al sistema"
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Información del Usuario Actual
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Cambiar Contraseña
```http
POST /api/auth/change-password
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "nuevaPassword456"
}
```

### 5. Logout
```http
POST /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Roles y Permisos

### Administrador
- **Puede hacer:** Todo en el sistema
- **Acceso a:**
  - Gestión de usuarios (`/api/usuarios`)
  - Gestión de roles (`/api/roles`)
  - Todas las operaciones CRUD
  - Supervisión completa de órdenes

### Recepcionista  
- **Puede hacer:** Gestionar equipos y procesar órdenes
- **Acceso a:**
  - Crear/editar/eliminar equipos
  - Actualizar estados de órdenes
  - Ver todas las órdenes
  - Gestión de préstamos

### Catedrático
- **Puede hacer:** Crear y gestionar sus propias órdenes
- **Acceso a:**
  - Crear órdenes de préstamo
  - Editar sus propias órdenes (solo pendientes)
  - Ver sus propias órdenes
  - Consultar equipos disponibles

## Uso de Tokens

### Headers Required
Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <token>
```

### Ejemplo con curl:
```bash
curl -X GET \
  http://localhost:3000/api/equipos \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### Ejemplo con JavaScript (Fetch):
```javascript
const token = localStorage.getItem('token');

fetch('/api/equipos', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

## Manejo de Errores de Autenticación

### Token Expirado (401)
```json
{
  "success": false,
  "message": "Token expirado"
}
```

**Solución:** Usar el refresh token para obtener uno nuevo.

### Token Inválido (401)
```json
{
  "success": false,
  "message": "Token inválido"
}
```

**Solución:** Hacer login nuevamente.

### Sin Permisos (403)
```json
{
  "success": false,
  "message": "No tienes permisos para acceder a este recurso"
}
```

## 🔄 Flujo de Autenticación Completo

### 1. Cliente Web/App
```javascript
// 1. Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'password123'
  })
});

const { data } = await loginResponse.json();

// 2. Guardar tokens
localStorage.setItem('token', data.token);
localStorage.setItem('refreshToken', data.refreshToken);

// 3. Usar token en requests
const equiposResponse = await fetch('/api/equipos', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// 4. Manejar token expirado
if (equiposResponse.status === 401) {
  // Intentar refresh
  const refreshResponse = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refreshToken: localStorage.getItem('refreshToken')
    })
  });
  
  if (refreshResponse.ok) {
    const newTokenData = await refreshResponse.json();
    localStorage.setItem('token', newTokenData.data.token);
    // Reintentar request original
  } else {
    // Redirect to login
    window.location.href = '/login';
  }
}
```

## Middleware de Autenticación

El sistema incluye varios middleware de autorización:

### `authenticateToken`
Verifica que el token JWT sea válido.

### `authorize(roles)`
Verifica que el usuario tenga uno de los roles especificados.
```javascript
// Solo administradores
authorize(['Administrador'])

// Administradores y recepcionistas
authorize(['Administrador', 'Recepcionista'])
```

### `authorizeCatedratico`
Verifica que un catedrático solo acceda a sus propios recursos.

### `authorizeRecepcionista`  
Permisos específicos para recepcionistas.

## Implementación en Rutas

```javascript
// Ruta pública
router.post('/login', authController.login);

// Ruta protegida (cualquier usuario autenticado)
router.get('/equipos', authenticateToken, equipoController.getAll);

// Ruta con permisos específicos
router.post('/equipos', 
  authenticateToken,
  authorize(['Administrador', 'Recepcionista']),
  equipoController.create
);

// Ruta solo para administradores
router.get('/usuarios',
  authenticateToken,
  authorize(['Administrador']),
  usuarioController.getAll
);
```

## Integración Frontend

### React Hooks Example:
```javascript
import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const login = async (credentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (response.ok) {
      const { data } = await response.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
  };
  
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };
  
  return { user, token, login, logout };
};
```

## Debugging Tips

### Verificar Token
```javascript
// Decodificar token (solo para debug, no en producción)
const jwt = require('jsonwebtoken');
const decoded = jwt.decode(token);
console.log('Token payload:', decoded);
```

### Logs del Servidor
El servidor logea información útil:
```
[AUTH] Usuario admin intentando login
[AUTH] Login exitoso para usuario admin
[AUTH] Token generado para usuario 1
[JWT] Token válido para usuario admin
[AUTH] Usuario sin permisos para /api/usuarios
```

## Configuración de Seguridad

### Recomendaciones de Producción:
1. **JWT_SECRET**: Usar una clave de al menos 32 caracteres
2. **HTTPS**: Siempre usar HTTPS en producción
3. **Token Expiry**: Tokens de corta duración (15-60 min)
4. **Refresh Tokens**: Rotar refresh tokens periódicamente
5. **Rate Limiting**: Implementar límites en endpoints de login

### Variables de Entorno Seguras:
```env
JWT_SECRET=super_secure_secret_key_32_characters_minimum!
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=24h
NODE_ENV=production
```