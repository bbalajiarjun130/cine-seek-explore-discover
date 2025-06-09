import Movie from '../models/Movie.js';
import axios from 'axios';
import stringSimilarity from 'string-similarity';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

export const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find({}, '-embedding') // Exclude embedding field
        .sort({ rating: -1 }) // Sort by rating
        .limit(6); // Limit to 10 results

        res.status(200).json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getEmbedding = async (text) => {
  const response = await axios.post(
    "https://api.openai.com/v1/embeddings",
    {
      input: text,
      model: "text-embedding-ada-002",
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  return response.data.data[0].embedding;
};

export const addMovies = async (req, res) => {
    try {
        const {
            title,
            year,
            director,
            genre,
            poster,
            plot,
            rating,
            actors,
        } = req.body;

        if (!title || !genre || !year || !plot) {
            return res.status(400).json({ message: 'Required fields are missing.' });
        }
      
        // Get embedding from OpenAI
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: plot,
        });
      
        const embedding = embeddingResponse.data[0].embedding;

        const newMovie = new Movie({
            title,
            year,
            director,
            genre,
            poster,
            plot,
            rating,
            actors,
            embedding, // Add the embedding field
        });

        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie);
    } catch (error) {
        console.error('Error creating movie:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const searchMovies = async (req, res) => {
    const { query } = req.body;

    try {
        const embedResponse = await axios.post(
            'https://api.openai.com/v1/embeddings', {
                input: query,
                model: 'text-embedding-ada-002'
            }, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        )

        const queryEmbedding = embedResponse.data.data[0].embedding;

        const movies = await Movie.find({}, {
            title: 1,
            year: 1,
            director: 1,
            genre: 1,
            poster: 1,
            plot: 1,
            rating: 1,
            actors : 1,
            embedding: 1 
          });

        const cosineSimilarity = (vecA, vecB) => {
            const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
            const normA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
            const normB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
            return dotProduct / (normA * normB);
        }

        const matchProperty = {
            'exact match': 3,
            'partial match': 2,
            'no match': 1
        }

        const results = movies.map(movie => {
            const similarity = cosineSimilarity(queryEmbedding, movie.embedding);

            const title = movie.title || '';
            const plot = movie.plot || '';

            const titleSimilarity = stringSimilarity.compareTwoStrings(query, title);
            const plotSimilarity = stringSimilarity.compareTwoStrings(query, plot);

            let matchType = 'no match';
            if (titleSimilarity > 0.9) {
                matchType = 'exact match';
            } else if (titleSimilarity > 0.6 || plotSimilarity > 0.6) {
                matchType = 'partial match';
            }

            const { embedding, ...cleaned } = movie.toObject(); // remove embedding
            return { ...cleaned, similarity, matchType };
          })
          .sort((a, b) => {
            const propertyDifference = matchProperty[b.matchType] - matchProperty[a.matchType];
            if (propertyDifference !== 0) {
                return propertyDifference;
            }
            return b.similarity - a.similarity; // Sort by similarity if match types are the same
          })
          .slice(0, 5);
        
        // Log the results
        res.json(results)
    }
    catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const advancedSearch = async (req, res) => {
  const { title, genre, actors, year, director, rating } = req.body;

  try {
    const actualQuery = {};

    // Title - case-insensitive partial match
    if (typeof title === 'string' && title.trim() !== '') {
      actualQuery.title = { $regex: title.trim(), $options: 'i' };
    }

    // Genre - accepts either a string (comma-separated) or array
    if (typeof genre === 'string' && genre.trim() !== '') {
      const genreArray = genre.split(',').map(g => g.trim()).filter(Boolean);
      if (genreArray.length > 0) {
        actualQuery.genre = { $in: genreArray };
      }
    } else if (Array.isArray(genre) && genre.length > 0) {
      actualQuery.genre = {
        $in: genre.map(g => g.trim()).filter(Boolean)
      };
    }

    // Actors - partial match in array
    if (Array.isArray(actors) && actors.length > 0) {
      actualQuery.actors = {
        $in: actors
          .filter(actor => typeof actor === 'string' && actor.trim() !== '')
          .map(actor => actor.trim())
      };
    }

    // Year - numeric range
    if (Array.isArray(year) && year.length === 2) {
      actualQuery.year = { $gte: year[0], $lte: year[1] };
    }

    // Director - case-insensitive partial match
    if (typeof director === 'string' && director.trim() !== '') {
      actualQuery.director = { $regex: director.trim(), $options: 'i' };
    }

    // Rating - numeric range
    if (Array.isArray(rating) && rating.length === 2) {
      actualQuery.rating = { $gte: rating[0], $lte: rating[1] };
    }

    const movies = await Movie.find(actualQuery).select('-embedding');
    res.json(movies);
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};