
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Film,
  Menu,
  Search,
  Star,
  UserRound,
  X,
} from "lucide-react";
import "./index.css";

type Movie = {
  id: number;
  title: string;
  year: number;
  genre: string;
  rating: number;
  image: string;
  description: string;
  duration: string;
  director: string;
};

const movies: Movie[] = [
  {
    id: 1,
    title: "Oppenheimer",
    year: 2023,
    genre: "Drama",
    rating: 8.3,
    image:
      "https://image.tmdb.org/t/p/w780/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
    description:
      "The story of J. Robert Oppenheimer and his role in the development of the atomic bomb, exploring the scientific ambition and moral consequences of a world-changing discovery.",
    duration: "3h",
    director: "Christopher Nolan",
  },
  {
    id: 2,
    title: "Interstellar",
    year: 2014,
    genre: "Sci-Fi",
    rating: 8.7,
    image:
      "https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    description:
      "A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars.",
    duration: "2h 49m",
    director: "Christopher Nolan",
  },
  {
    id: 3,
    title: "Dune: Part Two",
    year: 2024,
    genre: "Sci-Fi",
    rating: 8.5,
    image:
      "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    duration: "2h 46m",
    director: "Denis Villeneuve",
  },
  {
    id: 4,
    title: "The Batman",
    year: 2022,
    genre: "Thriller",
    rating: 7.8,
    image:
      "https://image.tmdb.org/t/p/w780/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    description:
      "When a sadistic killer targets Gotham's elite, Batman must investigate the corruption hidden beneath the city's surface.",
    duration: "2h 56m",
    director: "Matt Reeves",
  },
  {
    id: 5,
    title: "La La Land",
    year: 2016,
    genre: "Romance",
    rating: 8.0,
    image:
      "https://image.tmdb.org/t/p/w780/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    description:
      "An aspiring actress and a dedicated jazz musician meet in Los Angeles and pursue their dreams while navigating love and ambition.",
    duration: "2h 8m",
    director: "Damien Chazelle",
  },
  {
    id: 6,
    title: "Whiplash",
    year: 2014,
    genre: "Drama",
    rating: 8.5,
    image:
      "https://image.tmdb.org/t/p/w780/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    description:
      "A young drummer enters an intense relationship with a demanding music instructor at a prestigious conservatory.",
    duration: "1h 47m",
    director: "Damien Chazelle",
  },
  {
    id: 7,
    title: "Parasite",
    year: 2019,
    genre: "Thriller",
    rating: 8.5,
    image:
      "https://image.tmdb.org/t/p/w780/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    description:
      "A poor family gradually becomes entangled with a wealthy household, setting off a chain of unexpected events.",
    duration: "2h 12m",
    director: "Bong Joon-ho",
  },
  {
    id: 8,
    title: "Past Lives",
    year: 2023,
    genre: "Romance",
    rating: 7.8,
    image:
      "https://image.tmdb.org/t/p/w780/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg",
    description:
      "Two childhood friends reconnect after decades apart and reflect on love, destiny, and the lives they might have lived.",
    duration: "1h 45m",
    director: "Celine Song",
  },
  {
    id: 9,
    title: "Everything Everywhere All at Once",
    year: 2022,
    genre: "Sci-Fi",
    rating: 7.7,
    image:
      "https://image.tmdb.org/t/p/w780/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    description:
      "An exhausted laundromat owner discovers that she must connect with alternate versions of herself to save the multiverse.",
    duration: "2h 19m",
    director: "Daniel Kwan and Daniel Scheinert",
  },
];

const featuredMovies = [movies[0], movies[1], movies[2], movies[3]];

const genres = ["All films", "Drama", "Sci-Fi", "Thriller", "Romance"];

type TMDBSearchMovie = {
  id: number;
  title: string;
  release_date?: string;
  poster_path: string | null;
  overview?: string;
  vote_average?: number;
  genre_ids?: number[];
};

