require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const setupSwagger = require('../swagger');

// see documentation at http://localhost:3000/api-docs
setupSwagger(app);

const movieRoutes = require('./routes/movieRoutes');
const theatreRoutes = require('./routes/theatreRoutes');
const seatRoutes = require('./routes/seatRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const authRoutes = require('./routes/authenticationRoutes');
const userModel = require('./models/userModel');

app.use(express.json());
app.use(cors());

// routes
app.use('/api/movie', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/seats', seatRoutes)
app.use('/api/schedule', scheduleRoutes);
app.use('/api/authentication', authRoutes);

// test
app.get('/', (req, res) => {
  res.send('Hello from staff-backend');
});

(async () => {
  try {
    await userModel.createAdminIfNotExists();
  } catch (err) {
    console.error('Error creating admin:', err);
  }
})();

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});