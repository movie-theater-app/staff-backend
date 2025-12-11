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
const staffRoutes = require('./routes/staffRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const userModel = require('./models/userModel');
const { addStatistics } = require('./db/addStatistics');

app.use(express.json());
// app.use(cors());

const allowedOrigins = [
  "https://delightful-forest-092e86a03.3.azurestaticapps.net",
  "https://demo-northstar-movie-theatre.azurewebsites.net",
  "http://localhost:5173"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true, 
}));


app.use((req,res,next)=>{
   console.log("REQUEST →", req.method, req.path);
   next();
});

// routes
app.use('/api/movie', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/seats', seatRoutes)
app.use('/api/schedule', scheduleRoutes);
app.use('/api/authentication', authRoutes);
app.use('/api/staff', staffRoutes)
app.use('/api/statistics', statisticsRoutes);

// test
app.get('/', (req, res) => {
  res.send('Hello from staff-backend');
});

// create admin automatically if missing
( async () => {
  try {
    await userModel.createAdminIfNotExists();
  } catch (err) {
    console.error('Error creating admin:', err);
  }
  try {
    await addStatistics();
  } catch (err) {
    console.error('Error adding statistics:', err);
  }
})();

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});