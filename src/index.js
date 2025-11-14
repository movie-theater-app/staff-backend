require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');

const movieRoutes = require('./routes/movieRoutes');
const theatreRoutes = require('./routes/theatreRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

app.use(express.json());
app.use(cors());

app.use('/api/movie', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/schedule', scheduleRoutes);

// test
app.get('/', (req, res) => {
  res.send('Hello from staff-backend');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});