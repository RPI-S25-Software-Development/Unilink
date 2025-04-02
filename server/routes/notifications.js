const express = require('express');
const pool = require('../db')
const router = express.Router();

// GET a notification by user id
router.get('/userId/:userId', async (req, res) => {
    try {
        const result = await pool.query("select * from unilink.notifcations where user_id=$1", [req.params.userId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET notifications by event id
router.get('/eventId/:eventId', async (req, res) => {
    try {
        const result = await pool.query("select * from unilink.notifcations where event_id=$1", [req.params.eventId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET notifications by notification id
router.get('/notificationId/:notificationId', async (req, res) => {
    try {
        const result = await pool.query("select * from unilink.notifcations where notification_id=$1", [req.params.notificationId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;