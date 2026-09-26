import { useTitle } from "../hooks/useTitle";
import { useEffect, useRef, useState } from "react";
import { LiquidGlassCarousel } from "../components/ui/liquid-glass-carousel";

const movies = [
    { src: 'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', title: 'Interstellar', category: 'SCI-FI / DRAMA', year: '2014' },
    { src: 'https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', title: 'Oppenheimer', category: 'DRAMA / HISTORY', year: '2023' },
    { src: 'https://image.tmdb.org/t/p/w780/1X7vow16X7CnCoexXh4H4F2yDJv.jpg', title: 'Dune: Part Two', category: 'SCI-FI / ADVENTURE', year: '2024' },
    { src: 'https://image.tmdb.org/t/p/w780/74xTEgt7R36Fpooo50r9T25onhq.jpg', title: 'The Batman', category: 'ACTION / CRIME', year: '2022' },
    { src: 'https://image.tmdb.org/t/p/w780/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', title: 'Inception', category: 'SCI-FI / ACTION', year: '2010' },
    { src: 'https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg', title: 'The Dark Knight', category: 'ACTION / CRIME', year: '2008' },
    { src: 'https://image.tmdb.org/t/p/w780/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', title: 'Parasite', category: 'DRAMA / THRILLER', year: '2019' },
    { src: 'https://image.tmdb.org/t/p/w780/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', title: 'The Shawshank Redemption', category: 'DRAMA / CRIME', year: '1994' },
    { src: 'https://image.tmdb.org/t/p/w780/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg', title: 'Pulp Fiction', category: 'CRIME / DRAMA', year: '1994' },
    { src: 'https://image.tmdb.org/t/p/w780/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', title: 'The Godfather', category: 'CRIME / DRAMA', year: '1972' },
    { src: 'https://image.tmdb.org/t/p/w780/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', title: 'Fight Club', category: 'DRAMA / THRILLER', year: '1999' },
    { src: 'https://image.tmdb.org/t/p/w780/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', title: 'The Matrix', category: 'SCI-FI / ACTION', year: '1999' },
    { src: 'https://image.tmdb.org/t/p/w780/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg', title: 'Spider-Man: Into the Spider-Verse', category: 'ANIMATION / ACTION', year: '2018' },
    { src: 'https://image.tmdb.org/t/p/w780/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', title: 'Dune', category: 'SCI-FI / ADVENTURE', year: '2021' },
    { src: 'https://image.tmdb.org/t/p/w780/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', title: 'Avatar: The Way of Water', category: 'SCI-FI / ADVENTURE', year: '2022' },
    { src: 'https://image.tmdb.org/t/p/w780/c8Ass7acuOe4za6DhSattE359gr.jpg', title: 'Schindler\'s List', category: 'DRAMA / HISTORY', year: '1993' }
];

const quotes = [
    { text: "Cinema is a mirror by which we often see ourselves.", author: "Alejandro González Iñárritu" },
    { text: "A film is — or should be — more like music than like fiction.", author: "Stanley Kubrick" },
    { text: "Every great film should seem new every time you see it.", author: "Roger Ebert" },
    { text: "Cinema is the most beautiful fraud in the world.", author: "Jean-Luc Godard" },
];

const stats = [
    { value: "500K+", label: "FILMS CATALOGUED" },
    { value: "190+", label: "COUNTRIES" },
    { value: "98", label: "YEARS OF CINEMA" },
    { value: "4.8", label: "AVG RATING" },
];

const moods = [
    { label: "Dramatic", color: "#e8c97a" },
    { label: "Sci-Fi", color: "#7ab8e8" },
    { label: "Comedy", color: "#7ae89a" },
    { label: "Horror", color: "#e87a7a" },
    { label: "Romance", color: "#e87acc" },
    { label: "Action", color: "#e8a97a" },
    { label: "Mystery", color: "#b87ae8" },
    { label: "Documentary", color: "#7ae8d4" },
];

const trending = [
    { title: "Dune: Part Two", year: "2024", rating: "8.5", poster: "https://image.tmdb.org/t/p/w300/1X7vow16X7CnCoexXh4H4F2yDJv.jpg" },
    { title: "Oppenheimer", year: "2023", rating: "8.4", poster: "https://image.tmdb.org/t/p/w300/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" },
    { title: "Parasite", year: "2019", rating: "8.5", poster: "https://image.tmdb.org/t/p/w300/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg" },
    { title: "The Batman", year: "2022", rating: "7.8", poster: "https://image.tmdb.org/t/p/w300/74xTEgt7R36Fpooo50r9T25onhq.jpg" },
];

/* Scroll-reveal hook */
function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.12 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
}

/* Animated counter */
function AnimCounter({ target, duration = 2000 }) {
    const [count, setCount] = useState("0");
    const ref = useRef(null);
    const started = useRef(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const num = parseInt(target.replace(/[^0-9]/g, ""), 10);
                if (isNaN(num)) { setCount(target); return; }
                const suffix = target.replace(/[0-9,]/g, "");
                const step = Math.ceil(num / (duration / 16));
                let current = 0;
                const timer = setInterval(() => {
                    current += step;
                    if (current >= num) { clearInterval(timer); setCount(target); }
                    else setCount(current.toLocaleString() + suffix);
                }, 16);
            }
        }, { threshold: 0.3 });
        obs.observe(el);
        return () => obs.disconnect();
    }, [target, duration]);
    return <span ref={ref}>{count}</span>;
}

