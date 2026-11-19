// Servidor só para desenvolvimento local (no Vercel, a API corre em api/ como funções).
// Arranque: npm start  (lê as credenciais de db/.env) e abrir http://localhost:3000

const path = require('node:path');
const express = require('express');
const parksHandler = require('../api/parks/index');
const parkInfoHandler = require('../api/parks/[id]/info');

const PORT = Number(process.env.PORT) || 3000;
const ROOT = path.join(__dirname, '..');

const app = express();
app.disable('x-powered-by');

// As mesmas funções que o Vercel usa, para o comportamento local ser igual ao publicado.
app.get('/api/parks', (req, res) => parksHandler(req, res));
app.get('/api/parks/:id/info', (req, res) => parkInfoHandler({ query: { id: req.params.id } }, res));

// Ficheiros do site. Nunca entregar db/ (credenciais), node_modules nem o código do servidor.
const PRIVATE = /^\/(db|node_modules|scripts|lib|api|\.git|\.vscode|\.vercel)(\/|$)|^\/(package(-lock)?\.json|vercel\.json)$/i;
app.use((req, res, next) => (PRIVATE.test(req.path) ? res.status(404).end() : next()));
app.use(express.static(ROOT, { dotfiles: 'deny', index: 'index.html' }));

app.listen(PORT, () => {
  console.log(`ParkView em http://localhost:${PORT}`);
});
