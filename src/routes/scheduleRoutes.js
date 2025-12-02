const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { authRequired } = require('../middleware/authenticationMiddleware');


router.post('/', authRequired, scheduleController.importSchedule);

router.get('/', authRequired, scheduleController.getSchedules);
router.get('/theater/:theater_id', authRequired, scheduleController.getScheduleByTheater);
router.get('/movie/:movie_id', authRequired, scheduleController.getScheduleByMovie);
router.get('/auditorium/:auditorium_id', authRequired, scheduleController.getScheduleByAuditorium);
router.get('/date/:date', authRequired, scheduleController.getScheduleByScreening_date);
router.get('/movie_theater/:movie_id/:theater_id', authRequired, scheduleController.getScheduleByMovieAndTheater);
router.delete('/:id', authRequired, scheduleController.deleteSchedule)
router.get('/:id', authRequired, scheduleController.getScheduleById);
router.get('/:id/seats', authRequired, scheduleController.getSeatsBySchedule);


module.exports = router;