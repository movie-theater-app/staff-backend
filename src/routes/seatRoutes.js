const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');

// Creates/updates -> then PUT seats for the auditorium (based on seat_capacity)
router.post('/create', seatController.createSeatsForAuditorium);

// gets seats for layout model
router.get('/:auditoriumId', seatController.getSeatsByAuditorium);

// update seat status
router.patch('/:seatId/status', seatController.updateSeatStatus);

// update seat type
router.patch('/:id/type', seatController.updateSeatType);

module.exports = router;
