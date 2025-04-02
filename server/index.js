//ROUTES
require('dotenv').config();
const express = require('express');
const startScheduler = require('./scheduled_jobs');
const cors = require('cors');
const app = express();
if (process.env.ENV === 'Prod') {
    app.use(cors);
} else {
    console.log("Dev");
}
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
const host = process.env.ENV === 'Prod' ? process.env.HOST : 'localhost';
const port = process.env.API_PORT;

const userRoutes = require('./routes/users');
const eventsRoutes = require('./routes/events');
const organizationsRoutes = require('./routes/organizations');
const rsvpsRoutes = require('./routes/rsvps');
const likesRoutes = require('./routes/likes');
const tagsRoutes = require('./routes/tags');
const notificationsRoutes = require('./routes/notifications');
const universityRoutes = require('./routes/university');
const eventTagsRoutes = require('./routes/event_tags');
const userTagsRoutes = require('./routes/user_tags');
app.use('/users', userRoutes);
app.use('/events', eventsRoutes);
app.use('/organizations', organizationsRoutes);
app.use('/rsvps', rsvpsRoutes);
app.use('/likes', likesRoutes);
app.use('/tags', tagsRoutes);
app.use('/notications', notificationsRoutes);
app.use('/university', universityRoutes);
app.use('/eventTags', eventTagsRoutes);
app.use('/userTags', userTagsRoutes);

// start the scheduled job to delete expired events in the last 24 hours
// and create notifications for events starting in the next 24 hours
startScheduler();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server listening at https://${host}:${port}`);
});