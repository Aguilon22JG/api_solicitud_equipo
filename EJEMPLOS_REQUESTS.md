# Ejemplos de Requests para la API de Equipos Universitarios

## Configuración Base
```
Base URL: http://localhost:3000/api
Content-Type: application/json
```

## 🏥 Health Check
```http
GET http://localhost:3000/health
```

## 📋 API Info
```http
GET http://localhost:3000/api
```

---

## 🔧 EQUIPOS

### Listar todos los equipos
```http
GET http://localhost:3000/api/equipos
```

### Listar equipos con paginación y filtros
```http
GET http://localhost:3000/api/equipos?page=1&limit=5&status=1
```

### Obtener equipo específico
```http
GET http://localhost:3000/api/equipos/1
```

### Crear nuevo equipo
```http
POST http://localhost:3000/api/equipos
Content-Type: application/json

{
  "name": "Proyector BenQ MX550",
  "current_quantity": 8,
  "available_quantity": 6
}
```

### Actualizar equipo
```http
PUT http://localhost:3000/api/equipos/1
Content-Type: application/json

{
  "name": "Proyector BenQ MX550 - Actualizado",
  "current_quantity": 10,
  "available_quantity": 8
}
```

### Eliminar equipo (soft delete)
```http
DELETE http://localhost:3000/api/equipos/1
```

---

## 👨‍🏫 CATEDRÁTICOS

### Listar catedráticos
```http
GET http://localhost:3000/api/catedraticos
```

### Obtener catedrático con sus cursos y órdenes
```http
GET http://localhost:3000/api/catedraticos/1
```

### Crear catedrático
```http
POST http://localhost:3000/api/catedraticos
Content-Type: application/json

{
  "first_name": "Roberto",
  "last_name": "Silva",
  "phone": "12345678"
}
```

### Actualizar catedrático
```http
PUT http://localhost:3000/api/catedraticos/1
Content-Type: application/json

{
  "first_name": "Roberto Carlos",
  "last_name": "Silva Morales",
  "phone": "87654321"
}
```

---

## 👩‍💼 RECEPCIONISTAS

### Listar recepcionistas
```http
GET http://localhost:3000/api/recepcionistas
```

### Crear recepcionista
```http
POST http://localhost:3000/api/recepcionistas
Content-Type: application/json

{
  "first_name": "Elena",
  "last_name": "Vargas",
  "phone": "55667788"
}
```

---

## 🏫 AULAS

### Listar aulas
```http
GET http://localhost:3000/api/aulas
```

### Crear aula
```http
POST http://localhost:3000/api/aulas
Content-Type: application/json

{
  "name": "Aula 303",
  "description": "Aula multimedia con proyector y sistema de sonido"
}
```

---

## 🎓 CARRERAS

### Listar carreras
```http
GET http://localhost:3000/api/carreras
```

### Crear carrera
```http
POST http://localhost:3000/api/carreras
Content-Type: application/json

{
  "name": "Ingeniería en Ciencias de la Computación"
}
```

---

## 📚 CURSOS

### Listar cursos con sus relaciones
```http
GET http://localhost:3000/api/cursos
```

### Crear curso
```http
POST http://localhost:3000/api/cursos
Content-Type: application/json

{
  "name": "Algoritmos y Estructuras de Datos",
  "carreraId": 1,
  "catedraticoId": 1
}
```

---

## 📝 ÓRDENES

### Listar todas las órdenes
```http
GET http://localhost:3000/api/ordenes
```

### Filtrar órdenes por estado y fecha
```http
GET http://localhost:3000/api/ordenes?status_order=0&date_use=2024-10-25
```

### Obtener orden específica con todos los detalles
```http
GET http://localhost:3000/api/ordenes/1
```

### Crear nueva orden con equipos
```http
POST http://localhost:3000/api/ordenes
Content-Type: application/json

{
  "note": "Equipos para clase práctica de programación avanzada",
  "date_use": "2024-10-30",
  "start_time": "10:00:00",
  "end_time": "12:00:00",
  "catedraticoId": 1,
  "aulaId": 1,
  "cursoId": 1,
  "items": [
    {
      "equipoId": 1,
      "quantity": 1
    },
    {
      "equipoId": 2,
      "quantity": 15
    },
    {
      "equipoId": 4,
      "quantity": 2
    }
  ]
}
```

### Actualizar orden completa
```http
PUT http://localhost:3000/api/ordenes/1
Content-Type: application/json

{
  "note": "Equipos actualizados para clase práctica",
  "date_use": "2024-10-30",
  "start_time": "09:00:00",
  "end_time": "11:00:00",
  "items": [
    {
      "equipoId": 1,
      "quantity": 2
    },
    {
      "equipoId": 3,
      "quantity": 1
    }
  ]
}
```

