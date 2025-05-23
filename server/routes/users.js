const express = require('express');
const crypto = require('crypto');
const pool = require('../db')
const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
    try {
        const result = await pool.query("select * from unilink.users");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET user data associated with a specfic user id
router.get('/userId/:userId', async (req, res) => {
    try {
        const result = await pool.query(`select * from unilink.users where user_id='${req.params.userId}'`);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// CREATE A NEW USER
router.post('/', async (req, res) => {
    // Generate random UUID
    const user_id = crypto.randomUUID();
    // Pull params from request body
    try {
        const user_name = req.body['user_name'];
        const user_type = req.body['user_type'];
        const university_id = req.body['university_id'];
        const login_type = req.body['login_type'];
        const rec_frequency = req.body['rec_frequency'];
        const notifications = req.body['notifications']==='true';
        const created_at = new Date(req.body['created_at']);
        const email = req.body['email'];
        const password = req.body['password'];

        const query = `insert into unilink.users(user_id, user_name, user_type, university_id, login_type,
            rec_frequency, notifications, created_at, email, password) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
        try {
            const result = await pool.query(query, [user_id, user_name, user_type, university_id,
                login_type, rec_frequency, notifications, created_at, email, password]);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }

    } catch (error) {
        console.error("Error retrieving params:", error);
        res.status(417).json({ error: "Request body incorrect/missing expected parameters" });
    }
});

// EDIT AN EXISTING USER
router.put('/userId/:userId', async (req, res) => {
    // Pull params from request body
    try {
        const user_name = req.body['user_name'];
        const user_type = req.body['user_type'];
        const university_id = req.body['university_id'];
        const login_type = req.body['login_type'];
        const rec_frequency = req.body['rec_frequency'];
        const notifications = req.body['notifications']==='true';
        const created_at = new Date(req.body['created_at']);
        const email = req.body['email'];
        const password = req.body['password'];

        const query = `update unilink.users set user_name=$1, user_type=$2, university_id=$3,
        login_type=$4, rec_frequency=$5, notifications=$6, created_at=$7, email=$8, password=$9 where user_id=$10`;
        try {
            const result = await pool.query(query, [user_name, user_type, university_id, login_type,
                rec_frequency, notifications, created_at, email, password, req.params.userId]);
            res.json(result.rows[0]);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }

    } catch (error) {
        console.error("Error retrieving params:", error);
        res.status(417).json({ error: "Request body incorrect/missing expected parameters" });
    }
});

// DELETE AN EXISTING USER
// Then mark the corresponding rsvps associated with the user invalid
router.delete('/userId/:userId', async (req, res) => {
    const query = `delete from unilink.users where user_id=$1`;
    const query2 = `update unilink.rsvps set still_valid=$1 where user_id=$2`;
    try {
        const result = await pool.query(query, [req.params.userId]);
        const result2 = await pool.query(query2, [false, req.params.userId]);
        res.json(result2.rows[0]);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;