const axios = require("axios");
const Movie = require('../models/movieModel');
require('dotenv').config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = process.env.TMDB_BASE_URL;

async function searchTMDBMovie(req, res) {
    const query = req.query.query;

    if (!query) {
        return res.status(404).json({error: "No query found with query"});
    }

    try {
        const { data } = await axios.get(`${TMDB_API_URL}/search/movie`,{
            params: {
                api_key: TMDB_API_KEY,
                query,
            }
        });

        const results = data.results.map((movie) => ({
            tmdbID: movie.id,
            title: movie.title,
            releaseDate: movie.release_date,
            posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}` : null
        }));

        res.json(results);
    } catch (e) {
        res.status(500).json({error: e});
    }
}

async function importTMDBMovie(req, res) {
    const { tmbId } = req.params;
    try {
        const { data : movie } = await axios.get(`${TMDB_API_URL}/movie/${tmbId}`,{
            params: {
                api_key: TMDB_API_KEY,
            }
        })

        const { data: {results} } = await axios.get(`${TMDB_API_URL}/movie/${tmbId}/videos`,{
            params: {
                api_key: TMDB_API_KEY,
            }
        });
        const officialTrailers = results.filter((video) =>
            video.site === "YouTube" &&
            video.type === "Trailer" &&
            video.official === true,
        );
        const firstTrailer = officialTrailers.length > 0 ? officialTrailers[0] : null;
        const trailerURL = firstTrailer ? `https://www.youtube.com/watch?v=${firstTrailer.key}` : null;
        const movieData = {
            id: tmbId,
            title: movie.title,
            trailer_url: trailerURL,
            genre: movie.GENRE, // CHANGE THIS; THERE IS AN ARRAY OF OBJECTS FOR THE GENRE
            duration_minutes: movie.runtime,
            description: movie.overview,
            poster_url: movie.poster_path ? `http://image.tmdb.org/t/p/w185${movie.poster_path}` : null, // This is hardcoded the URL, it can be accessed through the configuration but it would mean one more API call and Idk if it means something
            age_rating: movie.vote_count, //THIS IS NOT THE AGE RATING BUT THERE IS NOT AGE RATING IN THIS API, JUST ADULT OR NOT
        }

        await Movie.addMovie(movieData);
        res.status(201).json(movie);
    } catch (error) {
        console.error("Error adding movie: " + error);
        res.status(500).json({error: "Failed to add movie"})
    }
}

async function updateMovie(req, res) {
    try{
        const movie = await Movie.updateMovie(req.body);
        if(!movie) return res.status(404).json({error: "No movie found to update"});
        res.status(200).json(movie);
    } catch (error) {
        console.error("Error updating movie: " + error);
        res.status(500).json({error: "Failed to update movie"})
    }
}

async function getAllMovies(req, res) {
    try {
        const movies = await Movie.getAllMovies();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({error: error});
    }
}

async function getMovieById(req, res) {
    try {
        const movie = await Movie.getMovieByID(req.params.id);
        if(!movie) return res.status(404).json({error: "No movie found with this id"});
        res.status(200).json(movie);
    } catch (error) {
        res.status(404).json({error: error});
    }
}

async function deleteMovie(req, res) {
    try {
        const deletedCount = await Movie.deleteMovie(req.params.id);
        if(deletedCount === 0){
            res.status(404).json({error: "No movie found with this id"});
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({error: error});
    }
}

module.exports = {
    searchTMDBMovie,
    importTMDBMovie,
    updateMovie,
    getAllMovies,
    getMovieById,
    deleteMovie,
}