const express = require('express');
const router = express.Router();
const theatreController = require('../controllers/theatreController');
//const seatModel = require('../models/seatModel');

/**
 * @swagger
 * /api/theatres:
 *   post:
 *     summary: "Create a new theatre"
 *     description: "Adds a theatre to the system"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theatre_name:
 *                 type: string
 *               address:
 *                 type: string
 *               contact_information:
 *                 type: string
 *                 description: "Phone number"
 *     responses:
 *       '201':
 *         description: "Theatre created successfully"
 *       '400':
 *         description: "Theatre already exists"
 *       '500':
 *         description: "Server error"
 */
router.post('/', theatreController.addTheatre);

// POST /api/auditoriums
router.post('/auditoriums', theatreController.addAuditorium);

module.exports = router;

