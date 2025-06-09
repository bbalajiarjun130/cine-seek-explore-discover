import express from 'express';
import {addMovies, advancedSearch, getMovies, searchMovies} from '../controllers/movieController.js';

const router = express.Router();

router.get('/', getMovies);

router.post('/add-movie', addMovies);

router.post('/search', searchMovies);

router.post('/advanced-search', advancedSearch)

export default router;