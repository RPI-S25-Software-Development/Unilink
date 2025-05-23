const express = require('express');
const crypto = require("crypto");
const pool = require('../db')
const router = express.Router();

// GET all user tags
router.get('/', async (req, res) => {
    try {
        const result = await pool.query("select * from unilink.user_tags");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching user tags:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all user tags for a specific user
router.get('/userId/:userId', async (req, res) => {
    try {
        const result = await pool.query("select user_tag_id, user_id, t.tag_id, tag_name, classification, color from unilink.user_tags ut, unilink.tags t where ut.tag_id=t.tag_id and user_id=$1", [req.params.userId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching user tags:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all tags matching a classification for a specific user
router.get('/userId/:userId/classification/:classification', async (req, res) => {
    try {
        const return_data = "user_tag_id, user_id, t.tag_id, tag_name, classification, color"
        const tables = "unilink.user_tags ut, unilink.tags t"
        const conditions = `ut.tag_id=t.tag_id and user_id='${req.params.userId}' and classification='${req.params.classification}'`

        const result = await pool.query(`select ${return_data} from ${tables} where ${conditions}`);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching user tags:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// CREATE a user tag
router.post('/', async (req, res) => {
    // Generate random UUID
    const user_tag_id = crypto.randomUUID();
    // Pull params from request body
    try {
        const user_id = req.body['user_id'];
        const tag_id = req.body['tag_id'];

        try {
            // Check to see if a user tag exists for that user_id and tag_id
            const check_query = `select * from unilink.user_tags where tag_id='${tag_id}' and user_id='${user_id}'`
            const check_res = await pool.query(check_query);
            // Case: the rsvp entry does not exist --> make a new entry
            if (check_res.rows.length === 0) {
                const query = `insert into unilink.user_tags(user_tag_id, user_id, tag_id)
                    VALUES($1, $2, $3)`;
                const result = await pool.query(query, [user_tag_id, user_id, tag_id]);
                res.status(201).json(result.rows[0]);
            }
            // Case: the user tag already exists --> send a success message
            else {
                res.status(200).json({ success: "User Tag already exists" });
            }
        } catch (error) {
            console.error("Error fetching user tags:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }

    } catch (error) {
        console.error("Error retrieving params:", error);
        res.status(417).json({ error: "Request body incorrect/missing expected parameters" });
    }
});

// UPDATE user_tags for a specific user id
router.put('/userId/:userId', async (req, res) => {
    const { tag_ids } = req.body;

    if (!Array.isArray(tag_ids)) {
        return res.status(400).json({ error: "Request body must include 'tag_ids' (array)" });
    }

    const created = [];
    const existing = [];

    try {
        const deleteQuery = `DELETE FROM unilink.user_tags WHERE user_id = $1`
        const deleteResponse = await pool.query(deleteQuery, [req.params.userId]);

        for (const tag_id of tag_ids) {
            const checkQuery = `SELECT * FROM unilink.user_tags WHERE tag_id = $1 AND user_id = $2`;
            const checkRes = await pool.query(checkQuery, [tag_id, req.params.userId]);

            if (checkRes.rows.length === 0) {
                const user_tag_id = crypto.randomUUID();
                const insertQuery = `INSERT INTO unilink.user_tags(user_tag_id, user_id, tag_id) VALUES ($1, $2, $3)`;
                await pool.query(insertQuery, [user_tag_id, req.params.userId, tag_id]);
                created.push(tag_id);
            } else {
                existing.push(tag_id);
            }
        }

        res.status(201).json({
            message: "User tags for user processed",
            created,
            existing
        });
    } catch (error) {
        console.error("Error updating user's user tags:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE user tag with user tag id
router.delete('/userTagId/:userTagId', async (req, res) => {
    // cancel user
    const query = `delete from unilink.user_tags where user_tag_id=$1`;
    try {
        const result = await pool.query(query, [req.params.userTagId]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching user tags:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;