
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  Clapperboard,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import "./FindFilm.css";

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  original_language: string;
};

type Mood = {
  id: string;
  label: string;
  description: string;
  genres: number[];
};

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
const API = "https://api.themoviedb.org/3";
const IMAGE = "https://image.tmdb.org/t/p";

const moods: Mood[] = [
  {
    id: "happy",
    label: "Feel good",
    description: "Light-hearted stories and good energy.",
    genres: [35, 10751, 16],
  },
  {
    id: "sad",
    label: "A little emotional",
    description: "Stories that stay with you.",
    genres: [18, 10749],
  },
  {
    id: "romantic",
    label: "In love",
    description: "Love, longing and beautiful connections.",
    genres: [10749, 18],
  },
  {
    id: "thrill",
    label: "Need a thrill",
    description: "Suspense, mystery and adrenaline.",
    genres: [53, 9648, 80],
  },
  {
    id: "curious",
    label: "Mind blown",
    description: "Complex ideas and unexpected stories.",
    genres: [878, 9648, 18],
  },
  {
    id: "relaxed",
    label: "Take it slow",
    description: "Comforting stories for a quiet evening.",
    genres: [10751, 16, 35],
  },
];

const genres = [
  { id: 28, label: "Action" },
  { id: 12, label: "Adventure" },
  { id: 16, label: "Animation" },
  { id: 35, label: "Comedy" },
  { id: 80, label: "Crime" },
  { id: 99, label: "Documentary" },
  { id: 18, label: "Drama" },
  { id: 14, label: "Fantasy" },
  { id: 27, label: "Horror" },
  { id: 9648, label: "Mystery" },
  { id: 10749, label: "Romance" },
  { id: 878, label: "Sci-Fi" },
  { id: 53, label: "Thriller" },
  { id: 10751, label: "Family" },
];

const languages = [
  { id: "", label: "All languages" },
  { id: "en", label: "English" },
  { id: "hi", label: "Hindi" },
  { id: "ja", label: "Japanese" },
  { id: "ko", label: "Korean" },
  { id: "fr", label: "French" },
  { id: "es", label: "Spanish" },
];

const years = [
  { id: "", label: "Any year" },
  { id: "2020", label: "2020 onwards" },
  { id: "2015", label: "2015 onwards" },
  { id: "2010", label: "2010 onwards" },
  { id: "2000", label: "2000 onwards" },
  { id: "1990", label: "1990 onwards" },
];

function SkeletonCard() {
  return (
    <div className="film-skeleton">
      <div className="skeleton-poster shimmer" />
      <div className="skeleton-line shimmer" />
      <div className="skeleton-line short shimmer" />
    </div>
  );
}

