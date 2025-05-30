import mongoose from "mongoose";
import { type } from "os";


const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    year: {
        type: Number,
        required: true,
    },
    director: {
        type: String,
        trim: true,
    },
    genre: {
        type: [String],
        required: true,
    },
    poster: {
        type: String,
        default: '',
    },
    plot: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 10,
    },
    runtime: {
        type: String,
    },
    actors: {
        type: [String],
    },
    embedding: {
        type: [Number],
        validate: arr => arr.length === 1536,
        index: false
    }
});

export default mongoose.model('Movie', movieSchema);