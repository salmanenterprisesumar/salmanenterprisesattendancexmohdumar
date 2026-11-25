import { connectToDatabase } from './_db.js';

const DOC_ID = 'main_erp_state';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('erp_state');

    if (req.method === 'GET') {
      const doc = await collection.findOne({ _id: DOC_ID });
      return res.status(200).json({
        state: doc ? doc.data : null,
        updatedAt: doc ? doc.updatedAt : null
      });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const nextState = body && body.state;

      if (!nextState || typeof nextState !== 'object') {
        return res.status(400).json({ ok: false, error: 'Invalid state payload' });
      }

      const now = new Date().toISOString();
      await collection.updateOne(
        { _id: DOC_ID },
        {
          $set: {
            _id: DOC_ID,
            data: nextState,
            updatedAt: now
          }
        },
        { upsert: true }
      );

      return res.status(200).json({ ok: true, updatedAt: now });
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