export default function FindFilm() {
  const [mood, setMood] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("0");
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState("popularity.desc");
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const resultsRef = useRef<HTMLElement | null>(null);
  const initialQuery = searchParams.get("query") || "";
  const [globalSearch, setGlobalSearch] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [didGlobalSearch, setDidGlobalSearch] = useState(Boolean(initialQuery));

  const selectedMood = useMemo(
    () => moods.find((item) => item.id === mood),
    [mood]
  );

  async function searchMovies(term: string, nextPage = 1) {
    if (!API_KEY) {
      setError("TMDB API key is missing. Add VITE_TMDB_API_KEY to your .env file.");
      return;
    }
    const cleanTerm = term.trim();
    if (!cleanTerm) {
      setDidGlobalSearch(false);
      discoverMovies(1);
      return;
    }
    setLoading(true);
    setError("");
    setHasSearched(true);
    setDidGlobalSearch(true);
    try {
      const params = new URLSearchParams({
        query: cleanTerm,
        page: String(nextPage),
        include_adult: "false",
      });
      const response = await fetch(`${API}/search/movie?${params.toString()}`, {
        headers: { Authorization: `Bearer ${API_KEY.trim()}`, accept: "application/json" },
      });
      if (!response.ok) throw new Error(response.status === 401
        ? "TMDB rejected the Read Access Token. Check your .env file and restart Vite."
        : "Unable to search movies. Please try again.");
      const data = await response.json();
      setMovies(data.results || []);
      setPage(nextPage);
      if (!data.results?.length && nextPage === 1) {
        setError(`No results for “${cleanTerm}”. Try a shorter title or choose a suggested match.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!globalSearch.trim()) {
      setSuggestions([]);
      return;
    }
    if (!API_KEY) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setSuggestionLoading(true);
      try {
        const params = new URLSearchParams({ query: globalSearch.trim(), include_adult: "false", page: "1" });
        const response = await fetch(`${API}/search/movie?${params.toString()}`, {
          headers: { Authorization: `Bearer ${API_KEY.trim()}`, accept: "application/json" },
        });
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled) setSuggestions((data.results || []).slice(0, 6));
      } catch {
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setSuggestionLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [globalSearch]);

  useEffect(() => {
    if (initialQuery.trim()) {
      setGlobalSearch(initialQuery);
      searchMovies(initialQuery, 1);
      window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 350);
    }
    // URL search is initialized once when opening the finder from the homepage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submitGlobalSearch(term = globalSearch) {
    setGlobalSearch(term);
    setQuery("");
    searchMovies(term, 1);
    window.history.replaceState({}, "", `/find-film${term.trim() ? `?query=${encodeURIComponent(term.trim())}` : ""}`);
    window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
  }

  async function discoverMovies(nextPage = 1) {
    if (!API_KEY) {
      setError(
        "TMDB API key is missing. Add VITE_TMDB_API_KEY to your .env file."
      );
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        include_adult: "false",
        sort_by: sort,
        "vote_average.gte": rating,
        "vote_count.gte": "80",
      });

      if (genre) {
        params.set("with_genres", genre);
      } else if (selectedMood) {
        params.set("with_genres", selectedMood.genres.join(","));
      }

      if (year) {
        params.set("primary_release_date.gte", `${year}-01-01`);
      }

      if (language) {
        params.set("with_original_language", language);
      }

      const response = await fetch(
        `${API}/discover/movie?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY.trim()}`,
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "TMDB rejected the Read Access Token. Check that the full token is in .env, then restart Vite."
            : "Unable to load movies. Please try again."
        );
      }

      const data = await response.json();
      setMovies(data.results || []);
      setPage(nextPage);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    discoverMovies(1);
    // Initial recommendations; filters are applied by the Find Films button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetFilters() {
    setMood("");
    setGenre("");
    setYear("");
    setRating("0");
    setLanguage("");
    setSort("popularity.desc");
    setQuery("");
    setMovies([]);
    setPage(1);
    setHasSearched(false);
    setError("");
  }

  const visibleMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="find-film-page">
      <header className="find-film-topbar">
        <Link to="/" className="find-film-logo" aria-label="CineMate home">
          <span className="logo-cine">CINE</span><span className="logo-mate">MATE</span><sup>®</sup>
        </Link>

        <nav className="find-film-nav">
          <Link to="/">Discover</Link>
          <Link to="/#collections">Collections</Link>
          <Link to="/#about">About</Link>
          <Link to="/awards">Awards</Link>
        </nav>

        <Link to="/" className="back-home">
          <ArrowLeft size={15} />
          <span>Home</span>
        </Link>
      </header>

      <section className="find-film-intro">
        <div className="find-film-copy">
          <div className="find-film-eyebrow">
            <span className="red-dot" />
            YOUR NEXT MOVIE STARTS HERE
          </div>

          <div className="find-film-heading-row">
            <div>
              <h1>
                WHAT'S YOUR
                <br />
                <span>MOOD</span> TONIGHT?
                <i>.</i>
              </h1>
              <p>
                Every mood has a story. Find a film that feels right for
                the moment.
              </p>
            </div>

            <div className="film-stamp" aria-hidden="true">
              <Clapperboard size={38} strokeWidth={1.5} />
              <span>THE FILM FINDER</span>
              <span>EST. CINEMATE</span>
            </div>
          </div>
          <div className="intro-footnote"><span>01 / 03</span> STORIES FOR EVERY STATE OF MIND</div>
        </div>

        <div className="find-film-collage" aria-label="A collage of cinematic stills">
          <div className="collage-image collage-one">
            <img src="https://image.tmdb.org/t/p/w780/xJHokMbljvjADYdit5fK5VQsXEG.jpg" alt="Interstellar cinematic scene" />
          </div>
          <div className="collage-image collage-two">
            <img src="https://image.tmdb.org/t/p/w780/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg" alt="Oppenheimer cinematic scene" />
          </div>
          <div className="collage-image collage-three">
            <img src="https://image.tmdb.org/t/p/w500/6oH378KUfCEitzJkm07r97L0RsZ.jpg" alt="Past Lives cinematic scene" />
          </div>
          <div className="collage-image collage-four">
            <img src="https://image.tmdb.org/t/p/w780/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg" alt="La La Land cinematic scene" />
          </div>
          <span className="collage-caption">A WORLD OF FILM / CINEMATE</span>
        </div>
      </section>

      <section className="global-movie-search" aria-label="Search any movie">
        <form className="global-movie-search-form" onSubmit={(event) => { event.preventDefault(); submitGlobalSearch(); }}>
          <Search size={19} />
          <input
            value={globalSearch}
            onChange={(event) => setGlobalSearch(event.target.value)}
            placeholder="Search any movie — e.g. Batman, Dune, Interstellar..."
            aria-label="Search all movies"
            autoComplete="off"
          />
          {globalSearch && <button type="button" aria-label="Clear movie search" onClick={() => { setGlobalSearch(""); setSuggestions([]); setDidGlobalSearch(false); setQuery(""); discoverMovies(1); }}><X size={16} /></button>}
          <button className="global-search-submit" type="submit">SEARCH <ArrowUpRight size={15} /></button>
        </form>
        {globalSearch.trim() && (suggestionLoading || suggestions.length > 0) && (
          <div className="movie-search-suggestions">
            {suggestionLoading && <div className="suggestion-status">Finding matching titles…</div>}
            {suggestions.map((movie) => (
              <button type="button" key={movie.id} className="movie-suggestion" onClick={() => submitGlobalSearch(movie.title)}>
                {movie.poster_path ? <img src={`${IMAGE}/w92${movie.poster_path}`} alt="" /> : <span className="suggestion-no-poster"><Clapperboard size={16} /></span>}
                <span><strong>{movie.title}</strong><small>{movie.release_date?.slice(0, 4) || "Release year unknown"}</small></span>
                <ArrowUpRight size={15} />
              </button>
            ))}
          </div>
        )}
        <p className="global-search-help">Partial titles work too. Choose a suggestion for a more precise match.</p>
      </section>

      <section className="mood-section">
        <div className="section-kicker">
          <span>01</span>
          <h2>HOW ARE YOU FEELING?</h2>
        </div>

        <div className="mood-grid">
          {moods.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`mood-card ${
                mood === item.id ? "selected" : ""
              }`}
              onClick={() => {
                setMood(mood === item.id ? "" : item.id);
                setGenre("");
              }}
            >
              <span className="mood-index">
                0{index + 1}
              </span>
              <span className="mood-name">{item.label}</span>
              <span className="mood-description">
                {item.description}
              </span>
              <ArrowUpRight className="mood-arrow" size={19} />
            </button>
          ))}
        </div>
      </section>

      <section className="film-filter-section">
        <div className="filter-heading">
          <div className="section-kicker">
            <span>02</span>
            <h2>MAKE IT YOURS</h2>
          </div>
          <button className="clear-filters" onClick={resetFilters}>
            <X size={14} /> Reset filters
          </button>
        </div>

        <div className="filter-grid">
          <label className="filter-field">
            <span>GENRE</span>
            <div className="select-wrap">
              <select
                value={genre}
                onChange={(e) => {
                  setGenre(e.target.value);
                  if (e.target.value) setMood("");
                }}
              >
                <option value="">Mood-based / All</option>
                {genres.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} />
            </div>
          </label>

          <label className="filter-field">
            <span>RELEASE PERIOD</span>
            <div className="select-wrap">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {years.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} />
            </div>
          </label>

          <label className="filter-field">
            <span>MINIMUM RATING</span>
            <div className="select-wrap">
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="0">Any rating</option>
                <option value="5">5.0+</option>
                <option value="6">6.0+</option>
                <option value="7">7.0+</option>
                <option value="8">8.0+</option>
              </select>
              <ChevronDown size={15} />
            </div>
          </label>

          <label className="filter-field">
            <span>LANGUAGE</span>
            <div className="select-wrap">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {languages.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} />
            </div>
          </label>

          <label className="filter-field">
            <span>SORT BY</span>
            <div className="select-wrap">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="popularity.desc">Popular</option>
                <option value="vote_average.desc">Top rated</option>
                <option value="release_date.desc">Latest releases</option>
                <option value="revenue.desc">Box office</option>
              </select>
              <ChevronDown size={15} />
            </div>
          </label>
        </div>

        <div className="filter-actions">
          <div className="filter-note">
            <SlidersHorizontal size={15} />
            Fine-tune your next watch
          </div>
          <button
            className="find-films-button"
            onClick={() => discoverMovies(1)}
            disabled={loading}
          >
            {loading ? "FINDING..." : "FIND FILMS"}
            <ArrowUpRight size={17} />
          </button>
        </div>
      </section>

      <section className="recommendations-section" ref={resultsRef}>
        <div className="recommendations-heading">
          <div>
            <div className="section-kicker">
              <span>03</span>
              <h2>YOUR FILM SELECTION</h2>
            </div>
            <p>
              {didGlobalSearch
                ? `Search results for “${globalSearch}”.`
                : selectedMood
                  ? `Stories selected for your "${selectedMood.label}" mood.`
                  : "Explore films selected by your preferences."}
            </p>
          </div>

          <div className="selection-mark">
            <Sparkles size={15} />
            CINEMATE PICKS
          </div>
        </div>

        <div className="movie-search">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search within these results..."
            aria-label="Search within movie results"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              <X size={15} />
            </button>
          )}
        </div>

        {error && (
          <div className="film-error" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="film-results-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : visibleMovies.length > 0 ? (
          <>
            <div className="film-results-grid">
              {visibleMovies.map((movie, index) => (
                <article
                  className="film-result-card"
                  key={movie.id}
                  style={{ animationDelay: `${index * 45}ms` }}
                >
                  <a
                    className="film-poster-link"
                    href={`https://www.themoviedb.org/movie/${movie.id}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View ${movie.title} on TMDB`}
                  >
                    {movie.poster_path ? (
                      <img
                        className="film-poster"
                        src={`${IMAGE}/w500${movie.poster_path}`}
                        alt={`${movie.title} poster`}
                        loading="lazy"
                      />
                    ) : (
                      <div className="poster-placeholder">
                        <Clapperboard size={32} />
                        <span>NO POSTER</span>
                      </div>
                    )}
                    <span className="poster-overlay">
                      VIEW FILM <ArrowUpRight size={17} />
                    </span>
                  </a>

                  <div className="film-result-info">
                    <div className="film-result-title">
                      <h3>{movie.title}</h3>
                      <span className="film-rating">
                        <Star size={12} fill="currentColor" />
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                    <div className="film-result-meta">
                      <span>
                        {movie.release_date
                          ? movie.release_date.slice(0, 4)
                          : "N/A"}
                      </span>
                      <span className="meta-divider" />
                      <span>{movie.original_language.toUpperCase()}</span>
                    </div>
                    <p className="film-overview">
                      {movie.overview || "No description available."}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="load-more-wrap">
              <button
                className="load-more-button"
                onClick={() => didGlobalSearch ? searchMovies(globalSearch, page + 1) : discoverMovies(page + 1)}
                disabled={loading}
              >
                LOAD MORE FILMS <ArrowUpRight size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="film-empty-state">
            <Clapperboard size={35} strokeWidth={1.3} />
            <h3>
              {hasSearched ? "NO FILMS FOUND" : "READY WHEN YOU ARE"}
            </h3>
            <p>
              {hasSearched
                ? "Try changing your mood or filters to discover more films."
                : "Choose your mood and filters, then find your next film."}
            </p>
            {hasSearched && (
              <button onClick={resetFilters}>CLEAR ALL FILTERS</button>
            )}
          </div>
        )}
      </section>

      <footer className="find-film-footer">
        <Link to="/" className="find-film-logo">
          <span className="logo-cine">CINE</span><span className="logo-mate">MATE</span><sup>®</sup>
        </Link>
        <span>EVERY MOOD HAS A MOVIE.</span>
        <span>POSTER AND MOVIE DATA BY TMDB</span>
      </footer>
    </main>
  );
}