const express = require('express');
const pool = require('../db')
const router = express.Router();

// Generate notifications for the given user which should be sent in the next 24 hours
router.get('/userId/:userId', async (req, res) => {
    // Fetch user information
    const userNameQuery = await pool.query(`select user_name from unilink.users where user_id='${req.params.userId}'`);
    for (const row of userNameQuery.rows) {
        const user_name = row['user_name'];
        // check rsvps to retrieve users signed up for this event
        const result5 = await pool.query(`select user_id from unilink.rsvps where event_id='${event_id} and still_valid='${true}`);
        for (const user_id of result5.rows) {
            // Create and send event notification
            // Post notification entry to db?
        }
    }
    try {
        const result = await pool.query("select * from unilink.notifcations where user_id=$1", [req.params.userId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;