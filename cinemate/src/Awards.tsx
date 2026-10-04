
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./awards.css";

type Award = {
  name: string;
  short: string;
  year: string;
  description: string;
  color: string;
  detail: string;
};

type Film = {
  title: string;
  year: number;
  awards: string;
  category: string;
  image: string;
  awardType: string[];
};

const awards: Award[] = [
  {
    name: "Academy Awards",
    short: "OSCARS",
    year: "1929",
    description: "Celebrating outstanding cinematic achievements.",
    color: "#d4ae68",
    detail:
      "The Academy Awards recognize achievements across filmmaking, including directing, acting, writing, cinematography and more.",
  },
  {
    name: "BAFTA Awards",
    short: "BAFTA",
    year: "1947",
    description: "Recognizing excellence in film and television.",
    color: "#b9a3d8",
    detail:
      "The British Academy of Film and Television Arts celebrates creative work in cinema, television and related screen arts.",
  },
  {
    name: "Golden Globe Awards",
    short: "GOLDEN GLOBES",
    year: "1944",
    description: "Honoring film and television storytelling.",
    color: "#d3b46c",
    detail:
      "The Golden Globes recognize achievements in motion pictures and television across drama, comedy and musical categories.",
  },
  {
    name: "Cannes Film Festival",
    short: "CANNES",
    year: "1946",
    description: "A global celebration of cinematic storytelling.",
    color: "#a5b9a5",
    detail:
      "The Cannes Film Festival showcases international cinema and awards distinctions such as the Palme d'Or.",
  },
];

const films: Film[] = [
  {
    title: "Oppenheimer",
    year: 2023,
    awards: "7 Academy Awards",
    category: "Drama",
    image: "https://image.tmdb.org/t/p/w780/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
    awardType: ["OSCARS"],
  },
  {
    title: "Everything Everywhere All at Once",
    year: 2022,
    awards: "7 Academy Awards",
    category: "Sci-Fi",
    image: "https://image.tmdb.org/t/p/w780/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    awardType: ["OSCARS"],
  },
  {
    title: "Dune: Part Two",
    year: 2024,
    awards: "Multiple nominations",
    category: "Sci-Fi",
    image: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    awardType: ["OSCARS"],
  },
  {
    title: "Parasite",
    year: 2019,
    awards: "4 Academy Awards",
    category: "Thriller",
    image: "https://image.tmdb.org/t/p/w780/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    awardType: ["OSCARS", "CANNES"],
  },
  {
    title: "The Grand Budapest Hotel",
    year: 2014,
    awards: "4 Academy Awards",
    category: "Comedy",
    image: "https://image.tmdb.org/t/p/w780/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
    awardType: ["OSCARS", "BAFTA"],
  },
  {
    title: "La La Land",
    year: 2016,
    awards: "6 Academy Awards",
    category: "Musical",
    image: "https://image.tmdb.org/t/p/w780/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    awardType: ["OSCARS", "GOLDEN GLOBES", "BAFTA"],
  },
];

const categories = [
  "All genres",
  "Drama",
  "Sci-Fi",
  "Thriller",
  "Comedy",
  "Musical",
];

