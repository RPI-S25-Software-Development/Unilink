const express = require('express');
const crypto = require("crypto");
const pool = require('../db')
const router = express.Router();

// GET all rsvps for a specific event
router.get('/eventId/:eventId', async (req, res) => {
    try {
        const result = await pool.query("select * from unilink.rsvps where event_id=$1", [req.params.eventId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching rsvps:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all rsvps for a specific user
router.get('/userId/:userId', async (req, res) => {
    try {
        const result = await pool.query("select * from unilink.rsvps where user_id=$1", [req.params.userId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching rsvps:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// CREATE a new rsvp
router.post('/', async (req, res) => {
    // Generate random UUID
    const rsvp_id = crypto.randomUUID();
    // Pull params from request body
    try {
        const user_id = req.body['user_id'];
        const event_id = req.body['event_id'];

        try {
            // Check to see if a rsvp exists for that event_id and user_id
            const check_query = `select * from unilink.rsvps where user_id='${user_id}' and event_id='${event_id}'`
            const check_res = await pool.query(check_query);
            // Case: the rsvp entry does not exist --> make a new entry
            if (check_res.rows.length === 0) {
                const query = `insert into unilink.rsvps(rsvp_id, user_id, event_id, still_valid)
                    VALUES($1, $2, $3, $4)`;
                const result = await pool.query(query, [rsvp_id, user_id, event_id, true]);
                res.status(201).json(result.rows[0]);
            }
            // Case: the rsvp entry already exists --> make the rsvp valid
            else {
                const query = `update unilink.rsvps set still_valid=$1 where user_id=$2 and event_id=$3`
                const result = await pool.query(query, [true, user_id, event_id]);
                res.status(201).json(result.rows[0]);
            }
        } catch (error) {
            console.error("Error fetching rsvps:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }

    } catch (error) {
        console.error("Error retrieving params:", error);
        res.status(417).json({ error: "Request body incorrect/missing expected parameters" });
    }
});

// DELETE AN RSVP FROM THE DB, given an event id and user id
router.delete('/eventId/:eventId/userId/:userId', async (req, res) => {
    const query = `DELETE FROM unilink.rsvps WHERE event_id=$1 AND user_id=$2`;
    try {
        const result = await pool.query(query, [req.params.eventId, req.params.userId]);
        res.json(result.rows[0]);
    } catch(error) {
        console.error("Error fetching rsvps:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// MARK A rsvp AS INVALID BUT LEAVES THE EVENT IN THE DB
router.delete('/rsvpId/:rsvpId', async (req, res) => {
    // cancel event
    const query = `update unilink.rsvps set still_valid=$1 where rsvp_id=$2`;
    try {
        const result = await pool.query(query, [false, req.params.rsvpId]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching rsvps:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;