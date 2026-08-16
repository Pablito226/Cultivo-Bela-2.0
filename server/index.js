const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');
const PORT = process.env.PORT || 3000;
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'changeme';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) return {};
    const content = fs.readFileSync(DATA_FILE, 'utf8');
    return content ? JSON.parse(content) : {};
  } catch (err) {
    console.error('Error leyendo data.json', err);
    return {};
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error escribiendo data.json', err);
    throw err;
  }
}

// Login sencillo: compara con ADMIN_USER / ADMIN_PASS y devuelve JWT
app.post('/api/login', (req, res) => {
  const { user, pass } = req.body || {};
  if (!user || !pass) return res.status(400).json({ error: 'user and pass required' });

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'authorization header missing' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'invalid authorization header' });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
}

// Endpoint público para obtener los datos (puede ajustarse si querés que sea privado)
app.get('/api/data', (req, res) => {
  const data = loadData();
  return res.json(data);
});

// Endpoint protegido para guardar los datos (espera un JSON completo)
app.post('/api/save', authMiddleware, (req, res) => {
  const payload = req.body;
  if (typeof payload !== 'object') return res.status(400).json({ error: 'invalid body' });
  try {
    saveData(payload);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'could not save data', details: err.message });
  }
});

// Servimos archivos estáticos del directorio padre (tu index.html está en la raíz del repo)
app.use(express.static(path.join(__dirname, '..')));

app.listen(PORT, () => {
  console.log(`Cultivo server listening on port ${PORT}`);
});
