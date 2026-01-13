const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories ORDER BY name');
        // Map to string array as expected by some frontend parts, or object array
        // Frontend uses ['all', ...Set(products.map)] mostly, but CategoryContext might need objects
        // Let's return objects
        res.json(categories.map(c => ({ id: c.id.toString(), name: c.name })));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [req.body.name]);
        res.status(201).json({ id: result.insertId.toString(), name: req.body.name });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        await db.query('UPDATE categories SET name = ? WHERE id = ?', [req.body.name, req.params.id]);
        res.json({ message: 'Updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
