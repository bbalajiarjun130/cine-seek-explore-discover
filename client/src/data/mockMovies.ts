
import { Movie } from "@/types/movie";

export const mockMovies: Movie[] = [
  {
    id: "1",
    title: "Inception",
    year: 2010,
    director: "Christopher Nolan",
    genre: ["Action", "Sci-Fi", "Thriller"],
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the task of planting an idea into the mind of a C.E.O.",
    rating: 8.8,
    runtime: "148 min",
    actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"]
  },
  {
    id: "2",
    title: "The Matrix",
    year: 1999,
    director: "Lana Wachowski",
    genre: ["Action", "Sci-Fi"],
    poster: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    plot: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    rating: 8.7,
    runtime: "136 min",
    actors: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"]
  },
  {
    id: "3",
    title: "Pulp Fiction",
    year: 1994,
    director: "Quentin Tarantino",
    genre: ["Crime", "Drama"],
    poster: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    plot: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    rating: 8.9,
    runtime: "154 min",
    actors: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"]
  },
  {
    id: "4",
    title: "The Shawshank Redemption",
    year: 1994,
    director: "Frank Darabont",
    genre: ["Drama"],
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    plot: "Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.",
    rating: 9.3,
    runtime: "142 min",
    actors: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"]
  },
  {
    id: "5",
    title: "The Dark Knight",
    year: 2008,
    director: "Christopher Nolan",
    genre: ["Action", "Crime", "Drama"],
    poster: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    rating: 9.0,
    runtime: "152 min",
    actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"]
  },
  {
    id: "6",
    title: "Interstellar",
    year: 2014,
    director: "Christopher Nolan",
    genre: ["Adventure", "Drama", "Sci-Fi"],
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    plot: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    rating: 8.6,
    runtime: "169 min",
    actors: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"]
  }
];

export const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Film Noir",
  "History",
  "Horror",
  "Music",
  "Musical",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Short Film",
  "Sport",
  "Superhero",
  "Thriller",
  "War",
  "Western"
];
