const Schedule = require("../models/scheduleModel");
const db = require("../db/db");

async function importSchedule(req, res) {
    try {
        const schedule = await Schedule.importSchedule(req.body);
        res.status(201).json({schedule});
    } catch (error){
        console.error("Error adding schedule: ", error.message);
        res.status(500).json({error: error})
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
        res.status(404).json({error: error})
    }
}
async function getScheduleById(req,res) {
    const {id} = req.params;
    try {
        const schedule = await Schedule.getScheduleById(id);
        res.status(200).json({schedule});
    } catch (error){
        console.error(`Error getting schedule with id: ${id}`, error.message);
        res.status(404).json({error: error})
    }
}

async function getScheduleByTheater(req,res){
    const {theater_id} = req.params;
    try {
        const schedules = await Schedule.getScheduleByTheater(theater_id);
        res.status(200).json({schedules});
    } catch (error){
        console.error(`Error getting schedule by theater with id: ${id}`, error.message);
        res.status(404).json({error: error})
    }
}

async function getScheduleByScreening_date(req, res) {
    const {date} = req.params;
    try {
        const schedules = await Schedule.getScheduleByScreening_date(date);
        res.status(200).json({schedules});
    } catch (error){
        console.error(`Error getting schedule with date: ${date}`, error.message);
        res.status(404).json({error: error})
    }
}

async function getScheduleByAuditorium(req,res) {
    const {auditorium_id} = req.params;
    try {
        const schedules = await Schedule.getScheduleByAuditorium(auditorium_id);
        res.status(200).json({schedules});
    } catch (error){
        console.error(`Error getting schedule by auditorium with id: ${auditorium_id}`, error.message);
        res.status(404).json({error: error})
    }
}

async function getScheduleByMovie(req, res) {
    const {movie_id} = req.params;
    try {
        const schedules = await Schedule.getScheduleByMovie(movie_id);
        res.status(200).json({schedules});
    } catch (error){
        console.error(`Error getting schedule by movie with id: ${movie_id}`, error.message);
        res.status(404).json({error: error})
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
}