const TMDB_API = "https://api.themoviedb.org/3";
const TMDB_IMAGE = "https://image.tmdb.org/t/p/w780";
const genreNames: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 18: "Drama", 14: "Fantasy", 27: "Horror",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 53: "Thriller",
};


function Brand() {
  return (
    <a href="#home" className="brand" aria-label="CineMate home">
      CINE<span>MATE</span>
      <sup>®</sup>
    </a>
  );
}

function Navigation({
  onSearch,
}: {
  onSearch: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <Brand />

      <nav className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
        <a href="#discover" onClick={() => setMenuOpen(false)}>
          Discover
        </a>
        <a href="#collections" onClick={() => setMenuOpen(false)}>
          Collections
        </a>
        <a href="/awards" onClick={() => setMenuOpen(false)}>
          Awards
        </a>
        <a href="#about" onClick={() => setMenuOpen(false)}>
          About
        </a>
      </nav>

      <div className="nav-controls">
        <button className="nav-search" onClick={onSearch}>
          <Search size={14} />
          <span>Search</span>
        </button>
        <button
          className="mobile-menu"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
    </header>
  );
}

function SearchPanel({
  open,
  onClose,
  query,
  setQuery,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  query: string;
  setQuery: (value: string) => void;
  onSubmit: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="search-overlay" onMouseDown={onClose}>
      <div
        className="search-panel"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="search-panel-top">
          <label htmlFor="movie-search">Find your next film</label>
          <button aria-label="Close search" onClick={onClose}>
            <X size={19} />
          </button>
        </div>

        <div className="search-input-wrap">
          <Search size={19} />
          <input
            id="movie-search"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search movies..."
          />
          {query && (
            <button
              aria-label="Clear search"
              onClick={() => setQuery("")}
            >
              <X size={16} />
            </button>
          )}
        </div>
        <p>Search through our curated movie selection.</p>
        <button className="search-done" onClick={onSubmit}>
          View results <ArrowUpRight size={15} />
        </button>
      </div>
    </div>
  );
}

