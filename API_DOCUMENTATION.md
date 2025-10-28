# Documentación API - Sistema de Préstamos de Equipos Universitarios

## URL Base
```
http://localhost:3001/api
```

## Autenticación
Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <token>
```

---

# 🔐 AUTENTICACIÓN

## POST /auth/login
**Descripción:** Iniciar sesión en el sistema

### Request Body:
```json
{
  "username": "admin",
  "password": "password123"
}
```

### Response (200):
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@universidad.edu",
      "rol_id": 1,
      "catedratico_id": null,
      "recepcionista_id": null,
      "status": 1,
      "createdAt": "2025-10-24T04:39:31.000Z",
      "updatedAt": "2025-10-24T04:39:31.000Z"
    },
    "rol": {
      "id": 1,
      "name": "Administrador",
      "description": "Acceso completo al sistema"
    },
    "catedratico": null,
    "recepcionista": null,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Response (401 - Credenciales inválidas):
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

## POST /auth/refresh
**Descripción:** Renovar token de acceso

### Request Body:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Response (200):
```json
{
  "success": true,
  "message": "Token renovado exitosamente",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## POST /auth/logout
**Descripción:** Cerrar sesión (requiere autenticación)

### Headers:
```
Authorization: Bearer <token>
```

### Response (200):
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

---

# 👥 USUARIOS (Solo Administradores)

## GET /usuarios
**Descripción:** Obtener todos los usuarios

### Response (200):
```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@universidad.edu",
      "rol_id": 1,
      "status": 1,
      "createdAt": "2025-10-24T04:39:31.000Z",
      "updatedAt": "2025-10-24T04:39:31.000Z",
      "rol": {
        "id": 1,
        "name": "Administrador"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

## GET /usuarios/:id
**Descripción:** Obtener usuario por ID

### Response (200):
```json
{
  "success": true,
  "message": "Usuario obtenido exitosamente",
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@universidad.edu",
    "rol_id": 1,
    "catedratico_id": null,
    "recepcionista_id": null,
    "status": 1,
    "createdAt": "2025-10-24T04:39:31.000Z",
    "updatedAt": "2025-10-24T04:39:31.000Z",
    "rol": {
      "id": 1,
      "name": "Administrador",
      "description": "Acceso completo al sistema"
    },
    "catedratico": null,
    "recepcionista": null
  }
}
```

## POST /usuarios
**Descripción:** Crear nuevo usuario

### Request Body:
```json
{
  "username": "nuevo_usuario",
  "email": "usuario@universidad.edu",
  "password": "password123",
  "rol_id": 2,
  "recepcionista_id": 1
}
```

### Response (201):
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "id": 6,
    "username": "nuevo_usuario",
    "email": "usuario@universidad.edu",
    "rol_id": 2,
    "catedratico_id": null,
    "recepcionista_id": 1,
    "status": 1,
    "createdAt": "2025-10-24T05:00:00.000Z",
    "updatedAt": "2025-10-24T05:00:00.000Z"
  }
}
```

## PUT /usuarios/:id
**Descripción:** Actualizar usuario

### Request Body:
```json
{
  "username": "usuario_actualizado",
  "email": "nuevo_email@universidad.edu",
  "rol_id": 3,
  "status": 1
}
```

### Response (200):
```json
{
  "success": true,
  "message": "Usuario actualizado exitosamente",
  "data": {
    "id": 6,
    "username": "usuario_actualizado",
    "email": "nuevo_email@universidad.edu",
    "rol_id": 3,
    "status": 1,
    "updatedAt": "2025-10-24T05:15:00.000Z"
  }
}
```

## DELETE /usuarios/:id
**Descripción:** Eliminar usuario (soft delete)

### Response (200):
```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente"
}
```

---

# 🔧 EQUIPOS

## GET /equipos
**Descripción:** Obtener todos los equipos

### Query Parameters (opcionales):
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `search`: Buscar por nombre o descripción
- `status`: Filtrar por estado (1=Disponible, 2=En uso, 3=Mantenimiento, 0=Inactivo)

