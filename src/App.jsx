import React, { useState, useEffect, useRef, useMemo } from 'react';
import { flushSync } from 'react-dom';
import ThreeBackground from './components/ThreeBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ImpactStats from './components/ImpactStats';
import About from './components/About';
import Works from './components/Works';
import ProjectModal from './components/ProjectModal';
import Skills from './components/Skills';
import Journey from './components/Journey';
import Contact from './components/Contact';
import CommandPalette from './components/CommandPalette';
import ChatAvatar from './components/ChatAvatar';
import Footer from './components/Footer';

// Builds a smooth undulating organic liquid wave polygon clip-path frame
function buildFluidWaveClipPath(ox, oy, radius, waveStrength, phase) {
  const steps = 72;
  const pts = [];
  for (let i = 0; i < steps; i++) {
    const theta = (i / steps) * Math.PI * 2;
    const harmonic =
      0.058 * Math.sin(6 * theta + phase) +
      0.034 * Math.cos(9 * theta - phase * 0.72) +
      0.018 * Math.sin(14 * theta + phase * 1.35);
    const r = Math.max(0, radius * (1 + waveStrength * harmonic));
    const px = ox + Math.cos(theta) * r;
    const py = oy + Math.sin(theta) * r;
    pts.push(`${px.toFixed(1)}px ${py.toFixed(1)}px`);
  }
  return `polygon(${pts.join(', ')})`;
}

// Builds a closed smooth SVG path for fluid ripple ring graphics (viewBox 0..600)
function buildSmoothWaveRingPath(cx, cy, baseR, amp1, lobes1, amp2, lobes2, phase = 0) {
  const count = 48;
  const pts = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const r = baseR + amp1 * Math.sin(lobes1 * a + phase) + amp2 * Math.cos(lobes2 * a - phase * 0.6);
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  let d = `M ${((pts[0][0] + pts[count - 1][0]) / 2).toFixed(2)},${((pts[0][1] + pts[count - 1][1]) / 2).toFixed(2)} `;
  for (let i = 0; i < count; i++) {
    const curr = pts[i];
    const next = pts[(i + 1) % count];
    const mx = (curr[0] + next[0]) / 2;
    const my = (curr[1] + next[1]) / 2;
    d += `Q ${curr[0].toFixed(2)},${curr[1].toFixed(2)} ${mx.toFixed(2)},${my.toFixed(2)} `;
  }
  return d + 'Z';
}

