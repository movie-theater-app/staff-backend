const db = require('../db/db');

// Adds theatre
async function addTheatre(theatreData) {
    const { name, address, contact_information } = theatreData;

    // check for duplicates
    const check = await db.query('SELECT * FROM theaters WHERE name = $1', [name]);
    if (check.rows.length > 0) {
        throw new Error('Theatre with this name already exists');
    }

    const query = `
        INSERT INTO theaters (name, address, contact_information)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    const values = [name, address, contact_information];

    return await db.query(query, values);
}

// Adds auditorium linked to a theatre
async function addAuditorium(auditoriumData) {
    const { theater_id, name, seat_count } = auditoriumData;

    const check = await db.query(
        'SELECT * FROM auditoriums WHERE name = $1 AND theater_id = $2', 
        [name, theater_id]);
    if (check.rows.length > 0) {
        throw new Error('This theatre already has an auditorium with that name');
    }

    const query = `
        INSERT INTO auditoriums (theater_id, name, seat_count)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    const values = [theater_id, name, seat_count];

    return await db.query(query, values);
}

module.exports = {
    addTheatre,
    addAuditorium
};
