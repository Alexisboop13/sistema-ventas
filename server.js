const express = require('express');
const Database = require('better-sqlite3');

const app = express();
const cors = require('cors');
app.use(cors());
const db = new Database('ventas.db');

app.use(express.json());

// ==========================================
// ENDPOINTS DE LA API (ORDEN CORRECTO)
// ==========================================

// 1. GET /api/ventas - Obtener todas las ventas
app.get('/api/ventas', (req, res) => {
  try {
    const ventas = db.prepare('SELECT * FROM ventas ORDER BY id DESC').all();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las ventas' });
  }
});

// 2. GET /api/ventas/export - Exportar a Excel (DEBE IR ANTES DEL /:id)
app.get('/api/ventas/export', (req, res) => {
  try {
    const ExcelJS = require('exceljs');
    const ventas = db.prepare('SELECT * FROM ventas ORDER BY id DESC').all();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventas');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Producto', key: 'producto', width: 30 },
      { header: 'Cantidad', key: 'cantidad', width: 15 },
      { header: 'Precio', key: 'precio', width: 15 },
      { header: 'Fecha', key: 'fecha', width: 20 }
    ];

    ventas.forEach(v => {
      worksheet.addRow(v);
    });

    worksheet.getRow(1).font = { bold: true };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=ventas.xlsx');

    workbook.xlsx.write(res).then(() => {
      res.end();
    });

  } catch (error) {
    console.error('Error al exportar:', error);
    res.status(500).json({ error: 'Error al generar el archivo Excel' });
  }
});
// GET /api/ventas/pdf - Exportar a PDF
app.get('/api/ventas/pdf', (req, res) => {
  const PDFDocument = require('pdfkit')
  const ventas = db.prepare('SELECT * FROM ventas ORDER BY id DESC').all()

  const doc = new PDFDocument()
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'attachment; filename=ventas.pdf')
  doc.pipe(res)

  doc.fontSize(20).text('Reporte de Ventas', { align: 'center' })
  doc.moveDown()

  ventas.forEach(v => {
    doc.fontSize(12).text(`${v.producto} — Cantidad: ${v.cantidad} — $${v.precio} — ${v.fecha}`)
    doc.moveDown(0.5)
  })

  doc.end()
})
// 3. GET /api/ventas/:id - Obtener una venta por ID (DEBE IR DESPUÉS DEL /export)
app.get('/api/ventas/:id', (req, res) => {
  try {
    const id = req.params.id;
    const venta = db.prepare('SELECT * FROM ventas WHERE id = ?').get(id);
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    res.json(venta);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la venta' });
  }
});

// 4. POST /api/ventas - Crear una nueva venta
app.post('/api/ventas', (req, res) => {
  try {
    const { producto, cantidad, precio, fecha } = req.body;
    if (!producto || !cantidad || !precio || !fecha) {
      return res.status(400).json({
        error: 'Faltan campos: producto, cantidad, precio y fecha son requeridos'
      });
    }
    const insert = db.prepare('INSERT INTO ventas (producto, cantidad, precio, fecha) VALUES (?, ?, ?, ?)');
    const result = insert.run(producto, cantidad, precio, fecha);
    res.status(201).json({
      mensaje: 'Venta creada exitosamente',
      id: result.lastInsertRowid
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la venta' });
  }
});

// 5. PUT /api/ventas/:id - Actualizar una venta existente
app.put('/api/ventas/:id', (req, res) => {
  try {
    const id = req.params.id;
    const { producto, cantidad, precio, fecha } = req.body;
    const existe = db.prepare('SELECT id FROM ventas WHERE id = ?').get(id);
    if (!existe) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    if (!producto || !cantidad || !precio || !fecha) {
      return res.status(400).json({
        error: 'Faltan campos: producto, cantidad, precio y fecha son requeridos'
      });
    }
    const update = db.prepare('UPDATE ventas SET producto = ?, cantidad = ?, precio = ?, fecha = ? WHERE id = ?');
    update.run(producto, cantidad, precio, fecha, id);
    res.json({ mensaje: 'Venta actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la venta' });
  }
});

// 6. DELETE /api/ventas/:id - Eliminar una venta
app.delete('/api/ventas/:id', (req, res) => {
  try {
    const id = req.params.id;
    const existe = db.prepare('SELECT id FROM ventas WHERE id = ?').get(id);
    if (!existe) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    const deleteVenta = db.prepare('DELETE FROM ventas WHERE id = ?');
    deleteVenta.run(id);
    res.json({ mensaje: 'Venta eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la venta' });
  }
});

// ==========================================
// FRONTEND
// ==========================================
app.get('/', (req, res) => {
  const ventas = db.prepare('SELECT * FROM ventas ORDER BY id DESC').all();
  let filas = '';
  for (let i = 0; i < ventas.length; i++) {
    const v = ventas[i];
    filas += '<tr><td>' + v.producto + '</td><td>' + v.cantidad + '</td><td>$' + v.precio + '</td><td>' + v.fecha + '</td></tr>';
  }
  res.send('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Ventas del dia</title><style>body{font-family:sans-serif;padding:2rem;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #ccc;padding:8px 12px;text-align:left;}th{background:#f4f4f4;}</style></head><body><h1>Ventas del dia</h1><table><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Fecha</th></tr>' + filas + '</table></body></html>');
});


// ==========================================
// WEBSOCKET — SENSOR EN TIEMPO REAL
// ==========================================
const { WebSocketServer } = require('ws');
const http = require('http');

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (socket) => {
  console.log('Cliente conectado por WebSocket');

  socket.send(JSON.stringify({ tipo: 'saludo', mensaje: 'Conectado al sensor' }));

  const intervalo = setInterval(() => {
    const dato = {
      tipo: 'sensor',
      valor: Math.floor(Math.random() * 100),
      timestamp: new Date().toISOString()
    };
    socket.send(JSON.stringify(dato));
  }, 1000);

  socket.on('close', () => {
    clearInterval(intervalo);
    console.log('Cliente desconectado');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
  console.log('API de ventas en http://localhost:' + PORT + '/api/ventas');
  console.log('WebSocket activo en ws://localhost:' + PORT);
});