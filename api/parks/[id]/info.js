// Vercel Function: GET /api/parks/:id/info — informação detalhada de um parque.
const { getParkInfo } = require('../../../lib/parkview-data');

module.exports = async function handler(req, res) {
  try {
    const info = await getParkInfo(req.query.id);
    if (!info) {
      res.status(404).json({ error: 'Parque não encontrado.' });
      return;
    }
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json(info);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao consultar a base de dados.' });
  }
};
