
import { useState } from "react";
import { Search, Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  onSearch: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <header className="navbar">
      <a href="#home" className="brand" aria-label="CineMate home">
        CINE<span>MATE</span>
        <sup>®</sup>
      </a>

      <nav className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
        <a href="#discover" onClick={() => setMenuOpen(false)}>Discover</a>
        <a href="#collections" onClick={() => setMenuOpen(false)}>Collections</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
      </nav>

      <div className="nav-controls">
        <button
          className="nav-search"
          aria-label="Search movies"
          onClick={() => {
            setSearchOpen(!searchOpen);
            setMenuOpen(false);
          }}
        >
          {searchOpen ? <X size={17} /> : <Search size={17} />}
          <span>Search</span>
        </button>

        <a className="nav-action" href="#discover">
          Explore <ArrowUpRight size={14} />
        </a>

        <button
          className="mobile-menu"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {searchOpen && (
        <div className="search-panel">
          <label htmlFor="movie-search">Find your next film</label>
          <div className="search-input-wrap">
            <Search size={18} />
            <input
              id="movie-search"
              autoFocus
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search movies..."
            />
            {query && (
              <button
                aria-label="Clear search"
                onClick={() => handleSearch("")}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <p>Search through our curated movie selection.</p>
        </div>
      )}
    </header>
  );
}