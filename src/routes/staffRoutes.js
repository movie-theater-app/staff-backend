const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { authRequired, adminOnly } = require('../middleware/authenticationMiddleware');

// get all staff members
router.get('/', authRequired, adminOnly, staffController.getAllStaff )
// create new staff members
router.post('/', authRequired, adminOnly, staffController.createStaff);
// update staff members
router.patch('/:id', authRequired, adminOnly, staffController.updateStaff);
// view your profile
router.get('/profile', authRequired, staffController.getMyProfile)
// update profile
router.patch('/profile', authRequired, staffController.updateMyProfile)
// change password (note this doesn't recover password)
router.patch('/profile/password', authRequired, staffController.changeMyPassword)

module.exports = router;