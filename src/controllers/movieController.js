const Movie = require('../models/movieModel');

async function addMovie(req, res) {
    try {
        const movie = await Movie.addMovie(req.body);
        res.status(201).json(movie);
    } catch (error) {
        console.error("Error adding movie: " + error);
        res.status(500).json({error: "Failed to add movie"})
    }
}

module.exports = {
    addMovie
}