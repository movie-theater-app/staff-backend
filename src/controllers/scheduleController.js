const Schedule = require("../models/scheduleModel");
const db = require("../db/db");

async function importSchedule(req, res) {
    try {
        const schedule = await Schedule.importSchedule(req.body);
        res.status(201).json({schedule});
    } catch (error){
        if (error.message.includes("Schedule conflict")) {
            return res.status(409).json({ error: error.message });
        }
        console.error("Error adding schedule: ", error.message);
        res.status(500).json({error: error.message})
    }
}
async function updateSchedule (req, res) {

}

async function getSchedules(req,res){
    try {
        const schedules = await Schedule.getSchedules();
        res.status(200).json({schedules});
    } catch (error){
        console.error("Error getting schedules: ", error.message);
        res.status(404).json({error: error.message})
    }
}
async function getScheduleById(req,res) {
    const {id} = req.params;
    try {
        const schedule = await Schedule.getScheduleById(id);
        res.status(200).json({schedule});
    } catch (error){
        console.error(`Error getting schedule with id: ${id}`, error.message);
        res.status(404).json({error: error.message})
    }
}

async function getScheduleByTheater(req,res){
    const {theater_id} = req.params;
    try {
        const schedules = await Schedule.getScheduleByTheater(theater_id);
        res.status(200).json({schedules});
    } catch (error){
        console.error(`Error getting schedule by theater with id: ${id}`, error.message);
        res.status(404).json({error: error.message})
    }
}

async function getScheduleByScreening_date(req, res) {
    const {date} = req.params;
    try {
        const schedules = await Schedule.getScheduleByScreening_date(date);
        res.status(200).json({schedules});
    } catch (error){
        console.error(`Error getting schedule with date: ${date}`, error.message);
        res.status(404).json({error: error.message})
    }
}

async function getScheduleByAuditorium(req,res) {
    const {auditorium_id} = req.params;
    try {
        const schedules = await Schedule.getScheduleByAuditorium(auditorium_id);
        res.status(200).json({schedules});
    } catch (error){
        console.error(`Error getting schedule by auditorium with id: ${auditorium_id}`, error.message);
        res.status(404).json({error: error.message})
    }
}

async function getScheduleByMovie(req, res) {
    const {movie_id} = req.params;
    try {
        const schedules = await Schedule.getScheduleByMovie(movie_id);
        res.status(200).json({schedules});
    } catch (error){
        console.error(`Error getting schedule by movie with id: ${movie_id}`, error.message);
        res.status(404).json({error: error.message})
    }
}

async function getScheduleByMovieAndTheater(req, res) {
    const {movie_id, theater_id} = req.params;
    try {
        const schedules = await Schedule.getScheduleByMovieAndTheater(movie_id, theater_id);
        res.status(200).json({schedules});
    } catch (error){
        console.error(`Error getting schedule by movie with id: ${movie_id}`, error.message);
        res.status(404).json({error: error.message})
    }
}

async function deleteSchedule(req,res){
    const {id} = req.params;
    try {
        await Schedule.deleteSchedule(id);
        res.status(204).send();
    } catch (error){
        console.error(`Error deleting schedule with id: ${id}`, error.message);
        res.status(404).json({error: error.message})
    }
}

async function getSeatsBySchedule(req, res) {
    const { id } = req.params;
    try {
        const result = await db.query(
            `SELECT s.id, s.seat_id, s.status
             FROM showtime_seats s
             WHERE s.schedule_id = $1`,
             [id]
        );
        res.status(200).json({ seats: result.rows });
    } catch (error) {
        console.error(`Error fetching seats for schedule ${id}`, error.message);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    importSchedule,
    updateSchedule,
    getSchedules,
    getScheduleById,
    getScheduleByTheater,
    getScheduleByScreening_date,
    getScheduleByAuditorium,
    getScheduleByMovie,
    getScheduleByMovieAndTheater,
    deleteSchedule,
    getSeatsBySchedule
}