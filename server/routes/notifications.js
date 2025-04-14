const express = require('express');
const pool = require('../db')
const router = express.Router();

// Generate notifications for the given user which should be sent in the next 24 hours
router.get('/userId/:userId', async (req, res) => {
    // Fetch user information
    try {
        const query = `SELECT DISTINCT
            e.event_id,
            e.title,
            e.event_description,
            e.poster_path,
            e.event_location,
            e.event_time,
            e.organization_id,
            o.organization_name
        FROM unilink.events e
        JOIN unilink.organizations o ON e.organization_id = o.organization_id
        LEFT JOIN unilink.rsvps r ON e.event_id = r.event_id AND r.user_id = '${req.params.userId}'
        LEFT JOIN unilink.likes l ON e.event_id = l.event_id AND l.user_id = '${req.params.userId}'
        WHERE e.event_time >= NOW() AND e.event_time <= NOW() + INTERVAL '2 days'`;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;