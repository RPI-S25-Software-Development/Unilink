const express = require('express');
const pool = require('../db')
const router = express.Router();

// GET all tags
router.get('/', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM unilink.tags");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching tags:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET tags by classification
router.get('/classification/:classification/', async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM unilink.tags WHERE classification='${req.params.classification}'`);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching tags:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;