/* Quote rotator */
function QuoteRotator() {
    const [idx, setIdx] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setIdx(i => (i + 1) % quotes.length), 5000);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="quote-rotator">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8c97a" strokeWidth="1.5" style={{ opacity: 0.5, marginBottom: 12, flexShrink: 0 }}>
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
            <p key={idx} className="quote-text">{quotes[idx].text}</p>
            <span className="quote-author">— {quotes[idx].author}</span>
        </div>
    );
}

export const HomePage = () => {
    useTitle("Cinemate");

    const [introRef, introVis] = useReveal();
    const [discoverRef, discoverVis] = useReveal();
    const [radarRef, radarVis] = useReveal();

    return (
        <main className="cinemate-home">
            {/* HERO: CAROUSEL */}
            <section className="cinemate-cinema">
                <div className="cinema-heading">
                    <span>FEATURED FILMS</span>
                    <span>01 — 16</span>
                </div>
                <div className="liquid-cinema">
                    <LiquidGlassCarousel projects={movies} />
                </div>
            </section>

            {/* GOLDEN DIVIDER */}
            <div className="section-divider">
                <div className="divider-line" />
                <svg className="divider-diamond" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="7" y="0.5" width="9" height="9" rx="1.5" transform="rotate(45 7 0.5)" stroke="#e8c97a" strokeWidth="1" />
                </svg>
                <div className="divider-line" />
            </div>

            {/* SECTION 1: INTRODUCTION */}
            <section
                className={`cinema-introduction reveal-section ${introVis ? "revealed" : ""}`}
                ref={introRef}
            >
                <div className="section-number">01 — CINEMATE</div>
                <div className="intro-grid">
                    <h1>
                        Cinema is a collection
                        <br />
                        of stories, feelings
                        <br />
                        and moments.
                    </h1>

                    <div className="stats-row">
                        {stats.map((s, i) => (
                            <div className="stat-item" key={i}>
                                <div className="stat-value"><AnimCounter target={s.value} /></div>
                                <div className="stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    <QuoteRotator />
                </div>
            </section>

            {/* GOLDEN DIVIDER */}
            <div className="section-divider">
                <div className="divider-line" />
                <svg className="divider-diamond" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="7" y="0.5" width="9" height="9" rx="1.5" transform="rotate(45 7 0.5)" stroke="#e8c97a" strokeWidth="1" />
                </svg>
                <div className="divider-line" />
            </div>

            {/* SECTION 2: DISCOVER */}
            <section
                className={`discover-section reveal-section ${discoverVis ? "revealed" : ""}`}
                ref={discoverRef}
            >
                <div className="section-number">02 — DISCOVER</div>
                <div className="discover-content">
                    <h2>
                        Tell us how
                        <br />
                        you feel.
                    </h2>

                    <p>
                        CineMate finds films based on your mood,
                        taste and curiosity — not just a genre.
                    </p>

                    {/* Mood pills */}
                    <div className="mood-grid">
                        {moods.map((m, i) => (
                            <button
                                key={i}
                                className="mood-pill"
                                style={{ "--pill-color": m.color }}
                            >
                                <span>{m.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Trending picks */}
                    <div className="trending-section">
                        <span className="trending-label">TRENDING NOW</span>
                        <div className="trending-row">
                            {trending.map((m, i) => (
                                <div className="trending-card" key={i}>
                                    <img src={m.poster} alt={m.title} />
                                    <div className="trending-info">
                                        <span className="trending-title">{m.title}</span>
                                        <span className="trending-meta">{m.year} · {m.rating}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* GOLDEN DIVIDER */}
            <div className="section-divider">
                <div className="divider-line" />
                <svg className="divider-diamond" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="7" y="0.5" width="9" height="9" rx="1.5" transform="rotate(45 7 0.5)" stroke="#e8c97a" strokeWidth="1" />
                </svg>
                <div className="divider-line" />
            </div>

            {/* SECTION 3: RADAR */}
            <section
                className={`radar-section reveal-section ${radarVis ? "revealed" : ""}`}
                ref={radarRef}
                id="radar"
            >
                <div className="section-number">03 — CINEMATE RADAR</div>
                <div className="radar-items">
                    <article className="radar-card">
                        <img className="radar-bg" src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80" alt="Oscars" />
                        <div className="radar-overlay"></div>
                        <div className="radar-content">
                            <span>AWARDS</span>
                            <h3>Oscar season</h3>
                            <p>Follow submissions, nominees and the road to the ceremony.</p>
                        </div>
                    </article>
                    <article className="radar-card">
                        <img className="radar-bg" src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80" alt="World Cinema" />
                        <div className="radar-overlay"></div>
                        <div className="radar-content">
                            <span>FESTIVALS</span>
                            <h3>World cinema</h3>
                            <p>Discover what's emerging from major film festivals.</p>
                        </div>
                    </article>
                    <article className="radar-card">
                        <img className="radar-bg" src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80" alt="News" />
                        <div className="radar-overlay"></div>
                        <div className="radar-content">
                            <span>NEWS</span>
                            <h3>What's happening</h3>
                            <p>Fresh stories, releases, casting and trailers.</p>
                        </div>
                    </article>
                </div>
            </section>

            <footer className="cinemate-footer">
                <span>CINEMATE</span>
                <span>DISCOVER · CINEMA · CULTURE</span>
                <span>© 2026</span>
            </footer>
        </main>
    );
};