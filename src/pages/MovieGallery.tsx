import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./MovieGallery.css";

type Movie = {
  title: string;
  year: string;
  genre: string;
  colors: [string, string];
};

type TMDBMovie = {
  id: number;
  title: string;
  original_title?: string;
  release_date?: string;
  poster_path: string | null;
};

type Provider = { provider_name: string; logo_path: string };

const movies: Movie[] = [
  { title: "Interstellar", year: "2014", genre: "Sci-Fi", colors: ["#111827", "#a88b65"] },
  { title: "Oppenheimer", year: "2023", genre: "Drama", colors: ["#32130c", "#e05a23"] },
  { title: "Dune", year: "2021", genre: "Sci-Fi", colors: ["#6e421f", "#e6ad62"] },
  { title: "Inception", year: "2010", genre: "Thriller", colors: ["#17202b", "#57768a"] },
  { title: "Parasite", year: "2019", genre: "Thriller", colors: ["#172c25", "#a5b59b"] },
  { title: "Whiplash", year: "2014", genre: "Drama", colors: ["#270d0d", "#a83228"] },
  { title: "The Batman", year: "2022", genre: "Crime", colors: ["#090909", "#a52a2a"] },
  { title: "Her", year: "2013", genre: "Romance", colors: ["#792e29", "#ef9b76"] },
  { title: "Fight Club", year: "1999", genre: "Drama", colors: ["#241c1b", "#a74d39"] },
  { title: "Arrival", year: "2016", genre: "Sci-Fi", colors: ["#29363c", "#b5a58b"] },
  { title: "The Matrix", year: "1999", genre: "Sci-Fi", colors: ["#071b13", "#2e9b6a"] },
  { title: "Pulp Fiction", year: "1994", genre: "Crime", colors: ["#3c1b12", "#d7a13c"] },
  { title: "La La Land", year: "2016", genre: "Musical", colors: ["#171f50", "#e8a94d"] },
  { title: "Paris, Texas", year: "1984", genre: "Drama", colors: ["#482e24", "#d69a65"] },
  { title: "The Godfather", year: "1972", genre: "Crime", colors: ["#151515", "#7d2727"] },
  { title: "Moonlight", year: "2016", genre: "Drama", colors: ["#112e61", "#6f91b5"] },
  { title: "Blade Runner", year: "1982", genre: "Sci-Fi", colors: ["#1b1b31", "#d87a42"] },
  { title: "Goodfellas", year: "1990", genre: "Crime", colors: ["#1d1715", "#b38b55"] },
  { title: "The Truman Show", year: "1998", genre: "Comedy", colors: ["#4a7d9b", "#e9d9b2"] },
  {
    title: "Eternal Sunshine of the Spotless Mind",
    year: "2004",
    genre: "Romance",
    colors: ["#324b46", "#c5a17c"],
  },
];

const posterCount = 180;
const radius = 5.15;
const IMAGE_BASE = "/tmdb-images/t/p/w500";

function normalizeTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
}

function createFallbackTexture(movie: Movie, index: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 560;

  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createLinearGradient(0, 0, 400, 560);
  gradient.addColorStop(0, movie.colors[0]);
  gradient.addColorStop(1, movie.colors[1]);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 560);

  const glow = ctx.createRadialGradient(220, 210, 10, 220, 210, 290);
  glow.addColorStop(0, "rgba(255,255,255,0.20)");
  glow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 400, 560);

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 2;

  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.arc(200, 250, 35 + i * 29, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(0, 420, 400, 140);

  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.font = "bold 31px Arial";
  ctx.fillText(movie.title.toUpperCase().slice(0, 24), 200, 475, 350);

  ctx.font = "17px Arial";
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillText(`${movie.year} / ${movie.genre.toUpperCase()}`, 200, 520);

  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.fillRect(24, 30, 4, 70 + (index % 5) * 18);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

/**
 * Searches TMDB and only accepts a matching movie.
 * It will not use an unrelated result just because it has a poster.
 */
async function getPosterPath(
  movie: Movie,
  token: string
): Promise<string | null> {
  const params = new URLSearchParams({
    query: movie.title,
    year: movie.year,
    include_adult: "false",
  });

  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(
      `TMDB ${response.status} for "${movie.title}": ${details.slice(0, 150)}`
    );
  }

  const data: { results?: TMDBMovie[] } = await response.json();
  const results = data.results ?? [];

  const wantedTitle = normalizeTitle(movie.title);

  // First preference: exact title and exact release year.
  const exactYearMatch = results.find((item) => {
    const titleMatches =
      normalizeTitle(item.title) === wantedTitle ||
      normalizeTitle(item.original_title ?? "") === wantedTitle;

    const yearMatches = item.release_date?.slice(0, 4) === movie.year;

    return titleMatches && yearMatches && Boolean(item.poster_path);
  });

  // Second preference: exact title, even if TMDB's year differs.
  const exactTitleMatch = results.find((item) => {
    const titleMatches =
      normalizeTitle(item.title) === wantedTitle ||
      normalizeTitle(item.original_title ?? "") === wantedTitle;

    return titleMatches && Boolean(item.poster_path);
  });

  const match = exactYearMatch ?? exactTitleMatch;

  if (!match?.poster_path) {
    console.warn(`No exact TMDB poster found for ${movie.title} (${movie.year})`);
    return null;
  }

  return `${IMAGE_BASE}${match.poster_path}`;
}

