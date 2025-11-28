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
        SELECT $1, $2, $3, $4, $5, $6
            WHERE NOT EXISTS (
      SELECT 1
      FROM schedules s
      WHERE s.auditorium_id = $3
            AND s.screening_date = $4
            AND $5 < s.end_time
            AND $6 > s.start_time
            )
            RETURNING *;
    `;


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
        const error = `Error adding schedule, there is already a movie 
        playing with start time: ${start_time}, end time: ${end_time} and day (${screening_date}) in that auditorium with id: ${auditorium_id}) `
        console.error(error);
        return null;
    }

    const schedule = result.rows[0];
    await seatsPerShowtime(schedule.id, auditorium_id);
    return schedule;
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

async function getScheduleByMovieAndTheater( movie_id, theater_id) {
    const query = `
    SELECT *
    FROM schedules
    WHERE movie_id = $1
    AND theater_id = $2;`;

    const result = await db.query(query,[movie_id, theater_id]);

    if (result.rowCount === 0) {
        console.warn(`Schedule by movie with id: ${movie_id} and theater with id:${theater_id}not found`);
    }

    return result.rows;
}

async function deleteSchedule(id) {
    const query = `
    DELETE 
    FROM schedules
    WHERE id = $1`;

    await db.query(query,[id]);
}
// seats per showtime
async function seatsPerShowtime(scheduleId, auditoriumId) {

      // check if seats already exist for this showtime
    const existing = await db.query(
        `SELECT 1 FROM showtime_seats WHERE schedule_id = $1 LIMIT 1`,
        [scheduleId]
    );
    if (existing.rowCount > 0) {
        console.log(`Showtime seats already exist for schedule ${scheduleId}`);
        return;
    }

    // get auditorium seats
    const seatsResult = await db.query(
        `SELECT id, status FROM seats WHERE auditorium_id = $1`,
        [auditoriumId]
    );

    if (seatsResult.rowCount === 0) {
        throw new Error(`No seats found for auditorium ${auditoriumId}`);
    }
    const seatIds = seatsResult.rows;
    // insert each seat into showtime_seats-table
    for (const seat of seatIds) {
        await db.query(
            `INSERT INTO showtime_seats (schedule_id, seat_id, status)
             VALUES ($1, $2, $3)`,
            [scheduleId, seat.id, seat.status]
        );
    }

    return seatIds.length; 
}


async function seatsPerShowtime(scheduleId, auditoriumId) {
    // get auditorium seats
    const seatsResult = await db.query(
        `SELECT id, status FROM seats WHERE auditorium_id = $1`,
        [auditoriumId]
    );

    if (seatsResult.rowCount === 0) {
        throw new Error(`No seats found for auditorium ${auditoriumId}`);
    }

    const seatIds = seatsResult.rows;

    // insert each seat into showtime_seats-table
    for (const seat of seatIds) {
        await db.query(
            `INSERT INTO showtime_seats (schedule_id, seat_id, status)
             VALUES ($1, $2, $3)`,
            [scheduleId, seat.id, seat.status]
        );
    }

    return seatIds.length; 
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
    seatsPerShowtime
}