
import { useState } from "react";
import { ArrowUpRight, Bookmark, Star } from "lucide-react";
import type { Movie } from "../data/movies";

interface FilmGalleryProps {
  movies: Movie[];
  searchQuery: string;
}

const categories = ["All", "Sci-Fi", "Drama", "Romance", "Action", "Comedy"];

export default function FilmGallery({
  movies,
  searchQuery,
}: FilmGalleryProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [savedMovies, setSavedMovies] = useState<number[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const filteredMovies = movies.filter((movie) => {
    const matchesCategory =
      activeCategory === "All" || movie.genre === activeCategory;

    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const toggleSave = (id: number) => {
    setSavedMovies((previous) =>
      previous.includes(id)
        ? previous.filter((movieId) => movieId !== id)
        : [...previous, id]
    );
  };

  return (
    <section className="editorial-section section-padding" id="discover">
      <div className="section-topline">
        <span className="section-label">01 / The collection</span>
        <span className="section-label">Curated for the curious</span>
      </div>

      <div className="section-heading">
        <div>
          <p className="section-eyebrow">A world of stories</p>
          <h2 className="section-title">
            THE <span className="outline-text">MOVIE</span>
            <br /> INDEX<span className="accent-dot">.</span>
          </h2>
        </div>
        <p className="section-subtitle">
          From unforgettable classics to modern masterpieces.
          Find stories that stay with you long after the credits.
        </p>
      </div>

      <div className="filter-bar">
        <div className="filter-list" role="group" aria-label="Filter by genre">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-chip ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <span className="results-count">
          {filteredMovies.length.toString().padStart(2, "0")} FILMS
        </span>
      </div>

      {filteredMovies.length > 0 ? (
        <div className="film-grid">
          {filteredMovies.map((movie, index) => (
            <article className="film-card" key={movie.id}>
              <button
                className="film-image"
                onClick={() => setSelectedMovie(movie)}
                aria-label={`View ${movie.title} details`}
              >
                <img src={movie.poster} alt={`${movie.title} poster`} />
                <span className="film-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="film-view">
                  View film <ArrowUpRight size={14} />
                </span>
              </button>

              <div className="film-meta">
                <div>
                  <h3 className="film-name">{movie.title}</h3>
                  <p className="film-info">
                    {movie.year} <span>•</span> {movie.genre}
                  </p>
                </div>
                <div className="film-actions">
                  <span className="film-rating">
                    <Star size={12} fill="currentColor" />
                    {movie.rating.toFixed(1)}
                  </span>
                  <button
                    className={`save-button ${
                      savedMovies.includes(movie.id) ? "saved" : ""
                    }`}
                    onClick={() => toggleSave(movie.id)}
                    aria-label={
                      savedMovies.includes(movie.id)
                        ? `Remove ${movie.title} from saved films`
                        : `Save ${movie.title}`
                    }
                  >
                    <Bookmark
                      size={16}
                      fill={
                        savedMovies.includes(movie.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>NO FILMS FOUND.</p>
          <span>Try a different title or category.</span>
        </div>
      )}

      {selectedMovie && (
        <div
          className="movie-modal-backdrop"
          onClick={() => setSelectedMovie(null)}
          role="presentation"
        >
          <div
            className="movie-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedMovie(null)}
              aria-label="Close movie details"
            >
              ×
            </button>
            <img
              className="modal-backdrop"
              src={selectedMovie.backdrop}
              alt=""
            />
            <div className="modal-content">
              <p className="section-label">CINEMATE / FILM DETAILS</p>
              <h2 id="modal-title">{selectedMovie.title}</h2>
              <div className="modal-meta">
                <span>{selectedMovie.year}</span>
                <span>{selectedMovie.genre}</span>
                <span>
                  <Star size={13} fill="currentColor" />
                  {selectedMovie.rating.toFixed(1)}
                </span>
              </div>
              <p>{selectedMovie.description}</p>
              <button
                className="modal-save"
                onClick={() => toggleSave(selectedMovie.id)}
              >
                <Bookmark size={15} />
                {savedMovies.includes(selectedMovie.id)
                  ? "Saved to your list"
                  : "Add to watchlist"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}