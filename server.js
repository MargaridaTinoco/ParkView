// ParkView — servidor que entrega o site e a API com os dados do TiDB Cloud.
// Arranque: npm start  (lê as credenciais de db/.env)

const express = require('express');
const mysql = require('mysql2/promise');

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const CACHE_MS = 10 * 60 * 1000; // os dados são de 2022, não mudam: 10 min de cache

const missing = ['TIDB_HOST', 'TIDB_USER', 'TIDB_PASSWORD'].filter((name) => !process.env[name]);
if (missing.length) {
  console.error(`Faltam variáveis em db/.env: ${missing.join(', ')}. Copia db/.env.example para db/.env.`);
  process.exit(1);
}

const pool = mysql.createPool({
  host: process.env.TIDB_HOST,
  port: Number(process.env.TIDB_PORT) || 4000,
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE || 'parkview',
  // O TiDB Cloud exige TLS; os certificados de raiz do Node chegam.
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
  connectionLimit: 5,
  decimalNumbers: true,
  dateStrings: true,
});

// --- consultas ---------------------------------------------------------------

// Só os 19 parques com perfil completo (P063 e P064 ficam fora do site).
const PARKS_SQL = `
  SELECT p.id_parque, p.nome, p.latitude, p.longitude,
         COALESCE(p.lugares_oficial, p.capacidade_mediana_dados) AS capacidade,
         COALESCE(v.freguesia, v.freguesia_lugares_proximos, 'Sem freguesia') AS freguesia,
         e.taxa_media, e.taxa_p90,
         c.cluster, c.perfil_procura
  FROM parques p
  LEFT JOIN parques_via_publica  v ON v.id_parque = p.id_parque
  LEFT JOIN parques_estatisticas e ON e.id_parque = p.id_parque
  LEFT JOIN parques_clusters     c ON c.id_parque = p.id_parque
  WHERE p.perfil_completo = 1
  ORDER BY p.nome`;

const PARK_MONTHS_SQL = `
  SELECT m.id_parque, m.mes, m.taxa_media
  FROM vw_ocupacao_mensal m
  JOIN parques p ON p.id_parque = m.id_parque
  WHERE p.perfil_completo = 1`;

// Média da cidade ponderada pela capacidade: lugares ocupados / lugares disponíveis.
const CITY_MONTHS_SQL = `
  SELECT MONTH(o.data_hora) AS mes,
         SUM(o.ocupacao_media) / SUM(o.capacidade_max) AS taxa
  FROM ocupacao_horaria o
  JOIN parques p ON p.id_parque = o.id_parque
  WHERE p.perfil_completo = 1 AND o.ocupacao_media IS NOT NULL
  GROUP BY MONTH(o.data_hora)`;

const PARK_INFO_SQL = `
  SELECT p.lugares_oficial, p.lugares_deficientes, p.horario_rotacao, p.horario_assinaturas,
         p.servico_cve, p.servico_via_verde, p.tipologia, p.modo_exploracao,
         t.tarifa_1h, t.tarifa_max,
         tr.metro_mais_proxima, tr.linha_metro, tr.dist_metro_m, tr.paragens_bus_300m
  FROM parques p
  LEFT JOIN parques_tarifas     t  ON t.id_parque  = p.id_parque
  LEFT JOIN parques_transportes tr ON tr.id_parque = p.id_parque
  WHERE p.id_parque = ? AND p.perfil_completo = 1`;

const pct = (value) => (value === null || value === undefined ? null : Math.round(value * 1000) / 10);
const bool = (value) => (value === null || value === undefined ? null : Boolean(value));

function monthlySeries(rows) {
  const series = Array(12).fill(null);
  rows.forEach((row) => { series[row.mes - 1] = pct(row.taxa_media ?? row.taxa); });
  return series;
}

let cache = { at: 0, data: null };

async function loadDashboardData() {
  if (cache.data && Date.now() - cache.at < CACHE_MS) return cache.data;

  const [[parkRows], [monthRows], [cityRows]] = await Promise.all([
    pool.query(PARKS_SQL),
    pool.query(PARK_MONTHS_SQL),
    pool.query(CITY_MONTHS_SQL),
  ]);

  const monthsByPark = new Map();
  monthRows.forEach((row) => {
    if (!monthsByPark.has(row.id_parque)) monthsByPark.set(row.id_parque, []);
    monthsByPark.get(row.id_parque).push(row);
  });

  const data = {
    year: 2022,
    parks: parkRows.map((row) => ({
      id: row.id_parque,
      name: row.nome,
      zone: row.freguesia,
      capacity: row.capacidade,
      occupancy: pct(row.taxa_media),
      peak: pct(row.taxa_p90),
      latitude: row.latitude,
      longitude: row.longitude,
      cluster: row.cluster,
      demandProfile: row.perfil_procura,
      monthly: monthlySeries(monthsByPark.get(row.id_parque) || []),
    })),
    cityMonthly: monthlySeries(cityRows),
  };

  cache = { at: Date.now(), data };
  return data;
}

// --- servidor -------------------------------------------------------------------

const app = express();
app.disable('x-powered-by');

app.get('/api/parks', async (req, res, next) => {
  try {
    res.json(await loadDashboardData());
  } catch (error) {
    next(error);
  }
});

app.get('/api/parks/:id/info', async (req, res, next) => {
  try {
    const [rows] = await pool.query(PARK_INFO_SQL, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Parque não encontrado.' });
    const r = rows[0];
    // No catálogo, "não aplicável" quer dizer que o parque não tem avenças.
    const hasSubscriptions = r.horario_assinaturas
      ? !/^n[ãa]o aplic/i.test(r.horario_assinaturas)
      : null;
    // As chaves seguem os campos que o painel "Informação do parque" (script.js) conhece.
    return res.json({
      total_spaces: r.lugares_oficial,
      reduced_mobility_spaces: r.lugares_deficientes,
      service_hours: r.horario_rotacao,
      subscription_hours: hasSubscriptions ? r.horario_assinaturas : null,
      first_hour_price: r.tarifa_1h,
      daily_max_price: r.tarifa_max,
      park_type: r.tipologia,
      operation_mode: r.modo_exploracao,
      subscriptions: hasSubscriptions,
      electric_charging: bool(r.servico_cve),
      via_verde_payment: bool(r.servico_via_verde),
      // Acima de 1,5 km o "metro mais próximo" não é útil (ex.: Belém → Rato a 5 km).
      nearest_metro: r.metro_mais_proxima && r.dist_metro_m <= 1500 ? `${r.metro_mais_proxima} (${r.linha_metro})` : null,
      nearest_metro_distance_m: r.dist_metro_m <= 1500 ? r.dist_metro_m : null,
      bus_stops_300m: r.paragens_bus_300m,
    });
  } catch (error) {
    return next(error);
  }
});

// Ficheiros do site. Nunca entregar a pasta db/ (credenciais), node_modules ou o código do servidor.
const PRIVATE = /^\/(db|node_modules|\.git|\.vscode)(\/|$)|^\/(server\.js|package(-lock)?\.json)$/i;
app.use((req, res, next) => (PRIVATE.test(req.path) ? res.status(404).end() : next()));
app.use(express.static(ROOT, { dotfiles: 'deny', index: 'index.html' }));

app.use((error, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(error);
  res.status(500).json({ error: 'Erro ao consultar a base de dados.' });
});

app.listen(PORT, () => {
  console.log(`ParkView em http://localhost:${PORT}`);
});
