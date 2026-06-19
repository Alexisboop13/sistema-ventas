const Database = require('better-sqlite3');
const db = new Database('ventas.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS ventas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto TEXT,
    cantidad INTEGER,
    precio REAL,
    fecha TEXT
  )
`);

const insertar = db.prepare(`
  INSERT INTO ventas (producto, cantidad, precio, fecha) VALUES (?, ?, ?, ?)
`);

insertar.run('Limpieza dental', 3, 850, '2026-06-08');
insertar.run('Consulta general', 5, 500, '2026-06-08');
insertar.run('Extraccion', 2, 1200, '2026-06-08');
insertar.run('Ortodoncia', 1, 3500, '2026-06-08');

console.log('Base de datos creada con ventas de ejemplo');
