
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { galleryImages } from "../data/movies";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-visual">
        <img
          src={galleryImages[0].image}
          alt={galleryImages[0].alt}
        />
        <div className="hero-image-caption">
          <span>FRAME NO. 001</span>
          <span>THE ART OF CINEMA</span>
        </div>
      </div>

      <div className="hero-copy">
        <div className="hero-kicker">
          <span className="red-dot" />
          A new perspective on movies
        </div>

        <h1 className="hero-title">
          <span>BEYOND</span>
          <span>THE</span>
          <span>FRAME<span className="accent-dot">.</span></span>
        </h1>

        <p className="hero-description">
          More than a movie list. A space to discover stories,
          explore cinema, and find the film you'll remember.
        </p>

        <div className="hero-footer">
          <a className="text-link" href="#discover">
            Explore the collection <ArrowUpRight size={15} />
          </a>
          <a className="scroll-cue" href="#discover">
            <ArrowDown size={14} /> SCROLL TO DISCOVER
          </a>
        </div>

        <div className="hero-index">
          <span>01</span>
          <span className="hero-index-line" />
          <span>05</span>
        </div>
      </div>
    </section>
  );
}