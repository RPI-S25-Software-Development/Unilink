require('dotenv').config();
const express = require('express');
const crypto = require("crypto");
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

//USER SIGNUP
router.post("/usersignup", async (req, res) => {
    //generate random UUID
    const user_id = crypto.randomUUID();
    try {
        if (!req.body) {
            return res.status(400).json({ error: "Request body is missing" });
        }
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO unilink.users (user_id, email, password) VALUES ($1, $2, $3) RETURNING user_id;`;

        try {
            const result = await pool.query(query, [user_id, email, hashedPassword]);
            const access_token = jwt.sign({ id: user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.status(201).json({ message: "User registered successfully", access_token });
        } catch (error) {
            console.error("Error creating user:", error);
            if (error.code === "23505") {
                return res.status(400).json({ error: "Email already exists" });
            }

            res.status(500).json({ error: "Internal Server Error" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//ADMIN SIGNUP
// router.post('/adminsignup', async (req, res) => {
    
//     try {
//         const { email, password } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const connection = await pool.getConnection();
//         await connection.execute(
//             'INSERT INTO unilink.users (email, password, role_type) VALUES (?, ?)',
//             [email, hashedPassword, 'admin']
//         );
//         connection.release();

//         res.status(201).json({ message: 'Admin registered successfully' });
//     } catch (error) {
//         if (error.code === 'ER_DUP_ENTRY') {
//             res.status(400).json({ error: 'Email already exists' });
//         } else {
//             res.status(500).json({ error: error.message });
//         }
//     }
// });

//ORGANIZATION SIGNUP
// router.post('/orgsignup', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const connection = await pool.getConnection();
//         await connection.execute(
//             'INSERT INTO unilink.organizations (email, password) VALUES (?, ?)',
//             [email, hashedPassword]
//         );
//         connection.release();

//         res.status(201).json({ message: 'Organization registered successfully' });
//     } catch (error) {
//         if (error.code === 'ER_DUP_ENTRY') {
//             res.status(400).json({ error: 'Email already exists' });
//         } else {
//             res.status(500).json({ error: error.message });
//         }
//     }
// });

//USER AND ADMIN LOGIN
router.post("/login", async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: "Request body is missing" });
        }
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const query = `SELECT user_id, password FROM unilink.users WHERE email = $1;`;
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const access_token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", access_token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//ORGANIZATION LOGIN
// router.post('/orglogin', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

//         const connection = await pool.getConnection();
//         const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
//         connection.release();

//         if (rows.length === 0) return res.status(400).json({ error: 'Invalid email/password' });

//         const user = rows[0];
//         const valid = await bcrypt.compare(password, user.password);
//         if (!valid) return res.status(400).json({ error: 'Invalid email/password' });

//         const access_token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.status(200).json({ access_token });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });



module.exports = router;