
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut, updateProfile, type User } from "firebase/auth";
import { auth } from "./firebase";
import AuthModal from "./components/AuthModal";
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
        <a className="nav-gallery-link" href="/movie-gallery" aria-label="Explore the movie gallery">
          <Film size={14} strokeWidth={1.8} />
          <span>Movie Gallery</span>
          <ArrowUpRight size={13} />
        </a>
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

function CinematicHero({ onProfile }: { onProfile: () => void; user: User | null }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [currentFilms, setCurrentFilms] = useState<Movie[]>(featuredMovies);

  useEffect(() => {
    const token = import.meta.env.VITE_TMDB_API_KEY?.trim();
    if (!token) return;

    let cancelled = false;
    fetch(`${TMDB_API}/trending/movie/week?language=en-US`, {
      headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Trending movies unavailable");
        return response.json();
      })
      .then((data) => {
        if (cancelled || !Array.isArray(data.results)) return;
        const fresh = data.results
          .filter((item: TMDBSearchMovie) => item.poster_path)
          .slice(0, 8)
          .map((item: TMDBSearchMovie): Movie => ({
            id: item.id,
            title: item.title,
            year: Number(item.release_date?.slice(0, 4)) || new Date().getFullYear(),
            genre: item.genre_ids?.map((id) => genreNames[id]).filter(Boolean)[0] || "Film",
            rating: item.vote_average || 0,
            image: `${TMDB_IMAGE}${item.poster_path}`,
            description: item.overview || "",
            duration: "",
            director: "",
          }));
        if (fresh.length) {
          setCurrentFilms(fresh);
          setActive(0);
        }
      })
      .catch(() => {
        // Keep the curated featured films visible if the API is unavailable.
      });

    return () => { cancelled = true; };
  }, []);

  const movie = currentFilms[active] || currentFilms[0];

  useEffect(() => {
    if (paused || currentFilms.length < 2) return;

    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % currentFilms.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [paused, currentFilms.length]);

  const changeSlide = (direction: number) => {
    setActive(
      (current) =>
        (current + direction + currentFilms.length) % currentFilms.length
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
            {String(currentFilms.length).padStart(2, "0")}
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
            aria-label="Open your profile and film collections"
            title="Your profile"
            onClick={onProfile}
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
            {words.map((word) => (
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
      // Keep the frame landscape and let it widen across the viewport as the
      // visitor scrolls. The overlay is revealed only near the end of the move.
      const eased = progress * progress * (3 - 2 * progress);
      const radius = 22 * (1 - eased);
      const compact = window.innerWidth <= 600;
      const tablet = window.innerWidth > 600 && window.innerWidth <= 900;
      const startWidth = compact ? 0.88 : tablet ? 0.82 : 0.68;
      const endWidth = 1;
      const startHeight = compact ? 0.48 : tablet ? 0.54 : 0.58;
      const endHeight = compact ? 0.73 : tablet ? 0.84 : 1;
      frame.style.width = `${window.innerWidth * (startWidth + (endWidth - startWidth) * eased)}px`;
      frame.style.height = `${window.innerHeight * (startHeight + (endHeight - startHeight) * eased)}px`;
      frame.style.borderRadius = `${radius}px`;
      frame.style.setProperty("--spotlight-progress", String(eased));
      frame.style.setProperty("--spotlight-copy-opacity", String(Math.max(0, Math.min(1, (eased - 0.76) / 0.24))));
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
              FEEL EVERY FRAME<span className="accent-dot">.</span>
            </h2>
            <p className="feature-description">
              Every film has a world of its own. Step inside the stories,
              images, and moments that stay with you long after the credits.
            </p>
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

function ProfilePanel({
  name, user, onNameChange, saved, lists, onListsChange, onClose, onSignOut, onRemoveMovie, avatarTheme, onAvatarThemeChange,
}: {
  name: string;
  user: User;
  onNameChange: (value: string) => void;
  onSignOut: () => void;
  onRemoveMovie: (id: number) => void;
  saved: number[];
  lists: { id: string; name: string; movieIds: number[] }[];
  onListsChange: (value: { id: string; name: string; movieIds: number[] }[]) => void;
  onClose: () => void;
  avatarTheme: string;
  onAvatarThemeChange: (value: string) => void;
}) {
  const [draftName, setDraftName] = useState(name);
  const [newList, setNewList] = useState("");
  const [selectedList, setSelectedList] = useState<Record<string, string>>({});
  const [expandedList, setExpandedList] = useState<string | null>(null);
  const savedFilms = saved.map((id) => movies.find((movie) => movie.id === id)).filter((movie): movie is Movie => Boolean(movie));
  const createList = () => {
    const title = newList.trim();
    if (!title) return;
    onListsChange([...lists, { id: `${Date.now()}-${title}`, name: title, movieIds: [] }]);
    setNewList("");
  };
  const addToList = (movieId: number) => {
    const listId = selectedList[movieId];
    if (!listId) return;
    onListsChange(lists.map((list) => list.id === listId && !list.movieIds.includes(movieId)
      ? { ...list, movieIds: [...list.movieIds, movieId] } : list));
  };
  return (
    <div className="profile-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="profile-panel" role="dialog" aria-modal="true" aria-labelledby="profile-title">
        <button className="profile-close" onClick={onClose} aria-label="Close profile"><X size={20} /></button>
        <div className="profile-account-head">
          <div className={`profile-avatar avatar-${avatarTheme}`}><span>{(name || user.email || "F").trim().charAt(0).toUpperCase()}</span></div>
          <div className="profile-account-copy"><strong>{name || "Film Lover"}</strong><span>{user.email}</span><small>YOUR CINEMATE ACCOUNT</small></div>
          <button className="profile-signout" onClick={onSignOut}>SIGN OUT</button>
        </div>
        <p className="profile-eyebrow">YOUR PERSONAL FILM JOURNAL</p>
        <h2 id="profile-title">YOUR <span>FRAME.</span></h2>
        <label className="profile-name-label" htmlFor="profile-name">DISPLAY NAME</label>
        <div className="profile-name-row">
          <input id="profile-name" value={draftName} maxLength={32} onChange={(e) => setDraftName(e.target.value)} onBlur={() => onNameChange(draftName.trim() || "Film Lover")} onKeyDown={(e) => { if (e.key === "Enter") { onNameChange(draftName.trim() || "Film Lover"); e.currentTarget.blur(); } }} />
          <button onClick={() => onNameChange(draftName.trim() || "Film Lover")}>SAVE NAME</button>
        </div>
        <div className="avatar-picker">
          <div><strong>YOUR AVATAR</strong><span>Choose a signature CineMate color</span></div>
          <div className="avatar-options" role="group" aria-label="Choose avatar theme">
            {[{id:"emerald",label:"Emerald",mark:"✦"},{id:"burgundy",label:"Burgundy",mark:"✺"},{id:"midnight",label:"Midnight",mark:"✧"},{id:"bronze",label:"Bronze",mark:"◈"},{id:"plum",label:"Plum",mark:"✴"},{id:"ocean",label:"Ocean",mark:"◉"}].map((option) => <button type="button" key={option.id} className={`avatar-choice avatar-${option.id} ${avatarTheme === option.id ? "selected" : ""}`} aria-label={`${option.label} avatar`} aria-pressed={avatarTheme === option.id} title={option.label} onClick={() => onAvatarThemeChange(option.id)}><span>{option.mark}</span></button>)}
          </div>
        </div>
        <div className="profile-stats"><div><strong>{savedFilms.length}</strong><span>WATCHLIST</span></div><div><strong>{lists.length}</strong><span>COLLECTIONS</span></div></div>
        <div className="profile-section-head"><h3>MY WATCHLIST</h3><span>YOUR SAVED FILMS</span></div>
        {savedFilms.length ? <div className="profile-film-list">{savedFilms.map((movie) => (
          <div className="profile-film-row" key={movie.id}>
            <img src={movie.image} alt={`${movie.title} poster`} />
            <div className="profile-film-copy"><strong>{movie.title}</strong><span>{movie.year} · {movie.genre}</span></div>
            {lists.length > 0 && <div className="profile-add-list"><select aria-label={`Choose collection for ${movie.title}`} value={selectedList[movie.id] || ""} onChange={(e) => setSelectedList((old) => ({ ...old, [movie.id]: e.target.value }))}><option value="">Add to list…</option>{lists.map((list) => <option key={list.id} value={list.id}>{list.name}</option>)}</select><button onClick={() => addToList(movie.id)} aria-label={`Add ${movie.title} to selected collection`}>+</button></div>}
            <button className="profile-remove-film" onClick={() => onRemoveMovie(movie.id)} aria-label={`Remove ${movie.title} from watchlist`} title="Remove from watchlist"><X size={14} /></button>
          </div>
        ))}</div> : <p className="profile-empty">Save films from the homepage to start your watchlist.</p>}
        <div className="profile-section-head profile-collections-head"><h3>MY COLLECTIONS</h3><span>MAKE IT YOURS</span></div>
        <form className="profile-create-list" onSubmit={(e) => { e.preventDefault(); createList(); }}><input value={newList} onChange={(e) => setNewList(e.target.value)} placeholder="e.g. Films that changed me" aria-label="New collection name" maxLength={42} /><button type="submit">CREATE LIST <ArrowUpRight size={14} /></button></form>
        <div className="profile-list-grid">{lists.map((list, index) => (
          <article className={`profile-list-card ${expandedList === list.id ? "is-expanded" : ""}`} key={list.id}>
            <button className="profile-list-open" onClick={() => setExpandedList(expandedList === list.id ? null : list.id)} aria-expanded={expandedList === list.id}>
              <div className="profile-list-art"><span>{String(index + 1).padStart(2, "0")}</span><Film size={24} /></div>
              <div className="profile-list-meta"><strong>{list.name}</strong><span>{list.movieIds.length} FILM{list.movieIds.length === 1 ? "" : "S"}</span></div>
              <span className="profile-list-chevron">{expandedList === list.id ? "−" : "+"}</span>
            </button>
            <button className="profile-list-delete" aria-label={`Delete ${list.name}`} onClick={() => onListsChange(lists.filter((item) => item.id !== list.id))}><X size={15} /></button>
            {expandedList === list.id && <div className="profile-list-detail">
              <div className="profile-list-detail-head"><span>INSIDE THIS COLLECTION</span><strong>{list.movieIds.length} FILM{list.movieIds.length === 1 ? "" : "S"}</strong></div>
              {list.movieIds.length ? <div className="profile-collection-films">{list.movieIds.map((movieId) => {
                const film = movies.find((item) => Number(item.id) === Number(movieId));
                return film ? <article className="profile-collection-film" key={movieId}><img src={film.image} alt={`${film.title} poster`} /><div><strong>{film.title}</strong><span>{film.year} · {film.genre}</span></div><button type="button" onClick={() => onListsChange(lists.map((item) => item.id === list.id ? {...item, movieIds:item.movieIds.filter((id) => Number(id) !== Number(movieId))} : item))} aria-label={`Remove ${film.title} from ${list.name}`}><X size={14}/></button></article> : null;
              })}</div> : <div className="profile-collection-empty"><Film size={22}/><p>This collection is waiting for its first film.</p><span>Choose a saved movie below and add it to this collection.</span></div>}
              {savedFilms.length > 0 && <div className="profile-collection-add"><label htmlFor={`add-film-${list.id}`}>ADD FROM YOUR WATCHLIST</label><div><select id={`add-film-${list.id}`} value={selectedList[list.id] || ""} onChange={(e) => setSelectedList((old) => ({...old,[list.id]:e.target.value}))}><option value="">Choose a film…</option>{savedFilms.filter((film) => !list.movieIds.some((id) => Number(id) === Number(film.id))).map((film) => <option key={film.id} value={film.id}>{film.title}</option>)}</select><button type="button" disabled={!selectedList[list.id]} onClick={() => { const movieId = Number(selectedList[list.id]); if (!movieId) return; onListsChange(lists.map((item) => item.id === list.id && !item.movieIds.some((id) => Number(id) === movieId) ? {...item,movieIds:[...item.movieIds,movieId]} : item)); setSelectedList((old) => ({...old,[list.id]:""})); }}>ADD FILM +</button></div></div>}
            </div>}
          </article>
        ))}</div>
        <p className="profile-note">Your film journal is saved in this browser for this session of CineMate.</p>
      </section>
      <style>{`
        .profile-account-head{display:flex;align-items:center;gap:13px;margin:0 0 34px;padding:0 0 20px;border-bottom:1px solid #dedbd6}.profile-avatar{width:54px;height:54px;flex:0 0 54px;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:linear-gradient(145deg,#27272a,#8e3038);color:#fff;font:700 22px 'DM Sans',sans-serif;border:2px solid #fff;box-shadow:0 0 0 1px #d8d5d0}.profile-avatar span{display:grid;place-items:center;width:100%;height:100%}.avatar-emerald{background:linear-gradient(145deg,#075b4d,#0b352f)!important}.avatar-burgundy{background:linear-gradient(145deg,#9d3444,#481a2a)!important}.avatar-midnight{background:linear-gradient(145deg,#343b58,#101321)!important}.avatar-bronze{background:linear-gradient(145deg,#a36b35,#4b2c19)!important}.avatar-plum{background:linear-gradient(145deg,#76508e,#342044)!important}.avatar-ocean{background:linear-gradient(145deg,#287b9c,#12364e)!important}.profile-account-copy{display:grid;gap:4px;min-width:0;flex:1}.profile-account-copy strong{font-size:15px}.profile-account-copy span{font-size:11px;color:#777;overflow-wrap:anywhere}.profile-account-copy small{font:8px monospace;letter-spacing:1px;color:#ed3037}.profile-signout{border:1px solid #d8d5d0;background:transparent;padding:9px 11px;font:9px monospace;letter-spacing:.6px;cursor:pointer}.profile-signout:hover{border-color:#ed3037;color:#ed3037}
        .profile-backdrop{position:fixed;inset:0;z-index:1000;background:rgba(10,10,11,.72);backdrop-filter:blur(9px);display:flex;justify-content:flex-end}
        .profile-panel{position:relative;width:min(1080px,86vw);height:100%;overflow:auto;background:#f7f5f2;color:#111;padding:58px clamp(28px,6vw,88px) 48px;box-shadow:-24px 0 80px #0003;animation:profile-in .45s cubic-bezier(.2,.8,.2,1)}
        @keyframes profile-in{from{transform:translateX(40px);opacity:.6}to{transform:translateX(0);opacity:1}}
        .profile-close{position:absolute;right:28px;top:24px;border:0;background:transparent;cursor:pointer}.profile-eyebrow,.profile-name-label,.profile-section-head span,.profile-stats span,.profile-film-copy span,.profile-list-meta span,.profile-note{font:10px monospace;letter-spacing:1.2px;color:#777}
        .profile-panel h2{font-size:clamp(42px,7vw,68px);line-height:.95;letter-spacing:-.07em;margin:18px 0 34px;font-weight:950}.profile-panel h2 span{color:#ef303c}
        .profile-name-row{display:flex;gap:8px;margin-top:8px}.profile-name-row input,.profile-create-list input{min-width:0;flex:1;border:1px solid #d8d5d0;background:transparent;padding:13px 14px;font:14px inherit;color:#111}.profile-name-row button,.profile-create-list button{border:0;background:#111;color:#fff;padding:0 16px;font:10px monospace;letter-spacing:.7px;cursor:pointer;display:flex;align-items:center;gap:9px}
        .avatar-picker{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px 0 5px}.avatar-picker>div:first-child{display:grid;gap:5px}.avatar-picker strong{font:10px monospace;letter-spacing:1px}.avatar-picker span{font-size:11px;color:#777}.avatar-options{display:flex;gap:9px;flex-wrap:wrap}.avatar-choice{width:38px;height:38px;border:2px solid #f7f5f2;border-radius:50%;color:white;display:grid;place-items:center;cursor:pointer;box-shadow:0 0 0 1px #d3d0ca;transition:transform .2s,box-shadow .2s}.avatar-choice span{font-size:15px;font-weight:700;color:#fff}.avatar-choice:hover{transform:translateY(-3px)}.avatar-choice.selected{box-shadow:0 0 0 2px #ef303c;transform:scale(1.08)}.profile-stats{display:flex;gap:42px;padding:25px 0;border-bottom:1px solid #ddd;margin-bottom:26px}.profile-stats div{display:grid;gap:5px}.profile-stats strong{font-size:30px;letter-spacing:-1.5px}
        .profile-section-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:24px 0 14px}.profile-section-head h3{font-size:13px;letter-spacing:.5px;margin:0}.profile-film-list{border-top:1px solid #dedbd6}.profile-film-row{display:flex;align-items:center;gap:13px;padding:10px 0;border-bottom:1px solid #dedbd6}.profile-film-row img{width:42px;height:58px;object-fit:cover;background:#ddd}.profile-film-copy{display:grid;gap:5px;flex:1;min-width:0}.profile-remove-film{width:28px;height:28px;display:grid;place-items:center;border:1px solid #dedbd6;background:transparent;color:#777;cursor:pointer}.profile-remove-film:hover{border-color:#ed3037;color:#ed3037}.profile-film-copy strong{font-size:13px}.profile-film-copy span{letter-spacing:.4px}.profile-add-list{display:flex;gap:4px}.profile-add-list select{max-width:130px;border:1px solid #d5d1cc;background:transparent;padding:7px;font-size:11px}.profile-add-list button{width:29px;border:0;background:#ef303c;color:white;font-size:18px;cursor:pointer}.profile-empty{padding:22px;border:1px dashed #d4d0ca;color:#777;font-size:13px}
        .profile-collections-head{margin-top:34px}.profile-create-list{display:flex;gap:8px}.profile-create-list button{white-space:nowrap}.profile-list-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:14px}.profile-list-card{position:relative;border:1px solid #dedbd6;padding:9px;min-width:0}.profile-list-open{display:flex;align-items:center;gap:10px;width:100%;padding:0 26px 0 0;border:0;background:transparent;text-align:left;cursor:pointer}.profile-list-chevron{margin-left:auto;font-size:20px;color:#ed3037}.profile-list-delete{position:absolute;right:7px;top:8px;border:0;background:transparent;color:#888;cursor:pointer}.profile-list-detail{margin-top:15px;padding-top:14px;border-top:1px solid #dedbd6;animation:collection-open .24s ease}.profile-list-detail-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;font:9px 'DM Mono',monospace;letter-spacing:1px;color:#777}.profile-list-detail-head strong{color:#ed3037;font-weight:500}.profile-collection-films{display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:10px}.profile-collection-film{position:relative;display:grid;grid-template-columns:46px 1fr;align-items:center;gap:9px;min-width:0;padding:8px;border:1px solid #e2dfda;background:#fff9}.profile-collection-film img{width:46px;height:66px;object-fit:cover;background:#ddd}.profile-collection-film>div{display:grid;gap:5px;min-width:0}.profile-collection-film strong{font-size:11px;line-height:1.35;overflow-wrap:anywhere}.profile-collection-film span{font:9px 'DM Mono',monospace;color:#777}.profile-collection-film button{position:absolute;right:4px;top:4px;width:22px;height:22px;display:grid;place-items:center;border:0;background:#f7f5f2;color:#777;cursor:pointer}.profile-collection-empty{display:grid;justify-items:center;text-align:center;padding:20px 12px;border:1px dashed #d8d5d0;color:#8b8782}.profile-collection-empty p{margin:9px 0 4px;font-size:12px;font-weight:700;color:#333}.profile-collection-empty span{font-size:10px}.profile-collection-add{margin-top:14px;padding-top:12px;border-top:1px solid #e2dfda}.profile-collection-add label{display:block;margin-bottom:8px;font:9px 'DM Mono',monospace;letter-spacing:1px;color:#777}.profile-collection-add>div{display:flex;gap:7px}.profile-collection-add select{flex:1;min-width:0;padding:10px;border:1px solid #d8d5d0;background:#fff;color:#171717;font-size:11px}.profile-collection-add button{border:0;background:#ed3037;color:white;padding:0 12px;font:9px 'DM Mono',monospace;letter-spacing:.6px;cursor:pointer}.profile-collection-add button:disabled{opacity:.4;cursor:not-allowed}@keyframes collection-open{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}.profile-list-film span{font-weight:600}.profile-list-art{height:55px;width:48px;flex:0 0 48px;background:linear-gradient(145deg,#242326,#6e3034);color:#fff;display:grid;place-items:center;position:relative}.profile-list-art span{position:absolute;left:5px;top:4px;font:8px monospace;color:#e8b9b9}.profile-list-meta{display:grid;gap:6px;min-width:0;flex:1}.profile-list-meta strong{font-size:12px;overflow-wrap:anywhere}.profile-list-card>button{border:0;background:transparent;color:#888;cursor:pointer}.profile-note{margin-top:24px;letter-spacing:.3px;font-size:10px}
        @media(max-width:760px){.profile-panel{width:100%;padding-left:22px;padding-right:22px}.avatar-picker{align-items:flex-start;flex-direction:column}}
        @media(max-width:520px){.profile-list-grid{grid-template-columns:1fr}.profile-collection-films{grid-template-columns:1fr}.profile-collection-add>div{flex-direction:column}.profile-collection-add button{min-height:40px}.profile-film-row{flex-wrap:wrap}.profile-add-list{margin-left:auto}.profile-panel{padding-top:54px}}
        .profile-hero-button{gap:8px}.profile-button-avatar{width:21px;height:21px;display:block}
        @media(max-width:520px){.profile-account-head{align-items:flex-start;flex-wrap:wrap}.profile-signout{margin-left:auto}}
        @media(prefers-reduced-motion:reduce){.profile-panel{animation:none}}
      `}</style>
    </div>
  );
}

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem("cinemate:saved") || "[]"); } catch { return []; }
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(auth.currentUser);
  const [profileDataReady, setProfileDataReady] = useState(false);
  const [profileName, setProfileName] = useState(() => localStorage.getItem("cinemate:profile-name") || "Film Lover");
  const [avatarTheme, setAvatarTheme] = useState(() => localStorage.getItem("cinemate:avatar-theme") || "emerald");
  const [lists, setLists] = useState<{ id: string; name: string; movieIds: number[] }[]>(() => {
    try { return JSON.parse(localStorage.getItem("cinemate:lists") || "[]"); } catch { return []; }
  });
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchResults, setSearchResults] = useState<Movie[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  useEffect(() => onAuthStateChanged(auth, (user) => {
    setAuthUser(user);
    const owner = user?.uid || "guest";
    const read = <T,>(key: string, fallback: T): T => {
      try { const raw = localStorage.getItem(`cinemate:${owner}:${key}`); return raw ? JSON.parse(raw) as T : fallback; }
      catch { return fallback; }
    };
    // Migrate data from the earlier unscoped browser keys so existing journals are not lost.
    const scopedSaved = localStorage.getItem(`cinemate:${owner}:saved`);
    const scopedLists = localStorage.getItem(`cinemate:${owner}:lists`);
    const legacySaved = localStorage.getItem("cinemate:saved");
    const legacyLists = localStorage.getItem("cinemate:lists");
    const parseLegacy = <T,>(raw: string | null, fallback: T): T => { try { return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } };
    const nextSaved = scopedSaved ? read<number[]>("saved", []) : parseLegacy<number[]>(legacySaved, read<number[]>("saved", []));
    const nextLists = scopedLists ? read<{ id: string; name: string; movieIds: number[] }[]>("lists", []) : parseLegacy<{ id: string; name: string; movieIds: number[] }[]>(legacyLists, read<{ id: string; name: string; movieIds: number[] }[]>("lists", []));
    setSaved(Array.isArray(nextSaved) ? nextSaved.map(Number).filter(Number.isFinite) : []);
    setLists(Array.isArray(nextLists) ? nextLists.map((list) => ({...list, movieIds:Array.isArray(list.movieIds) ? list.movieIds.map(Number).filter(Number.isFinite) : []})) : []);
    setProfileName(user?.displayName || read<string>("profile-name", "Film Lover"));
    setAvatarTheme(read<string>("avatar-theme", "emerald"));
    setProfileDataReady(true);
  }), []);
  useEffect(() => {
    if (!profileDataReady) return;
    const owner = authUser?.uid || "guest";
    localStorage.setItem(`cinemate:${owner}:saved`, JSON.stringify(saved));
  }, [saved, authUser, profileDataReady]);
  useEffect(() => {
    if (!profileDataReady) return;
    const owner = authUser?.uid || "guest";
    localStorage.setItem(`cinemate:${owner}:profile-name`, profileName);
  }, [profileName, authUser, profileDataReady]);
  useEffect(() => {
    if (!profileDataReady) return;
    const owner = authUser?.uid || "guest";
    localStorage.setItem(`cinemate:${owner}:lists`, JSON.stringify(lists));
  }, [lists, authUser, profileDataReady]);

  const toggleSaved = (id: number) => {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((movieId) => movieId !== id)
        : [...current, id]
    );
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
        <CinematicHero user={authUser} onProfile={() => authUser ? setProfileOpen(true) : setAuthOpen(true)} />
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

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onSuccess={() => { setAuthUser(auth.currentUser); setProfileOpen(true); }} />}
      {profileOpen && authUser && (
        <ProfilePanel
          avatarTheme={avatarTheme}
          onAvatarThemeChange={(value) => { setAvatarTheme(value); localStorage.setItem(`cinemate:${authUser.uid}:avatar-theme`, value); }}
          name={profileName === "Film Lover" ? (authUser.displayName || authUser.email?.split("@")[0] || "Film Lover") : profileName}
          user={authUser}
          onNameChange={(value) => {
            const next = value.trim() || "Film Lover";
            setProfileName(next);
            void updateProfile(authUser, { displayName: next });
          }}
          saved={saved}
          lists={lists}
          onListsChange={setLists}
          onClose={() => setProfileOpen(false)}
          onSignOut={() => { void signOut(auth); setProfileOpen(false); setProfileName("Film Lover"); }}
          onRemoveMovie={toggleSaved}
        />
      )}

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