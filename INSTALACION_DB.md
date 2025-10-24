# 🗄️ Guía de Instalación y Configuración de MariaDB

## 📋 Requisitos Previos

Antes de ejecutar la API, necesitas tener MariaDB instalado y configurado.

## 🚀 Instalación de MariaDB en Windows

### Opción 1: Instalación directa de MariaDB

1. **Descargar MariaDB**
   - Ve a: https://mariadb.org/download/
   - Selecciona la versión estable más reciente
   - Elige "Windows" como sistema operativo
   - Descarga el archivo MSI

2. **Instalar MariaDB**
   - Ejecuta el archivo MSI descargado
   - Sigue el asistente de instalación
   - **Importante**: Anota la contraseña del usuario `root` que configures

3. **Verificar instalación**
   ```cmd
   mysql --version
   ```

### Opción 2: Usando XAMPP (Recomendado para desarrollo)

1. **Descargar XAMPP**
   - Ve a: https://www.apachefriends.org/
   - Descarga la versión más reciente

2. **Instalar XAMPP**
   - Ejecuta el instalador
   - Asegúrate de seleccionar MySQL/MariaDB

3. **Iniciar servicios**
   - Abre el Panel de Control de XAMPP
   - Inicia Apache y MySQL

### Opción 3: Usando Docker (Para usuarios avanzados)

```bash
# Ejecutar MariaDB en contenedor
docker run --name mariadb-equipo \
  -e MYSQL_ROOT_PASSWORD=tu_password \
  -e MYSQL_DATABASE=equipo_universidad \
  -p 3306:3306 \
  -d mariadb:latest
```

## ⚙️ Configuración de la Base de Datos

### 1. Conectar a MariaDB

**Usando Command Line:**
```cmd
mysql -u root -p
```

**Usando XAMPP phpMyAdmin:**
- Ve a: http://localhost/phpmyadmin

### 2. Crear la Base de Datos

```sql
-- Crear la base de datos
CREATE DATABASE equipo_universidad 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Crear usuario específico (opcional, recomendado para producción)
CREATE USER 'equipo_user'@'localhost' IDENTIFIED BY 'tu_password_seguro';
GRANT ALL PRIVILEGES ON equipo_universidad.* TO 'equipo_user'@'localhost';
FLUSH PRIVILEGES;

-- Verificar que se creó correctamente
SHOW DATABASES;
USE equipo_universidad;
```

### 3. Configurar variables de entorno

Edita el archivo `.env` en la raíz del proyecto:

```env
# Si usas el usuario root
DB_HOST=localhost
DB_PORT=3306
DB_NAME=equipo_universidad
DB_USER=root
DB_PASSWORD=tu_password_de_root

# Si creaste un usuario específico
DB_HOST=localhost
DB_PORT=3306
DB_NAME=equipo_universidad
DB_USER=equipo_user
DB_PASSWORD=tu_password_seguro

# Configuración del servidor
PORT=3000
NODE_ENV=development
```

## 🔧 Ejecutar Migraciones y Seeders

Una vez configurada la base de datos:

### 1. Ejecutar migraciones (crear tablas)
```bash
cd "d:\aleja\Documents\Proyectos\Solicitud de equipo MESO\api_equipo"
npm run migrate
```

### 2. Ejecutar seeders (datos de ejemplo)
```bash
npm run seed
```

### 3. Verificar que todo funciona
```bash
npm run dev
```

## 🔍 Verificación

### 1. Verificar tablas creadas
```sql
USE equipo_universidad;
SHOW TABLES;
```

Deberías ver estas tablas:
- `aulas`
- `carreras`
- `catedraticos`
- `cursos`
- `equipos`
- `order_items`
- `ordenes`
- `recepcionistas`
- `SequelizeMeta` (tabla interna de Sequelize)

### 2. Verificar datos de ejemplo
```sql
-- Ver algunos registros
SELECT * FROM equipos LIMIT 5;
SELECT * FROM catedraticos LIMIT 5;
SELECT * FROM ordenes LIMIT 5;
```

### 3. Probar la API
```bash
# Health check
curl http://localhost:3000/health

# Listar equipos
curl http://localhost:3000/api/equipos
```

## 🛠️ Comandos Útiles

### Resetear base de datos completa
```bash
# Revertir todas las migraciones
npm run migrate:undo:all

# Volver a ejecutar migraciones
npm run migrate

# Volver a ejecutar seeders
npm run seed
```

### Comandos de MariaDB útiles
```sql
-- Ver estructura de una tabla
DESCRIBE equipos;

-- Ver todas las bases de datos
SHOW DATABASES;

-- Ver todas las tablas
SHOW TABLES;

-- Ver tamaño de la base de datos
SELECT 
    table_schema as 'Database', 
    sum( data_length + index_length ) / 1024 / 1024 as 'DB Size in MB' 
FROM information_schema.tables 
WHERE table_schema='equipo_universidad' 
GROUP BY table_schema;
```

## 🔒 Configuración de Seguridad (Producción)

### 1. Crear usuario específico
```sql
-- Usuario solo para la aplicación
CREATE USER 'api_equipo'@'localhost' IDENTIFIED BY 'password_muy_seguro';
GRANT SELECT, INSERT, UPDATE, DELETE ON equipo_universidad.* TO 'api_equipo'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Configurar firewall
```sql
-- Limitar conexiones
SET GLOBAL max_connections = 50;
SET GLOBAL max_user_connections = 20;
```

## 🐛 Solución de Problemas Comunes

### Error: "Can't connect to MySQL server"
- Verificar que MariaDB esté ejecutándose
- Verificar puerto (3306)
- Verificar credenciales en `.env`

### Error: "Access denied for user"
- Verificar usuario y contraseña
- Verificar permisos del usuario

### Error: "Unknown database"
- Asegurarse de que la base de datos existe
- Ejecutar el comando CREATE DATABASE

### Puerto ocupado
```bash
# Ver qué proceso usa el puerto 3306
netstat -ano | findstr 3306

# Cambiar puerto en .env si es necesario
DB_PORT=3307
```

## 📱 Herramientas Recomendadas

### Clientes GUI para MariaDB:
1. **phpMyAdmin** (incluido en XAMPP)
2. **HeidiSQL** (gratis, solo Windows)
3. **MySQL Workbench** (gratis, multiplataforma)
4. **DBeaver** (gratis, multiplataforma)

### Para testing de API:
1. **Postman** (gratis)
2. **Insomnia** (gratis)
3. **VS Code REST Client** (extensión)

## 🎯 Siguientes Pasos

Una vez configurado todo:

1. ✅ Instalar MariaDB
2. ✅ Crear base de datos
3. ✅ Configurar `.env`
4. ✅ Ejecutar migraciones
5. ✅ Ejecutar seeders
6. ✅ Iniciar servidor
7. ✅ Probar endpoints

¡Tu API estará lista para usar! 🚀