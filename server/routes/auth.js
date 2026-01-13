const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Login
router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Simple plain text password check as per user request (in real app usage bcrypt)
        // Adjusting query to check both username and password directly as per previous simple implementation
        const [users] = await db.query(
            'SELECT * FROM users WHERE username = ? AND password = ? AND role = ?',
            [username, password, role]
        );

        if (users.length > 0) {
            const user = users[0];
            res.json({
                user: {
                    id: user.id,
                    name: user.username,
                    role: user.role
                },
                token: 'dummy-token' // In real app use JWT
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
