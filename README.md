# API REST para Gestión de Préstamos de Equipos Universitarios

Una API REST desarrollada en Node.js con Express y MariaDB para gestionar órdenes de préstamo de equipos en universidades.

## Características

- **CRUD completo** para todas las entidades
- **Validaciones robustas** con express-validator
- **Migraciones de base de datos** con Sequelize
- **Relaciones complejas** entre entidades
- **Manejo de errores** centralizado
- **Paginación** en listados
- **Soft delete** para entidades principales
- **Documentación** completa de endpoints

## Entidades del Sistema

### Principales
- **Equipos**: Inventario de equipos disponibles
- **Catedráticos**: Profesores del sistema
- **Recepcionistas**: Personal administrativo
- **Aulas**: Espacios físicos
- **Carreras**: Programas académicos
- **Cursos**: Materias específicas
- **Órdenes**: Solicitudes de préstamo
- **Items de Orden**: Equipos específicos por orden

### Relaciones
- Una **Carrera** tiene muchos **Cursos**
- Un **Catedrático** imparte muchos **Cursos**
- Un **Catedrático** puede crear muchas **Órdenes**
- Una **Orden** pertenece a un **Aula** y un **Curso**
- Una **Orden** puede tener muchos **Items** (equipos)

## Stack Tecnológico

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **MariaDB** - Base de datos
- **Sequelize** - ORM
- **express-validator** - Validaciones
- **helmet** - Seguridad
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Variables de entorno

## Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd api_equipo
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:
```env
# Configuración de la Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=equipo_universidad
DB_USER=root
DB_PASSWORD=tu_password

# Configuración del Servidor
PORT=3000
NODE_ENV=development
```

4. **Crear la base de datos**
```sql
CREATE DATABASE equipo_universidad CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. **Ejecutar migraciones**
```bash
npm run migrate
```

6. **Iniciar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Endpoints de la API

### Base URL: `http://localhost:3000/api`

### Equipos (`/equipos`)
- `GET /equipos` - Listar equipos
- `GET /equipos/:id` - Obtener equipo específico
- `POST /equipos` - Crear equipo
- `PUT /equipos/:id` - Actualizar equipo
- `DELETE /equipos/:id` - Eliminar equipo (soft delete)

### Catedráticos (`/catedraticos`)
- `GET /catedraticos` - Listar catedráticos
- `GET /catedraticos/:id` - Obtener catedrático específico
- `POST /catedraticos` - Crear catedrático
- `PUT /catedraticos/:id` - Actualizar catedrático
- `DELETE /catedraticos/:id` - Eliminar catedrático (soft delete)

### Recepcionistas (`/recepcionistas`)
- `GET /recepcionistas` - Listar recepcionistas
- `GET /recepcionistas/:id` - Obtener recepcionista específico
- `POST /recepcionistas` - Crear recepcionista
- `PUT /recepcionistas/:id` - Actualizar recepcionista
- `DELETE /recepcionistas/:id` - Eliminar recepcionista (soft delete)

### Aulas (`/aulas`)
- `GET /aulas` - Listar aulas
- `GET /aulas/:id` - Obtener aula específica
- `POST /aulas` - Crear aula
- `PUT /aulas/:id` - Actualizar aula
- `DELETE /aulas/:id` - Eliminar aula (soft delete)

### Carreras (`/carreras`)
- `GET /carreras` - Listar carreras
- `GET /carreras/:id` - Obtener carrera específica
- `POST /carreras` - Crear carrera
- `PUT /carreras/:id` - Actualizar carrera
- `DELETE /carreras/:id` - Eliminar carrera (soft delete)

### Cursos (`/cursos`)
- `GET /cursos` - Listar cursos
- `GET /cursos/:id` - Obtener curso específico
- `POST /cursos` - Crear curso
- `PUT /cursos/:id` - Actualizar curso
- `DELETE /cursos/:id` - Eliminar curso (soft delete)

### Órdenes (`/ordenes`)
- `GET /ordenes` - Listar órdenes
- `GET /ordenes/:id` - Obtener orden específica
- `POST /ordenes` - Crear orden con items
- `PUT /ordenes/:id` - Actualizar orden
- `PUT /ordenes/:id/status` - Actualizar estado de orden
- `DELETE /ordenes/:id` - Cancelar orden

## Ejemplos de Uso

### Crear un Equipo
```bash
POST /api/equipos
Content-Type: application/json

{
  "name": "Proyector Epson X49",
  "current_quantity": 5,
  "available_quantity": 3
}
```

### Crear una Orden con Items
```bash
POST /api/ordenes
Content-Type: application/json

{
  "note": "Necesario para clase de programación",
  "date_use": "2024-10-25",
  "start_time": "08:00:00",
  "end_time": "10:00:00",
  "catedraticoId": 1,
  "aulaId": 1,
  "cursoId": 1,
  "items": [
    {
      "equipoId": 1,
      "quantity": 2
    },
    {
      "equipoId": 2,
      "quantity": 1
    }
  ]
}
```

### Actualizar Estado de Orden
```bash
PUT /api/ordenes/1/status
Content-Type: application/json

{
  "status_concierge": 1,
  "recepcionistaId": 1
}
```

## Parámetros de Consulta

### Paginación
- `page` - Número de página (default: 1)
- `limit` - Elementos por página (default: 10)

### Filtros
- `status` - Filtrar por estado (0=inactivo, 1=activo)

Ejemplo:
```
GET /api/equipos?page=2&limit=5&status=1
```

## Estados del Sistema

### Estados de Equipos/Entidades
- `0` - Inactivo
- `1` - Activo

### Estados de Orden
- `0` - Pendiente
- `1` - Aprobada
- `2` - En uso
- `3` - Completada
- `4` - Cancelada

### Estados de Conserje
- `0` - Pendiente
- `1` - Aprobada
- `2` - Rechazada

## Manejo de Errores

La API retorna errores en formato JSON:

```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [] // Detalles adicionales si aplica
}
```

### Códigos de Estado HTTP
- `200` - Éxito
- `201` - Creado exitosamente
- `400` - Error en la solicitud
- `404` - No encontrado
- `500` - Error interno del servidor

## Scripts Disponibles

```bash
# Desarrollo con recarga automática
npm run dev

# Producción
npm start

# Ejecutar migraciones
npm run migrate

# Revertir última migración
npm run migrate:undo

# Ejecutar seeders
npm run seed

# Ejecutar tests
npm test
```

## Estructura del Proyecto

```
api_equipo/
├── src/
│   ├── config/
│   │   ├── config.js          # Configuración de Sequelize
│   │   └── database.js        # Conexión a la BD
│   ├── controllers/
│   │   ├── equipoController.js
│   │   ├── catedraticoController.js
│   │   ├── ordenController.js
│   │   └── basicControllers.js
│   ├── middleware/
│   │   ├── validation.js      # Reglas de validación
│   │   └── errorHandler.js    # Manejo de errores
│   ├── migrations/           # Migraciones de BD
│   ├── models/              # Modelos de Sequelize
│   ├── routes/              # Rutas de Express
│   └── server.js           # Servidor principal
├── .env.example           # Variables de entorno ejemplo
├── .sequelizerc          # Configuración de Sequelize CLI
└── package.json         # Dependencias y scripts
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## Soporte

Si tienes preguntas o necesitas ayuda:

- Crear un issue en GitHub
- Contactar al equipo de desarrollo
- Revisar la documentación de las tecnologías utilizadas

---

**Desarrollado por Javier García para la solicitud eficiente de equipos universitarios**