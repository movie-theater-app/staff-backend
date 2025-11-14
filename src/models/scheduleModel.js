const db = require ('../db/db');

async function importSchedule (scheduleData) {
    const {
        movie_id,
        theater_id,
        auditorium_id,
        screening_date,
        start_time,
        end_time
    } = scheduleData;

    const query = `
    INSERT INTO schedules
    (movie_id, theater_id, auditorium_id, screening_date, start_time, end_time)
    VALUES 
    ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (auditorium_id, screening_date, start_time) DO NOTHING
    RETURNING *;`;


    const values = [
        movie_id,
        theater_id,
        auditorium_id,
        screening_date,
        start_time,
        end_time
    ]

    const result = await db.query(query, values);

    if (result.rowCount === 0){
        console.error(`Error adding schedule, there is already a movie playing at that time (${start_time}) and day (${screening_date}) in that auditorium with id: ${auditorium_id}) `);
        return null;
    }

    return result.rows[0];
}

async function updateSchedule (id, data) {

}

async function getSchedules(){
    const query = `
    SELECT * 
    FROM schedules
    ORDER BY screening_date ASC, start_time ASC;`;


    const result = await db.query(query);

    if (result.rowCount === 0) {
        throw new Error("Schedules not found");
    }

    return result.rows;
}
async function getScheduleById(id) {
    const query = `
    SELECT * 
    FROM schedules
    WHERE id = $1;`;

    const result = await db.query(query,[id]);

    if (result.rowCount === 0) {
        throw new Error(`Schedule with id: ${id} not found`);
    }

    return result.rows[0];
}

async function getScheduleByTheater(theater_id){
    const query = `
    SELECT * 
    FROM schedules
    WHERE theater_id = $1;`;

    const result = await db.query(query,[theater_id]);

    if (result.rowCount === 0) {
        throw new Error(`Schedules with by theater with id: ${theater_id} not found`);
    }

    return result.rows;
}

async function getScheduleByScreening_date(date) {
    const query = `
    SELECT * 
    FROM schedules
    WHERE screening_date = $1;`;

    const result = await db.query(query,[date]);

    if (result.rowCount === 0) {
        throw new Error(`Schedules with date: ${date} not found`);
    }

    return result.rows;
}

async function getScheduleByAuditorium(auditorium_id) {
    const query = `
    SELECT * 
    FROM schedules
    WHERE auditorium_id = $1;`;

    const result = await db.query(query,[auditorium_id]);

    if (result.rowCount === 0) {
        throw new Error(`Schedules by auditorium with id: ${auditorium_id} not found`);
    }

    return result.rows;
}

async function getScheduleByMovie(movie_id) {
    const query = `
    SELECT * 
    FROM schedules
    WHERE movie_id = $1;`;

    const result = await db.query(query,[movie_id]);

    if (result.rowCount === 0) {
        throw new Error(`Schedule by movie with id: ${movie_id} not found`);
    }

    return result.rows;
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