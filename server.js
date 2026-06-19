const express = require('express');
const Database = require('better-sqlite3');
const app = express();
const db = new Database('ventas.db');

app.get('/', (req, res) => {
  const ventas = db.prepare('SELECT * FROM ventas').all();

  const filas = ventas.map(v => `
    <tr>
      <td>${v.producto}</td>
      <td>${v.cantidad}</td>
      <td>$${v.precio}</td>
      <td>${v.fecha}</td>
    </tr>
  `).join('');

  res.send(`
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Ventas del dia</title>
        <style>
          body { font-family: sans-serif; padding: 2rem; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; }
          th { background: #f4f4f4; }
        </style>
      </head>
      <body>
        <h1>Ventas del dia</h1>
        <table>
          <tr>
            <th>Producto</th><th>Cantidad</th><th>Precio</th><th>Fecha</th>
          </tr>
          ${filas}
        </table>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