export default function MovieGallery() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedPoster, setSelectedPoster] = useState<string | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [providerLoading, setProviderLoading] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let animationFrame = 0;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      42,
      Math.max(mount.clientWidth, 1) /
        Math.max(mount.clientHeight, 1),
      0.1,
      100
    );

    camera.position.set(0, 0, 14.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.7));

    const keyLight = new THREE.PointLight(0xffd2a1, 55, 35);
    keyLight.position.set(-5, 5, 8);
    scene.add(keyLight);

    const redLight = new THREE.PointLight(0xe92735, 28, 30);
    redLight.position.set(6, -2, -4);
    scene.add(redLight);

    const sphere = new THREE.Group();
    scene.add(sphere);

    const geometry = new THREE.PlaneGeometry(0.72, 1.02);
    const posterMeshes: THREE.Mesh[] = [];
    const fallbackTextures: THREE.Texture[] = [];
    const loadedTextures = new Set<THREE.Texture>();

    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const normalAxis = new THREE.Vector3(0, 0, 1);

    // Create the sphere's 180 poster cards.
    for (let i = 0; i < posterCount; i++) {
      const y = 1 - (i / (posterCount - 1)) * 2;
      const ringRadius = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;

      const normal = new THREE.Vector3(
        Math.cos(theta) * ringRadius,
        y,
        Math.sin(theta) * ringRadius
      );

      const movie = movies[i % movies.length];
      const fallback = createFallbackTexture(movie, i);

      fallbackTextures.push(fallback);

      const material = new THREE.MeshStandardMaterial({
        map: fallback,
        roughness: 0.78,
        metalness: 0.05,
        side: THREE.DoubleSide,
      });

      const poster = new THREE.Mesh(geometry, material);

      poster.position.copy(normal).multiplyScalar(radius);
      poster.quaternion.setFromUnitVectors(normalAxis, normal);
      poster.rotateZ(((i % 7) - 3) * 0.025);
      poster.userData.movie = movie;

      sphere.add(poster);
      posterMeshes.push(poster);
    }

    // Fetch posters from TMDB.
    const token = import.meta.env.VITE_TMDB_API_KEY?.trim();

    if (!token) {
      console.error(
        "TMDB token missing. Add VITE_TMDB_API_KEY to the .env file beside package.json."
      );
    } else {
      const posterRequests = movies.map(async (movie) => {
        try {
          const url = await getPosterPath(movie, token);
          return url ? { title: movie.title, url } : null;
        } catch (error) {
          console.error(`Could not fetch poster for ${movie.title}`, error);
          return null;
        }
      });

      Promise.all(posterRequests).then((results) => {
        if (disposed) return;

        const posterUrls = new Map<string, string>();

        results.forEach((result) => {
          if (result) {
            posterUrls.set(result.title, result.url);
          }
        });

        const loader = new THREE.TextureLoader();

        posterUrls.forEach((url, title) => {
          loader.load(
            url,
            (texture) => {
              if (disposed) {
                texture.dispose();
                return;
              }

              texture.colorSpace = THREE.SRGBColorSpace;
              texture.minFilter = THREE.LinearMipmapLinearFilter;
              texture.magFilter = THREE.LinearFilter;
              texture.generateMipmaps = true;

              loadedTextures.add(texture);

              // Apply the same movie poster to every matching sphere card.
              posterMeshes.forEach((mesh) => {
                const movie = mesh.userData.movie as Movie;

                if (movie.title !== title) return;

                const material = mesh.material as THREE.MeshStandardMaterial;
                material.map = texture;
                material.needsUpdate = true;
              });
            },
            undefined,
            (error) => {
              console.error(`Image failed to load for ${title}`, error);
            }
          );
        });
      });
    }

    // Pointer interaction.
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    let isDragging = false;
    let moved = false;
    let lastX = 0;
    let lastY = 0;
    let velocityX = 0;
    let velocityY = 0;

    const onPointerDown = (event: PointerEvent) => {
      isDragging = true;
      moved = false;
      lastX = event.clientX;
      lastY = event.clientY;

      renderer.domElement.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isDragging) return;

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;

      if (Math.abs(dx) + Math.abs(dy) > 2) {
        moved = true;
      }

      sphere.rotation.y += dx * 0.006;
      sphere.rotation.x += dy * 0.004;

      velocityX = dx * 0.0004;
      velocityY = dy * 0.0003;

      lastX = event.clientX;
      lastY = event.clientY;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!isDragging) return;

      isDragging = false;

      if (!moved) {
        const rect = renderer.domElement.getBoundingClientRect();

        pointer.x =
          ((event.clientX - rect.left) / rect.width) * 2 - 1;

        pointer.y =
          -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);

        const hits = raycaster.intersectObjects(posterMeshes, false);

        if (hits.length) {
          setSelectedMovie(hits[0].object.userData.movie as Movie);
        }
      }
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);

    // Responsive resizing.
    const resizeObserver = new ResizeObserver(() => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    resizeObserver.observe(mount);

    // Animation loop.
    const animate = () => {
      if (disposed) return;

      animationFrame = requestAnimationFrame(animate);

      if (!isDragging) {
        sphere.rotation.y += 0.0018 + velocityX;
        sphere.rotation.x += velocityY;

        velocityX *= 0.94;
        velocityY *= 0.94;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup.
    return () => {
      disposed = true;

      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();

      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);

      sphere.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();

          const material = object.material as THREE.MeshStandardMaterial;
          material.dispose();
        }
      });

      fallbackTextures.forEach((texture) => texture.dispose());
      loadedTextures.forEach((texture) => texture.dispose());

      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    if (!selectedMovie) return;
    let cancelled = false;
    const token = import.meta.env.VITE_TMDB_API_KEY?.trim();
    setProviders([]);
    setSelectedPoster(null);
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}`, accept: "application/json" };
    const load = async () => {
      setProviderLoading(true);
      try {
        const query = new URLSearchParams({ query: selectedMovie.title, year: selectedMovie.year });
        const searchResponse = await fetch(`https://api.themoviedb.org/3/search/movie?${query}`, { headers });
        if (!searchResponse.ok) throw new Error("Movie lookup failed");
        const searchData = await searchResponse.json();
        const match = (searchData.results || []).find((item: any) => normalizeTitle(item.title || "") === normalizeTitle(selectedMovie.title));
        if (!match) return;
        if (!cancelled && match.poster_path) setSelectedPoster(`https://image.tmdb.org/t/p/w342${match.poster_path}`);
        const response = await fetch(`https://api.themoviedb.org/3/movie/${match.id}/watch/providers`, { headers });
        if (!response.ok) return;
        const data = await response.json();
        const region = data.results?.IN || data.results?.US;
        const list: Provider[] = [...(region?.flatrate || []), ...(region?.rent || []), ...(region?.buy || [])];
        if (!cancelled) setProviders(list.filter((item, index) => list.findIndex((x) => x.provider_name === item.provider_name) === index));
      } catch (error) { console.warn("Streaming availability could not be loaded", error); }
      finally { if (!cancelled) setProviderLoading(false); }
    };
    void load();
    return () => { cancelled = true; };
  }, [selectedMovie]);

  return (
    <main className="movie-gallery-page">
      <header className="gallery-header">
        <a href="/" className="gallery-logo" aria-label="CineMate home">
          CINE<span>MATE</span><sup>®</sup>
        </a>

        <a href="/" className="gallery-home">
          ← <span>HOME</span>
        </a>
      </header>

      <section className="gallery-intro">
        <p className="gallery-eyebrow">
          <span className="gallery-dot" />
          THE CINE MATE COLLECTION
        </p>

        <h1>
          THE MOVIE
          <br />
          <span>UNIVERSE</span>
          <i>.</i>
        </h1>

        <p className="gallery-description">
          A world of stories, all around you. Explore the collection.
        </p>
      </section>

      <section className="gallery-stage">
        <div className="gallery-glow" />
        <div className="gallery-sphere" ref={mountRef} />
        <div className="gallery-hint">
          <span>↔</span> DRAG TO EXPLORE
        </div>
      </section>

      <footer className="gallery-footer">
        <span>
          CINE<span>MATE</span> / MOVIE GALLERY
        </span>
        <span>{posterCount} FRAMES · ONE UNIVERSE</span>
      </footer>

      {selectedMovie && (
        <div
          className="movie-detail-backdrop"
          onClick={() => setSelectedMovie(null)}
        >
          <section
            className="movie-detail"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="movie-detail-close"
              onClick={() => setSelectedMovie(null)}
              aria-label="Close movie details"
            >
              ×
            </button>

            <p className="gallery-eyebrow">FROM THE COLLECTION</p>
            <div className="movie-detail-content">
              {selectedPoster && <img className="movie-detail-poster" src={selectedPoster} alt={`${selectedMovie.title} poster`} />}
              <div className="movie-detail-copy">
                <h2>{selectedMovie.title}</h2>
                <p>{selectedMovie.year}<span> · </span>{selectedMovie.genre}</p>
                <div className="movie-platforms">
                  <span className="platforms-label">WHERE TO WATCH</span>
                  {providerLoading ? <p>Checking availability…</p> : providers.length ? <div className="provider-list">{providers.map((provider) => <span className="provider-item" key={provider.provider_name}><img src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`} alt="" />{provider.provider_name}</span>)}</div> : <p>Streaming availability isn’t listed for this region.</p>}
                  <small>Availability can change. Data via TMDB.</small>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}