const fs = require('fs');
const path = require('path');

// Mapeo de nombres de modelo a tabla en minúsculas
const modelTableMapping = {
  'Equipo': 'equipo',
  'Catedratico': 'catedratico',
  'Recepcionista': 'recepcionista',
  'Aula': 'aula',
  'Carrera': 'carrera',
  'Curso': 'curso',
  'Orden': 'orden',
  'OrderItem': 'order_item'
};

const modelsDir = path.join(__dirname, '..', 'src', 'models');

Object.entries(modelTableMapping).forEach(([modelName, tableName]) => {
  const filePath = path.join(modelsDir, `${modelName}.js`);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Buscar y reemplazar tableName
    const tableNameRegex = /tableName:\s*['"]([^'"]*)['"]/;
    const match = content.match(tableNameRegex);
    
    if (match) {
      console.log(`📝 Actualizando ${modelName}: ${match[1]} → ${tableName}`);
      content = content.replace(tableNameRegex, `tableName: '${tableName}'`);
      fs.writeFileSync(filePath, content);
    } else {
      console.log(`⚠️  No se encontró tableName en ${modelName}`);
    }
  } else {
    console.log(`❌ Archivo no encontrado: ${filePath}`);
  }
});

console.log('✅ Actualización completa');