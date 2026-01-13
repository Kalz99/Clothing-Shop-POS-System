const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create Sale (Checkout)
router.post('/', async (req, res) => {
    const {
        customerName,
        customerMobile,
        items,
        subtotal,
        discount,
        total,
        paymentMethod,
        cashierName
    } = req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 0. Generate Sequential Invoice Number
        // Lock the table or use a separate counter table ideally, but for simple needs:
        // Get the last invoice number descending
        const [lastSale] = await connection.query('SELECT invoice_no FROM sales ORDER BY id DESC LIMIT 1');
        let nextInvoiceNo = 'INV000001';

        if (lastSale.length > 0) {
            const lastNo = lastSale[0].invoice_no;
            // distinct format check: INVxxxxxx
            if (lastNo.startsWith('INV')) {
                const numPart = parseInt(lastNo.replace('INV', ''), 10);
                if (!isNaN(numPart)) {
                    nextInvoiceNo = `INV${String(numPart + 1).padStart(6, '0')}`;
                }
            }
        }

        // 1. Handle Customer (Find or Create)
        let customerId = null;
        if (customerMobile) {
            const [custs] = await connection.query('SELECT id FROM customers WHERE phone = ?', [customerMobile]);
            if (custs.length > 0) {
                customerId = custs[0].id;
                // Optional: Update name if changed?
            } else {
                const [newCust] = await connection.query(
                    'INSERT INTO customers (name, phone) VALUES (?, ?)',
                    [customerName, customerMobile]
                );
                customerId = newCust.insertId;
            }
        }

        // 2. Resolve User ID (Cashier)
        let userId = null;
        if (cashierName) {
            const [users] = await connection.query('SELECT id FROM users WHERE username = ?', [cashierName]);
            if (users.length > 0) userId = users[0].id;
        }

        // 3. Insert Sale
        const [saleResult] = await connection.query(
            `INSERT INTO sales 
            (invoice_no, user_id, customer_id, subtotal, discount, total, payment_method) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nextInvoiceNo, userId, customerId, subtotal, discount, total, paymentMethod]
        );
        const saleId = saleResult.insertId;

        // 4. Insert Sale Items & Update Stock
        for (const item of items) {
            // Insert item
            await connection.query(
                `INSERT INTO sale_items 
                (sale_id, product_id, product_name, unit_price, qty, line_total) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [saleId, parseInt(item.id), item.name, item.price, item.quantity, item.price * item.quantity]
            );

            // Update Stock
            await connection.query(
                `UPDATE products SET stock_qty = stock_qty - ? WHERE id = ?`,
                [item.quantity, parseInt(item.id)]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Sale recorded', saleId, invoiceNo: nextInvoiceNo });

    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ message: 'Transaction failed' });
    } finally {
        connection.release();
    }
});

// Get Sales History
router.get('/', async (req, res) => {
    try {
        const [sales] = await db.query(`
            SELECT s.*, c.name as customer_name, c.phone as customer_phone, u.username as cashier_name 
            FROM sales s 
            LEFT JOIN customers c ON s.customer_id = c.id
            LEFT JOIN users u ON s.user_id = u.id
            ORDER BY s.created_at DESC
        `);

        // We also need items for each sale to fully reconstruct the Invoice object
        // This is N+1 if we loop, or we can fetch all items and map.
        // For a simple list, we might not need items.
        // BUT the Invoices page "Reciept" viewing needs items.

        // Let's just return basic info for list, and create a detail endpoint?
        // Or for simplicity, fetch items for the top 50 sales?

        // Better: Fetch items in a second query
        const [items] = await db.query('SELECT * FROM sale_items WHERE sale_id IN (?)', [sales.map(s => s.id).concat(0)]); // concat 0 to handle empty list

        const salesWithItems = sales.map(s => {
            const saleItems = items.filter(i => i.sale_id === s.id).map(i => ({
                id: i.product_id.toString(), // casting for frontend compatibility
                name: i.product_name,
                price: Number(i.unit_price),
                quantity: i.qty,
                // reconstruction
                barcode: '', // not stored in sale_items, maybe query product? relevant for receipt?
                stock: 0
            }));

            return {
                id: s.id.toString(),
                invoiceNo: s.invoice_no,
                date: s.created_at,
                customerName: s.customer_name || 'Walk-in',
                customerMobile: s.customer_phone || '',
                items: saleItems,
                subtotal: Number(s.subtotal),
                discount: Number(s.discount),
                total: Number(s.total),
                paymentMethod: s.payment_method,
                cashierName: s.cashier_name || 'Unknown'
            };
        });

        res.json(salesWithItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
