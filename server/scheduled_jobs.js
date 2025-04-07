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
        const result2 = await pool.query(query2, [false, event_id]);
    }

    // TASK 2: generate notifications for upcoming events
    // fetch all event_ids coming up in the next 48 hours
    // const result4 = await pool.query("select event_id, event_name, event_time from unilink.events where event_time >= NOW() and event_time <= NOW() + INTERVAL '2 days'");
    // for (const row of result4.rows) {
    //     const event_id = row['event_id'];
    //     const event_name = row['event_name'];
    //     const event_time = row['event_time'];
    //     // check rsvps to retrieve users signed up for this event
    //     const result5 = await pool.query(`select user_id from unilink.rsvps where event_id='${event_id} and still_valid='${true}`);
    //     for (const user_id of result5.rows) {
    //         // Create and send event notification
    //         // Post notification entry to db?
    //     }
    // }
}

// Call API immediately, then every 24 hours (86400000 ms)
function startScheduler() {
    scheduledJobs();
    setInterval(scheduledJobs, 24 * 60 * 60 * 1000);
}

module.exports = startScheduler;