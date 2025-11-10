const axios = require("axios");
const Movie = require('../models/movieModel');
const {addMovie} = require("../models/movieModel");
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
            id: movie.id,
            title: movie.title,
            releaseDate: movie.release_date,
            posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w92/${movie.poster_path}` : null
        }));

        res.json(results);
    } catch (e) {
        res.status(500).json({error: e});
    }
}
async function getTMDBMovieByID(req, res) {
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

        const {data : {results : releaseResults} } = await axios.get(`${TMDB_API_URL}/movie/${tmbId}/release_dates`,{
            params: {
                api_key: TMDB_API_KEY,
            }
        });


        const finnishRelease = releaseResults.find((r) => r.iso_3166_1 === "ES");
        const ageRating = finnishRelease.release_dates[0].certification;

        const genres = movie.genres.map((genre) => genre.name).join(", ");

        const firstTrailer = officialTrailers.length > 0 ? officialTrailers[0] : null;
        const trailerURL = firstTrailer ? `https://www.youtube.com/watch?v=${firstTrailer.key}` : null;
        const movieData = {
            id: tmbId,
            title: movie.title,
            trailer_url: trailerURL,
            genre: genres,
            duration_minutes: movie.runtime,
            description: movie.overview,
            poster_url: movie.poster_path ? `http://image.tmdb.org/t/p/w185${movie.poster_path}` : null,
            age_rating: ageRating, // THIS AGE RATING IS FOR SPAIN AS IT IS ONLY INTEGERS.
        }

        res.status(201).json(movieData);
    } catch (e) {
        console.error(e);
        res.status(404).json({error: e});
    }
}



async function importMovie(req, res) {
    try {
        addedMovie = await Movie.addMovie(req.body);
        if(!addedMovie) {
            throw new error("There is already movie with this ID")
        }
        res.status(201).json(addedMovie);
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
    getTMDBMovieByID,
    importMovie,
    updateMovie,
    getAllMovies,
    getMovieById,
    deleteMovie,
}