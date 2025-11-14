const express = require('express');
const router = express.Router();
const theatreController = require('../controllers/theatreController');

// POST /api/theatres
router.post('/', theatreController.addTheatre);

// POST /api/auditoriums
router.post('/auditoriums', theatreController.addAuditorium);

router.get('/auditoriums', theatreController.getAuditoriums);
router.get('/auditoriums/:id', theatreController.getAuditoriumById);

router.get('/:theater_id/auditoriums', theatreController.getAuditoriumsByTheater);


router.get('/', theatreController.getAllTheaters);
router.get('/:id', theatreController.getTheaterById);



module.exports = router;
