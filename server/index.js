const express = require('express');
const app = express();
const port = 3000;

const userRoutes = require('./routes/users');
const eventsRoutes = require('./routes/events');
const organizationsRoutes = require('./routes/organizations');
const rsvpsRoutes = require('./routes/rsvps');
const savesRoutes = require('./routes/saves');
const tagsRoutes = require('./routes/tags');
app.use('/users', userRoutes);
app.use('/events', eventsRoutes);
app.use('/organizations', organizationsRoutes);
app.use('/rsvps', rsvpsRoutes);
app.use('/saves', savesRoutes);
app.use('/tags', tagsRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});