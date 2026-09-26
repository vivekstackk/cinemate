// Three.js + GSAP carousel engine — no React dependency.
// Adapted from Yousuf-developer/liquid-glass-carousel to accept projects as a parameter.

import * as THREE from "three";
import { gsap } from "gsap";
import { CONFIG, INTERACT, LENS, FOCUS, ENTRY } from "./carousel-config";

export function createCarousel(mount, projects, callbacks = {}) {
  const {
    cursorElement = null,
    onActiveChange = () => {},
    onFocusChange = () => {},
    onEntryDone = () => {},
    onModeChange = () => {},
  } = callbacks;

  let W = mount.clientWidth;
  let H = mount.clientHeight;

  // ---- renderer / scene / camera (orthographic, 1 unit = 1 px) ----
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    -W / 2, W / 2, H / 2, -H / 2, -100, 100
  );
  camera.position.z = 10;

  // ---- load the source images ----
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');
  const sources = projects.map((img) => {
    const s = {
      tex: null,
      aspect: img.aspect || 1,
      locked: img.aspect != null,
    };
    loader.load(img.src, (tex) => {
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      tex.colorSpace = THREE.SRGBColorSpace;
      if (!s.locked && tex.image) s.aspect = tex.image.width / tex.image.height;
      s.tex = tex;
      recomputeTotal();
      if (!userInteracted) {
        scroll = centerForIndex(0);
        target = scroll;
      }
    });
    return s;
  });

  function slotWidth(srcIndex) {
    return sources[srcIndex].aspect * CONFIG.PANEL_H + CONFIG.GAP;
  }

  let offsets = [];
  let totalWidth = 0;
  function recomputeTotal() {
    offsets = [];
    let acc = 0;
    for (let i = 0; i < sources.length; i++) {
      offsets.push(acc);
      acc += slotWidth(i);
    }
    totalWidth = acc;
  }
  recomputeTotal();

  function centerForIndex(idx) {
    const N = sources.length;
    const loop = Math.floor(idx / N);
    const s = ((idx % N) + N) % N;
    return offsets[s] + slotWidth(s) / 2 - CONFIG.GAP / 2 + loop * totalWidth;
  }

  function nearestIndex(value) {
    if (!totalWidth) return 0;
    const N = sources.length;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < N; i++) {
      const center = offsets[i] + slotWidth(i) / 2 - CONFIG.GAP / 2;
      const k = Math.round((value - center) / totalWidth);
      const dist = Math.abs(center + k * totalWidth - value);
      if (dist < bestDist) {
        bestDist = dist;
        best = i + k * N;
      }
    }
    return best;
  }

  function centerIndex(value) {
    if (!totalWidth) return 0;
    let bestI = 0;
    let bestDist = Infinity;
    for (let i = 0; i < sources.length; i++) {
      const center = offsets[i] + slotWidth(i) / 2 - CONFIG.GAP / 2;
      const k = Math.round((value - center) / totalWidth);
      const dist = Math.abs(center + k * totalWidth - value);
      if (dist < bestDist) {
        bestDist = dist;
        bestI = i;
      }
    }
    return bestI;
  }
  let lastCenter = -1;

  // ---- mesh pool ----
  const REPEATS = 4;
  const pool = [];
  for (let r = 0; r < REPEATS; r++) {
    for (let i = 0; i < sources.length; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xdddddd,
        transparent: true,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), mat);
      mesh.visible = false;
      scene.add(mesh);
      pool.push({ mesh, mat, srcIndex: i });
    }
  }

  // ---- scroll state ----
  let scroll = centerForIndex(0);
  let target = scroll;
  let userInteracted = false;
  let velocity = 0;
  let prevScroll = 0;
  let scrollEnergy = 0;
  let pendingFocus = null;
  let lastInput = performance.now();
  let snapped = false;

  // ---- liquid-glass lens: FBO + fullscreen pass ----
  const dpr = renderer.getPixelRatio();
  let rt = new THREE.WebGLRenderTarget(W * dpr, H * dpr);
  const lensScene = new THREE.Scene();
  const lensCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const lensUniforms = {
    uTex: { value: rt.texture },
    uRes: { value: new THREE.Vector2(W * dpr, H * dpr) },
    uCenter: { value: new THREE.Vector2(0.5, 0.5) },
    uSizeX: { value: LENS.sizeX },
    uSizeY: { value: LENS.sizeY },
    uShape: { value: LENS.shape === "square" ? 1.0 : 0.0 },
    uSquareRound: { value: LENS.squareRound },
    uRotation: { value: 0.0 },
    uAspect: { value: W / H },
    uZoom: { value: LENS.zoom },
    uDispersion: { value: LENS.dispersion },
    uBlur: { value: LENS.blur },
    uGlow: { value: LENS.glow },
    uWhiteGlow: { value: LENS.whiteGlow },
    uNovaSize: { value: LENS.novaSize },
    uBlueRing: { value: LENS.blueRing },
    uRingRadius: { value: LENS.ringRadius },
    uRingWidth: { value: LENS.ringWidth },
    uShimmer: { value: LENS.shimmer ? 1.0 : 0.0 },
    uShimmerFreq: { value: LENS.shimmerFreq },
    uShimmerSpeed: { value: LENS.shimmerSpeed },
    uShimmerDepth: { value: LENS.shimmerDepth },
    uTime: { value: 0.0 },
    uRimStart: { value: LENS.rimStart },
    uRimTangential: { value: LENS.rimTangential },
    uRimInward: { value: LENS.rimInward },
    uRimFreq1: { value: LENS.rimFreq1 },
    uRimFreq2: { value: LENS.rimFreq2 },
    uBlueColor: { value: new THREE.Color(LENS.blueColor) },
    uRimLine: { value: LENS.rimLine },
    uRimLinePos: { value: LENS.rimLinePos },
    uRimLineWidth: { value: LENS.rimLineWidth },
    uVignette: { value: LENS.vignette },
    uVignetteSize: { value: LENS.vignetteSize },
    uSamples: { value: LENS.samples },
  };

  const lensMat = new THREE.ShaderMaterial({
    uniforms: lensUniforms,
    vertexShader: `
      varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
    `,
    fragmentShader: `
      #define PI 3.14159265
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTex;
      uniform vec2  uRes;
      uniform vec2  uCenter;
      uniform float uSizeX;
      uniform float uSizeY;
      uniform float uAspect;
      uniform float uZoom;
      uniform float uDispersion;
      uniform float uBlur;
      uniform float uGlow;
      uniform float uWhiteGlow;
      uniform float uNovaSize;
      uniform float uBlueRing;
      uniform float uRingRadius;
      uniform float uRingWidth;
      uniform float uShimmer;
      uniform float uShimmerFreq;
      uniform float uShimmerSpeed;
      uniform float uShimmerDepth;
      uniform float uTime;
      uniform float uRimStart;
      uniform float uRimTangential;
      uniform float uRimInward;
      uniform float uRimFreq1;
      uniform float uRimFreq2;
      uniform vec3  uBlueColor;
      uniform float uRimLine;
      uniform float uRimLinePos;
      uniform float uRimLineWidth;
      uniform float uVignette;
      uniform float uVignetteSize;
      uniform float uShape;
      uniform float uSquareRound;
      uniform float uRotation;
      uniform int   uSamples;

      const int MAX_SAMPLES = 16;

      float sdRoundBox(vec2 p, vec2 b, float r){
        vec2 q = abs(p) - b + r;
        return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
      }

      vec4 discLens(vec2 center, float aspectCorrect, out float outA) {
        vec2 p = (vUv - center);
        p.x *= aspectCorrect;
        float ca = cos(uRotation), sa = sin(uRotation);
        p = mat2(ca, -sa, sa, ca) * p;
        vec2 halfSize = vec2(uSizeX, uSizeY);
        float dist = length(p / halfSize);
        outA = 0.0;

        float maskND;
        if (uShape > 0.5) {
          float corner = min(uSizeX, uSizeY) * clamp(uSquareRound, 0.0, 1.0);
          float sd = sdRoundBox(p, halfSize, corner);
          maskND = 1.0 + sd / min(uSizeX, uSizeY);
        } else {
          maskND = dist;
        }
        if (maskND > 1.0) return vec4(0.0);

        float shapeND = clamp(maskND, 0.0, 1.0);
        float nd = clamp(dist, 0.0, 1.0);
        vec2  offset = vUv - center;
        vec2  radialDir = normalize(offset + 1e-6);
        vec2  tangentDir = vec2(-radialDir.y, radialDir.x);
        float angle = atan(p.y, p.x);

        float pull = uZoom * 0.30 * (nd * nd);
        float rimStrength = smoothstep(uRimStart, 1.0, nd);
        float fluidWave = sin(angle * uRimFreq1) * 0.55 + sin(angle * uRimFreq2) * 0.25;
        float rScreen = (uSizeX + uSizeY) * 0.5;
        vec2  rimOff = tangentDir * fluidWave * rimStrength * rScreen * uRimTangential;
        vec2  rimPull = -radialDir * rimStrength * rScreen * uRimInward;

        vec2 baseUV = center + offset * (1.0 - pull) + rimOff + rimPull;

        float rimMask = smoothstep(0.55, 1.0, nd);
        vec2  dispDir = offset * uDispersion * 0.004 * rimMask;
        int N = uSamples;
        if (N < 2) N = 2;
        if (N > MAX_SAMPLES) N = MAX_SAMPLES;
        vec4 col = vec4(0.0);
        vec3 caW = vec3(0.0);
        for (int i = 0; i < MAX_SAMPLES; i++) {
          if (i >= N) break;
          float t = float(i) / float(N - 1);
          vec2 sUV = baseUV + dispDir * (t - 0.5);
          vec4 s = texture2D(uTex, sUV);
          vec3 w = vec3(
            exp(-pow((t - 0.00) / 0.38, 2.0)),
            exp(-pow((t - 0.50) / 0.38, 2.0)),
            exp(-pow((t - 1.00) / 0.38, 2.0))
          );
          col.rgb += s.rgb * w;
          col.a += s.a * ((w.x + w.y + w.z) / 3.0);
          caW += w;
        }
        col.rgb /= max(caW, vec3(0.001));
        col.a /= max((caW.x + caW.y + caW.z)/3.0, 0.001);

        float blurFade = 1.0 - smoothstep(0.72, 0.98, nd);
        if (uBlur > 0.01 && blurFade > 0.01) {
          vec2 blurRad = vec2(uBlur) / uRes * blurFade;
          vec4 bcol = vec4(0.0);
          float btw = 0.0;
          for (float a = 0.0; a < PI * 2.0; a += PI * 2.0 / 6.0) {
            for (float rr = 0.4; rr <= 1.001; rr += 0.3) {
              vec2 o = vec2(cos(a), sin(a)) * blurRad * rr;
              float w = 1.0 - rr * 0.38;
              bcol += texture2D(uTex, baseUV + o) * w;
              btw += w;
            }
          }
          col = mix(bcol / btw, col, rimMask);
        }

        col.rgb *= mix(0.91, 1.0, smoothstep(0.0, 0.38, shapeND));

        float r2 = shapeND * shapeND * 0.25;
        float gs = max(uNovaSize * uGlow * 0.003, 0.004);
        float nova = exp(-r2 / gs) + exp(-r2 / (gs * 7.0)) * 0.18;
        nova *= uWhiteGlow * (uGlow / 17.0) * 1.15;
        col.rgb += vec3(nova);
        float addedAlpha = nova;

        float dC = shapeND * 0.5;
        float tR = clamp(uRingRadius, 0.1, 0.49);
        float rW = max(uRingWidth, 0.003);
        float ring = exp(-pow((dC - tR) / rW, 2.0));
        ring *= uBlueRing * (uGlow / 17.0) * 1.8;
        if (uShimmer > 0.5) ring *= sin(angle * uShimmerFreq + uTime * uShimmerSpeed) * uShimmerDepth + (1.0 - uShimmerDepth);
        float ringAura = exp(-pow((dC - tR) / (rW * 6.0), 2.0)) * 0.28 * uBlueRing * (uGlow / 17.0);
        col.rgb += uBlueColor * (ring + ringAura);
        addedAlpha += max(ring, ringAura);

        float rimLine = exp(-pow((dC - uRimLinePos) / max(uRimLineWidth, 0.0001), 2.0)) * uRimLine;
        col.rgb += vec3(rimLine);
        addedAlpha += rimLine;

        // The glass itself should have a tiny bit of opacity so you can see its distortion
        addedAlpha += 0.05 * uZoom; // faint glass tint

        col.a = clamp(col.a + addedAlpha, 0.0, 1.0);

        outA = smoothstep(1.0, 0.93, maskND);
        return col;
      }

      void main(){
        vec4 base = texture2D(uTex, vUv);
        vec4 outc = base;

        float a = 0.0;
        vec4 c = discLens(uCenter, uAspect, a);
        
        // mix the lens over the base background based on the lens mask 'a'
        // 'c.a' tells us how opaque the lens actually is at this pixel
        float finalA = c.a * a;
        outc.rgb = mix(outc.rgb, c.rgb, finalA);
        outc.a = max(outc.a, finalA);

        if (uVignette > 0.001) {
          vec2 vc = vUv - 0.5;
          vc.x *= uAspect;
          float d = length(vc) / max(uVignetteSize, 0.0001);
          float vig = 1.0 - uVignette * smoothstep(0.5, 1.0, d);
          outc.rgb *= clamp(vig, 0.0, 1.0);
        }

        gl_FragColor = outc;
      }
    `,
    transparent: true
  });
  const lensQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), lensMat);
  lensScene.add(lensQuad);

  // ---- focus state ----
  const focusState = {
    active: false,
    srcIndex: -1,
    poolIdx: -1,
    lensFx: ENTRY.enabled ? 0 : 1,
    anim: null,
  };
  const drop = new Array(REPEATS * sources.length).fill(0);
  let focusScale = 1;
  const lastCenterX = new Array(REPEATS * sources.length);

  // ---- entry state ----
  const pEntry = new Array(REPEATS * sources.length).fill(ENTRY.enabled ? 0 : 1);
  let entryActive = ENTRY.enabled;
  let entrySettled = false;
  const growArr = new Array(REPEATS * sources.length).fill(ENTRY.enabled ? 0 : 1);
  let entryAnim = null;

  const LENS_FX_KEYS = [
    "uDispersion", "uBlueRing", "uRimLine", "uVignette",
    "uZoom", "uRimTangential", "uRimInward", "uGlow"
  ];
  const lensFxFull = {};
  LENS_FX_KEYS.forEach((k) => (lensFxFull[k] = lensUniforms[k].value));

  // ---- layout ----
  let panelRects = [];
  let centeredPanel = null;
  function layout() {
    panelRects = [];
    centeredPanel = null;
    let centeredDist = Infinity;
    const half = W / 2;
    const buffer = CONFIG.PANEL_H;
    pool.forEach((p, poolIdx) => {
      const rep = Math.floor(poolIdx / sources.length);
      const i = p.srcIndex;
      const src = sources[i];

      const slotCenterInLoop = offsets[i] + slotWidth(i) / 2 - CONFIG.GAP / 2;
      let x = slotCenterInLoop - scroll;
      x = ((x % totalWidth) + totalWidth) % totalWidth;
      x += (rep - Math.floor(REPEATS / 2)) * totalWidth;
      if (x > half + totalWidth) x -= totalWidth * REPEATS;

      const centerX = x;
      const inEntry = entryActive || entrySettled;
      if (!inEntry && (centerX < -half - buffer || centerX > half + buffer)) {
        p.mesh.visible = false;
        lastCenterX[poolIdx] = undefined;
        return;
      }
      lastCenterX[poolIdx] = centerX;

      const shrink = 1 - 0.25 * scrollEnergy;
      const h = CONFIG.PANEL_H * shrink;
      const wPx = src.aspect * CONFIG.PANEL_H * shrink;

      if (src.tex && !p.bound) {
        p.mat.map = src.tex;
        p.mat.color.set(0xffffff);
        p.mat.needsUpdate = true;
        p.bound = true;
      }

      let y = 0;

      const isFocused = focusState.active && focusState.poolIdx === poolIdx;
      const d = drop[poolIdx] || 0;
      let drawW = wPx;
      let drawH = h;
      if (isFocused) {
        drawW = wPx * focusScale;
        drawH = h * focusScale;
      } else if (d > 0) {
        y = -d * H * FOCUS.dropDist;
      }

      p.mesh.visible = true;

      let finalX = centerX;
      let finalY = y;
      let finalW = drawW;
      let finalH = drawH;
      if (entryActive || entrySettled) {
        const pe = pEntry[poolIdx] || 0;
        const g = growArr[poolIdx] || 0;

        const curH = ENTRY.startH + (drawH - ENTRY.startH) * g;
        finalH = curH;
        finalW = curH * src.aspect;

        const cSrc = centerIndex(scroll);
        let di = i - cSrc;
        if (di > sources.length / 2) di -= sources.length;
        if (di < -sources.length / 2) di += sources.length;
        const N = sources.length;
        const midRep = Math.floor(REPEATS / 2);
        if (rep !== midRep) {
          p.mesh.visible = false;
          lastCenterX[poolIdx] = undefined;
          return;
        }
        const slotH = (s) => {
          const gg = growArr[midRep * N + s] || 0;
          return ENTRY.startH + (CONFIG.PANEL_H - ENTRY.startH) * gg;
        };
        let off = 0;
        if (di > 0) {
          for (let k = 0; k < di; k++) {
            const sa = (((cSrc + k) % N) + N) % N;
            const sb = (((cSrc + k + 1) % N) + N) % N;
            off += (sources[sa].aspect * slotH(sa) + sources[sb].aspect * slotH(sb)) / 2 + CONFIG.GAP;
          }
        } else if (di < 0) {
          for (let k = 0; k < -di; k++) {
            const sa = (((cSrc - k) % N) + N) % N;
            const sb = (((cSrc - k - 1) % N) + N) % N;
            off -= (sources[sa].aspect * slotH(sa) + sources[sb].aspect * slotH(sb)) / 2 + CONFIG.GAP;
          }
        }
        finalX = off;
        if (finalX < -half - buffer || finalX > half + buffer) {
          p.mesh.visible = false;
          lastCenterX[poolIdx] = undefined;
          return;
        }

        const below = -H * ENTRY.fromBelow;
        finalY = below + (y - below) * pe;
      }

      p.mesh.position.set(finalX, finalY, 0);
      p.mesh.scale.set(finalW, finalH, 1);

      const sx = centerX + W / 2;
      const sy = H / 2 - y;
      panelRects.push({
        left: sx - drawW / 2,
        right: sx + drawW / 2,
        top: sy - drawH / 2,
        bottom: sy + drawH / 2,
        poolIdx,
        srcIndex: i,
        centerX,
      });

      if (Math.abs(centerX) < centeredDist) {
        centeredDist = Math.abs(centerX);
        centeredPanel = { srcIndex: i, centerX, wPx, h, poolIdx };
      }
    });
  }

  function panelAtPointer(px, py) {
    for (let i = 0; i < panelRects.length; i++) {
      const r = panelRects[i];
      if (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom)
        return r;
    }
    return null;
  }

  const el = renderer.domElement;
  el.style.touchAction = "none";
  el.style.userSelect = "none";
  el.style.setProperty("-webkit-user-select", "none");
  el.style.setProperty("-webkit-touch-callout", "none");
  el.style.setProperty("-webkit-tap-highlight-color", "transparent");

  // ---- drag state ----
  let dragging = false;
  let dragPointerId = null;
  let dragLastX = 0;
  let dragDist = 0;
  let dragVel = 0;
  let dragMoveT = 0;
  let suppressClick = false;
  let dragPointerType = "mouse";
  let lastPointerX = NaN;
  let lastPointerY = NaN;
  let pointerInside = false;
  let lastPointerType = "mouse";

  // ---- cursor follower ----
  if (cursorElement)
    gsap.set(cursorElement, { xPercent: 20, yPercent: 30, scale: 0, autoAlpha: 0 });
  const moveX = cursorElement
    ? gsap.quickTo(cursorElement, "x", { duration: 0.5, ease: "power3.out" })
    : null;
  const moveY = cursorElement
    ? gsap.quickTo(cursorElement, "y", { duration: 0.5, ease: "power3.out" })
    : null;

  let overPanel = false;
  let hoverPanel = false;
  let cursorNow = "";

  function setCursor(v) {
    if (v === cursorNow) return;
    cursorNow = v;
    el.style.cursor = v;
  }

  function updateCursor() {
    if (focusState.active || entryActive || entrySettled) return setCursor("");
    if (dragging) return setCursor("grabbing");
    if (!hoverPanel) return setCursor("");
    if (INTERACT.drag) return setCursor("grab");
    return setCursor(INTERACT.noClick ? "" : "pointer");
  }

  function setHover(on) {
    hoverPanel = on;
    setView(on);
  }

  function refreshHover() {
    if (!pointerInside || lastPointerType !== "mouse") return;
    if (!Number.isFinite(lastPointerX)) return;
    if (focusState.active) {
      setHover(false);
      return;
    }
    setHover(panelAtPointer(lastPointerX, lastPointerY) !== null);
  }

  function setView(on) {
    if (entryActive || entrySettled) on = false;
    if (dragging) on = false;
    if (on === overPanel) {
      updateCursor();
      return;
    }
    overPanel = on;
    updateCursor();
    if (!cursorElement) return;
    gsap.killTweensOf(cursorElement, "scale,autoAlpha,opacity,visibility");
    gsap.to(cursorElement, {
      scale: on ? 1 : 0,
      autoAlpha: on ? 1 : 0,
      duration: on ? 0.35 : 0.25,
      ease: on ? "power3.out" : "power3.in",
    });
  }

  // ---- input ----
  function inputLocked() {
    return focusState.active || entryActive || entrySettled;
  }

  function onWheel(e) {
    e.preventDefault();
    if (inputLocked()) return;
    userInteracted = true;
    pendingFocus = null;
    target += (e.deltaY || e.deltaX) * CONFIG.WHEEL;
    lastInput = performance.now();
    snapped = false;
  }

  function onPointerDown(e) {
    suppressClick = false;
    if (!INTERACT.drag || inputLocked()) return;
    if (dragging) return;
    if (e.button !== 0 && e.pointerType === "mouse") return;
    dragging = true;
    dragPointerId = e.pointerId;
    dragPointerType = e.pointerType || "mouse";
    try { el.setPointerCapture(e.pointerId); } catch (err) {}
    dragLastX = e.clientX;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    dragDist = 0;
    dragVel = 0;
    dragMoveT = performance.now();
    setView(false);
    velocity = 0;
    pendingFocus = null;
    userInteracted = true;
    snapped = false;
    lastInput = dragMoveT;
  }

  function onPointerMove(e) {
    if (dragging && e.pointerId === dragPointerId) {
      const sens = dragPointerType === "mouse" ? CONFIG.DRAG : INTERACT.TOUCH_DRAG;
      const dx = e.clientX - dragLastX;
      dragLastX = e.clientX;
      dragDist += Math.abs(dx);
      target -= dx * sens;
      dragVel = dragVel * 0.6 + -dx * sens * 0.4;
      dragMoveT = performance.now();
      lastInput = dragMoveT;
      snapped = false;
    }
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    lastPointerType = e.pointerType || "mouse";
    pointerInside = true;
    if (e.pointerType !== "mouse") return;
    if (moveX) moveX(e.clientX);
    if (moveY) moveY(e.clientY);
    if (focusState.active) {
      setHover(false);
      return;
    }
    setHover(panelAtPointer(e.clientX, e.clientY) !== null);
  }

  function onPointerUp(e) {
    if (!dragging) return;
    if (e && dragPointerId !== null && e.pointerId !== dragPointerId) return;
    dragging = false;
    if (dragPointerId !== null) {
      try { el.releasePointerCapture(dragPointerId); } catch (err) {}
      dragPointerId = null;
    }
    velocity = performance.now() - dragMoveT > INTERACT.FLICK_IDLE_MS ? 0 : dragVel;
    dragVel = 0;
    lastInput = performance.now();
    snapped = false;
    suppressClick = dragDist > (dragPointerType === "mouse" ? INTERACT.CLICK_SLOP : INTERACT.TOUCH_CLICK_SLOP);
    if (dragPointerType === "mouse")
      setHover(panelAtPointer(lastPointerX, lastPointerY) !== null);
    else updateCursor();
  }

  function onEnter(e) {
    pointerInside = true;
    lastPointerType = e.pointerType || "mouse";
  }
  function onLeave() {
    pointerInside = false;
    setHover(false);
  }

  function onClick(e) {
    if (INTERACT.noClick) return;
    if (suppressClick) { suppressClick = false; return; }
    if (inputLocked()) return;
    const hit = panelAtPointer(e.clientX, e.clientY);
    if (!hit) return;
    if (centeredPanel && hit.poolIdx === centeredPanel.poolIdx) {
      pendingFocus = null;
      openFocus();
      return;
    }
    userInteracted = true;
    velocity = 0;
    target = centerForIndex(nearestIndex(scroll + hit.centerX));
    snapped = true;
    pendingFocus = { srcIndex: hit.srcIndex };
    setView(false);
  }

  function setInteraction(next = {}) {
    if (next.drag !== undefined) {
      INTERACT.drag = next.drag;
      if (!INTERACT.drag) {
        INTERACT.noClick = false;
        if (dragging) onPointerUp();
      }
    }
    if (next.noClick !== undefined) {
      INTERACT.noClick = next.noClick;
      if (INTERACT.noClick) INTERACT.drag = true;
    }
    updateCursor();
    onModeChange({ drag: INTERACT.drag, noClick: INTERACT.noClick });
  }

  // ---- focus open / close ----
  function openFocus() {
    if (focusState.active || !centeredPanel) return;
    const src = sources[centeredPanel.srcIndex];
    if (!src || !src.tex) return;

    focusState.active = true;
    focusState.srcIndex = centeredPanel.srcIndex;
    const focusPoolIdx = centeredPanel.poolIdx;
    focusState.poolIdx = focusPoolIdx;

    target = centerForIndex(nearestIndex(scroll));

    const focusX = lastCenterX[focusPoolIdx] || 0;
    const others = pool
      .map((p, idx) => ({ idx, x: lastCenterX[idx] }))
      .filter((o) => o.idx !== focusPoolIdx && o.x !== undefined)
      .map((o) => ({ idx: o.idx, dist: Math.abs(o.x - focusX) }))
      .sort((a, b) => a.dist - b.dist);

    let rank = 0;
    let prevDist = -1;
    const ranked = others.map((o) => {
      if (prevDist >= 0 && o.dist - prevDist > 1) rank++;
      prevDist = o.dist;
      return { idx: o.idx, rank };
    });

    LENS_FX_KEYS.forEach((k) => (lensFxFull[k] = lensUniforms[k].value));

    if (focusState.anim) focusState.anim.kill();
    const tl = gsap.timeline();
    tl.to(focusState, { lensFx: 0, duration: FOCUS.lensFade, ease: "power3.out" }, 0);
    tl.to({ v: focusScale }, {
      v: FOCUS.centerScale,
      duration: FOCUS.focusDuration,
      ease: FOCUS.focusEase,
      onUpdate() { focusScale = this.targets()[0].v; },
    }, 0);
    ranked.forEach((o) => {
      tl.to(drop, { [o.idx]: 1, duration: FOCUS.cardDuration, ease: FOCUS.cardEase }, o.rank * FOCUS.stagger);
    });
    focusState.anim = tl;

    setView(false);
    onFocusChange(true);
  }

  function closeFocus() {
    if (!focusState.active) return;
    if (focusState.anim) focusState.anim.kill();

    const focusX = lastCenterX[focusState.poolIdx] || 0;
    const others = pool
      .map((p, idx) => ({ idx, x: lastCenterX[idx] }))
      .filter((o) => o.x !== undefined && (drop[o.idx] || 0) > 0)
      .map((o) => ({ idx: o.idx, dist: Math.abs(o.x - focusX) }))
      .sort((a, b) => b.dist - a.dist);

    let rank = 0;
    let prevDist = -1;
    const ranked = others.map((o) => {
      if (prevDist >= 0 && prevDist - o.dist > 1) rank++;
      prevDist = o.dist;
      return { idx: o.idx, rank };
    });

    onFocusChange(false);

    const tl = gsap.timeline({
      onComplete: () => {
        focusState.active = false;
        focusState.srcIndex = -1;
        updateCursor();
      },
    });
    tl.to(focusState, { lensFx: 1, duration: FOCUS.lensFade * 0.8, ease: "power3.inOut" }, 0);
    tl.to({ v: focusScale }, {
      v: 1,
      duration: FOCUS.focusDuration * 0.85,
      ease: FOCUS.focusEase,
      onUpdate() { focusScale = this.targets()[0].v; },
    }, 0);
    ranked.forEach((o) => {
      tl.to(drop, { [o.idx]: 0, duration: FOCUS.cardDuration * 0.85, ease: FOCUS.cardEase }, o.rank * FOCUS.stagger * 0.7);
    });
    focusState.anim = tl;
  }

  // ---- entry animation ----
  function playEntry() {
    if (entryAnim) entryAnim.kill();
    for (let k = 0; k < pEntry.length; k++) pEntry[k] = 0;
    entryActive = true;
    entrySettled = false;
    onEntryDone(false);
    for (let k = 0; k < growArr.length; k++) growArr[k] = 0;
    focusState.lensFx = 0;

    target = centerForIndex(nearestIndex(scroll));
    scroll = target;
    velocity = 0;
    snapped = true;

    layout();
    const visible = [];
    for (let k = 0; k < lastCenterX.length; k++) {
      if (lastCenterX[k] !== undefined) visible.push(k);
    }

    const tl = gsap.timeline({ delay: ENTRY.delay });
    const spread = ENTRY.stagger * Math.max(visible.length - 1, 1);
    let lastRiseEnd = 0;
    visible.forEach((idx) => {
      const at = Math.random() * spread;
      lastRiseEnd = Math.max(lastRiseEnd, at + ENTRY.riseDuration);
      tl.to(pEntry, { [idx]: 1, duration: ENTRY.riseDuration, ease: ENTRY.riseEase }, at);
    });

    tl.call(() => {
      entryActive = false;
      entrySettled = true;
    }, null, lastRiseEnd);

    const cSrcG = centerIndex(scroll);
    const Ng = sources.length;
    const midRepG = Math.floor(REPEATS / 2);
    const growList = [];
    let maxRank = 0;
    for (let k = 0; k < lastCenterX.length; k++) {
      if (lastCenterX[k] === undefined) continue;
      if (Math.floor(k / Ng) !== midRepG) continue;
      let di = (k % Ng) - cSrcG;
      if (di > Ng / 2) di -= Ng;
      if (di < -Ng / 2) di += Ng;
      const r = Math.abs(di);
      maxRank = Math.max(maxRank, r);
      growList.push({ idx: k, rank: r });
    }
    const growRanked = growList.map((v) => ({
      idx: v.idx,
      rank: ENTRY.growDir === "outward" ? v.rank : maxRank - v.rank,
    }));

    const growStart = lastRiseEnd + ENTRY.growDelay;
    let growEnd = growStart;

    tl.to(focusState, { lensFx: 1, duration: ENTRY.lensBloom, ease: ENTRY.lensBloomEase }, growStart);

    growRanked.forEach((o) => {
      const at = growStart + o.rank * ENTRY.growStagger;
      growEnd = Math.max(growEnd, at + ENTRY.growDuration);
      tl.to(growArr, { [o.idx]: 1, duration: ENTRY.growDuration, ease: ENTRY.growEase }, at);
    });
    tl.call(() => {
      entrySettled = false;
      for (let k = 0; k < growArr.length; k++) growArr[k] = 1;
      onEntryDone(true);
      updateCursor();
    }, null, growEnd);
    entryAnim = tl;
  }

  el.addEventListener("wheel", onWheel, { passive: false });
  el.addEventListener("pointerdown", onPointerDown);
  el.addEventListener("pointermove", onPointerMove);
  el.addEventListener("pointerup", onPointerUp);
  el.addEventListener("pointercancel", onPointerUp);
  el.addEventListener("pointerenter", onEnter);
  el.addEventListener("pointerleave", onLeave);
  el.addEventListener("click", onClick);

  // ---- animation loop ----
  let raf;
  function tick() {
    if (!dragging) {
      target += velocity;
      velocity *= CONFIG.FRICTION;
      if (Math.abs(velocity) < 0.05) velocity = 0;

      if (CONFIG.SNAP && !snapped && !focusState.active && performance.now() - lastInput > CONFIG.SNAP_IDLE_MS) {
        target = centerForIndex(nearestIndex(scroll));
        snapped = true;
      }
    }

    const follow = dragging && dragPointerType !== "mouse"
      ? INTERACT.TOUCH_EASE
      : snapped && !pendingFocus
        ? CONFIG.SNAP_EASE
        : CONFIG.EASE;
    scroll += (target - scroll) * follow;

    const rawSpeed = scroll - prevScroll;
    prevScroll = scroll;
    const norm = Math.min(1, Math.abs(rawSpeed) / Math.max(1, CONFIG.SHRINK_MAX));
    const k = norm > scrollEnergy ? CONFIG.SHRINK_ATTACK : CONFIG.SHRINK_DECAY;
    scrollEnergy += (norm - scrollEnergy) * k;

    layout();
    refreshHover();

    const activeIdx = centeredPanel ? centeredPanel.srcIndex : centerIndex(scroll);
    if (activeIdx !== lastCenter && activeIdx >= 0) {
      lastCenter = activeIdx;
      onActiveChange(activeIdx);
    }

    if (pendingFocus && !focusState.active) {
      if (Math.abs(target - scroll) < 0.5) {
        const pf = pendingFocus;
        pendingFocus = null;
        if (centeredPanel && centeredPanel.srcIndex === pf.srcIndex)
          openFocus();
      }
    }

    lensUniforms.uCenter.value.set(LENS.posX, LENS.posY);
    lensUniforms.uAspect.value = W / H;
    lensUniforms.uTime.value = performance.now() * 0.001;
    const rad = (a) => (a * Math.PI) / 180;
    lensUniforms.uRotation.value = rad(LENS.rotation) + rad(LENS.spin) * (performance.now() * 0.001);
    const fx = focusState.lensFx;
    LENS_FX_KEYS.forEach((key) => {
      lensUniforms[key].value = lensFxFull[key] * fx;
    });

    renderer.setRenderTarget(rt);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.render(lensScene, lensCam);

    raf = requestAnimationFrame(tick);
  }
  tick();

  if (ENTRY.enabled) playEntry();

  // ---- resize / teardown ----
  function onResize() {
    W = mount.clientWidth;
    H = mount.clientHeight;
    renderer.setSize(W, H);
    camera.left = -W / 2;
    camera.right = W / 2;
    camera.top = H / 2;
    camera.bottom = -H / 2;
    camera.updateProjectionMatrix();
    rt.setSize(W * dpr, H * dpr);
    lensUniforms.uRes.value.set(W * dpr, H * dpr);
  }
  window.addEventListener("resize", onResize);

  function destroy() {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    el.removeEventListener("wheel", onWheel);
    el.removeEventListener("pointerdown", onPointerDown);
    el.removeEventListener("pointermove", onPointerMove);
    el.removeEventListener("pointerup", onPointerUp);
    el.removeEventListener("pointercancel", onPointerUp);
    el.removeEventListener("pointerenter", onEnter);
    el.removeEventListener("pointerleave", onLeave);
    el.removeEventListener("click", onClick);
    if (focusState.anim) focusState.anim.kill();
    if (entryAnim) entryAnim.kill();
    renderer.dispose();
    rt.dispose();
    lensQuad.geometry.dispose();
    lensMat.dispose();
    pool.forEach((p) => {
      p.mesh.geometry.dispose();
      p.mat.dispose();
    });
    sources.forEach((s) => {
      if (s.tex) s.tex.dispose();
    });
    if (renderer.domElement.parentNode)
      renderer.domElement.parentNode.removeChild(renderer.domElement);
  }

  return {
    closeFocus,
    replayEntry: playEntry,
    refreshLayout: recomputeTotal,
    setInteraction,
    lensUniforms,
    destroy,
  };
}
