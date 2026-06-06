// Script simple para visualizar la base de datos SQLite
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error abriendo la base de datos:', err.message);
    return;
  }
  console.log('✅ Conectado a la base de datos SQLite\n');
});

// Función para mostrar tablas
function showTables() {
  return new Promise((resolve, reject) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      console.log('📊 Tablas en la base de datos:');
      rows.forEach(row => console.log(`  - ${row.name}`));
      console.log('');
      resolve(rows);
    });
  });
}

// Función para mostrar datos de una tabla
function showTableData(tableName) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      console.log(`\n📋 Datos de la tabla: ${tableName}`);
      console.log('─'.repeat(60));
      if (rows.length === 0) {
        console.log('  (vacía)');
      } else {
        console.log(JSON.stringify(rows, null, 2));
      }
      console.log(`\nTotal: ${rows.length} registros\n`);
      resolve(rows);
    });
  });
}

// Función principal
async function main() {
  try {
    await showTables();
    
    // Mostrar datos de cada tabla
    await showTableData('users');
    await showTableData('forms');
    await showTableData('user_responses');
    await showTableData('user_progress');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    db.close((err) => {
      if (err) {
        console.error('Error cerrando la base de datos:', err.message);
      } else {
        console.log('\n✅ Conexión cerrada');
      }
    });
  }
}

main();
