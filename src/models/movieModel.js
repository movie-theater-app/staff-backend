const db = require('../db/db');


async function addMovie(movieData) {
    const {
        title,
        trailer_url,
        genre,
        duration_minutes,
        description,
        poster_url,
        age_rating,
    } = movieData;

    const query =`
        INSERT INTO movies
        (title, trailer_url, genre, duration_minutes, description, poster_url, age_rating)
        VALUES
        ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *;
    `;

    const values = [
        title,
        trailer_url,
        genre,
        duration_minutes,
        description,
        poster_url,
        age_rating,
    ]

   return await db.query(query, values);

}

module.exports = {
    addMovie
}