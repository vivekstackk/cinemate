import { useTitle } from "../hooks/useTitle";
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

export const HomePage = () => {
    useTitle("Cinemate");

    return (
        <main className="cinemate-home">
            <section className="cinemate-cinema">
                <div className="cinema-heading">
                    <span>FEATURED FILMS</span>
                    <span>01 — 16</span>
                </div>

                <div className="liquid-cinema">
                    <LiquidGlassCarousel
                        projects={movies}
                    />
                </div>
            </section>

            <section className="cinema-introduction">
                <div className="section-number">
                    01 — CINEMATE
                </div>

                <h1>
                    Cinema is a collection
                    <br />
                    of stories, feelings
                    <br />
                    and moments.
                </h1>
            </section>

            <section className="discover-section">
                <div className="section-number">
                    02 — DISCOVER
                </div>

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

                    <button>
                        FIND MY MOVIE ↗
                    </button>
                </div>
            </section>

            <section className="radar-section" id="radar">
                <div className="section-number">
                    03 — CINEMATE RADAR
                </div>

                <div className="radar-items">
                    <article className="radar-card">
                        <img className="radar-bg" src="https://images.unsplash.com/photo-1618519764620-7403abdbdf9c?auto=format&fit=crop&w=800&q=80" alt="Oscars" />
                        <div className="radar-overlay"></div>
                        <div className="radar-content">
                            <span>AWARDS</span>
                            <h3>Oscar season</h3>
                            <p>
                                Follow submissions, nominees and the
                                road to the ceremony.
                            </p>
                        </div>
                    </article>

                    <article className="radar-card">
                        <img className="radar-bg" src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80" alt="World Cinema" />
                        <div className="radar-overlay"></div>
                        <div className="radar-content">
                            <span>FESTIVALS</span>
                            <h3>World cinema</h3>
                            <p>
                                Discover what's emerging from major
                                film festivals.
                            </p>
                        </div>
                    </article>

                    <article className="radar-card">
                        <img className="radar-bg" src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80" alt="News" />
                        <div className="radar-overlay"></div>
                        <div className="radar-content">
                            <span>NEWS</span>
                            <h3>What's happening</h3>
                            <p>
                                Fresh stories, releases, casting and
                                trailers.
                            </p>
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