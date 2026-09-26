// Layout + scroll feel
export const CONFIG = {
  PANEL_H: 450,
  GAP: 12,
  EASE: 0.09,
  WHEEL: 1.4,
  DRAG: 1.6,
  FRICTION: 0.865,
  SNAP: true,
  SNAP_IDLE_MS: 120,
  SNAP_EASE: 0.05,
  SHRINK_MAX: 60,
  SHRINK_ATTACK: 0.25,
  SHRINK_DECAY: 0.06,
};

// Interaction modes
export const INTERACT = {
  drag: true,
  noClick: false,
  CLICK_SLOP: 6,
  FLICK_IDLE_MS: 90,
  TOUCH_DRAG: 1.0,
  TOUCH_EASE: 0.22,
  TOUCH_CLICK_SLOP: 12,
};

// Liquid-glass lens settings
export const LENS = {
  shape: "circle",
  squareRound: 0,
  rotation: 65,
  spin: 0,
  sizeX: 0.45,
  sizeY: 0.75,
  posX: 0.5,
  posY: 0.5,
  zoom: 0,
  dispersion: 8,
  blur: 0.0,
  glow: 3.5,
  whiteGlow: 0.2,
  novaSize: 10,
  blueRing: 4,
  ringRadius: 0.40,
  ringWidth: 0.03,
  shimmer: true,
  shimmerFreq: 12,
  shimmerSpeed: 3.5,
  shimmerDepth: 0.12,
  rimStart: 0.578,
  rimTangential: 0.6,
  rimInward: 0,
  rimFreq1: 2,
  rimFreq2: 1,
  blueColor: "#009dff",
  rimLine: 0.8,
  rimLinePos: 0.41,
  rimLineWidth: 0.015,
  vignette: 0,
  vignetteSize: 0.3,
  samples: 16,
};

// Focus mode
export const FOCUS = {
  cardDuration: 0.7,
  focusDuration: 0.9,
  cardEase: "power4.out",
  focusEase: "power3.out",
  stagger: 0.06,
  dropDist: 1.4,
  centerScale: 1.18,
  lensFade: 0.85,
};

// Entry animation
export const ENTRY = {
  enabled: true,
  delay: 0.5,
  startH: 80,
  riseDuration: 1.0,
  stagger: 0.07,
  riseEase: "power3.out",
  fromBelow: 0.9,
  growDelay: 0.25,
  growDuration: 2.15,
  growEase: "expo.inOut",
  growStagger: 0.085,
  growDir: "inward",
  lensBloom: 1.4,
  lensBloomEase: "power2.inOut",
};
