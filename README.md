# sistema-ventas

Sistema de ventas completo construido para demostrar el stack de desarrollo de una empresa real.

---

## ¿Qué hace este proyecto?

Simula un sistema empresarial con backend, frontend, datos en tiempo real y configuración de deploy. Cada pieza del proyecto cubre una tecnología del stack real del equipo.

---

## Estructura

```
sistema-ventas/
├── server.js        → API REST en Node.js + Express + SQLite
├── datos.js         → Script que crea y llena la base de datos
├── main.py          → Segunda API en Python con FastAPI + Bearer token
├── sensor.html      → Demo de WebSockets en tiempo real
├── .htaccess        → Configuración de deploy para Apache
└── frontend/        → Interfaz visual en Vue 3 + Quasar
```

---

## Tecnologías

| Capa | Tecnología | Para qué sirve |
|---|---|---|
| Backend JS | Node.js + Express | Servidor HTTP, rutas, API REST |
| Base de datos | SQLite (better-sqlite3) | Almacena las ventas |
| Backend Python | FastAPI + Uvicorn | Segunda API con autenticación |
| Tiempo real | WebSockets (ws) | Datos en vivo sin recargar página |
| Export | ExcelJS + PDFKit | Descarga de reportes .xlsx y .pdf |
| Frontend | Vue 3 + Quasar | Interfaz con tabla y gráfica |
| Gráficas | Apache ECharts | Visualización de datos |
| Idiomas | Vue I18n | Multiidioma español / inglés |
| Deploy | Apache + .htaccess | Proxy reverso hacia Node.js |

---

## Cómo correr el proyecto

### Backend Node.js

```bash
# Instalar dependencias
npm install

# Crear base de datos con datos de ejemplo
node datos.js

# Iniciar servidor
node server.js
```

Servidor en: `http://localhost:3000`

### Backend FastAPI

```bash
# Instalar dependencias
pip install fastapi uvicorn

# Iniciar servidor
uvicorn main:app --reload --port 8000
```

API en: `http://localhost:8000`

### Frontend Quasar

```bash
cd frontend
npm install
quasar dev
```

Interfaz en: `http://localhost:9000`

---

## Endpoints Node.js

| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/ventas | Obtener todas las ventas |
| GET | /api/ventas/:id | Obtener una venta por ID |
| POST | /api/ventas | Crear una venta |
| PUT | /api/ventas/:id | Actualizar una venta |
| DELETE | /api/ventas/:id | Eliminar una venta |
| GET | /api/ventas/export | Descargar Excel |
| GET | /api/ventas/pdf | Descargar PDF |

---

## Endpoints FastAPI

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | / | No | Status de la API |
| GET | /ventas | Bearer token | Obtener ventas |
| POST | /ventas | Bearer token | Crear venta |

Ejemplo con token:

```bash
curl http://localhost:8000/ventas -H "Authorization: Bearer mi-token-secreto"
```

Sin token devuelve `401 Not authenticated`.

---

## WebSockets

Abre `sensor.html` en el navegador con el servidor corriendo. Muestra datos llegando cada segundo simulando un lector de hardware (QR, biométrico, Raspberry Pi).

Flujo:

```
Servidor Node.js → WebSocket → Navegador en tiempo real
```

---

## Deploy con Apache

El archivo `.htaccess` configura Apache como proxy reverso — redirige el tráfico del puerto 80 hacia Node.js en el puerto 3000. Es el mismo flujo que se usa en servidores Linux y cPanel.

```
Usuario → puerto 80 → Apache → puerto 3000 → Node.js
```

---

## Frontend

La interfaz en `frontend/` muestra:

- Tabla de ventas con datos de la API (QTable de Quasar)
- Gráfica de barras por producto (Apache ECharts)
- Botón para cambiar entre español e inglés (Vue I18n)

---

## Autor

Alexis Dehesa — Data Engineer  
Proyecto construido para demostrar dominio del stack: Node.js, FastAPI, Vue 3, Quasar, WebSockets, Apache.