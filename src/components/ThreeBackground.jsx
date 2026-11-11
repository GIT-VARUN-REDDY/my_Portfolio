import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground({ theme, themeRipple }) {
  const canvasRef = useRef(null);
  const themeWaveTriggerRef = useRef(null);
  const themeStateRef = useRef({
    primary: new THREE.Color(theme === 'light' ? '#1f5fd1' : '#4d9dff'),
    secondary: new THREE.Color(theme === 'light' ? '#0284c7' : '#38bdf8'),
    highlight: new THREE.Color(theme === 'light' ? '#60a5fa' : '#dbeafe'),
    lightMode: theme === 'light' ? 1.0 : 0.0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGL not supported:', e);
      return;
    }

    const isMobile = window.innerWidth < 768;
    const FOV = 50;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      FOV,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.set(0, 0, 0);

    // Smoothly morphed color uniforms shared across layers
    const orbColor = new THREE.Color().copy(themeStateRef.current.primary);
    const colSecondary = new THREE.Color().copy(themeStateRef.current.secondary);
    const colHighlight = new THREE.Color().copy(themeStateRef.current.highlight);
    const lightDir = new THREE.Vector3(0, 0, 1);

    // =========================================================================
    // LAYER 1: SUBTLE EDGE-FREE AURORA MIST
    // =========================================================================
    const auroraGeo = new THREE.PlaneGeometry(2, 2);
    const auroraUniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uCol1: { value: orbColor },
      uCol2: { value: colSecondary },
      uLightMode: { value: themeStateRef.current.lightMode }
    };

    const auroraMat = new THREE.ShaderMaterial({
      uniforms: auroraUniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.999, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uScroll;
        uniform vec2 uMouse;
        uniform vec3 uCol1;
        uniform vec3 uCol2;
        uniform float uLightMode;
        varying vec2 vUv;

        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          float band1 = sin(p.x * 2.1 + uTime * 0.2 + uScroll * 4.2 + p.y) * 0.3;
          float band2 = cos(p.x * 1.5 - uTime * 0.15 + uScroll * 3.0 - p.y * 0.8) * 0.26;
          float glow1 = exp(-pow(p.y - band1 + 0.18, 2.0) * 3.0);
          float glow2 = exp(-pow(p.y - band2 - 0.24, 2.0) * 2.6);

          float mDist = length(p - vec2(uMouse.x * 0.65, uMouse.y * 0.65));
          float mGlow = exp(-mDist * mDist * 2.5) * 0.35;

          float radialFade = smoothstep(1.45, 0.15, length(p * vec2(0.85, 1.0)));
          vec3 col = mix(uCol1, uCol2, 0.5 + 0.5 * sin(p.x * 1.6 + uScroll * 3.2));
          float rawAlpha = (glow1 * 0.5 + glow2 * 0.4 + mGlow) * radialFade;
          float finalAlpha = rawAlpha * mix(0.11, 0.065, uLightMode);

          gl_FragColor = vec4(col, finalAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      depthTest: false
    });

    const auroraQuad = new THREE.Mesh(auroraGeo, auroraMat);
    auroraQuad.frustumCulled = false;
    auroraQuad.renderOrder = -3;
    scene.add(auroraQuad);

    // =========================================================================
    // LAYER 2: 3D FLUID PARTICLE WAVE HORIZON (Subtle, Scroll-Reversible)
    // =========================================================================
    const cols = isMobile ? 48 : 80;
    const rows = isMobile ? 28 : 42;
    const totalPts = cols * rows;
    const widthSpan = isMobile ? 38 : 62;
    const depthSpan = isMobile ? 26 : 38;

    const positions = new Float32Array(totalPts * 3);
    const gridSeeds = new Float32Array(totalPts * 2);
    let ptr = 0;
    let seedPtr = 0;

    for (let rz = 0; rz < rows; rz++) {
      const nz = rz / (rows - 1);
      const z = -nz * depthSpan - 8.0;
      for (let rx = 0; rx < cols; rx++) {
        const nx = rx / (cols - 1);
        const x = (nx - 0.5) * widthSpan;
        positions[ptr++] = x;
        positions[ptr++] = 0.0;
        positions[ptr++] = z;
        gridSeeds[seedPtr++] = nx;
        gridSeeds[seedPtr++] = nz;
      }
    }

    const waveGeo = new THREE.BufferGeometry();
    waveGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    waveGeo.setAttribute('aSeed', new THREE.BufferAttribute(gridSeeds, 2));

    const waveUniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uScrollVel: { value: 0 },
      uPixelRatio: { value: dpr },
      uMouseWorld: { value: new THREE.Vector2(0, -18) },
      uBurstPos: { value: new THREE.Vector2(0, -18) },
      uBurstTime: { value: 99.0 },
      uThemeWavePos: { value: new THREE.Vector2(18, -10) },
      uThemeWaveTime: { value: 99.0 },
      uCol1: { value: orbColor },
      uCol2: { value: colSecondary },
      uColHi: { value: colHighlight },
      uLightMode: { value: themeStateRef.current.lightMode }
    };

    const waveMat = new THREE.ShaderMaterial({
      uniforms: waveUniforms,
      vertexShader: `
        attribute vec2 aSeed;
        uniform float uTime;
        uniform float uScroll;
        uniform float uScrollVel;
        uniform float uPixelRatio;
        uniform vec2 uMouseWorld;
        uniform vec2 uBurstPos;
        uniform float uBurstTime;
        uniform vec2 uThemeWavePos;
        uniform float uThemeWaveTime;

        varying float vCrest;
        varying float vDepthFade;
        varying float vCenterCalm;
        varying float vFocus;

        void main() {
          vec3 pos = position;
          float sPhase = uScroll * 9.0;
          float swell = 1.0 + clamp(abs(uScrollVel) * 0.012, 0.0, 0.55);

          float w1 = sin(pos.x * 0.22 + uTime * 0.5 + sPhase) *
                     cos(pos.z * 0.25 + uTime * 0.35 + sPhase * 0.72) * 1.35;
          float w2 = sin((pos.x * 0.38 - pos.z * 0.32) - uTime * 0.42 + sPhase * 1.2) * 0.52;
          float w3 = cos(pos.x * 0.14 + pos.z * 0.16 - sPhase * 0.55) * 0.72;

          float waveY = (w1 + w2 + w3) * swell;

          float dMouse = length(pos.xz - uMouseWorld);
          float mouseLift = exp(-dMouse * dMouse * 0.025) * 1.75;
          float mouseRipple = sin(dMouse * 1.1 - uTime * 2.1) * exp(-dMouse * 0.14) * 0.52;

          float burstRadius = uBurstTime * 11.5;
          float burstRing = exp(-pow(dMouse - burstRadius, 2.0) * 0.18) * exp(-uBurstTime * 0.8);
          float burstLift = burstRing * 2.2;

          float dTheme = length(pos.xz - uThemeWavePos);
          float themeRadius = uThemeWaveTime * 15.0;
          float themeCrest1 = exp(-pow(dTheme - themeRadius, 2.0) * 0.032) * exp(-uThemeWaveTime * 0.52);
          float themeCrest2 = exp(-pow(dTheme - max(0.0, themeRadius - 6.5), 2.0) * 0.045) * exp(-uThemeWaveTime * 0.62) * 0.65;
          float themeWaveLift = (themeCrest1 + themeCrest2) * 2.85;

          pos.y += waveY + mouseLift + mouseRipple + burstLift + themeWaveLift;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          float crestNorm = clamp((waveY + mouseLift * 0.6 + burstLift + themeWaveLift * 0.7 + 1.6) / 3.4, 0.0, 1.0);
          float perspectiveScale = 28.0 / max(2.0, -mvPosition.z);
          gl_PointSize = (1.35 + crestNorm * 2.1 + burstRing * 1.6 + themeCrest1 * 1.9) * perspectiveScale * uPixelRatio;

          vec2 ndc = gl_Position.xy / max(0.001, gl_Position.w);
          vCenterCalm = smoothstep(0.08, 0.85, length(ndc * vec2(0.85, 1.1)));

          float distZ = -mvPosition.z;
          vDepthFade = smoothstep(4.0, 11.0, distZ) * smoothstep(46.0, 18.0, distZ);
          vDepthFade *= smoothstep(0.0, 0.14, aSeed.x) * smoothstep(1.0, 0.86, aSeed.x);
          vDepthFade *= smoothstep(0.0, 0.14, aSeed.y) * smoothstep(1.0, 0.86, aSeed.y);

          vCrest = crestNorm;
          vFocus = clamp(exp(-dMouse * 0.12) + burstRing + themeCrest1 + themeCrest2, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uCol1;
        uniform vec3 uCol2;
        uniform vec3 uColHi;
        uniform float uLightMode;

        varying float vCrest;
        varying float vDepthFade;
        varying float vCenterCalm;
        varying float vFocus;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          float soft = pow(smoothstep(0.5, 0.05, dist), 1.6);
          vec3 baseCol = mix(uCol1, uCol2, vCrest);
          vec3 dotColor = mix(baseCol, uColHi, vFocus * 0.5 + pow(vCrest, 2.2) * 0.3);

          float centerFactor = mix(0.24, 1.0, vCenterCalm);
          float baseOpacity = mix(0.68, 0.54, uLightMode);
          float alpha = soft * vDepthFade * centerFactor * baseOpacity * (0.28 + 0.72 * vCrest + vFocus * 0.25);

          gl_FragColor = vec4(dotColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false
    });

    const wavePoints = new THREE.Points(waveGeo, waveMat);
    wavePoints.position.set(0, -4.6, 0);
    wavePoints.rotation.x = 0.22;
    wavePoints.renderOrder = -2;
    scene.add(wavePoints);

    // =========================================================================
    // LAYER 3: ORIGINAL SOFT FADED GLOWING CORNER SPHERES (ORBS)
    // Floating at left/right viewport corners with cursor repulsion & bursts
    // =========================================================================
    const orbGeo = new THREE.SphereGeometry(1, 40, 28);
    const numOrbs = isMobile ? 6 : 9;

    const orbVs = `
      varying vec3 vN, vV;
      void main() {
        vN = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vV = -mv.xyz;
        gl_Position = projectionMatrix * mv;
      }
    `;

    const orbFs = `
      uniform vec3 uC, uL;
      uniform float uA, uG;
      varying vec3 vN, vV;
      void main() {
        vec3 nn = normalize(vN);
        float d = dot(nn, normalize(uL)) * 0.5 + 0.5;
        float nv = max(dot(nn, normalize(vV)), 0.0);
        vec3 c = mix(uC * 0.75, vec3(1.0), pow(d, 3.0) * 0.6);
        float a = uA * (0.35 + 0.65 * d) * smoothstep(0.0, 0.6, nv) + uG * 0.14 * smoothstep(0.0, 0.5, nv);
        gl_FragColor = vec4(mix(c, uC, 0.25 + uG * 0.5), a);
      }
    `;

    const orbs = [];
    for (let i = 0; i < numOrbs; i++) {
      const z = -(10 + Math.random() * 50);
      const r = -z * (0.035 + Math.random() * 0.07);
      const uniforms = {
        uC: { value: orbColor },
        uL: { value: lightDir },
        uA: { value: 0.16 + Math.random() * 0.22 },
        uG: { value: 0 }
      };

      const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: orbVs,
        fragmentShader: orbFs,
        transparent: true,
        depthWrite: false
      });

      const mesh = new THREE.Mesh(orbGeo, mat);
      mesh.renderOrder = -1;
      scene.add(mesh);

      orbs.push({
        m: mesh,
        u: uniforms,
        z,
        r,
        nx: (i % 2 ? 1 : -1) * (0.88 + Math.random() * 0.22),
        ny: (i + 0.5) / numOrbs,
        k: 0.25 + Math.random() * 0.7,
        ph: Math.random() * 6.28,
        off: new THREE.Vector2(),
        vel: new THREE.Vector2(),
        g: 0,
        pu: 0
      });
    }

    // =========================================================================
    // INPUT, SCROLL SYNC & 60FPS RENDER LOOP
    // =========================================================================
    let mouseNdcX = 0, mouseNdcY = 0;
    let smoothMx = 0, smoothMy = 0;
    let smoothScroll = window.scrollY;
    let prevScrollY = window.scrollY;
    let scrollVel = 0;
    let burst = null;

    const onPointerMove = (e) => {
      mouseNdcX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNdcY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onPointerDown = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      burst = { x: nx, y: ny };
      waveUniforms.uBurstPos.value.set(nx * 18, -ny * 12 - 22);
      waveUniforms.uBurstTime.value = 0.0;
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const newDpr = Math.min(window.devicePixelRatio || 1, width < 768 ? 1.5 : 2);
      renderer.setPixelRatio(newDpr);
      renderer.setSize(width, height);
      waveUniforms.uPixelRatio.value = newDpr;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('resize', handleResize);

    let animationFrameId;
    let lastTime = performance.now();
    let simTime = 0;

    const animate = (now) => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = Math.min(Math.max((now - lastTime) / 1000, 0.004), 0.14);
      lastTime = now;

      if (!reduceMotion) {
        simTime += dt * 0.52;
        waveUniforms.uBurstTime.value = Math.min(99.0, waveUniforms.uBurstTime.value + dt);
        waveUniforms.uThemeWaveTime.value = Math.min(99.0, waveUniforms.uThemeWaveTime.value + dt);

        if (themeWaveTriggerRef.current) {
          const { nx, ny } = themeWaveTriggerRef.current;
          waveUniforms.uThemeWavePos.value.set(nx * 24, -ny * 14 - 20);
          waveUniforms.uThemeWaveTime.value = 0.0;
          burst = { x: nx, y: ny };
          themeWaveTriggerRef.current = null;
        }
      }

      const sy = window.scrollY;
      const vh = window.innerHeight || 800;
      const scrollDiff = sy - smoothScroll;
      const scrollLambda = Math.abs(scrollDiff) > vh * 1.1 ? 14 : 7.5;
      smoothScroll += scrollDiff * (1 - Math.exp(-scrollLambda * dt));
      scrollVel += ((sy - prevScrollY) - scrollVel) * (1 - Math.exp(-5.5 * dt));
      prevScrollY = sy;

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
      const scrollNorm = smoothScroll / maxScroll;

      const mFollow = 1 - Math.exp(-3.6 * dt);
      smoothMx += (mouseNdcX - smoothMx) * mFollow;
      smoothMy += (mouseNdcY - smoothMy) * mFollow;

      // Morph theme colors smoothly in slow fluid motion
      const colFollow = 1 - Math.exp(-2.8 * dt);
      const target = themeStateRef.current;
      orbColor.lerp(target.primary, colFollow);
      colSecondary.lerp(target.secondary, colFollow);
      colHighlight.lerp(target.highlight, colFollow);
      const nextLight = auroraUniforms.uLightMode.value + (target.lightMode - auroraUniforms.uLightMode.value) * colFollow;
      auroraUniforms.uLightMode.value = nextLight;
      waveUniforms.uLightMode.value = nextLight;

      lightDir.set(smoothMx * 0.9, -smoothMy * 0.9, 0.9);

      // Update Aurora & Wave Horizon shaders
      auroraUniforms.uTime.value = simTime;
      auroraUniforms.uScroll.value = scrollNorm;
      auroraUniforms.uMouse.value.set(smoothMx, smoothMy);

      waveUniforms.uTime.value = simTime;
      waveUniforms.uScroll.value = scrollNorm;
      waveUniforms.uScrollVel.value = scrollVel;
      waveUniforms.uMouseWorld.value.set(smoothMx * 18, -smoothMy * 12 - 22);

      if (!reduceMotion) {
        wavePoints.position.x = smoothMx * -1.2 + Math.sin(scrollNorm * Math.PI * 2.0) * 1.4;
        wavePoints.position.y = -4.6 + smoothMy * 0.5 + scrollNorm * 0.8;
        wavePoints.rotation.y = smoothMx * 0.04;
      }

      // Update Soft Faded Corner Orbs (camera stays at origin so edges lock cleanly)
      const fy = smoothScroll / window.innerHeight;
      orbs.forEach((o) => {
        const hh = Math.tan((FOV * Math.PI) / 360) * -o.z;
        const hw = hh * camera.aspect;
        const span = 2 * (hh + o.r);

        const bx = o.nx * hw + Math.sin(simTime * 0.3 + o.ph) * 0.9 - scrollVel * 0.01 * o.k;
        const by =
          (((o.ny * span + fy * o.k * 2 * hh) % span) + span) % span -
          span / 2 +
          Math.cos(simTime * 0.4 + o.ph) * 0.7;

        const mxw = mouseNdcX * hw;
        const myw = mouseNdcY * hh;
        const dx = bx + o.off.x - mxw;
        const dy = by + o.off.y - myw;
        const d = Math.hypot(dx, dy) || 0.001;
        const R0 = o.r * 1.8 + hh * 0.4;
        const f = Math.max(0, 1 - d / R0);

        if (!reduceMotion) {
          if (f > 0) {
            o.vel.x += (dx / d) * f * f * hh * 4.5 * dt;
            o.vel.y += (dy / d) * f * f * hh * 4.5 * dt;
          }

          if (burst) {
            const cx = burst.x * hw;
            const cy = burst.y * hh;
            const ex = bx - cx;
            const ey = by - cy;
            const ed = Math.hypot(ex, ey) || 0.001;
            const ef = Math.max(0, 1 - ed / (hh * 1.6));
            o.vel.x += (ex / ed) * ef * hh * 1.8;
            o.vel.y += (ey / ed) * ef * hh * 1.8;
            o.pu = ef > 0 ? 1 : o.pu;
          }

          o.vel.addScaledVector(o.off, -2.5 * dt);
          o.vel.multiplyScalar(Math.exp(-1.6 * dt));
          o.off.addScaledVector(o.vel, dt);
        }

        o.g += (f - o.g) * (1 - Math.exp(-4.5 * dt));
        o.pu *= Math.exp(-1.8 * dt);
        o.u.uG.value = Math.min(1, o.g + o.pu * 0.6);

        const s = o.r * (1 + o.g * 0.12 + o.pu * 0.18);
        o.m.position.set(bx + o.off.x, by + o.off.y, o.z);
        o.m.scale.set(s, s * (1 + Math.min(Math.abs(scrollVel) * 0.004, 0.25)), s);
      });

      burst = null;
      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', handleResize);

      auroraGeo.dispose();
      auroraMat.dispose();
      waveGeo.dispose();
      waveMat.dispose();
      orbGeo.dispose();
      orbs.forEach((o) => o.m.material.dispose());
      renderer.dispose();
    };
  }, []);

  // Morph background shader colors smoothly on theme switch
  useEffect(() => {
    const isLight = theme === 'light';
    themeStateRef.current = {
      primary: new THREE.Color(isLight ? '#1f5fd1' : '#4d9dff'),
      secondary: new THREE.Color(isLight ? '#0284c7' : '#38bdf8'),
      highlight: new THREE.Color(isLight ? '#60a5fa' : '#dbeafe'),
      lightMode: isLight ? 1.0 : 0.0
    };
  }, [theme]);

  useEffect(() => {
    if (themeRipple) {
      themeWaveTriggerRef.current = themeRipple;
    }
  }, [themeRipple]);

  return <canvas ref={canvasRef} id="gl" aria-hidden="true" />;
}