### Actualizar solo el estado de la orden (para recepcionistas)
```http
PUT http://localhost:3000/api/ordenes/1/status
Content-Type: application/json

{
  "status_concierge": 1,
  "recepcionistaId": 1
}
```

### Aprobar orden y cambiar estado
```http
PUT http://localhost:3000/api/ordenes/1/status
Content-Type: application/json

{
  "status_order": 1,
  "status_concierge": 1,
  "recepcionistaId": 1
}
```

### Marcar orden como en uso
```http
PUT http://localhost:3000/api/ordenes/1/status
Content-Type: application/json

{
  "status_order": 2
}
```

### Completar orden
```http
PUT http://localhost:3000/api/ordenes/1/status
Content-Type: application/json

{
  "status_order": 3
}
```

### Cancelar orden
```http
DELETE http://localhost:3000/api/ordenes/1
```

---

## 🔍 CASOS DE USO COMPLETOS

### 1. Flujo completo: Crear solicitud de préstamo

#### Paso 1: Verificar equipos disponibles
```http
GET http://localhost:3000/api/equipos?status=1
```

#### Paso 2: Verificar aulas disponibles
```http
GET http://localhost:3000/api/aulas?status=1
```

#### Paso 3: Crear la orden
```http
POST http://localhost:3000/api/ordenes
Content-Type: application/json

{
  "note": "Material para clase de introducción a la programación",
  "date_use": "2024-11-01",
  "start_time": "08:00:00",
  "end_time": "10:00:00",
  "catedraticoId": 1,
  "aulaId": 1,
  "cursoId": 1,
  "items": [
    {
      "equipoId": 1,
      "quantity": 1
    },
    {
      "equipoId": 2,
      "quantity": 20
    }
  ]
}
```

### 2. Flujo de aprobación por recepcionista

#### Paso 1: Ver órdenes pendientes
```http
GET http://localhost:3000/api/ordenes?status_concierge=0
```

#### Paso 2: Aprobar orden
```http
PUT http://localhost:3000/api/ordenes/3/status
Content-Type: application/json

{
  "status_concierge": 1,
  "status_order": 1,
  "recepcionistaId": 1
}
```

### 3. Gestión durante el uso

#### Marcar como en uso al inicio de la clase
```http
PUT http://localhost:3000/api/ordenes/3/status
Content-Type: application/json

{
  "status_order": 2
}
```

#### Marcar como completada al finalizar
```http
PUT http://localhost:3000/api/ordenes/3/status
Content-Type: application/json

{
  "status_order": 3
}
```

---

## 📊 REPORTES Y CONSULTAS

### Órdenes por catedrático
```http
GET http://localhost:3000/api/ordenes?catedraticoId=1
```

### Órdenes pendientes de aprobación
```http
GET http://localhost:3000/api/ordenes?status_concierge=0
```

### Órdenes aprobadas para hoy
```http
GET http://localhost:3000/api/ordenes?status_order=1&date_use=2024-10-25
```

### Equipos más solicitados (manualmente revisar los order_items)
```http
GET http://localhost:3000/api/ordenes
```

---

## ⚠️ CASOS DE ERROR

### Intentar crear orden con equipo inexistente
```http
POST http://localhost:3000/api/ordenes
Content-Type: application/json

{
  "note": "Test error",
  "date_use": "2024-11-01",
  "start_time": "08:00:00",
  "end_time": "10:00:00",
  "catedraticoId": 1,
  "aulaId": 1,
  "cursoId": 1,
  "items": [
    {
      "equipoId": 999,
      "quantity": 1
    }
  ]
}
```

### Intentar crear orden con cantidad insuficiente
```http
POST http://localhost:3000/api/ordenes
Content-Type: application/json

{
  "note": "Test error cantidad",
  "date_use": "2024-11-01",
  "start_time": "08:00:00",
  "end_time": "10:00:00",
  "catedraticoId": 1,
  "aulaId": 1,
  "cursoId": 1,
  "items": [
    {
      "equipoId": 1,
      "quantity": 100
    }
  ]
}
```

### Datos inválidos
```http
POST http://localhost:3000/api/equipos
Content-Type: application/json

{
  "name": "",
  "current_quantity": -5,
  "available_quantity": "invalid"
}
```

---

## 🧪 TESTING

Para probar estos endpoints puedes usar:

1. **Postman**: Importa estos ejemplos como requests
2. **cURL**: Convierte los ejemplos a comandos cURL
3. **VS Code REST Client**: Usa la extensión REST Client
4. **Insomnia**: Importa como colección

### Ejemplo con cURL:
```bash
# Listar equipos
curl -X GET http://localhost:3000/api/equipos

# Crear equipo
curl -X POST http://localhost:3000/api/equipos \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Equipo","current_quantity":5,"available_quantity":3}'
```