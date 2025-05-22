  import express from 'express';
  import pool from '../utils/dblogin.js';

  const router = express.Router();

  // Create a new POI (Place of Interest)
  router.post('/pois', async (req, res) => {
    const { name, category, address, latitude, longitude } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO pois (name, category, address, latitude, longitude) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, category, address, latitude, longitude]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create POI' });
    }
  });

  // Get all POIs with optional filters
  router.get('/pois', async (req, res) => {
    const { name, category, longitude, latitude } = req.query;

    let query = 'SELECT * FROM pois';
    const conditions = [];
    const values = [];

    if (name) {
      values.push(`%${name}%`);
      conditions.push(`name ILIKE $${values.length}`);
    }

    if (category) {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }

    if (longitude) {
      values.push(parseFloat(longitude));
      conditions.push(`longitude = $${values.length}`);
    }

    if (latitude) {
      values.push(parseFloat(latitude));
      conditions.push(`latitude = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    try {
      const result = await pool.query(query, values);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch POIs' });
    }
  });


  // Get a POI by ID
  router.get('/pois/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM pois WHERE id = $1', [id]);
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ error: 'POI not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch POI' });
    }
  });

  // Update a POI by ID
  router.put('/pois/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, address, latitude, longitude } = req.body;
    try {
      const result = await pool.query(
        'UPDATE pois SET name = $1, category = $2, address = $3, latitude = $4, longitude = $5 WHERE id = $6 RETURNING *',
        [name, category, address, latitude, longitude, id]
      );
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ error: 'POI not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update POI' });
    }
  });

  //verify
  router.put('/pois/verify/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        'UPDATE pois SET verified = TRUE WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ error: 'POI not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update POI' });
    }
  });

  // Delete a POI by ID
  router.delete('/pois/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM pois WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length > 0) {
        res.status(200).json({ message: 'POI deleted successfully' });
      } else {
        res.status(404).json({ error: 'POI not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete POI' });
    }
  });

  // calculating distance
  router.put('/calculate', async (req, res) => {
    const { latitude, longitude } = req.body;
    try {
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to calculate' });
    }
  });

  export default router;