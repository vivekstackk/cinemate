import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Clapperboard } from "lucide-react";
import "./CurtainIntro.css";

export default function CurtainIntro() {
  const location = useLocation();
  // Play only when the app is initially opened directly on the homepage.
  // Route changes during the same session must never replay the intro.
  const [shouldPlay] = useState(() => {
    return window.location.pathname === "/";
  });
  const [visible, setVisible] = useState(shouldPlay);

  useEffect(() => {
    if (!shouldPlay) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = window.setTimeout(() => setVisible(false), reducedMotion ? 50 : 1750);
    return () => window.clearTimeout(timeout);
  }, [shouldPlay]);

  // Keep the location hook subscribed to routing without tying the intro
  // lifecycle to route changes. This prevents it from appearing on Awards,
  // Find a Film, or when returning home from another tab.
  void location;

  if (!visible) return null;

  return (
    <div className="cinema-intro" aria-hidden="true">
      <div className="intro-curtain intro-curtain-left" />
      <div className="intro-curtain intro-curtain-right" />
      <div className="intro-title">
        <Clapperboard className="intro-mark" strokeWidth={1.5} />
        <div className="intro-wordmark">CINE<span>MATE</span><i>.</i></div>
        <div className="intro-kicker">THE EXPERIENCE BEGINS</div>
      </div>
      <div className="intro-bottomline"><span />A CINEMATIC DISCOVERY PLATFORM<span /></div>
    </div>
  );
}
