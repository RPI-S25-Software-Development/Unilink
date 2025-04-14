const express = require('express');
const crypto = require("crypto");
const pool = require('../db');
const router = express.Router();

/* `select * from unilink.events e, unilink.organizations o
    where e.organization_id = o.organization_id and o.organization_id = '${req.params.orgId}'`
*/

function eventsQuery(filterQuery = "", userId = "") {
    var fromTable = "FROM unilink.events e";
    if(filterQuery != "") fromTable = `FROM filtered_events fe
    JOIN unilink.events e ON fe.event_id = e.event_id`;

    var filteredEventsTable = "";
    if(filterQuery != "") filteredEventsTable = `,filtered_events AS (${filterQuery})`

    var interactionsSelected = "";
    if(userId != "") {
        interactionsSelected = `
            ,
            CASE WHEN EXISTS (
                SELECT DISTINCT e.event_id
                FROM unilink.likes l WHERE e.event_id = l.event_id AND user_id = '${userId}' AND still_valid = true
            ) THEN TRUE ELSE FALSE END AS like_selected,
            CASE WHEN EXISTS (
                SELECT DISTINCT e.event_id    
                FROM unilink.rsvps r WHERE e.event_id = r.event_id AND user_id = '${userId}' AND still_valid = true
            ) THEN TRUE ELSE FALSE END AS rsvp_selected
        `
    };

    return `WITH
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
        ${filteredEventsTable}
        SELECT 
            e.event_id,
            e.title,
            e.event_description,
            e.poster_path,
            e.event_location,
            e.event_time,
            nullif(jsonb_strip_nulls(jsonb_build_object(
                'organization_id', e.organization_id,
                'organization_name', o.organization_name
            ))::text, '{}')::jsonb AS organization_data,
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
            ${interactionsSelected}
        ${fromTable}
        LEFT JOIN likes_count lc ON e.event_id = lc.event_id
        LEFT JOIN rsvps_count rc ON e.event_id = rc.event_id
        LEFT JOIN unilink.event_tags et ON e.event_id = et.event_id
        LEFT JOIN unilink.tags t ON et.tag_id = t.tag_id
        LEFT JOIN unilink.organizations o on e.organization_id = o.organization_id
        GROUP BY 
            e.event_id, e.title, e.event_description, e.poster_path, 
            e.event_location, e.event_time, e.organization_id, 
            e.max_attendees, e.expiration_date, e.canceled,
            lc.likes_count, rc.rsvps_count, o.organization_name;
        `;
}

// GET all events
router.get('/', async (req, res) => {
    const query = eventsQuery();

    try {
        const result = await pool.query(query);
        res.json(result.rows);
        //console.log(`Rows returned: ${result.rows.length}`);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all events, with interactions data from a specific user id
router.get('/userId/:userId', async (req, res) => {
    const query = eventsQuery(filterQuery = "", userId=req.params.userId);

    try {
        const result = await pool.query(query);
        res.json(result.rows);
        //console.log(`Rows returned: ${result.rows.length}`);
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
    const filterQuery = `
        SELECT DISTINCT e.event_id
        FROM unilink.events e
        JOIN unilink.event_tags et ON e.event_id = et.event_id
        JOIN unilink.tags t ON et.tag_id = t.tag_id
        WHERE t.tag_name = $1
    `

    const query = eventsQuery(filterQuery);

    try {
        const result = await pool.query(query, [req.params.tagName]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all events with a specific tag id
router.get('/tagId/:tagId', async (req, res) => {
    const filterQuery = `
        SELECT DISTINCT e.event_id
        FROM unilink.events e
        JOIN unilink.event_tags et ON e.event_id = et.event_id
        JOIN unilink.tags t ON et.tag_id = t.tag_id
        WHERE t.tag_id = $1
    `

    const query = eventsQuery(filterQuery);

    try {
        const result = await pool.query(query, [req.params.tagId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all events with a specific tag category
router.get('/tagCategory/:category', async (req, res) => {
    const filterQuery = `
        SELECT DISTINCT e.event_id
        FROM unilink.events e
        JOIN unilink.event_tags et ON e.event_id = et.event_id
        JOIN unilink.tags t ON et.tag_id = t.tag_id
        WHERE t.classification = $1
    `

    const query = eventsQuery(filterQuery);

    try {
        const result = await pool.query(query, [req.params.category]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching events by tag category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all events with a specific event id
router.get('/eventId/:eventId', async (req, res) => {
    const filterQuery = `
        SELECT DISTINCT e.event_id
        FROM unilink.events e
        WHERE e.event_id = $1
    `

    const query = eventsQuery(filterQuery);

    try {
        const result = await pool.query(query, [req.params.eventId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// OLD USER ID ENDPOINT
// GET all events that has a like or RSVP from a specific user id
// router.get('/userId/:userId', async (req, res) => {
//     const filterQuery = `
//         SELECT DISTINCT event_id
//         FROM unilink.likes
//         WHERE user_id = $1 AND still_valid = true
//         UNION
//         SELECT DISTINCT event_id
//         FROM unilink.rsvps
//         WHERE user_id = $1 AND still_valid = true
//     `

//     const query = eventsQuery(filterQuery);

//     try {
//         const result = await pool.query(query, [req.params.userId]);
//         res.json(result.rows);
//     } catch (error) {
//         console.error("Error fetching user activity events:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// GET all events with title partially matching a given search text
router.get('/searchTitle/:searchTitle', async (req, res) => {
    const filterQuery = `
        SELECT DISTINCT e.event_id
        FROM unilink.events e
        WHERE LOWER(e.title) LIKE '%'||LOWER($1)||'%'
    `

    const query = eventsQuery(filterQuery);

    try {
        const result = await pool.query(query, [req.params.searchTitle]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching events by tag category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET all events with a specific tag category
// and with title partially matching given search text
router.get('/tagCategory/:category/searchTitle/:searchTitle', async (req, res) => {
    const filterQuery = `
        SELECT DISTINCT e.event_id
        FROM unilink.events e
        JOIN unilink.event_tags et ON e.event_id = et.event_id
        JOIN unilink.tags t ON et.tag_id = t.tag_id
        WHERE t.classification = $1 AND LOWER(e.title) LIKE '%'||LOWER($2)||'%'
    `

    const query = eventsQuery(filterQuery);

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
            event_location=$4, event_time=$5, organization_id=$6, max_attendees=$7, expiration_date=$8
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