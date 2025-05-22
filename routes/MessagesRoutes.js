import express from 'express';
import pool from '../utils/dblogin.js';

const router = express.Router();

// Create a new message
router.post('/messages', async (req, res) => {
  const { channel_id, user_id,  content } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO messages (channel_id, user_id,  content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [channel_id, user_id, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all messages
router.get('/messages', async (req, res) => {
  const { user_id, channel_id } = req.query;

  let query = 'SELECT * FROM messages WHERE 1=1';
  let params = [];
  let paramIndex = 1;

  if (user_id) {
    query += `AND user_id = $${paramIndex})`;
    params.push(user_id);
    paramIndex++;
  }

  if (channel_id) {
    query += ` AND channel_id = $${paramIndex}`;
    params.push(channel_id);
    paramIndex++;
  }

  query += ' ORDER BY sent_at ASC';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get message by id
router.get('/messages/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Message not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a message
router.delete('/messages/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM messages WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Message deleted', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;