const express = require('express');
const crypto = require("crypto");
const pool = require('../db');
const router = express.Router();

// GET all events
// returns number of likes, rsvps and event tags
router.get('/', async (req, res) => {
    const query = `
    WITH 
    likes_count AS (
        SELECT event_id, COUNT(*) AS likes_count
        FROM unilink.likes
        WHERE still_valid = true
        GROUP BY event_id
    ),
    rsvps_count AS (
        SELECT event_id, COUNT(*) AS rsvps_count
        FROM unilink.rsvps
        WHERE still_valid = true
        GROUP BY event_id
    )
    SELECT 
        e.event_id,
        e.title,
        e.event_description,
        e.poster_path,
        e.event_location,
        e.event_time,
        e.organization_id,
        e.max_attendees,
        e.expiration_date,
        e.canceled,
        COALESCE(lc.likes_count, 0) AS likes_count,
        COALESCE(rc.rsvps_count, 0) AS rsvps_count,
        ARRAY_REMOVE(ARRAY_AGG(
            DISTINCT nullif(jsonb_strip_nulls(jsonb_build_object(
                'tag_id', t.tag_id,
                'tag_name', t.tag_name,
                'classification', t.classification,
                'color', t.color
            ))::text, '{}')::jsonb
        ), NULL) AS event_tags
    FROM unilink.events e
    LEFT JOIN likes_count lc ON e.event_id = lc.event_id
    LEFT JOIN rsvps_count rc ON e.event_id = rc.event_id
    LEFT JOIN unilink.event_tags et ON e.event_id = et.event_id
    LEFT JOIN unilink.tags t ON et.tag_id = t.tag_id
    GROUP BY 
        e.event_id, e.title, e.event_description, e.poster_path, 
        e.event_location, e.event_time, e.organization_id, 
        e.max_attendees, e.expiration_date, e.canceled,
        lc.likes_count, rc.rsvps_count;
    `;

    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all events which have expired in the last 24 hours
router.get('/lastDay', async (req, res) => {
    try {
        const result = await pool.query("select event_id from unilink.events where expiration_date <= NOW() and expiration_date >= NOW() - INTERVAL '1 day'");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all events with a specific tag name
router.get('/tagName/:tagName', async (req, res) => {
    const query = `select e.event_id, e.title, e.event_description, e.poster_path, e.event_location, e.event_time, e.organization_id, e.max_attendees, e.expiration_date, e.canceled, t.tag_id, t.tag_name
    from unilink.tags t, unilink.event_tags et, unilink.events e
    where t.tag_id = et.tag_id and e.event_id = et.event_id and t.tag_name = '${req.params.tagName}'`;
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all events with a specific tag id
router.get('/tagId/:tagId', async (req, res) => {
    const query = `select e.event_id, e.title, e.event_description, e.poster_path, e.event_location, e.event_time, e.organization_id, e.max_attendees, e.expiration_date, e.canceled, t.tag_id, t.tag_name
    from unilink.tags t, unilink.event_tags et, unilink.events e
    where t.tag_id = et.tag_id and e.event_id = et.event_id and t.tag_id = '${req.params.tagId}'`;
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all events with the same tag category
router.get('/tagCategory/:category', async (req, res) => {
    const query = `
    WITH 
    likes_count AS (
        SELECT event_id, COUNT(*) AS likes_count
        FROM unilink.likes
        WHERE still_valid = true
        GROUP BY event_id
    ),
    rsvps_count AS (
        SELECT event_id, COUNT(*) AS rsvps_count
        FROM unilink.rsvps
        WHERE still_valid = true
        GROUP BY event_id
    ),
    filtered_events AS (
        SELECT DISTINCT e.event_id
        FROM unilink.events e
        JOIN unilink.event_tags et ON e.event_id = et.event_id
        JOIN unilink.tags t ON et.tag_id = t.tag_id
        WHERE t.classification = $1
    )
    SELECT 
        e.event_id,
        e.title,
        e.event_description,
        e.poster_path,
        e.event_location,
        e.event_time,
        e.organization_id,
        e.max_attendees,
        e.expiration_date,
        e.canceled,
        COALESCE(lc.likes_count, 0) AS likes_count,
        COALESCE(rc.rsvps_count, 0) AS rsvps_count,
        ARRAY_REMOVE(ARRAY_AGG(
            DISTINCT nullif(jsonb_strip_nulls(jsonb_build_object(
                'tag_id', t.tag_id,
                'tag_name', t.tag_name,
                'classification', t.classification,
                'color', t.color
            ))::text, '{}')::jsonb
        ), NULL) AS event_tags
    FROM filtered_events fe
    JOIN unilink.events e ON fe.event_id = e.event_id
    LEFT JOIN likes_count lc ON e.event_id = lc.event_id
    LEFT JOIN rsvps_count rc ON e.event_id = rc.event_id
    LEFT JOIN unilink.event_tags et ON e.event_id = et.event_id
    LEFT JOIN unilink.tags t ON et.tag_id = t.tag_id
    GROUP BY 
        e.event_id, e.title, e.event_description, e.poster_path, 
        e.event_location, e.event_time, e.organization_id, 
        e.max_attendees, e.expiration_date, e.canceled,
        lc.likes_count, rc.rsvps_count;
    `;

    try {
        const result = await pool.query(query, [req.params.category]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching events by tag category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all events with a specific event id
// Also returns the number of RSVPs and SAVEs associated with each, as well as all tags
router.get('/eventId/:eventId', async (req, res) => {
    const query = `
    WITH likes_count AS (
        SELECT COUNT(*) AS likes_count
        FROM unilink.likes 
        WHERE still_valid = true AND event_id = $1
    ),
    rsvps_count AS (
        SELECT COUNT(*) AS rsvps_count
        FROM unilink.rsvps
        WHERE still_valid = true AND event_id = $1
    )
    SELECT 
        e.event_id,
        e.title,
        e.event_description,
        e.poster_path,
        e.event_location,
        e.event_time,
        e.organization_id,
        e.max_attendees,
        e.expiration_date,
        e.canceled,
        lc.likes_count,
        rc.rsvps_count,
        ARRAY_REMOVE(ARRAY_AGG(
            DISTINCT nullif(jsonb_strip_nulls(jsonb_build_object(
                'tag_id', t.tag_id,
                'tag_name', t.tag_name,
                'classification', t.classification,
                'color', t.color
            ))::text, '{}')::jsonb
        ), NULL) AS event_tags
    FROM unilink.events e
    LEFT JOIN unilink.event_tags et ON e.event_id = et.event_id
    LEFT JOIN unilink.tags t ON et.tag_id = t.tag_id
    CROSS JOIN likes_count lc
    CROSS JOIN rsvps_count rc
    WHERE e.event_id = $1
    GROUP BY 
        e.event_id, e.title, e.event_description, e.poster_path, 
        e.event_location, e.event_time, e.organization_id, 
        e.max_attendees, e.expiration_date, e.canceled, 
        lc.likes_count, rc.rsvps_count;
    `;

    try {
        const result = await pool.query(query, [req.params.eventId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all events given a user_id based on the users likes and RSVPs
router.get('/userId/:userId', async (req, res) => {
    const query = `
    WITH 
    likes_count AS (
        SELECT event_id, COUNT(*) AS likes_count
        FROM unilink.likes
        WHERE still_valid = true
        GROUP BY event_id
    ),
    rsvps_count AS (
        SELECT event_id, COUNT(*) AS rsvps_count
        FROM unilink.rsvps
        WHERE still_valid = true
        GROUP BY event_id
    ),
    user_events AS (
        SELECT DISTINCT event_id
        FROM unilink.likes
        WHERE user_id = $1 AND still_valid = true
        UNION
        SELECT DISTINCT event_id
        FROM unilink.rsvps
        WHERE user_id = $1 AND still_valid = true
    )
    SELECT 
        e.event_id,
        e.title,
        e.event_description,
        e.poster_path,
        e.event_location,
        e.event_time,
        e.organization_id,
        e.max_attendees,
        e.expiration_date,
        e.canceled,
        COALESCE(lc.likes_count, 0) AS likes_count,
        COALESCE(rc.rsvps_count, 0) AS rsvps_count,
        ARRAY_REMOVE(ARRAY_AGG(
            DISTINCT nullif(jsonb_strip_nulls(jsonb_build_object(
                'tag_id', t.tag_id,
                'tag_name', t.tag_name,
                'classification', t.classification,
                'color', t.color
            ))::text, '{}')::jsonb
        ), NULL) AS event_tags
    FROM user_events ue
    JOIN unilink.events e ON ue.event_id = e.event_id
    LEFT JOIN likes_count lc ON e.event_id = lc.event_id
    LEFT JOIN rsvps_count rc ON e.event_id = rc.event_id
    LEFT JOIN unilink.event_tags et ON e.event_id = et.event_id
    LEFT JOIN unilink.tags t ON et.tag_id = t.tag_id
    GROUP BY 
        e.event_id, e.title, e.event_description, e.poster_path, 
        e.event_location, e.event_time, e.organization_id, 
        e.max_attendees, e.expiration_date, e.canceled,
        lc.likes_count, rc.rsvps_count;
    `;

    try {
        const result = await pool.query(query, [req.params.userId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching user activity events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all events with title partially matching given search text
router.get('/searchTitle/:searchTitle', async (req, res) => {
    const query = `
    WITH 
    likes_count AS (
        SELECT event_id, COUNT(*) AS likes_count
        FROM unilink.likes
        WHERE still_valid = true
        GROUP BY event_id
    ),
    rsvps_count AS (
        SELECT event_id, COUNT(*) AS rsvps_count
        FROM unilink.rsvps
        WHERE still_valid = true
        GROUP BY event_id
    ),
    filtered_events AS (
        SELECT DISTINCT e.event_id
        FROM unilink.events e
        WHERE LOWER(e.title) LIKE '%'||LOWER($1)||'%'
    )
    SELECT 
        e.event_id,
        e.title,
        e.event_description,
        e.poster_path,
        e.event_location,
        e.event_time,
        e.organization_id,
        e.max_attendees,
        e.expiration_date,
        e.canceled,
        COALESCE(lc.likes_count, 0) AS likes_count,
        COALESCE(rc.rsvps_count, 0) AS rsvps_count,
        ARRAY_REMOVE(ARRAY_AGG(
            DISTINCT nullif(jsonb_strip_nulls(jsonb_build_object(
                'tag_id', t.tag_id,
                'tag_name', t.tag_name,
                'classification', t.classification,
                'color', t.color
            ))::text, '{}')::jsonb
        ), NULL) AS event_tags
    FROM filtered_events fe
    JOIN unilink.events e ON fe.event_id = e.event_id
    LEFT JOIN likes_count lc ON e.event_id = lc.event_id
    LEFT JOIN rsvps_count rc ON e.event_id = rc.event_id
    LEFT JOIN unilink.event_tags et ON e.event_id = et.event_id
    LEFT JOIN unilink.tags t ON et.tag_id = t.tag_id
    GROUP BY 
        e.event_id, e.title, e.event_description, e.poster_path, 
        e.event_location, e.event_time, e.organization_id, 
        e.max_attendees, e.expiration_date, e.canceled,
        lc.likes_count, rc.rsvps_count;
    `;

    try {
        const result = await pool.query(query, [req.params.searchTitle]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching events by tag category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all events with the same tag category
// and with title partially matching given search text
router.get('/tagCategory/:category/searchTitle/:searchTitle', async (req, res) => {
    const query = `
    WITH 
    likes_count AS (
        SELECT event_id, COUNT(*) AS likes_count
        FROM unilink.likes
        WHERE still_valid = true
        GROUP BY event_id
    ),
    rsvps_count AS (
        SELECT event_id, COUNT(*) AS rsvps_count
        FROM unilink.rsvps
        WHERE still_valid = true
        GROUP BY event_id
    ),
    filtered_events AS (
        SELECT DISTINCT e.event_id
        FROM unilink.events e
        JOIN unilink.event_tags et ON e.event_id = et.event_id
        JOIN unilink.tags t ON et.tag_id = t.tag_id
        WHERE t.classification = $1 AND LOWER(e.title) LIKE '%'||LOWER($2)||'%'
    )
    SELECT 
        e.event_id,
        e.title,
        e.event_description,
        e.poster_path,
        e.event_location,
        e.event_time,
        e.organization_id,
        e.max_attendees,
        e.expiration_date,
        e.canceled,
        COALESCE(lc.likes_count, 0) AS likes_count,
        COALESCE(rc.rsvps_count, 0) AS rsvps_count,
        ARRAY_REMOVE(ARRAY_AGG(
            DISTINCT nullif(jsonb_strip_nulls(jsonb_build_object(
                'tag_id', t.tag_id,
                'tag_name', t.tag_name,
                'classification', t.classification,
                'color', t.color
            ))::text, '{}')::jsonb
        ), NULL) AS event_tags
    FROM filtered_events fe
    JOIN unilink.events e ON fe.event_id = e.event_id
    LEFT JOIN likes_count lc ON e.event_id = lc.event_id
    LEFT JOIN rsvps_count rc ON e.event_id = rc.event_id
    LEFT JOIN unilink.event_tags et ON e.event_id = et.event_id
    LEFT JOIN unilink.tags t ON et.tag_id = t.tag_id
    GROUP BY 
        e.event_id, e.title, e.event_description, e.poster_path, 
        e.event_location, e.event_time, e.organization_id, 
        e.max_attendees, e.expiration_date, e.canceled,
        lc.likes_count, rc.rsvps_count;
    `;

    try {
        const result = await pool.query(query, [req.params.category, req.params.searchTitle]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching events by tag category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all events with a specific organization name
router.get('/orgName/:orgName', async (req, res) => {
    const query = `select * from unilink.events e, unilink.organizations o
    where e.organization_id = o.organization_id and o.organization_name = '${req.params.orgName}'`;
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all events with a specific organization id
router.get('/orgId/:orgId', async (req, res) => {
    const query = `select * from unilink.events e, unilink.organizations o
    where e.organization_id = o.organization_id and o.organization_id = '${req.params.orgId}'`;
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// CREATE A NEW EVENT
router.post('/', async (req, res) => {
    // Generate random UUID
    const event_id = crypto.randomUUID();
    // Pull params from request body
    try {
        const title = req.body['title'];
        const event_description = req.body['event_description'];
        const poster_path = req.body['poster_path'];
        const event_location = req.body['event_location'];
        const event_time = new Date(req.body['event_time']);
        const organization_id = req.body['organization_id'];
        const max_attendees = parseInt(req.body['max_attendees'],10);
        const expiration_date = new Date(req.body['expiration_date']);

        const query = `insert into unilink.events(event_id, title, event_description, poster_path,
            event_location, event_time, organization_id, max_attendees, expiration_date)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
        try {
            const result = await pool.query(query, [event_id, title, event_description, poster_path, event_location, event_time,
                organization_id, max_attendees, expiration_date]);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error("Error fetching events:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }

    } catch (error) {
        console.error("Error retrieving params:", error);
        res.status(417).json({ error: "Request body incorrect/missing expected parameters" });
    }
});

// EDIT AN EXISTING EVENT
router.put('/eventId/:eventId', async (req, res) => {
    // Pull params from request body
    try {
        const title = req.body['title'];
        const event_description = req.body['event_description'];
        const poster_path = req.body['poster_path'];
        const event_location = req.body['event_location'];
        const event_time = new Date(req.body['event_time']);
        const organization_id = req.body['organization_id'];
        const max_attendees = parseInt(req.body['max_attendees'],10);
        const expiration_date = new Date(req.body['expiration_date']);

        const query = `update unilink.events set title=$1, event_description=$2, poster_path=$3,
            event_location=$4, event_time=$5, organization_id=$6, max_attendees=$7, expiration_date=$8,
            where event_id=$9`;
        try {
            const result = await pool.query(query, [title, event_description, poster_path, event_location, event_time,
                organization_id, max_attendees, expiration_date, req.params.eventId]);
            res.json(result.rows[0]);
        } catch (error) {
            console.error("Error fetching events:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }

    } catch (error) {
        console.error("Error retrieving params:", error);
        res.status(417).json({ error: "Request body incorrect/missing expected parameters" });
    }
});

// CANCEL AN EXISTING EVENT
// MARKS AN EVENT AS CANCELED BUT LEAVES THE EVENT IN THE DB
// Then mark the corresponding rsvps associated with the event invalid
router.delete('/eventId/:eventId', async (req, res) => {
    // cancel event
    const query = `update unilink.events set canceled=$1 where event_id=$2`;
    const query2 = `update unilink.rsvps set still_valid=$1 where event_id=$2`;
    try {
        const result = await pool.query(query, [true, req.params.eventId]);
        const result2 = await pool.query(query2, [false, req.params.eventId]);
        res.json(result2.rows[0]);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;