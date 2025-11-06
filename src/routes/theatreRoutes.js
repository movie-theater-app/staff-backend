const express = require('express');
const router = express.Router();
const theatreController = require('../controllers/theatreController');

// POST /api/theatres
router.post('/', theatreController.addTheatre);

// POST /api/auditoriums
router.post('/auditoriums', theatreController.addAuditorium);

module.exports = router;