export default function Awards() {
  const [search, setSearch] = useState("");
  const [selectedAward, setSelectedAward] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All genres");
  const [activeAward, setActiveAward] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 700);
    return () => window.clearTimeout(timeout);
  }, []);

  const filteredFilms = useMemo(() => {
    const query = search.trim().toLowerCase();

    return films.filter((film) => {
      const matchesSearch =
        !query ||
        film.title.toLowerCase().includes(query) ||
        film.category.toLowerCase().includes(query) ||
        film.awards.toLowerCase().includes(query);

      const matchesAward =
        selectedAward === "All" ||
        film.awardType.includes(selectedAward);

      const matchesGenre =
        selectedGenre === "All genres" ||
        film.category === selectedGenre;

      return matchesSearch && matchesAward && matchesGenre;
    });
  }, [search, selectedAward, selectedGenre]);

  return (
    <main className="awards-page">
      <header className="awards-topbar">
        <Link className="awards-logo" to="/" aria-label="CineMate home">
          CINE<span>MATE</span><sup>®</sup>
        </Link>

        <nav className="awards-navigation" aria-label="Main navigation">
          <Link to="/">DISCOVER</Link>
          <Link to="/#collections">COLLECTIONS</Link>
          <Link to="/#about">ABOUT</Link>
          <Link to="/awards" className="active">
            AWARDS
          </Link>
          <Link to="/find-film">FIND A FILM</Link>
        </nav>

        <Link className="awards-home-link" to="/">
          <span aria-hidden="true">↖</span> HOME
        </Link>
      </header>

      <section className="awards-hero">
        <div className="awards-hero-copy">
          <div className="eyebrow">
            <span className="red-dot" />
            THE ART OF RECOGNITION
          </div>

          <h1>
            BEYOND
            <br />
            THE
            <br />
            TROPHY<span className="big-dot">.</span>
          </h1>

          <p>
            A celebration of the films, filmmakers, and stories
            that leave their mark on cinema.
          </p>

          <a href="#award-organizations" className="awards-explore">
            EXPLORE AWARDS <span>↗</span>
          </a>
        </div>

        <div className="awards-hero-art">
          <div className="hero-film-image">
            <img
              src="https://image.tmdb.org/t/p/original/ptpr0kGAckfQkJeJIt8st5dglvd.jpg"
              alt="Oppenheimer cinematic artwork"
            />
            <div className="hero-image-overlay" />
            <span className="hero-image-index">01 / 06</span>
          </div>

          <div className="hero-art-caption">
            <span>FEATURED FILM</span>
            <span>OPPENHEIMER / 2023</span>
          </div>
        </div>

        <div className="hero-vertical-text">
          CINEMA / RECOGNITION / EXCELLENCE
        </div>
      </section>

      <section
        className="award-organizations"
        id="award-organizations"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE GLOBAL STAGE / 01</span>
            <h2>THE AWARDS<span className="heading-dot">.</span></h2>
          </div>
          <p>
            Explore the institutions that celebrate filmmaking
            across the world.
          </p>
        </div>

        <div className="award-org-grid">
          {awards.map((award, index) => {
            const isActive = activeAward === award.short;

            return (
              <button
                className={`award-org-card ${isActive ? "selected" : ""}`}
                key={award.short}
                type="button"
                aria-expanded={isActive}
                onClick={() =>
                  setActiveAward(isActive ? null : award.short)
                }
                style={
                  { "--award-color": award.color } as React.CSSProperties
                }
              >
                <span className="org-number">
                  0{index + 1} / AWARD
                </span>

                <div className="award-emblem" aria-hidden="true">
                  {award.short === "OSCARS" ? "✦" : "✳"}
                </div>

                <h3>{award.short}</h3>
                <p>{award.description}</p>

                <div className="org-bottom">
                  <span>EST. {award.year}</span>
                  <span className="org-arrow">
                    {isActive ? "−" : "↗"}
                  </span>
                </div>

                <div className={`award-expanded ${isActive ? "open" : ""}`}>
                  <strong>{award.name}</strong>
                  <p>{award.detail}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="award-winning-films" id="winning-films">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE ARCHIVE / 02</span>
            <h2>
              AWARD-WINNING
              <br />
              CINEMA<span className="heading-dot">.</span>
            </h2>
          </div>
          <p>
            Explore recognized films through their awards,
            genres and stories.
          </p>
        </div>

        <div className="award-controls">
          <label className="award-search">
            <span aria-hidden="true">⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="SEARCH FILMS..."
              aria-label="Search films"
            />
            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>

          <div className="award-selects">
            <select
              value={selectedAward}
              onChange={(event) => setSelectedAward(event.target.value)}
              aria-label="Filter by award"
            >
              <option value="All">ALL AWARDS</option>
              {awards.map((award) => (
                <option value={award.short} key={award.short}>
                  {award.short}
                </option>
              ))}
            </select>

            <select
              value={selectedGenre}
              onChange={(event) => setSelectedGenre(event.target.value)}
              aria-label="Filter by genre"
            >
              {categories.map((category) => (
                <option value={category} key={category}>
                  {category.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="archive-meta">
          <span>FILM ARCHIVE</span>
          <span>
            {loading ? "LOADING..." : `${filteredFilms.length} FILMS`}
          </span>
        </div>

        <div className="award-film-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div className="award-film-skeleton" key={index}>
                  <div className="skeleton-poster" />
                  <div className="skeleton-line long" />
                  <div className="skeleton-line short" />
                </div>
              ))
            : filteredFilms.map((film, index) => (
                <article className="award-film-card" key={film.title}>
                  <div className="film-poster">
                    <img
                      src={film.image}
                      alt={`${film.title} poster`}
                      loading="lazy"
                    />
                    <span className="film-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="film-arrow">↗</span>
                    <div className="film-poster-overlay" />
                  </div>

                  <div className="film-info">
                    <div>
                      <h3>{film.title}</h3>
                      <span>
                        {film.year} / {film.category}
                      </span>
                    </div>
                    <p>{film.awards}</p>
                  </div>
                </article>
              ))}
        </div>

        {!loading && filteredFilms.length === 0 && (
          <div className="no-films">
            <span>NO RESULTS FOUND</span>
            <p>Try another title, award or genre.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedAward("All");
                setSelectedGenre("All genres");
              }}
            >
              RESET FILTERS ↗
            </button>
          </div>
        )}
      </section>

      <footer className="awards-footer">
        <Link to="/" className="footer-brand">
          CINE<span>MATE</span><sup>®</sup>
        </Link>
        <p>FOR THE LOVE OF CINEMA.</p>
        <Link to="/">BACK TO DISCOVER ↑</Link>
      </footer>
    </main>
  );
}