const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { authRequired} = require('../middleware/authenticationMiddleware');

// router.post('/', movieController.addMovie);

router.get('/tmdb/search', authRequired, movieController.searchTMDBMovie);
router.get('/tmdb/search/:tmbId', authRequired, movieController.getTMDBMovieByID);

router.get('/', authRequired, movieController.getAllMovies); //get movies that are already inside our database

router.post('/import', authRequired, movieController.importMovie);
router.get('/:id', authRequired, movieController.getMovieById);
router.put('/:id', authRequired, movieController.updateMovie);
router.delete('/:id', authRequired, movieController.deleteMovie)

module.exports = router;