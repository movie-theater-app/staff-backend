const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// router.post('/', movieController.addMovie);

router.get('/tmdb/search', movieController.searchTMDBMovie);
router.get('/tmdb/search/:tmbId', movieController.getTMDBMovieByID);

router.get('/', movieController.getAllMovies); //get movies that are already inside our database

router.post('/import', movieController.importMovie);
router.get('/:id', movieController.getMovieById);
router.put('/:id', movieController.updateMovie);
router.delete('/:id', movieController.deleteMovie)

module.exports = router;