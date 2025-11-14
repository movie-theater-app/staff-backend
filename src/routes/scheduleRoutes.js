const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');


router.post('/', scheduleController.importSchedule);

router.get('/', scheduleController.getSchedules);
router.get('/theater/:theater_id', scheduleController.getScheduleByTheater);
router.get('/movie/:movie_id', scheduleController.getScheduleByMovie);
router.get('/auditorium/:auditorium_id', scheduleController.getScheduleByAuditorium);
router.get('/date/:date', scheduleController.getScheduleByScreening_date);

router.get('/:id', scheduleController.getScheduleById);


module.exports = router;