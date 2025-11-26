require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');
const setupSwagger = require('../swagger');

// see documentation at http://localhost:3000/api-docs
setupSwagger(app);

const movieRoutes = require('./routes/movieRoutes');
const theatreRoutes = require('./routes/theatreRoutes');
const seatRoutes = require('./routes/seatRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
<<<<<<< HEAD
=======
const authRoutes = require('./routes/authenticationRoutes');

>>>>>>> 9db4e06 (Temp commit to move changes to dev)

app.use(express.json());
app.use(cors());

// routes
app.use('/api/movie', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/seats', seatRoutes)
app.use('/api/schedule', scheduleRoutes);

// test
app.get('/', (req, res) => {
  res.send('Hello from staff-backend');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});