// React wrapper for the liquid-glass carousel engine.
// Usage: <LiquidGlassCarousel projects={[{ src, title, category, year }, ...]} />

import React, { useEffect, useRef, useState } from "react";
import { createCarousel } from "./carousel-engine";

const OMDB_KEY = "b9a5e69d";

export const LiquidGlassCarousel = ({ projects = [] }) => {
  const mountRef = useRef(null);
  const engineRef = useRef(null);
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const [entryDone, setEntryDone] = useState(false);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    if (!mountRef.current || projects.length === 0) return;

    // Map movie data to the format the engine expects
    const engineProjects = projects.map((p) => ({
      src: p.src + "?cors=1",
      aspect: null, // auto-measure from image
      brand: p.title || "",
      desc: p.category || "",
    }));

    const engine = createCarousel(mountRef.current, engineProjects, {
      onActiveChange: setActive,
      onFocusChange: setFocused,
      onEntryDone: setEntryDone,
    });
    engineRef.current = engine;

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, [projects]);

  const current = projects[active] || {};

  // Fetch OMDB details when focused
  useEffect(() => {
    if (focused && current.title) {
      const fetchDetail = async () => {
        try {
          const res = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_KEY}&t=${encodeURIComponent(current.title)}&plot=full`);
          const data = await res.json();
          if (data.Response === "True") {
            setDetail(data);
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchDetail();
    } else {
      setDetail(null);
    }
  }, [focused, current.title]);

  // Close focus on click anywhere (when focused)
  const handleClose = () => {
    if (engineRef.current && focused) {
      engineRef.current.closeFocus();
    }
  };

  // Shared Animation Styles
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

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* WebGL canvas mounts here */}
      <div
        ref={mountRef}
        style={{ width: "100%", height: "100%" }}
      />

      {/* Overlay: basic info on UPPER side of cards (hidden when focused) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "300px",
          height: "450px",
          pointerEvents: "none",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          transition: "opacity 0.4s ease",
          opacity: (!entryDone || focused) ? 0 : 1,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(244, 242, 238, 0.88)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: "20px",
            padding: "4px 12px",
            marginBottom: "12px",
            alignSelf: "flex-start",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#009dff",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#333",
              fontWeight: 600,
            }}
          >
            {current.category || ""}
          </span>
          {current.year && (
            <span
              style={{
                fontSize: "9px",
                letterSpacing: "0.1em",
                color: "#666",
              }}
            >
              · {current.year}
            </span>
          )}
        </div>

        <div
          style={{
            fontSize: "28px",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: "#fff",
            textTransform: "uppercase",
            textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          }}
        >
          {current.title || ""}
        </div>
      </div>

      {/* Detailed Info Overlay when Focused */}
      {focused && detail && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
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
              pointerEvents: "auto",
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
              pointerEvents: "auto",
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
      )}

      {/* Counter on UPPER right */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "24px",
          pointerEvents: "none",
          zIndex: 10,
          background: "rgba(244, 242, 238, 0.88)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          borderRadius: "20px",
          padding: "5px 14px",
          fontSize: "10px",
          letterSpacing: "0.12em",
          color: "#333",
          fontWeight: 600,
          transition: "opacity 0.4s ease",
          opacity: focused ? 0 : 1,
        }}
      >
        {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
      </div>

      {/* Close button when focused */}
      {focused && (
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            zIndex: 11,
            width: "44px",
            height: "44px",
            border: "1px solid rgba(232, 201, 122, 0.5)",
            borderRadius: "50%",
            background: "rgba(10, 10, 15, 0.8)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            fontSize: "20px",
            fontWeight: 300,
            color: "#e8c97a",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(232, 201, 122, 0.12)";
            e.currentTarget.style.borderColor = "rgba(232, 201, 122, 0.7)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(232, 201, 122, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
            e.currentTarget.style.borderColor = "rgba(232, 201, 122, 0.4)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};
