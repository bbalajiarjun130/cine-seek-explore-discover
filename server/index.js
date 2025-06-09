import express from 'express';
import connectDB from './config/config.js';
import movieRoutes from './routes/movieRoutes.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:8080',
}));

// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.json());

// Connect to the database
connectDB();

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the Semantic Search API!');
});

// Use the movie routes
app.use('/api/movies', movieRoutes);

// Start the server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});