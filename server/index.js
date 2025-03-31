//DATABASE CONNECTION
require('dotenv').config();
const { Client } = require('pg');

// Database connection configuration
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432
});

// Connect to the database
client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Connection error', err.stack));

// Example query
client.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Query error', err.stack);
    } else {
        console.log('Current time from database:', res.rows[0]);
    }
    
    // Close the connection
    client.end();
});

//ROUTES
const express = require('express');
const app = express();
const port = 3000;

const userRoutes = require('./routes/users');
const eventsRoutes = require('./routes/events');
const organizationsRoutes = require('./routes/organizations');
const rsvpsRoutes = require('./routes/rsvps');
const likesRoutes = require('./routes/likes');
const tagsRoutes = require('./routes/tags');
app.use('/users', userRoutes);
app.use('/events', eventsRoutes);
app.use('/organizations', organizationsRoutes);
app.use('/rsvps', rsvpsRoutes);
app.use('/likes', likesRoutes);
app.use('/tags', tagsRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});