### Response (200):
```json
{
  "success": true,
  "message": "Equipos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Proyector Epson",
      "description": "Proyector multimedia para presentaciones",
      "serial_number": "EP001",
      "model": "PowerLite X41+",
      "brand": "Epson",
      "quantity_available": 5,
      "quantity_total": 5,
      "status": 1,
      "location": "Almacén A-1",
      "createdAt": "2025-10-24T04:39:31.000Z",
      "updatedAt": "2025-10-24T04:39:31.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

## GET /equipos/:id
**Descripción:** Obtener equipo por ID

### Response (200):
```json
{
  "success": true,
  "message": "Equipo obtenido exitosamente",
  "data": {
    "id": 1,
    "name": "Proyector Epson",
    "description": "Proyector multimedia para presentaciones",
    "serial_number": "EP001",
    "model": "PowerLite X41+",
    "brand": "Epson",
    "quantity_available": 5,
    "quantity_total": 5,
    "status": 1,
    "location": "Almacén A-1",
    "createdAt": "2025-10-24T04:39:31.000Z",
    "updatedAt": "2025-10-24T04:39:31.000Z"
  }
}
```

## POST /equipos
**Descripción:** Crear nuevo equipo (Admin/Recepcionista)

### Request Body:
```json
{
  "name": "Laptop HP",
  "description": "Laptop para presentaciones",
  "serial_number": "HP001",
  "model": "EliteBook 840",
  "brand": "HP",
  "quantity_total": 3,
  "status": 1,
  "location": "Almacén B-2"
}
```

### Response (201):
```json
{
  "success": true,
  "message": "Equipo creado exitosamente",
  "data": {
    "id": 16,
    "name": "Laptop HP",
    "description": "Laptop para presentaciones",
    "serial_number": "HP001",
    "model": "EliteBook 840",
    "brand": "HP",
    "quantity_available": 3,
    "quantity_total": 3,
    "status": 1,
    "location": "Almacén B-2",
    "createdAt": "2025-10-24T05:30:00.000Z",
    "updatedAt": "2025-10-24T05:30:00.000Z"
  }
}
```

## PUT /equipos/:id
**Descripción:** Actualizar equipo

### Request Body:
```json
{
  "name": "Laptop HP Actualizada",
  "quantity_total": 5,
  "status": 1
}
```

### Response (200):
```json
{
  "success": true,
  "message": "Equipo actualizado exitosamente",
  "data": {
    "id": 16,
    "name": "Laptop HP Actualizada",
    "quantity_total": 5,
    "quantity_available": 5,
    "updatedAt": "2025-10-24T05:45:00.000Z"
  }
}
```

---

# 📋 ÓRDENES

## GET /ordenes
**Descripción:** Obtener órdenes (filtradas por rol)

### Query Parameters (opcionales):
- `page`, `limit`: Paginación
- `status`: Estado de la orden
- `fecha_inicio`, `fecha_fin`: Rango de fechas
- `catedratico_id`: Filtrar por catedrático (solo admin/recepcionista)

### Response (200):
```json
{
  "success": true,
  "message": "Órdenes obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "catedratico_id": 1,
      "aula_id": 1,
      "curso_id": 1,
      "recepcionista1_id": 1,
      "recepcionista2_id": 2,
      "fecha_solicitud": "2025-10-24T04:39:31.000Z",
      "fecha_uso": "2025-10-25T08:00:00.000Z",
      "hora_inicio": "08:00:00",
      "hora_fin": "10:00:00",
      "estado": 1,
      "observaciones": "Clase de matemáticas avanzadas",
      "fecha_entrega": null,
      "fecha_devolucion": null,
      "revision_conserje": null,
      "observaciones_devolucion": null,
      "createdAt": "2025-10-24T04:39:31.000Z",
      "updatedAt": "2025-10-24T04:39:31.000Z",
      "catedratico": {
        "id": 1,
        "first_name": "Juan",
        "last_name": "Pérez"
      },
      "aula": {
        "id": 1,
        "name": "Aula 101",
        "building": "Edificio A"
      },
      "curso": {
        "id": 1,
        "name": "Matemáticas I",
        "code": "MAT001"
      },
      "recepcionista1": {
        "id": 1,
        "first_name": "Ana",
        "last_name": "Rodríguez"
      },
      "recepcionista2": {
        "id": 2,
        "first_name": "Carlos",
        "last_name": "Morales"
      },
      "items": [
        {
          "id": 1,
          "equipo_id": 1,
          "quantity": 2,
          "equipo": {
            "name": "Proyector Epson",
            "model": "PowerLite X41+"
          }
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "pages": 1
  }
}
```

## GET /ordenes/:id
**Descripción:** Obtener orden específica por ID

### Response (200):
```json
{
  "success": true,
  "message": "Orden obtenida exitosamente",
  "data": {
    "id": 1,
    "catedratico_id": 1,
    "aula_id": 1,
    "curso_id": 1,
    "recepcionista1_id": 1,
    "recepcionista2_id": 2,
    "fecha_solicitud": "2025-10-24T04:39:31.000Z",
    "fecha_uso": "2025-10-25T08:00:00.000Z",
    "hora_inicio": "08:00:00",
    "hora_fin": "10:00:00",
    "estado": 1,
    "observaciones": "Clase de matemáticas avanzadas",
    "fecha_entrega": null,
    "fecha_devolucion": null,
    "revision_conserje": null,
    "observaciones_devolucion": null,
    "createdAt": "2025-10-24T04:39:31.000Z",
    "updatedAt": "2025-10-24T04:39:31.000Z",
    "catedratico": {
      "id": 1,
      "first_name": "Juan",
      "last_name": "Pérez",
      "phone": "555-0101"
    },
    "aula": {
      "id": 1,
      "name": "Aula 101",
      "building": "Edificio A",
      "capacity": 30
    },
    "curso": {
      "id": 1,
      "name": "Matemáticas I",
      "code": "MAT001",
      "credits": 4,
      "carrera": {
        "name": "Ingeniería en Sistemas"
      }
    },
    "recepcionista1": {
      "id": 1,
      "first_name": "Ana",
      "last_name": "Rodríguez",
      "phone": "555-0201"
    },
    "recepcionista2": {
      "id": 2,
      "first_name": "Carlos",
      "last_name": "Morales",
      "phone": "555-0202"
    },
    "items": [
      {
        "id": 1,
        "equipo_id": 1,
        "quantity": 2,
        "equipo": {
          "id": 1,
          "name": "Proyector Epson",
          "model": "PowerLite X41+",
          "brand": "Epson",
          "serial_number": "EP001"
        }
      }
    ]
  }
}
```

## POST /ordenes
**Descripción:** Crear nueva orden (Solo Catedráticos)

### Request Body:
```json
{
  "catedratico_id": 1,
  "aula_id": 1,
  "curso_id": 1,
  "recepcionista_entrega_id": 1,
  "recepcionista_recibe_id": 2,
  "date_use": "2025-10-30",
  "start_time": "08:00:00",
  "end_time": "10:00:00",
  "note": "Clase de programación básica",
  "items": [
    {
      "equipo_id": 1,
      "quantity": 1
    },
    {
      "equipo_id": 3,
      "quantity": 2
    }
  ]
}
```

### Response (201):
```json
{
  "success": true,
  "message": "Orden creada exitosamente",
  "data": {
    "id": 9,
    "catedratico_id": 1,
    "aula_id": 1,
    "curso_id": 1,
    "recepcionista1_id": 1,
    "recepcionista2_id": 2,
    "fecha_solicitud": "2025-10-24T06:00:00.000Z",
    "fecha_uso": "2025-10-30T08:00:00.000Z",
    "hora_inicio": "08:00:00",
    "hora_fin": "10:00:00",
    "estado": 1,
    "observaciones": "Clase de programación básica",
    "createdAt": "2025-10-24T06:00:00.000Z",
    "updatedAt": "2025-10-24T06:00:00.000Z",
    "items": [
      {
        "id": 15,
        "orden_id": 9,
        "equipo_id": 1,
        "quantity": 1
      },
      {
        "id": 16,
        "orden_id": 9,
        "equipo_id": 3,
        "quantity": 2
      }
    ]
  }
}
```

## PUT /ordenes/:id/entregar
**Descripción:** Marcar orden como entregada (Solo Recepcionistas)

### Request Body:
```json
{
  "observaciones_entrega": "Equipos entregados en perfecto estado"
}
```

### Response (200):
```json
{
  "success": true,
  "message": "Orden marcada como entregada exitosamente",
  "data": {
    "id": 9,
    "estado": 2,
    "fecha_entrega": "2025-10-24T06:15:00.000Z",
    "updatedAt": "2025-10-24T06:15:00.000Z"
  }
}
```

## PUT /ordenes/:id/devolver
**Descripción:** Marcar orden como devuelta (Solo Recepcionistas)

### Request Body:
```json
{
  "revision_conserje": 1,
  "observaciones_devolucion": "Equipos devueltos en buen estado, revisión completa"
}
```

### Response (200):
```json
{
  "success": true,
  "message": "Orden marcada como devuelta exitosamente",
  "data": {
    "id": 9,
    "estado": 4,
    "fecha_devolucion": "2025-10-24T10:30:00.000Z",
    "revision_conserje": 1,
    "observaciones_devolucion": "Equipos devueltos en buen estado, revisión completa",
    "updatedAt": "2025-10-24T10:30:00.000Z"
  }
}
```

---

# 🏢 ENTIDADES BÁSICAS

## GET /catedraticos
### Response (200):
```json
{
  "success": true,
  "message": "Catedráticos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan.perez@universidad.edu",
      "phone": "555-0101",
      "department": "Matemáticas",
      "status": 1,
      "createdAt": "2025-10-24T04:39:31.000Z"
    }
  ]
}
```

## GET /recepcionistas
### Response (200):
```json
{
  "success": true,
  "message": "Recepcionistas obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "first_name": "Ana",
      "last_name": "Rodríguez",
      "phone": "555-0201",
      "shift": "Mañana",
      "status": 1,
      "createdAt": "2025-10-24T04:39:31.000Z"
    }
  ]
}
```

## GET /aulas
### Response (200):
```json
{
  "success": true,
  "message": "Aulas obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Aula 101",
      "building": "Edificio A",
      "floor": 1,
      "capacity": 30,
      "equipment": "Proyector, Pizarra digital",
      "status": 1
    }
  ]
}
```

## GET /carreras
### Response (200):
```json
{
  "success": true,
  "message": "Carreras obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Ingeniería en Sistemas",
      "code": "IS",
      "duration_years": 5,
      "status": 1
    }
  ]
}
```

## GET /cursos
### Response (200):
```json
{
  "success": true,
  "message": "Cursos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Matemáticas I",
      "code": "MAT001",
      "credits": 4,
      "semester": 1,
      "carrera_id": 1,
      "catedratico_id": 1,
      "status": 1,
      "carrera": {
        "name": "Ingeniería en Sistemas"
      },
      "catedratico": {
        "first_name": "Juan",
        "last_name": "Pérez"
      }
    }
  ]
}
```

## GET /roles
### Response (200):
```json
{
  "success": true,
  "message": "Roles obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Administrador",
      "description": "Acceso completo al sistema. Puede gestionar usuarios, equipos y todas las operaciones.",
      "createdAt": "2025-10-24T04:39:31.000Z"
    },
    {
      "id": 2,
      "name": "Recepcionista",
      "description": "Gestiona préstamos y devoluciones de equipos. Puede imprimir órdenes y marcar entregas/devoluciones."
    },
    {
      "id": 3,
      "name": "Catedrático",
      "description": "Puede crear órdenes de préstamo para sus clases y ver su historial de solicitudes."
    }
  ]
}
```

---

# 🚫 RESPUESTAS DE ERROR COMUNES

## 401 - No autorizado:
```json
{
  "success": false,
  "message": "Token no válido o expirado"
}
```

## 403 - Prohibido:
```json
{
  "success": false,
  "message": "No tienes permisos para acceder a este recurso"
}
```

## 404 - No encontrado:
```json
{
  "success": false,
  "message": "Recurso no encontrado"
}
```

## 400 - Datos inválidos:
```json
{
  "success": false,
  "message": "Datos de entrada inválidos",
  "errors": [
    {
      "field": "username",
      "message": "El nombre de usuario es requerido"
    },
    {
      "field": "email",
      "message": "Debe ser un email válido"
    }
  ]
}
```

## 500 - Error del servidor:
```json
{
  "success": false,
  "message": "Error interno del servidor",
  "error": "Descripción del error técnico"
}
```

---

# 📊 ESTADOS DEL SISTEMA

## Estados de Equipos:
- `0`: Inactivo
- `1`: Disponible
- `2`: En uso
- `3`: En mantenimiento

## Estados de Órdenes:
- `1`: Pendiente
- `2`: Aprobada
- `3`: En uso
- `4`: Completada
- `5`: Rechazada

## Revisión de Conserje:
- `0`: Incompleta/Con daños
- `1`: Completa/Sin daños

## Estados Generales (status):
- `0`: Inactivo
- `1`: Activo

---

# 🔍 HEALTH CHECK

## GET /health
**Descripción:** Verificar estado de la API

### Response (200):
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2025-10-24T06:00:00.000Z",
  "version": "1.0.0",
  "database": "connected"
}
```