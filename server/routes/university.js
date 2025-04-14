const express = require('express');
const crypto = require('crypto');
const pool = require('../db')
const router = express.Router();

// GET all universities
router.get('/', async (req, res) => {
    try {
        const result = await pool.query("select * from unilink.universities");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching universities:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all universities by id
router.get('/universityId/:universityId', async (req, res) => {
    try {
        const result = await pool.query(`select * from unilink.universities where university_id='${req.params.universityId}'`);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching universities:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all universities by name
router.get('/universityName/:universityName', async (req, res) => {
    try {
        const result = await pool.query(`select * from unilink.universities where university_name='${req.params.universityName}'`);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching universities:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// CREATE A NEW UNIVERSITY
router.post('/', async (req, res) => {
    // Generate random UUID
    const university_id = crypto.randomUUID();
    // Pull params from request body
    try {
        const university_name = req.params['university_name'];

        const query = `insert into unilink.universities(university_id, university_name)
            VALUES($1, $2)`;
        try {
            const result = await pool.query(query, [university_id, university_name]);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error("Error fetching universities:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }

    } catch (error) {
        console.error("Error retrieving params:", error);
        res.status(417).json({ error: "Request body incorrect/missing expected parameters" });
    }
});

// EDIT AN EXISTING UNIVERSITY
router.put('/universityId/:universityId', async (req, res) => {
    // Pull params from request body
    try {
        const university_name = req.params['university_name'];

        const query = `update unilink.universities set university_name=$1 where university_id=$2`;
        try {
            const result = await pool.query(query, [university_name, req.params.universityId]);
            res.json(result.rows[0]);
        } catch (error) {
            console.error("Error fetching universities:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }

    } catch (error) {
        console.error("Error retrieving params:", error);
        res.status(417).json({ error: "Request body incorrect/missing expected parameters" });
    }
});

// DELETE AN EXISTING UNIVERSITY
router.delete('/universityId/:universityId', async (req, res) => {
    const query = `delete from unilink.universities where user_id=$1`;
    try {
        const result = await pool.query(query, [req.params.universityId]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;