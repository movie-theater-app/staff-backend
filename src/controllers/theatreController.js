const Theatre = require('../models/theatreModel');
const seatModel = require('../models/seatModel'); 

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
        const auditoriumId = auditorium.rows[0].id;
        const seatCount = req.body.seat_capacity;
        // create seats for this auditorium id
        await seatModel.createSeats(auditoriumId, seatCount);
        // success 
        res.status(201).json({
        message: 'Auditorium and seats created successfully',
        auditorium: auditorium.rows[0],
        createdSeats: seatCount
        });
       // fail
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
