const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all products
router.get('/', async (req, res) => {
    try {
        const [products] = await db.query(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC
        `);


        const mapped = products.map(p => ({
            id: p.id.toString(),
            barcode: p.barcode,
            name: p.name,
            price: Number(p.selling_price),
            costPrice: Number(p.cost_price),
            category: p.category_name || 'Uncategorized',
            stock: p.stock_qty,
            brand: p.brand,
            size: p.size,
            color: p.color,
            createdAt: p.created_at
        }));

        res.json(mapped);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add product
router.post('/', async (req, res) => {
    const { barcode, name, category, size, brand, color, costPrice, price, stock } = req.body;

    try {
        // First find category_id
        // If category doesn't exist, maybe create it or error? 
        // For simple POS, let's assume category exists or selected from list.
        // But the frontend sends "category name". We need to resolve ID or insert it.

        let categoryId = null;
        if (category) {
            const [cats] = await db.query('SELECT id FROM categories WHERE name = ?', [category]);
            if (cats.length > 0) {
                categoryId = cats[0].id;
            } else {
                const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [category]);
                categoryId = result.insertId;
            }
        }

        const [result] = await db.query(
            `INSERT INTO products 
            (barcode, name, category_id, size, brand, color, cost_price, selling_price, stock_qty) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [barcode, name, categoryId, size, brand, color, costPrice, price, stock]
        );

        res.status(201).json({ id: result.insertId.toString(), ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating product' });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    const { barcode, name, category, size, brand, color, costPrice, price, stock } = req.body;
    const pid = req.params.id;

    try {
        let categoryId = null;
        if (category) {
            const [cats] = await db.query('SELECT id FROM categories WHERE name = ?', [category]);
            if (cats.length > 0) {
                categoryId = cats[0].id;
            } else {
                const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [category]);
                categoryId = result.insertId;
            }
        }

        await db.query(
            `UPDATE products SET 
            barcode=?, name=?, category_id=?, size=?, brand=?, color=?, 
            cost_price=?, selling_price=?, stock_qty=? 
            WHERE id=?`,
            [barcode, name, categoryId, size, brand, color, costPrice, price, stock, pid]
        );

        res.json({ message: 'Updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating product' });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting product' });
    }
});

module.exports = router;
