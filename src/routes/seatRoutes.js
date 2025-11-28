const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');
const { authRequired } = require('../middleware/authenticationMiddleware');

// Creates/updates -> then PUT seats for the auditorium (based on seat_capacity)
router.post('/create', authRequired, seatController.createSeatsForAuditorium);

// gets seats for layout model
router.get('/:auditoriumId', authRequired, seatController.getSeatsByAuditorium);

// update seat status
router.patch('/:seatId/status', authRequired, seatController.updateSeatStatus);

// update seat type
router.patch('/:id/type', authRequired, seatController.updateSeatType);

module.exports = router;
