// Vercel Function: GET /api/parks — parques, ocupação mensal e média da cidade.
const { getDashboardData } = require('../../lib/parkview-data');

module.exports = async function handler(req, res) {
  try {
    const data = await getDashboardData();
    // Dados históricos: a CDN do Vercel guarda a resposta e poupa pedidos ao TiDB.
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao consultar a base de dados.' });
  }
};
