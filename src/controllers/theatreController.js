const Theatre = require('../models/theatreModel');
const db = require("../db/db");
const seatModel = require('../models/seatModel'); 

async function addTheatre(req, res) {
   console.log("REQ.BODY:", req.body);
   console.log("REQ.USER:", req.user);
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

async function getAllTheaters(req, res) {
    try {
        const theaters = await Theatre.getAllTheaters();
        res.status(200).json(theaters);
    } catch (e) {
        console.error("Error getting theaters: ", e.message);
        res.status(404).json({ error: "Failed to get theaters" });
    }
}

async function getTheaterById(req, res) {
    const {id} = req.params;

    try {
        const theater = await Theatre.getTheaterById(id);
        res.status(200).json(theater);
    } catch (e) {
        console.error("Error getting theater: ", e.message);
        res.status(404).json({ error: "Failed to get theater" });
    }

}

async function getAuditoriumsByTheater(req, res) {
    const {theater_id} = req.params;

    try {
        const auditoriums = await Theatre.getAuditoriumsByTheater(theater_id);
        res.status(200).json(auditoriums);
    } catch (e) {
        console.error(`Error getting auditoriums of theater with id ${theater_id}: `, e.message);
        res.status(404).json({ error: `Failed to get auditoriums of theater with id ${theater_id}` });
    }
}

async function getAuditoriumById(req, res) {
    const {id} = req.params;

    try {
        const auditorium = await Theatre.getAuditoriumById(id);
        res.status(200).json(auditorium);
    } catch (e) {
        console.error(`Error getting auditoriums with id ${id}: `, e.message);
        res.status(404).json({ error: `Failed to get auditoriums with id ${id}` });
    }
}

async function getAuditoriums(req, res) {
    try {
        const auditoriums = await Theatre.getAuditoriums();
        res.status(200).json(auditoriums);
    } catch (e) {
        console.error(`Error getting auditoriums`, e.message);
        res.status(404).json({ error: `Failed to get auditoriums` });
    }
}

module.exports = {
    addTheatre,
    addAuditorium,
    getAllTheaters,
    getTheaterById,
    getAuditoriumsByTheater,
    getAuditoriumById,
    getAuditoriums,
};
