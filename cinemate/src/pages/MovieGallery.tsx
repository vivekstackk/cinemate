import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./MovieGallery.css";

type Movie = {
  title: string;
  year: string;
  genre: string;
  colors: [string, string];
};

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
  { title: "Eternal Sunshine of the Spotless Mind", year: "2004", genre: "Romance", colors: ["#324b46", "#c5a17c"] },
];

const posterCount = 180;
const radius = 5.15;
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

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

async function getPosterPath(movie: Movie, token: string): Promise<string | null> {
  const params = new URLSearchParams({ query: movie.title, year: movie.year });
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?${params}`, {
    headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`TMDB ${response.status} for "${movie.title}": ${detail.slice(0, 180)}`);
  }
  const data = await response.json();
  const normalize = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]/g, "");
  // Never substitute a similarly named film or a different release year.
  const result = (data.results ?? []).find((item: any) =>
    normalize(item.title ?? "") === normalize(movie.title) &&
    item.release_date?.slice(0, 4) === movie.year &&
    item.poster_path
  );
  return result?.poster_path ? `${IMAGE_BASE}${result.poster_path}` : null;
}

export default function MovieGallery() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let animationFrame = 0;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#101012");

    const camera = new THREE.PerspectiveCamera(
      42,
      Math.max(mount.clientWidth, 1) / Math.max(mount.clientHeight, 1),
      0.1,
      100
    );
    camera.position.set(0, 0, 14.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
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
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

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
      poster.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      poster.rotateZ(((i % 7) - 3) * 0.025);
      poster.userData.movie = movie;
      sphere.add(poster);
      posterMeshes.push(poster);
    }

    // Real poster images replace the fallback textures when the token is available.
    const token = import.meta.env.VITE_TMDB_API_KEY?.trim();
    if (!token) {
      console.error("TMDB token missing. Put VITE_TMDB_API_KEY in the .env beside this project's package.json.");
    } else {
      Promise.all(movies.map(async (movie) => {
        try {
          const url = await getPosterPath(movie, token);
          if (url) return { title: movie.title, url };
          console.warn(`TMDB returned no poster for ${movie.title}`);
        } catch (error) {
          console.error(error);
        }
        return null;
      })).then((items) => {
        if (disposed) return;
        const loader = new THREE.TextureLoader();
        const unique = new Map<string, string>();
        items.forEach((item) => {
          if (item) unique.set(item.title, item.url);
        });

        unique.forEach((url, title) => {
          loader.load(url, (texture) => {
            if (disposed) {
              texture.dispose();
              return;
            }
            texture.colorSpace = THREE.SRGBColorSpace;
            posterMeshes.forEach((mesh) => {
              const movie = mesh.userData.movie as Movie;
              if (movie.title === title) {
                const material = mesh.material as THREE.MeshStandardMaterial;
                material.map = texture;
                material.needsUpdate = true;
              }
            });
          }, undefined, (error) => console.error(`Image failed to load for ${title}`, error));
        });
      });
    }

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
      if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
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
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(posterMeshes, false);
        if (hits.length) setSelectedMovie(hits[0].object.userData.movie as Movie);
      }
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);

    const resizeObserver = new ResizeObserver(() => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(mount);

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
          (object.material as THREE.MeshStandardMaterial).dispose();
        }
      });
      fallbackTextures.forEach((texture) => texture.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <main className="movie-gallery-page">
      <header className="gallery-header">
        <a href="/" className="gallery-logo" aria-label="CineMate home">
          CINE<span>MATE</span><sup>®</sup>
        </a>
        <a href="/" className="gallery-home">← <span>HOME</span></a>
      </header>

      <section className="gallery-intro">
        <p className="gallery-eyebrow"><span className="gallery-dot" />THE CINE MATE COLLECTION</p>
        <h1>THE MOVIE<br /><span>UNIVERSE</span><i>.</i></h1>
        <p className="gallery-description">A world of stories, all around you. Explore the collection.</p>
      </section>

      <section className="gallery-stage">
        <div className="gallery-glow" />
        <div className="gallery-sphere" ref={mountRef} />
        <div className="gallery-hint"><span>↔</span> DRAG TO EXPLORE</div>
      </section>

      <footer className="gallery-footer">
        <span>CINE<span>MATE</span> / MOVIE GALLERY</span>
        <span>{posterCount} FRAMES · ONE UNIVERSE</span>
      </footer>

      {selectedMovie && (
        <div className="movie-detail-backdrop" onClick={() => setSelectedMovie(null)}>
          <section className="movie-detail" onClick={(event) => event.stopPropagation()}>
            <button className="movie-detail-close" onClick={() => setSelectedMovie(null)} aria-label="Close movie details">×</button>
            <p className="gallery-eyebrow">FROM THE COLLECTION</p>
            <h2>{selectedMovie.title}</h2>
            <p>{selectedMovie.year}<span>·</span>{selectedMovie.genre}</p>
          </section>
        </div>
      )}
    </main>
  );
}
