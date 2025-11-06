const Theatre = require('../models/theatreModel');

async function addTheatre(req, res) {
    try {
        const theatre = await Theatre.addTheatre(req.body);
        res.status(201).json(theatre.rows[0]); 
    } catch (error) {
        console.error("Error adding theatre: ", error.message);

        if (error.message.includes("already exists")) {
           return res.status(400).json({error: error.message})
        } 
        res.status(500).json({ error: "Failed to add theatre" });
    }
}

async function addAuditorium(req, res) {
    try {
        const auditorium = await Theatre.addAuditorium(req.body);
        res.status(201).json(auditorium.rows[0]);
    } catch (error) {
        console.error("Error adding auditorium: ", error.message);

        if (error.message.includes("already has an auditorium")) {
            return res.status(400).json({ error: error.message });
        } 
        res.status(500).json({ error: "Failed to add auditorium" });
    }
}

module.exports = {
    addTheatre,
    addAuditorium
};
