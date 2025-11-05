const db = require('../db/db');

// Adds theatre
async function addTheatre(theatreData) {
    const { name, address, contact_information } = theatreData;

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
