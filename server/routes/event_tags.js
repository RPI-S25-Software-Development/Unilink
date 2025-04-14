const express = require('express');
const crypto = require("crypto");
const pool = require('../db')
const router = express.Router();

// GET all event tags for a specific event
router.get('/eventId/:eventId', async (req, res) => {
    try {
        const result = await pool.query("select event_tag_id, event_id, t.tag_id, tag_name, classification, color from unilink.event_tags et, unilink.tags t where et.tag_id=t.tag_id and event_id=$1", [req.params.eventId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching event tags:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all event tags for a specific tag id
router.get('/tagId/:tagId', async (req, res) => {
    try {
        const result = await pool.query("select event_tag_id, event_id, t.tag_id, tag_name, classification, color from unilink.event_tags et, unilink.tags t where et.tag_id=t.tag_id and tag_id=$1", [req.params.tagId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching event tags:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// CREATE a new event tag given the eventId and tagId
router.post('/', async (req, res) => {
    // Generate random UUID
    const event_tag_id = crypto.randomUUID();
    // Pull params from request body
    try {
        const event_id = req.body['event_id'];
        const tag_id = req.body['tag_id'];

        try {
            // Check to see if a event tag exists for that event_id and tag_id
            const check_query = `select * from unilink.event_tags where tag_id='${tag_id}' and event_id='${event_id}'`
            const check_res = await pool.query(check_query);
            // Case: the rsvp entry does not exist --> make a new entry
            if (check_res.rows.length === 0) {
                const query = `insert into unilink.event_tags(event_tag_id, event_id, tag_id)
                    VALUES($1, $2, $3)`;
                const result = await pool.query(query, [event_tag_id, event_id, tag_id]);
                res.status(201).json(result.rows[0]);
            }
            // Case: the event tag already exists --> send a success message
            else {
                res.status(200).json({ success: "Event Tag already exists" });
            }
        } catch (error) {
            console.error("Error fetching event tags:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }

    } catch (error) {
        console.error("Error retrieving params:", error);
        res.status(417).json({ error: "Request body incorrect/missing expected parameters" });
    }
});

// DELETE event tag with event tag id
router.delete('/eventTagId/:eventTagId', async (req, res) => {
    // cancel event
    const query = `delete from unilink.event_tags where event_tag_id=$1`;
    try {
        const result = await pool.query(query, [req.params.eventTagId]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching event tags:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;