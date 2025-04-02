const express = require('express');
const crypto = require("crypto");
const pool = require('../db');
const router = express.Router();

// GET all events
router.get('/', async (req, res) => {
    try {
        const result = await pool.query("select * from unilink.events");
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

// GET all events with a specific event id
// Also returns the number of RSVPs and SAVEs associated with each
router.get('/eventId/:eventId', async (req, res) => {
    const query = `
    with likes_count as (select count(event_id) as likes_count
        from unilink.likes where still_valid = true and event_id = '${req.params.eventId}'),
    rsvps_count as (select count(event_id) as rsvps_count from unilink.rsvps
        where still_valid = true and event_id = '${req.params.eventId}')
    select e.event_id, e.title, e.event_description, e.poster_path, e.event_location, e.event_time,
        e.organization_id, e.max_attendees, e.expiration_date, e.canceled, lc.likes_count, rc.rsvps_count
        from unilink.events e, likes_count lc, rsvps_count rc
        where e.event_id = '${req.params.eventId}'`;
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all events with a specific title
// Also returns the number of RSVPs and SAVEs associated with each
// WARNING: IF THERE ARE MULTIPLE EVENTS WITH THE SAME NAME, MULTIPLE RESULTS WILL BE RETURNED
// EACH WITH THEIR RESPECTIVE LIKES AND RSVPS COUNT
router.get('/title/:title', async (req, res) => {
    const query = `
    with likes_count as (select l.event_id, count(l.event_id) as likes_count
        from unilink.likes l, unilink.events e where still_valid = true and l.event_id =
        e.event_id and e.title = '${req.params.title}' group by l.event_id),
    rsvps_count as (select r.event_id, count(r.event_id) as rsvps_count from unilink.rsvps r,
        unilink.events e where still_valid = true and r.event_id = e.event_id and e.title =
        '${req.params.title}' group by r.event_id)
    select e.event_id, e.title, e.event_description, e.poster_path, e.event_location, e.event_time,
        e.organization_id, e.max_attendees, e.expiration_date, e.canceled, lc.likes_count, rc.rsvps_count
    from unilink.events e, likes_count lc, rsvps_count rc
    where e.title = '${req.params.title}' and lc.event_id = rc.event_id and e.event_id = lc.event_id`;
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching events:", error);
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
// Then marks the corresponding rsvps associated with the event invalid
// Finally marks the notifications associated with the event as inactive
router.delete('/eventId/:eventId', async (req, res) => {
    // cancel event
    const query = `update unilink.events set canceled=$1 where event_id=$2`;
    const query2 = `update unilink.rsvps set still_valid=$1 where event_id=$2`;
    const query3 = `update unilink.notifications set active=$1 where event_id=$2`;
    try {
        const result = await pool.query(query, [true, req.params.eventId]);
        const result2 = await pool.query(query2, [false, req.params.eventId]);
        const result3 = await pool.query(query3, [false, req.params.eventId]);
        res.json(result3.rows[0]);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;