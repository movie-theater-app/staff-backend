const Theatre = require('../models/theatreModel');

async function addTheatre(req, res) {
    try {
        const theatre = await Theatre.addTheatre(req.body);
        res.status(201).json(theatre.rows[0]); 
    } catch (error) {
        console.error("Error adding theatre: " + error);
        res.status(500).json({ error: "Failed to add theatre" });
    }
}

async function addAuditorium(req, res) {
    try {
        const auditorium = await Theatre.addAuditorium(req.body);
        res.status(201).json(auditorium.rows[0]);
    } catch (error) {
        console.error("Error adding auditorium: " + error);
        res.status(500).json({ error: "Failed to add auditorium" });
    }
}

module.exports = {
    addTheatre,
    addAuditorium
};
