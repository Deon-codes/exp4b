import express from "express";

const app = express();
const port = 4000;

// Middleware to read JSON from Postman
app.use(express.json());

// Sample movie data
let movies = [
  {
    id: 1,
    title: "Interstellar",
    genre: "Sci-Fi",
    rating: 5,
    recommendation: "Yes"
  },
  {
    id: 2,
    title: "Mission impossible",
    genre: "Action",
    rating: 4,
    recommendation: "Yes"
  },
  {
    id: 3,
    title: "Conjuring",
    genre: "horror",
    rating: 3,
    recommendation: "No"
  }
];

// ====================================
// GET /movies
// Get all movies OR filter by rating
// ====================================
app.get("/movies", (req, res) => {
  const rating = req.query.rating;

  if (rating) {
    const filteredMovies = movies.filter(movie => movie.rating == rating);
    return res.json(filteredMovies);
  }

  res.json(movies);
});

// ====================================
// POST /movies
// Add a new movie
// ====================================
app.post("/movies", (req, res) => {
  const newMovie = {
    id: movies.length + 1,
    title: req.body.title,
    genre: req.body.genre,
    rating: req.body.rating,
    recommendation: req.body.recommendation
  };

  movies.push(newMovie);

  res.status(201).json({
    message: "Movie added successfully",
    movie: newMovie
  });
});

// ====================================
// PATCH /movies/:id
// Update selected movie fields
// ====================================
app.patch("/movies/:id", (req, res) => {
  const movieId = parseInt(req.params.id);
  const movie = movies.find(m => m.id === movieId);

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  if (req.body.title) movie.title = req.body.title;
  if (req.body.genre) movie.genre = req.body.genre;
  if (req.body.rating) movie.rating = req.body.rating;
  if (req.body.recommendation) movie.recommendation = req.body.recommendation;

  res.json({
    message: "Movie updated successfully",
    movie: movie
  });
});

// ====================================
// DELETE /movies/:id
// Delete a movie
// ====================================
app.delete("/movies/:id", (req, res) => {
  const movieId = parseInt(req.params.id);
  const movieIndex = movies.findIndex(m => m.id === movieId);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const deletedMovie = movies.splice(movieIndex, 1);

  res.json({
    message: "Movie deleted successfully",
    movie: deletedMovie[0]
  });
});

// Start server
app.listen(port, () => {
  console.log(`Movie API running at http://localhost:${port}`);
});
