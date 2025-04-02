require('dotenv').config();
const crypto = require("crypto");
const pool = require('./db');

async function scheduledJobs() {    
    // TASK 1: delete expired events in the last 24 hours
    // fetch all event_ids which expired in the last 24 hours
    const result = await pool.query("select event_id from unilink.events where expiration_date <= NOW() and expiration_date >= NOW() - INTERVAL '1 day'");
    for (const row of result.rows) {
        const event_id = row['event_id'];
        // Mark event as canceled
        const query = `update unilink.events set canceled=$1 where event_id=$2`;
        const result = await pool.query(query, [true, event_id]);
        // Set the corresponding rsvps and notifications as invalid/inactive
        const query2 = `update unilink.rsvps set still_valid=$1 where event_id=$2`;
        const query3 = `update unilink.notifications set active=$1 where event_id=$2`;
        const result2 = await pool.query(query2, [false, event_id]);
        const result3 = await pool.query(query3, [false, event_id]);
    }

    // TASK 2: 
}

// Call API immediately, then every 24 hours (86400000 ms)
function startScheduler() {
    scheduledJobs();
    setInterval(scheduledJobs, 24 * 60 * 60 * 1000);
}

module.exports = startScheduler;