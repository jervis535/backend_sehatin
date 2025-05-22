import express from 'express';
import pool from '../utils/dblogin.js';

const router = express.Router();

// Create a new channel
router.post('/channels', async (req, res) => {
  const { user_id0, user_id1 } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO channels (user_id0, user_id1)
       VALUES ($1, $2)
       RETURNING *`,
      [user_id0, user_id1]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all channels
router.get('/channels', async (req, res) => {
  const userId = parseInt(req.query.user_id, 10); // Get user_id from query string

  try {
    let result;

    if (!isNaN(userId)) {
      // Search channels by user_id
      result = await pool.query(
        `SELECT * FROM channels WHERE user_id0 = $1 OR user_id1 = $1`,
        [userId]
      );
    } else {
      // Return all channels if no user_id provided
      result = await pool.query('SELECT * FROM channels');
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No channels found' });
    }

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete a channel
router.delete('/channels/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM channels WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Channel not found' });
    res.json({ message: 'Channel deleted', channel: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
