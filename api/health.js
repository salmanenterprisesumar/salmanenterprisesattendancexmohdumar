import { connectToDatabase } from './_db.js';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    await db.command({ ping: 1 });
    return res.status(200).json({ ok: true, message: 'MongoDB Atlas connected' });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