function CinematicHero({
  onExplore,
}: {
  onExplore: () => void;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const movie = featuredMovies[active];

  useEffect(() => {
    if (paused) return;

    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % featuredMovies.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [paused]);

  const changeSlide = (direction: number) => {
    setActive(
      (current) =>
        (current + direction + featuredMovies.length) %
        featuredMovies.length
    );
  };

  return (
    <section className="cinema-hero" id="home">
      <div
        className="cutout-stage"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="cutout-art" key={movie.id}>
          <div className="cutout-image cutout-a">
            <img src={movie.image} alt="" />
          </div>
          <div className="cutout-image cutout-b">
            <img src={movie.image} alt="" />
          </div>
          <div className="cutout-image cutout-c">
            <img src={movie.image} alt="" />
          </div>
          <div className="cutout-image cutout-d">
            <img src={movie.image} alt="" />
          </div>
          <div className="cutout-image cutout-e">
            <img src={movie.image} alt="" />
          </div>
          <div className="cutout-image cutout-f">
            <img src={movie.image} alt="" />
          </div>
          <div className="cutout-image cutout-g">
            <img src={movie.image} alt="" />
          </div>
          <div className="cutout-image cutout-h">
            <img src={movie.image} alt="" />
          </div>
        </div>

        <div className="poster-caption">
          <span>FEATURED FILM / {String(active + 1).padStart(2, "0")}</span>
          <span>{movie.year}</span>
        </div>

        <div className="hero-slider-controls">
          <button
            aria-label="Previous featured film"
            onClick={() => changeSlide(-1)}
          >
            <ChevronLeft size={16} />
          </button>
          <span>
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(featuredMovies.length).padStart(2, "0")}
          </span>
          <button
            aria-label="Next featured film"
            onClick={() => changeSlide(1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="cinema-copy">
        <div className="hero-top-actions">
          <a href="/find" className="find-film-link">
            Find a Film <ArrowUpRight size={15} />
          </a>
          <button
            type="button"
            className="profile-hero-button"
            aria-label="User profile — authentication coming later"
            title="Profile coming soon"
          >
            <UserRound size={15} />
            <span>Me</span>
          </button>
        </div>

        <div className="cinema-mark">
          <Clapperboard size={22} strokeWidth={2.8} />
        </div>

        <div className="cinema-heading">
          <p className="cinema-kicker">
            <span className="red-dot" />
            A NEW PERSPECTIVE ON MOVIES
          </p>

          <h1>
            BEYOND
            <br />
            THE
            <br />
            FRAME<span className="title-period">.</span>
          </h1>

          <div className="hero-movie-info">
            <span>{movie.title}</span>
            <span className="movie-divider" />
            <span>{movie.year}</span>
            <span className="movie-divider" />
            <span>{movie.genre}</span>
          </div>

          <p className="cinema-description">
            More than a movie list. A space to discover stories,
            explore cinema, and find the film you'll remember.
          </p>

          <div className="cinema-bottom">
            <a className="cinema-explore" href="/find">
              Find a film by mood <ArrowUpRight size={17} />
            </a>
            <a className="scroll-hint" href="#discover">
              <ArrowDown size={15} /> Scroll to discover
            </a>
          </div>
        </div>

        <div className="hero-wordmark">CINEMATE</div>
      </div>
    </section>
  );
}

function Ticker() {
  const words = [
    "Stories that stay",
    "Cinema without limits",
    "Find your next film",
    "Beyond the frame",
  ];

  return (
    <div className="ticker" aria-label="CineMate highlights">
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <div className="ticker-group" key={copy} aria-hidden={copy === 1}>
            {words.map((word, index) => (
              <span key={word}>
                {word}
                <span className="ticker-dot"> ✳ </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function MovieCard({
  movie,
  index,
  saved,
  onSave,
  onOpen,
}: {
  movie: Movie;
  index: number;
  saved: boolean;
  onSave: (id: number) => void;
  onOpen: (movie: Movie) => void;
}) {
  return (
    <article className="film-card">
      <button
        className="film-image"
        onClick={() => onOpen(movie)}
        aria-label={`View ${movie.title} details`}
      >
        {movie.image ? <img src={movie.image} alt={`${movie.title} poster`} loading="lazy" /> : <span className="film-poster-placeholder">NO POSTER</span>}
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
            {movie.year} <span>·</span> {movie.genre}
          </p>
        </div>
        <div className="film-actions">
          <span className="film-rating">
            <Star size={12} fill="currentColor" />
            {movie.rating.toFixed(1)}
          </span>
          <button
            className={`save-button ${saved ? "saved" : ""}`}
            onClick={() => onSave(movie.id)}
            aria-label={saved ? "Remove from saved films" : "Save film"}
          >
            {saved ? (
              <BookmarkCheck size={17} />
            ) : (
              <Bookmark size={17} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

function MovieModal({
  movie,
  saved,
  onSave,
  onClose,
}: {
  movie: Movie | null;
  saved: boolean;
  onSave: (id: number) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!movie) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [movie, onClose]);

  if (!movie) return null;

  return (
    <div className="movie-modal-backdrop" onMouseDown={onClose}>
      <section
        className="movie-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close details"
        >
          <X size={21} />
        </button>
        <img
          className="modal-backdrop"
          src={movie.image}
          alt={movie.title}
        />
        <div className="modal-content">
          <p className="section-label">FILM / {movie.year}</p>
          <h2 id="modal-title">{movie.title}</h2>
          <div className="modal-meta">
            <span>
              <Star size={14} fill="currentColor" />
              {movie.rating.toFixed(1)}
            </span>
            <span>{movie.genre}</span>
            <span>{movie.duration}</span>
          </div>
          <p>{movie.description}</p>
          <p className="modal-director">
            DIRECTED BY <strong>{movie.director}</strong>
          </p>
          <button
            className="modal-save"
            onClick={() => onSave(movie.id)}
          >
            {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            {saved ? "Remove from saved films" : "Save to my collection"}
          </button>
        </div>
      </section>
    </div>
  );
}

function MovieCollection({
  saved,
  onSave,
  onOpen,
  query,
  searchResults,
}: {
  saved: number[];
  onSave: (id: number) => void;
  onOpen: (movie: Movie) => void;
  query: string;
  searchResults: Movie[] | null;
}) {
  const [genre, setGenre] = useState("All films");
  const [showSaved, setShowSaved] = useState(false);

  const sourceMovies = searchResults ?? movies;
  const filteredMovies = sourceMovies.filter((movie) => {
    const matchesGenre = genre === "All films" || movie.genre === genre;
    const matchesQuery =
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.genre.toLowerCase().includes(query.toLowerCase()) ||
      movie.director.toLowerCase().includes(query.toLowerCase());
    const matchesSaved = !showSaved || saved.includes(movie.id);

    return matchesGenre && matchesQuery && matchesSaved;
  });

  return (
    <section className="editorial-section section-padding" id="discover">
      <div className="section-topline">
        <span className="section-label">01 / THE COLLECTION</span>
        <span className="section-label">A CURATED SELECTION OF CINEMA</span>
      </div>

      <div className="section-heading" id="collections">
        <h2 className="section-title">
          THE <span className="outline-text">FILM</span>
          <br />
          INDEX<span className="accent-dot">.</span>
        </h2>
        <p className="section-subtitle">
          A collection of stories, perspectives, and unforgettable
          frames from across the world of cinema.
        </p>
      </div>

      <div className="filter-bar">
        <div className="filter-list">
          {genres.map((item) => (
            <button
              key={item}
              className={`filter-chip ${genre === item ? "active" : ""}`}
              onClick={() => setGenre(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          className={`saved-filter ${showSaved ? "active" : ""}`}
          onClick={() => setShowSaved((value) => !value)}
        >
          <Bookmark size={13} />
          Saved ({saved.length})
        </button>
      </div>

      <div className="collection-status">
        <span>{searchResults ? "SEARCH RESULTS" : query ? `SEARCH: ${query}` : "SELECTED FILMS"}</span>
        <span>{filteredMovies.length} RESULTS</span>
      </div>

      {filteredMovies.length ? (
        <div className="film-grid">
          {filteredMovies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              index={index}
              saved={saved.includes(movie.id)}
              onSave={onSave}
              onOpen={onOpen}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Film size={30} />
          <p>No films found.</p>
          <span>Try a different search or category.</span>
          <button
            className="text-link"
            onClick={() => {
              setGenre("All films");
              setShowSaved(false);
            }}
          >
            Reset filters <ArrowRight size={14} />
          </button>
        </div>
      )}
    </section>
  );
}

function FeaturedSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section || !frame) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let ticking = false;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      const scale = 0.78 + progress * 0.22;
      const radius = 18 * (1 - progress);
      frame.style.transform = `scale(${scale})`;
      frame.style.borderRadius = `${radius}px`;
      frame.style.setProperty("--spotlight-progress", String(progress));
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="feature-section feature-scroll-section" aria-label="Cinema spotlight">
      <div className="feature-sticky">
        <div className="feature-topline">
          <span className="section-label">02 / CINEMA SPOTLIGHT</span>
          <span className="section-label">THE ART OF STORYTELLING</span>
        </div>
        <div ref={frameRef} className="feature-frame feature-scroll-frame">
          <img
            src="https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"
            alt="Cinematic film scene"
            loading="lazy"
          />
          <div className="feature-overlay">
            <p className="section-label">A WORLD BEYOND THE SCREEN</p>
            <h2 className="feature-title">
              FEEL
              <br />
              EVERY
              <br />
              FRAME<span className="accent-dot">.</span>
            </h2>
            <a href="#discover" className="feature-link">
              EXPLORE THE COLLECTION <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="manifesto-section section-padding" id="about">
      <div className="manifesto-side">
        <p className="section-label">03 / OUR PERSPECTIVE</p>
        <Clapperboard className="manifesto-symbol" size={70} />
      </div>

      <div>
        <h2 className="manifesto-title">
          MORE THAN
          <br />
          <span>MOVIES.</span>
          <br />
          IT'S A FEELING.
        </h2>
        <p className="manifesto-description">
          Every film has a story. Every story leaves a mark.
          CineMate is your space to explore the films that move
          you, challenge you, and stay with you long after
          the credits roll.
        </p>
        <a href="#discover" className="text-link">
          FIND YOUR NEXT FILM <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <p className="section-label">THE END IS JUST THE BEGINNING</p>
          <h2 className="footer-title">
            CINE<span className="footer-accent">MATE</span>
            <span className="footer-accent">.</span>
          </h2>
        </div>
        <a href="#home" className="footer-back-top">
          BACK TO TOP ↑
        </a>
      </div>

      <div className="footer-bottom">
        <span>© 2026 CINEMATE</span>
        <span>MADE FOR THE LOVE OF CINEMA</span>
        <a href="#home">HOME ↑</a>
      </div>
    </footer>
  );
}

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<number[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchResults, setSearchResults] = useState<Movie[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const toggleSaved = (id: number) => {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((movieId) => movieId !== id)
        : [...current, id]
    );
  };

  const explore = () => {
    document.getElementById("discover")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="site-shell">
      <Navigation onSearch={() => setSearchOpen(true)} />

      <SearchPanel
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        query={query}
        setQuery={setQuery}
        onSubmit={async () => {
          const term = query.trim();
          setSearchOpen(false);
          if (!term) {
            setSearchResults(null);
            document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" });
            return;
          }
          const token = import.meta.env.VITE_TMDB_API_KEY?.trim();
          if (!token) {
            setSearchError("TMDB API key is missing. Add VITE_TMDB_API_KEY to your .env file and restart Vite.");
            setSearchResults([]);
            document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" });
            return;
          }
          setSearchLoading(true);
          setSearchError("");
          try {
            const params = new URLSearchParams({ query: term, include_adult: "false", page: "1" });
            const response = await fetch(`${TMDB_API}/search/movie?${params.toString()}`, {
              headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
            });
            if (!response.ok) throw new Error(response.status === 401 ? "TMDB rejected your API token. Check your .env file." : "Could not search movies. Please try again.");
            const data = await response.json();
            const mapped: Movie[] = (data.results as TMDBSearchMovie[] || []).map((item) => ({
              id: item.id,
              title: item.title,
              year: item.release_date ? Number(item.release_date.slice(0, 4)) : 0,
              genre: (item.genre_ids || []).map((id) => genreNames[id]).find(Boolean) || "Film",
              rating: Number(item.vote_average || 0),
              image: item.poster_path ? `${TMDB_IMAGE}${item.poster_path}` : "",
              description: item.overview || "No description available.",
              duration: "Feature film",
              director: "See film details",
            }));
            setSearchResults(mapped);
            if (!mapped.length) setSearchError(`No movies found for “${term}”. Try a shorter title or a suggested spelling.`);
          } catch (error) {
            setSearchResults([]);
            setSearchError(error instanceof Error ? error.message : "Search failed.");
          } finally {
            setSearchLoading(false);
            window.setTimeout(() => document.getElementById("discover")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
          }
        }}
      />

      <main>
        <CinematicHero onExplore={explore} />
        <Ticker />
        <MovieCollection
          saved={saved}
          onSave={toggleSaved}
          onOpen={setSelectedMovie}
          query={searchResults ? "" : query}
          searchResults={searchResults}
        />
        {(searchLoading || searchError) && (
          <div className="home-search-feedback" role="status">
            {searchLoading ? "SEARCHING THE FILM INDEX…" : searchError}
          </div>
        )}
        <FeaturedSection />
        <Manifesto />

        <section className="home-gallery-promo" aria-labelledby="gallery-promo-title">
          <div className="home-gallery-promo-content">
            <p className="gallery-promo-eyebrow">THE FINAL FRAME</p>
            <h2 id="gallery-promo-title">
              ENTER THE
              <br />
              MOVIE <span>UNIVERSE.</span>
            </h2>
            <p className="home-gallery-description">
              Hundreds of stories. One infinite world of cinema.
            </p>
            <a href="/movie-gallery" className="home-gallery-link">
              EXPLORE THE GALLERY <ArrowUpRight size={17} />
            </a>
          </div>

          <div className="home-gallery-orbit" aria-hidden="true">
            <div className="home-gallery-orbit-ring" />
            <div className="home-gallery-orbit-core">
              <Clapperboard size={48} strokeWidth={1.5} />
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <MovieModal
        movie={selectedMovie}
        saved={
          selectedMovie ? saved.includes(selectedMovie.id) : false
        }
        onSave={toggleSaved}
        onClose={() => setSelectedMovie(null)}
      />

      <style>{`
        .home-search-feedback {
          margin: -18px 5.5% 28px;
          padding: 14px 18px;
          border-left: 2px solid #ef303c;
          background: rgba(239, 48, 60, 0.06);
          color: #333;
          font-size: 13px;
        }
        .film-poster-placeholder {
          display: grid;
          width: 100%;
          height: 100%;
          min-height: 280px;
          place-items: center;
          background: #242426;
          color: #aaa;
          font: 11px monospace;
          letter-spacing: 1px;
        }
        .home-gallery-promo {
          min-height: 560px;
          padding: 90px 8%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          position: relative;
          overflow: hidden;
          background: #101012;
          color: #f7f5f1;
        }
        .home-gallery-promo-content {
          position: relative;
          z-index: 1;
        }
        .gallery-promo-eyebrow {
          color: #aaa7a3;
          font: 12px monospace;
          letter-spacing: 2px;
        }
        .home-gallery-promo h2 {
          margin: 28px 0 20px;
          font-size: clamp(44px, 7vw, 90px);
          line-height: .9;
          letter-spacing: -.07em;
          font-weight: 950;
        }
        .home-gallery-promo h2 span {
          color: #ef303c;
        }
        .home-gallery-description {
          color: #aaa7a3;
          font-size: 15px;
          line-height: 1.6;
        }
        .home-gallery-link {
          display: inline-flex;
          align-items: center;
          gap: 24px;
          margin-top: 28px;
          padding: 17px 22px;
          background: #ef303c;
          color: #fff;
          text-decoration: none;
          font: 12px monospace;
          letter-spacing: 1px;
          transition: background .25s ease, transform .25s ease;
        }
        .home-gallery-link:hover {
          background: #c91f2b;
          transform: translateY(-3px);
        }
        .home-gallery-orbit {
          position: relative;
          flex: 0 0 280px;
          width: 280px;
          aspect-ratio: 1;
          display: grid;
          place-items: center;
        }
        .home-gallery-orbit-ring {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(255,255,255,.3);
          border-radius: 50%;
          animation: home-gallery-spin 18s linear infinite;
        }
        .home-gallery-orbit-ring::before,
        .home-gallery-orbit-ring::after {
          content: "";
          position: absolute;
          border: 1px solid rgba(239,48,60,.45);
          border-radius: 50%;
        }
        .home-gallery-orbit-ring::before { inset: 28px; }
        .home-gallery-orbit-ring::after { inset: 58px; }
        .home-gallery-orbit-core {
          width: 105px;
          height: 105px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #ef303c;
          color: #fff;
          box-shadow: 0 0 65px rgba(239,48,60,.2);
        }
        @keyframes home-gallery-spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 700px) {
          .home-gallery-promo {
            min-height: 600px;
            padding: 70px 6%;
            align-items: flex-start;
            flex-direction: column;
          }
          .home-gallery-orbit {
            align-self: center;
            flex-basis: auto;
            width: 200px;
          }
          .home-gallery-orbit-core {
            width: 75px;
            height: 75px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .home-gallery-orbit-ring { animation: none; }
          .home-gallery-link { transition: none; }
        }
      `}</style>
    </div>
  );
}