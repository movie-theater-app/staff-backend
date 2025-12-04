const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

router.get('/', statisticsController.getAllStatistics);

router.get('/period', statisticsController.getStatisticsByPeriod);

module.exports = router;
