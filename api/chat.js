import { generatePortfolioReply, readJsonBody } from '../server/groqChat.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = await readJsonBody(req);
    const result = await generatePortfolioReply({
      message: body?.message,
      history: body?.history,
      env: process.env
    });
    return res.status(200).json(result);
  } catch (err) {
    const status = err?.status || 500;
    return res.status(status).json({ error: err?.message || 'Unable to generate reply' });
  }
}