export default function App() {
  // Always open and refresh in white (light) theme cleanly
  const [theme, setTheme] = useState('light');
  const [themeWave, setThemeWave] = useState(null);
  const [themeRipple, setThemeRipple] = useState(null);

  const [activeProject, setActiveProject] = useState(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const cursorRef = useRef(null);
  const activeTransitionRef = useRef(null);
  const waveCleanupRef = useRef(null);

  const wavePaths = useMemo(
    () => ({
      primary: buildSmoothWaveRingPath(300, 300, 236, 13, 6, 7, 11, 0.4),
      secondary: buildSmoothWaveRingPath(300, 300, 212, 10, 5, 6, 9, 1.9),
      tertiary: buildSmoothWaveRingPath(300, 300, 256, 8, 7, 5, 12, 3.1)
    }),
    []
  );

  // Sync theme attribute on root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    return () => {
      if (waveCleanupRef.current) clearTimeout(waveCleanupRef.current);
      if (activeTransitionRef.current) {
        try { activeTransitionRef.current.skipTransition(); } catch (e) {}
      }
      document.documentElement.classList.remove('vt-switching');
    };
  }, []);

  const toggleTheme = (triggerEvent) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const btn =
      (triggerEvent?.currentTarget instanceof Element ? triggerEvent.currentTarget : null) ||
      document.querySelector('.theme-toggle-btn');
    const rect = btn?.getBoundingClientRect();
    const ox = rect ? rect.left + rect.width / 2 : window.innerWidth - 96;
    const oy = rect ? rect.top + rect.height / 2 : 36;

    const nx = (ox / Math.max(1, window.innerWidth)) * 2 - 1;
    const ny = -(oy / Math.max(1, window.innerHeight)) * 2 + 1;
    const rippleId = Date.now() + Math.random();

    if (reduceMotion) {
      setTheme(nextTheme);
      return;
    }

    setThemeRipple({ id: rippleId, nx, ny });

    if (waveCleanupRef.current) {
      clearTimeout(waveCleanupRef.current);
      waveCleanupRef.current = null;
    }
    if (activeTransitionRef.current) {
      try { activeTransitionRef.current.skipTransition(); } catch (e) {}
      activeTransitionRef.current = null;
    }

    const endRadius =
      Math.hypot(Math.max(ox, window.innerWidth - ox), Math.max(oy, window.innerHeight - oy)) * 1.12;

    if (typeof document.startViewTransition !== 'function') {
      setTheme(nextTheme);
      return;
    }

    const boxSize = Math.max(240, Math.min(480, window.innerWidth - 20, window.innerHeight - 20));
    const dx = ox - boxSize / 2;
    const dy = oy - boxSize / 2;
    const targetScale = (endRadius * 600) / (236 * boxSize);

    document.documentElement.style.setProperty('--vt-x', `${ox.toFixed(1)}px`);
    document.documentElement.style.setProperty('--vt-y', `${oy.toFixed(1)}px`);
    document.documentElement.classList.add('vt-switching');

    const vt = document.startViewTransition(() => {
      flushSync(() => {
        document.documentElement.setAttribute('data-theme', nextTheme);
        setTheme(nextTheme);
        setThemeWave({ id: rippleId, targetTheme: nextTheme, boxSize });
      });
    });

    activeTransitionRef.current = vt;

    vt.ready
      .then(() => {
        // Generate silky undulating organic wave polygon keyframes from the toggle button
        const frameCount = 32;
        const clipKeyframes = [];
        for (let step = 0; step <= frameCount; step++) {
          const p = step / frameCount;
          const r = p * endRadius;
          const strength = Math.sin(p * Math.PI);
          const phase = p * 6.0;
          clipKeyframes.push({
            clipPath: buildFluidWaveClipPath(ox, oy, r, strength, phase)
          });
        }

        const fluidEasing = 'cubic-bezier(0.38, 0.05, 0.32, 1)';

        document.documentElement.animate(clipKeyframes, {
          duration: 2150,
          easing: fluidEasing,
          pseudoElement: '::view-transition-new(root)',
          fill: 'forwards'
        });

        try {
          document.documentElement.animate(
            [
              {
                transform: `translate(${dx}px, ${dy}px) scale(0.03) rotate(0deg)`,
                opacity: 0.95
              },
              {
                transform: `translate(${dx}px, ${dy}px) scale(${(targetScale * 0.45).toFixed(3)}) rotate(12deg)`,
                opacity: 0.9,
                offset: 0.42
              },
              {
                transform: `translate(${dx}px, ${dy}px) scale(${targetScale.toFixed(3)}) rotate(28deg)`,
                opacity: 0
              }
            ],
            {
              duration: 2220,
              easing: fluidEasing,
              pseudoElement: '::view-transition-group(theme-wave-1)',
              fill: 'forwards'
            }
          );

          document.documentElement.animate(
            [
              {
                transform: `translate(${dx}px, ${dy}px) scale(0.02) rotate(0deg)`,
                opacity: 0.82
              },
              {
                transform: `translate(${dx}px, ${dy}px) scale(${(targetScale * 0.52).toFixed(3)}) rotate(-9deg)`,
                opacity: 0.72,
                offset: 0.45
              },
              {
                transform: `translate(${dx}px, ${dy}px) scale(${(targetScale * 1.12).toFixed(3)}) rotate(-22deg)`,
                opacity: 0
              }
            ],
            {
              duration: 2380,
              easing: fluidEasing,
              pseudoElement: '::view-transition-group(theme-wave-2)',
              fill: 'forwards'
            }
          );
        } catch (e) {}
      })
      .catch(() => {});

    vt.finished
      .catch(() => {})
      .finally(() => {
        if (activeTransitionRef.current === vt) {
          activeTransitionRef.current = null;
        }
        document.documentElement.classList.remove('vt-switching');
        setThemeWave((cur) => (cur?.id === rippleId ? null : cur));
      });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3400);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Continuous Reversible 60FPS Scroll-Scrubbed 3D Engine + Damped Hover Tilt & Halo
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cr = cursorRef.current;
    const bar = document.getElementById('bar');
    const hd = document.querySelector('header');
    const hc = document.getElementById('hc');
    const heroTxt = document.getElementById('hero-txt');

    let cx = -500, cy = -500;
    let gx = -500, gy = -500;
    let gs = 1, gz = 1;
    let mx = 0, my = 0;
    let smx = 0, smy = 0;
    let smoothScrollY = window.scrollY;
    let lastLoopTime = performance.now();
    let cachedDocHeight = 0;
    let activeTilt = null;
    let activeMag = null;
    let animId;

    const tiltStates = new WeakMap();
    const activeTiltingCards = new Set();
    let s3dNodes = [];

    const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);
    const smoothstep = (t) => t * t * (3 - 2 * t);

    const getDocTop = (el) => {
      let top = 0;
      let cur = el;
      while (cur) {
        top += cur.offsetTop;
        cur = cur.offsetParent;
      }
      return top;
    };

    const measureNodes = () => {
      const gridEl = document.getElementById('wg');
      let deckCols = 1;
      if (gridEl && gridEl.children.length > 0) {
        const firstW = gridEl.children[0].offsetWidth || 300;
        deckCols = Math.max(1, Math.round(gridEl.clientWidth / firstW));
      }

      const elements = document.querySelectorAll('.s3d');
      s3dNodes = Array.from(elements).map((el) => {
        const mode = el.dataset.s3d || 'rise';
        const idx = Number(el.dataset.idx || 0);
        const colSlot = mode === 'deck' ? (idx % deckCols) - (deckCols - 1) / 2 : 0;
        return {
          el,
          mode,
          idx,
          deckCols,
          colSlot,
          top: getDocTop(el),
          height: el.offsetHeight || 100
        };
      });
      cachedDocHeight = document.documentElement.scrollHeight;
    };

    const getTiltState = (el) => {
      let st = tiltStates.get(el);
      if (!st) {
        st = { curX: 0, curY: 0, targetX: 0, targetY: 0 };
        tiltStates.set(el, st);
      }
      return st;
    };

    const handlePointerMove = (e) => {
      cx = e.clientX;
      cy = e.clientY;
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;

      if (!reduceMotion) {
        const tiltTarget = e.target.closest && e.target.closest('.tilt');
        if (activeTilt && activeTilt !== tiltTarget) {
          const prevSt = getTiltState(activeTilt);
          prevSt.targetX = 0;
          prevSt.targetY = 0;
          activeTilt.classList.remove('glaring');
        }
        activeTilt = tiltTarget || null;

        if (tiltTarget) {
          const rect = tiltTarget.getBoundingClientRect();
          const px = (e.clientX - rect.left) / Math.max(1, rect.width);
          const py = (e.clientY - rect.top) / Math.max(1, rect.height);
          const x = px - 0.5;
          const y = py - 0.5;
          const st = getTiltState(tiltTarget);
          st.targetX = -y * 13;
          st.targetY = x * 13;
          activeTiltingCards.add(tiltTarget);
          tiltTarget.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
          tiltTarget.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
          tiltTarget.classList.add('glaring');
        }

        // Subtle magnetic feel on buttons & arrows
        const magTarget = e.target.closest && e.target.closest('.btn, .go, .theme-toggle-btn');
        if (activeMag && activeMag !== magTarget) {
          activeMag.style.setProperty('--mag-x', '0px');
          activeMag.style.setProperty('--mag-y', '0px');
        }
        activeMag = magTarget || null;

        if (magTarget) {
          const rect = magTarget.getBoundingClientRect();
          const dx = (e.clientX - (rect.left + rect.width / 2)) / Math.max(1, rect.width / 2);
          const dy = (e.clientY - (rect.top + rect.height / 2)) / Math.max(1, rect.height / 2);
          magTarget.style.setProperty('--mag-x', `${(dx * 5).toFixed(1)}px`);
          magTarget.style.setProperty('--mag-y', `${(dy * 5).toFixed(1)}px`);
        }
      }
    };

    const handlePointerEnter = () => { gs = 1.55; };
    const handlePointerLeave = () => { gs = 1; };

    const attachHoverListeners = () => {
      document.querySelectorAll('a, button, input, textarea, .ic, .sk, .wk, .stat-card, .quick-facts-card, .jc').forEach((el) => {
        el.removeEventListener('pointerenter', handlePointerEnter);
        el.removeEventListener('pointerleave', handlePointerLeave);
        el.addEventListener('pointerenter', handlePointerEnter);
        el.addEventListener('pointerleave', handlePointerLeave);
      });
    };

    measureNodes();
    attachHoverListeners();

    const loop = (now) => {
      animId = requestAnimationFrame(loop);
      const dt = clamp((now - lastLoopTime) / 1000, 0.004, 0.16);
      lastLoopTime = now;

      // Re-measure cleanly only if page height shifted (e.g., fonts/images loaded)
      const docH = document.documentElement.scrollHeight;
      if (docH !== cachedDocHeight) {
        measureNodes();
      }

      const vh = window.innerHeight || 800;

      // Cursor halo smooth time-normalized spring (velvety slow-motion glide)
      const cursorFollow = 1 - Math.exp(-5.5 * dt);
      gx += (cx - gx) * cursorFollow;
      gy += (cy - gy) * cursorFollow;
      gz += (gs - gz) * (1 - Math.exp(-5 * dt));
      if (cr) {
        cr.style.transform = `translate(${gx}px, ${gy}px) scale(${gz})`;
      }

      // Smooth time-normalized scroll tracking (luxurious slow-motion deceleration)
      const targetScroll = window.scrollY;
      const scrollDiff = targetScroll - smoothScrollY;
      const scrollLambda = Math.abs(scrollDiff) > vh * 1.1 ? 14 : 7.5;
      smoothScrollY += scrollDiff * (1 - Math.exp(-scrollLambda * dt));
      if (Math.abs(targetScroll - smoothScrollY) < 0.2) {
        smoothScrollY = targetScroll;
      }

      const maxScroll = Math.max(1, docH - vh);
      const scrollPercent = clamp(smoothScrollY / maxScroll, 0, 1);

      if (bar) {
        bar.style.transform = `scaleX(${scrollPercent})`;
      }
      if (hd) {
        hd.classList.toggle('sc', targetScroll > 35);
      }

      if (reduceMotion) return;

      // Damped hover tilt spring for hovered and cooling cards
      const tiltFollow = 1 - Math.exp(-6.5 * dt);
      activeTiltingCards.forEach((el) => {
        const st = getTiltState(el);
        st.curX += (st.targetX - st.curX) * tiltFollow;
        st.curY += (st.targetY - st.curY) * tiltFollow;

        el.style.setProperty('--hrx', `${st.curX.toFixed(2)}deg`);
        el.style.setProperty('--hry', `${st.curY.toFixed(2)}deg`);

        if (el !== activeTilt && Math.abs(st.curX) < 0.03 && Math.abs(st.curY) < 0.03) {
          st.curX = 0;
          st.curY = 0;
          el.style.setProperty('--hrx', '0deg');
          el.style.setProperty('--hry', '0deg');
          activeTiltingCards.delete(el);
        }
      });

      // Multi-plane 3D Hero Exit & Reverse Entry Scrub
      if (hc && heroTxt) {
        const mFollow = 1 - Math.exp(-3.8 * dt);
        smx += (mx - smx) * mFollow;
        smy += (my - smy) * mFollow;
        const hp = clamp(smoothScrollY / vh, 0, 1.35);

        heroTxt.style.transform = `perspective(1100px) translate3d(0, ${(hp * 42).toFixed(1)}px, ${(-hp * 185).toFixed(1)}px) rotateX(${(hp * 15).toFixed(2)}deg) scale(${(1 - hp * 0.1).toFixed(3)})`;
        heroTxt.style.opacity = clamp(1 - hp * 1.15, 0, 1).toFixed(3);

        hc.style.transform = `perspective(1050px) translate3d(0, ${(-hp * 85).toFixed(1)}px, ${(hp * 55).toFixed(1)}px) rotateY(${(smx * 8).toFixed(2)}deg) rotateX(${(-smy * 6 + hp * 10).toFixed(2)}deg) scale(${clamp(1 - hp * 0.1, 0.78, 1).toFixed(3)})`;
        hc.style.opacity = clamp(1 - Math.max(0, hp - 0.25) * 1.35, 0, 1).toFixed(3);
      }

      // Continuous Bi-Directional 3D Scrubbing across all sections
      for (let i = 0; i < s3dNodes.length; i++) {
        const item = s3dNodes[i];
        const vTop = item.top - smoothScrollY;
        const bottomEdge = vTop + item.height;

        // Bottom-aware entrance so items near bottom of document settle 100% before maxScroll
        const maxTravelAboveBottom = Math.max(60, vh - (item.top - maxScroll));
        const nearBottomScale = clamp(maxTravelAboveBottom / (vh * 0.45), 0.3, 1);
        const rawStagger =
          item.mode === 'deck'
            ? (item.idx % item.deckCols) * 26
            : (item.idx % 6) * 22;
        const staggerPx = rawStagger * nearBottomScale;
        const availAfterStagger = Math.max(40, maxTravelAboveBottom - staggerPx);
        const enterSpan = Math.min(vh * 0.28, availAfterStagger * 0.8);
        const distFromBottom = vh - vTop - staggerPx;

        const eIn = smoothstep(clamp(distFromBottom / enterSpan, 0, 1));
        const inPhase = 1 - eIn;

        const exitSpan = Math.min(vh * 0.32, Math.max(120, item.height * 0.8));
        const eOut = item.mode === 'curtain'
          ? 1
          : smoothstep(clamp(bottomEdge / exitSpan, 0, 1));
        const outPhase = 1 - eOut;

        // Fast clarity opacity curve so cards become crisp solid inside viewport while still gliding in 3D
        const opIn = smoothstep(clamp(distFromBottom / Math.max(24, enterSpan * 0.42), 0, 1));
        const opOut = item.mode === 'curtain'
          ? 1
          : smoothstep(clamp(bottomEdge / Math.max(28, exitSpan * 0.45), 0, 1));
        const sop = clamp(opIn * opOut, 0, 1);

        const p = clamp((vh - vTop) / (vh + item.height), 0, 1);

        let stx = 0, sty = 0, stz = 0, srx = 0, sry = 0, srz = 0, ssc = 1;

        switch (item.mode) {
          case 'title': {
            sty = inPhase * 42 - outPhase * 32 + (0.5 - p) * 16;
            stz = -inPhase * 90 - outPhase * 110;
            srx = inPhase * 28 - outPhase * 24;
            ssc = 1 - inPhase * 0.1 - outPhase * 0.1;
            break;
          }
          case 'fan': {
            const fanOff = item.idx - 1.5;
            stx = fanOff * inPhase * 48 - fanOff * outPhase * 36;
            sty = inPhase * 52 - outPhase * 40;
            stz = -inPhase * 115 - outPhase * 110;
            srx = inPhase * 32 - outPhase * 24;
            sry = -fanOff * inPhase * 14 + fanOff * outPhase * 10;
            srz = fanOff * inPhase * 2.5;
            ssc = 1 - inPhase * 0.12 - outPhase * 0.1;
            break;
          }
          case 'door-left': {
            stx = -inPhase * 52 - outPhase * 24;
            sty = inPhase * 34 - outPhase * 30;
            stz = -inPhase * 100 - outPhase * 95;
            srx = inPhase * 14 - outPhase * 22;
            sry = inPhase * 20 + outPhase * 10;
            srz = -inPhase * 1.4;
            ssc = 1 - inPhase * 0.08 - outPhase * 0.08;
            break;
          }
          case 'door-right': {
            stx = inPhase * 52 + outPhase * 24;
            sty = inPhase * 34 - outPhase * 30;
            stz = -inPhase * 100 - outPhase * 95;
            srx = inPhase * 14 - outPhase * 22;
            sry = -inPhase * 20 - outPhase * 10;
            srz = inPhase * 1.4;
            ssc = 1 - inPhase * 0.08 - outPhase * 0.08;
            break;
          }
          case 'rise': {
            sty = inPhase * 32 - outPhase * 24;
            stz = -inPhase * 70 - outPhase * 70;
            srx = inPhase * 24 - outPhase * 20;
            ssc = 1 - inPhase * 0.08 - outPhase * 0.08;
            break;
          }
          case 'deck': {
            const cs = item.colSlot || 0;
            stx = cs * inPhase * 42 - cs * outPhase * 28;
            sty = inPhase * 58 - outPhase * 42;
            stz = -inPhase * 130 - outPhase * 115;
            srx = inPhase * 32 - outPhase * 25;
            sry = -cs * inPhase * 17 + cs * outPhase * 12;
            srz = cs * inPhase * 2.2;
            ssc = 1 - inPhase * 0.12 - outPhase * 0.1;
            const cvPy = clamp((0.5 - p) * 28, -14, 14);
            item.el.style.setProperty('--cv-py', `${cvPy.toFixed(1)}px`);
            break;
          }
          case 'wave-row': {
            const dir = item.idx % 2 === 0 ? 1 : -1;
            stx = -dir * inPhase * 44 + dir * outPhase * 28;
            sty = inPhase * 42 - outPhase * 30;
            stz = -inPhase * 95 - outPhase * 95;
            srx = inPhase * 24 - outPhase * 22;
            sry = dir * inPhase * 18 - dir * outPhase * 12;
            srz = dir * inPhase * 1.4;
            ssc = 1 - inPhase * 0.09 - outPhase * 0.09;
            item.el.style.setProperty('--sr-prog', sop.toFixed(3));
            break;
          }
          case 'step': {
            const dir = item.idx % 2 === 0 ? 1 : -1;
            stx = -dir * inPhase * 24;
            sty = inPhase * 52 - outPhase * 38;
            stz = -inPhase * 110 - outPhase * 100;
            srx = inPhase * 30 - outPhase * 24;
            sry = dir * inPhase * 14 - dir * outPhase * 10;
            ssc = 1 - inPhase * 0.1 - outPhase * 0.09;
            break;
          }
          case 'pill': {
            stx = inPhase * 48 + outPhase * 24;
            sty = inPhase * 24 - outPhase * 20;
            stz = -inPhase * 75 - outPhase * 65;
            srx = inPhase * 16 - outPhase * 16;
            sry = -inPhase * 16 - outPhase * 8;
            ssc = 1 - inPhase * 0.07 - outPhase * 0.07;
            break;
          }
          case 'curtain': {
            sty = inPhase * 44;
            stz = -inPhase * 90;
            srx = inPhase * 22;
            ssc = 1 - inPhase * 0.06;
            break;
          }
          default:
            break;
        }

        const elStyle = item.el.style;
        elStyle.setProperty('--stx', `${stx.toFixed(1)}px`);
        elStyle.setProperty('--sty', `${sty.toFixed(1)}px`);
        elStyle.setProperty('--stz', `${stz.toFixed(1)}px`);
        elStyle.setProperty('--srx', `${srx.toFixed(2)}deg`);
        elStyle.setProperty('--sry', `${sry.toFixed(2)}deg`);
        elStyle.setProperty('--srz', `${srz.toFixed(2)}deg`);
        elStyle.setProperty('--ssc', ssc.toFixed(3));
        elStyle.setProperty('--sop', sop.toFixed(3));
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('resize', measureNodes);
    document.fonts?.ready?.then(measureNodes);
    animId = requestAnimationFrame(loop);

    const mutationObserver = new MutationObserver(() => {
      measureNodes();
      attachHoverListeners();
    });
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mutationObserver.observe(mainEl, { childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', measureNodes);
      cancelAnimationFrame(animId);
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div className="portfolio-app">
      {/* Top Scroll Progress Bar */}
      <div id="bar" />

      {/* Interactive Cursor Spotlight Glow */}
      <div id="cr" ref={cursorRef} />

      {/* Three.js Particle & Shader Orbs Background */}
      <ThreeBackground theme={theme} themeRipple={themeRipple} />

      {/* Navigation Bar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        <Hero onOpenContact={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} />
        <ImpactStats />
        <About />
        <Works onSelectProject={(project) => setActiveProject(project)} />
        <Skills />
        <Journey />
        <Contact onShowToast={showToast} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Project Case Study Modal */}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}

      {/* Spotlight Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenChat={() => setIsChatOpen(true)}
        onSelectProject={(project) => setActiveProject(project)}
        onShowToast={showToast}
      />

      {/* Ask Varun's AI Avatar Chatbot */}
      <ChatAvatar
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification animate-slide-up">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Expanding Fluid Wave Crests during Theme Switch */}
      {themeWave && (
        <>
          <div
            key={`wave1-${themeWave.id}`}
            className="theme-wave-ring theme-wave-1"
            style={{ width: `${themeWave.boxSize}px`, height: `${themeWave.boxSize}px` }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 600 600" width="100%" height="100%">
              <path
                d={wavePaths.primary}
                fill="none"
                stroke={themeWave.targetTheme === 'dark' ? 'rgba(77, 157, 255, 0.22)' : 'rgba(31, 95, 209, 0.16)'}
                strokeWidth="28"
              />
              <path
                d={wavePaths.primary}
                fill="none"
                stroke={themeWave.targetTheme === 'dark' ? 'rgba(96, 165, 250, 0.45)' : 'rgba(59, 130, 246, 0.36)'}
                strokeWidth="10"
              />
              <path
                d={wavePaths.primary}
                fill="none"
                stroke={themeWave.targetTheme === 'dark' ? 'rgba(219, 234, 254, 0.85)' : 'rgba(255, 255, 255, 0.92)'}
                strokeWidth="3"
              />
            </svg>
          </div>
          <div
            key={`wave2-${themeWave.id}`}
            className="theme-wave-ring theme-wave-2"
            style={{ width: `${themeWave.boxSize}px`, height: `${themeWave.boxSize}px` }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 600 600" width="100%" height="100%">
              <path
                d={wavePaths.secondary}
                fill="none"
                stroke={themeWave.targetTheme === 'dark' ? 'rgba(56, 189, 248, 0.22)' : 'rgba(56, 189, 248, 0.18)'}
                strokeWidth="24"
              />
              <path
                d={wavePaths.secondary}
                fill="none"
                stroke={themeWave.targetTheme === 'dark' ? 'rgba(125, 211, 252, 0.55)' : 'rgba(31, 95, 209, 0.38)'}
                strokeWidth="5"
              />
              <path
                d={wavePaths.tertiary}
                fill="none"
                stroke={themeWave.targetTheme === 'dark' ? 'rgba(147, 197, 253, 0.48)' : 'rgba(255, 255, 255, 0.72)'}
                strokeWidth="2.5"
              />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
