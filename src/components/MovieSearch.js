import { useState, useEffect, useRef, useCallback } from "react";

const OMDB_KEY = "b9a5e69d";
const SEARCH_URL = `https://www.omdbapi.com/?apikey=${OMDB_KEY}&type=movie&s=`;
const DETAIL_URL = `https://www.omdbapi.com/?apikey=${OMDB_KEY}&i=`;

// Inject keyframes once
const styleId = "movie-search-anims";
if (typeof document !== "undefined" && !document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    @keyframes msSlideUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes msFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes msPosterReveal {
      from { opacity: 0; transform: scale(0.92); }
      to   { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}

const MovieSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [focused, setFocused] = useState(false);
  const [searchStatus, setSearchStatus] = useState("idle"); // idle, loading, success, empty, error
  const timerRef = useRef(null);
  const wrapRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced search
  const search = useCallback((q) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (q.length < 2) { 
      setResults([]); 
      setSearchStatus("idle");
      return; 
    }
    setSearchStatus("loading");
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(SEARCH_URL + encodeURIComponent(q));
        const data = await res.json();
        if (data.Response === "True" && data.Search) {
          setResults(data.Search.slice(0, 6));
          setSearchStatus("success");
        } else {
          setResults([]);
          setSearchStatus("empty");
        }
      } catch { 
        setResults([]);
        setSearchStatus("error");
      }
    }, 400);
  }, []);

  const handleInput = (e) => {
    const v = e.target.value;
    setQuery(v);
    search(v);
  };

  const openDetail = async (imdbID) => {
    setFocused(false);
    setQuery("");
    setResults([]);
    setSearchStatus("idle");
    setSelected(imdbID);
    try {
      const res = await fetch(DETAIL_URL + imdbID + "&plot=full");
      const data = await res.json();
      setDetail(data);
    } catch { setDetail(null); }
  };

  const closeDetail = () => { setSelected(null); setDetail(null); };

  // --- Styles ---
  const wrap = {
    position: "relative",
    zIndex: 100,
  };

  const inputStyle = {
    width: focused ? "340px" : "280px",
    height: "38px",
    padding: "0 16px 0 40px",
    background: "rgba(255,255,255,0.06)",
    border: `1px solid ${focused ? "rgba(232,201,122,0.6)" : "rgba(232,201,122,0.25)"}`,
    borderRadius: "20px",
    color: "#f4f2ee",
    fontSize: "12px",
    letterSpacing: "0.04em",
    outline: "none",
    transition: "all 0.3s ease",
    boxShadow: focused ? "0 0 15px rgba(232,201,122,0.1)" : "none",
  };

  const iconStyle = {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "14px",
    opacity: 0.5,
    pointerEvents: "none",
    color: "#f4f2ee"
  };

  const dropStyle = {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    right: 0,
    background: "rgba(15,15,15,0.95)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(232,201,122,0.15)",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
  };

  const itemStyle = (hovered) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 14px",
    cursor: "pointer",
    transition: "background 0.2s",
    background: hovered ? "rgba(232,201,122,0.08)" : "transparent",
  });

  const messageStyle = {
    padding: "16px",
    fontSize: "12px",
    color: "rgba(244,242,238,0.5)",
    textAlign: "center",
    letterSpacing: "0.05em",
  };

  // --- Modal ---
  const overlay = {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "#08080a", // solid background to prevent overlapping carousel bleed-through
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "msFadeIn 0.3s ease",
  };

  const modalContent = {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const posterStyle = {
    width: "360px",
    borderRadius: "12px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(232,201,122,0.08)",
    animation: "msPosterReveal 0.6s ease forwards",
    objectFit: "cover",
    zIndex: 5,
  };

  const animLine = (i) => ({
    opacity: 0,
    animation: `msSlideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`,
    animationDelay: `${0.2 + i * 0.1}s`,
  });

  const titleStyle = {
    fontSize: "clamp(32px, 4.5vw, 52px)",
    fontWeight: 600,
    lineHeight: 1.05,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    background: "linear-gradient(135deg, #e8c97a, #f0d68a, #c9a44e)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    paddingRight: "40px", // prevent overlapping with close button
  };

  const metaRow = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    fontSize: "14px",
    color: "rgba(244,242,238,0.7)",
    letterSpacing: "0.08em",
    flexWrap: "wrap",
  };

  const genrePill = {
    display: "inline-block",
    padding: "6px 16px",
    border: "1px solid rgba(232,201,122,0.3)",
    borderRadius: "20px",
    fontSize: "11px",
    letterSpacing: "0.12em",
    color: "#e8c97a",
    marginRight: "10px",
    marginBottom: "6px",
    background: "rgba(232,201,122,0.05)",
  };

  const ratingStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "24px",
    fontWeight: 500,
    color: "#f0d68a",
  };

  const plotStyle = {
    fontSize: "15px",
    lineHeight: 1.8,
    color: "rgba(244,242,238,0.85)",
    maxWidth: "600px",
    marginTop: "8px",
    marginBottom: "8px",
  };

  const labelStyle = {
    fontSize: "10px",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "rgba(244,242,238,0.45)",
    marginBottom: "6px",
  };

  const valueStyle = {
    fontSize: "15px",
    color: "#f4f2ee",
    lineHeight: 1.6,
  };

  const closeBtn = {
    position: "fixed",
    top: "16px",
    right: "16px",
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "1px solid rgba(232,201,122,0.5)",
    background: "rgba(10, 10, 15, 0.8)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    color: "#e8c97a",
    fontSize: "20px",
    fontWeight: 300,
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    transition: "all 0.3s ease",
    zIndex: 10000,
  };

  const [hoveredIdx, setHoveredIdx] = useState(-1);

  return (
    <>
      <div ref={wrapRef} style={wrap}>
        <span style={iconStyle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={handleInput}
          onFocus={() => setFocused(true)}
          style={inputStyle}
        />
        {focused && query.length >= 2 && (
          <div style={dropStyle}>
            {searchStatus === "loading" && <div style={messageStyle}>Searching...</div>}
            {searchStatus === "empty" && <div style={messageStyle}>No movies found for "{query}"</div>}
            {searchStatus === "error" && <div style={messageStyle}>Error connecting to server.</div>}
            {searchStatus === "success" && results.map((r, i) => (
              <div
                key={r.imdbID}
                style={itemStyle(hoveredIdx === i)}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(-1)}
                onClick={() => openDetail(r.imdbID)}
              >
                <img
                  src={r.Poster !== "N/A" ? r.Poster : ""}
                  alt=""
                  style={{ width: 36, height: 54, borderRadius: 4, objectFit: "cover", background: "rgba(255,255,255,0.05)" }}
                />
                <div>
                  <div style={{ fontSize: "13px", color: "#f4f2ee", fontWeight: 500 }}>{r.Title}</div>
                  <div style={{ fontSize: "11px", color: "rgba(244,242,238,0.45)", marginTop: 2 }}>{r.Year}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && detail && (
        <div style={overlay} onClick={closeDetail}>
          <button
            style={closeBtn}
            onClick={closeDetail}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(232,201,122,0.12)";
              e.currentTarget.style.borderColor = "rgba(232,201,122,0.7)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(232,201,122,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(232,201,122,0.4)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            ✕
          </button>
          
          <div style={modalContent} onClick={(e) => e.stopPropagation()}>
            
            {/* LEFT PANEL */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "40px",
                right: "calc(50% + 200px)",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                zIndex: 10,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div
                style={{
                  margin: "auto 0",
                  padding: "80px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  textAlign: "right",
                  alignItems: "flex-end",
                }}
              >
                {/* Director */}
                <div style={animLine(4)}>
                  <div style={labelStyle}>DIRECTOR</div>
                  <div style={valueStyle}>{detail.Director}</div>
                </div>

                {/* Cast */}
                <div style={animLine(5)}>
                  <div style={labelStyle}>CAST</div>
                  <div style={valueStyle}>{detail.Actors}</div>
                </div>
                
                {/* Awards */}
                {detail.Awards && detail.Awards !== "N/A" && (
                  <div style={animLine(6)}>
                    <div style={labelStyle}>AWARDS</div>
                    <div style={{ ...valueStyle, color: "#e8c97a", display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "flex-start", textAlign: "right" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "4px" }}>
                        <path d="M8 21h8M12 17v4M7 4h10M5 4h14a2 2 0 0 1 2 2v2a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6V6a2 2 0 0 1 2-2z"></path>
                      </svg>
                      <span>{detail.Awards}</span>
                    </div>
                  </div>
                )}

                {/* Box Office */}
                {detail.BoxOffice && detail.BoxOffice !== "N/A" && (
                  <div style={animLine(7)}>
                    <div style={labelStyle}>BOX OFFICE</div>
                    <div style={valueStyle}>{detail.BoxOffice}</div>
                  </div>
                )}
              </div>
            </div>

            {/* CENTER POSTER */}
            {detail.Poster && detail.Poster !== "N/A" && (
              <img src={detail.Poster.replace("SX300", "SX600")} alt={detail.Title} style={posterStyle} />
            )}

            {/* RIGHT PANEL */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "calc(50% + 200px)",
                right: "40px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                zIndex: 10,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div
                style={{
                  margin: "auto 0",
                  padding: "80px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                {/* Title */}
                <div style={{ ...animLine(0), ...titleStyle }}>{detail.Title}</div>

                {/* Meta row */}
                <div style={{ ...animLine(1), ...metaRow }}>
                  <span>{detail.Year}</span>
                  <span>·</span>
                  <span>{detail.Rated}</span>
                  <span>·</span>
                  <span>{detail.Runtime}</span>
                </div>

                {/* Genre pills */}
                <div style={animLine(2)}>
                  {(detail.Genre || "").split(",").map((g, i) => (
                    <span key={i} style={genrePill}>{g.trim().toUpperCase()}</span>
                  ))}
                </div>

                {/* Rating */}
                <div style={{ ...animLine(3), ...ratingStyle }}>
                  <span style={{ color: "#f0d68a", display: "flex", alignItems: "center" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </span>
                  <span>{detail.imdbRating}</span>
                  <span style={{ fontSize: "12px", color: "rgba(244,242,238,0.4)", fontWeight: 400 }}>/ 10 IMDb</span>
                </div>

                {/* Plot */}
                <div style={{ ...animLine(4), ...plotStyle }}>{detail.Plot}</div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default MovieSearch;
