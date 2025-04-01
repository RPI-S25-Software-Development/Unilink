//ROUTES
const express = require('express');
// const cors = require('cors');
const app = express();
// app.use(cors);
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
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