const db = require('../db/db');
const result = require("pg/lib/query");


async function addMovie(movieData) {
    const {
        id,
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
        (id,title, trailer_url, genre, duration_minutes, description, poster_url, age_rating)
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *;
    `;

    const values = [
        id,
        title,
        trailer_url,
        genre,
        duration_minutes,
        description,
        poster_url,
        age_rating,
    ]

   const result = await db.query(query, values);
    return result.rows[0];

}

async function updateMovie(id, movieData) {
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
        UPDATE movies
        SET
        title = $1,
        trailer_url = $2,
        genre = $3,
        duration_minutes = $4, 
        description = $5,
        poster_url = $6,
        age_rating = $7
        WHERE id = $8
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
        id
    ]

    const result = await db.query(query, values);
    return result.rows[0];
}

async function deleteMovie(id) {
    const query =`
    DELETE FROM movies
    WHERE id = $1;`;

    const result = await db.query(query, [id]);
    return result.rowCount;
}

async function getAllMovies() {
    const query =`
    SELECT id,title 
    FROM movies
    ORDER BY title;
    `;

    const results = await db.query(query);
    return results.rows;
}

async function getMovieByID(id) {
    const query =`
    SELECT *
    FROM movies
    WHERE id = $1;`;

    const result = await db.query(query, [id]);
    return result.rows[0];
}

module.exports = {
    addMovie,
    updateMovie,
    deleteMovie,
    getAllMovies,
    getMovieByID,
}