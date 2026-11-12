import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { projectsData } from '../data/portfolioData';

function Works({ onSelectProject }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [activeHue, setActiveHue] = useState(projectsData[0]?.hue || 215);

  const cardRefs = useRef([]);
  const moveRafRef = useRef(null);
  const latestTiltRef = useRef({ idx: null, x: 0, y: 0 });
  const total = projectsData.length;

  useEffect(() => {
    return () => {
      if (moveRafRef.current !== null) cancelAnimationFrame(moveRafRef.current);
    };
  }, []);

  const resetCardTilt = useCallback((idx) => {
    const el = cardRefs.current[idx];
    if (!el) return;
    el.style.setProperty('--card-rx', '0deg');
    el.style.setProperty('--card-ry', '0deg');
    el.style.setProperty('--mx', '50%');
    el.style.setProperty('--my', '50%');
  }, []);

  const handleCardEnter = useCallback((idx, project) => {
    setHoveredIdx(idx);
    setActiveHue(project?.hue || 215);
  }, []);

  const handleCardLeave = useCallback(
    (idx) => {
      if (moveRafRef.current !== null) {
        cancelAnimationFrame(moveRafRef.current);
        moveRafRef.current = null;
      }
      resetCardTilt(idx);
      setHoveredIdx((prev) => (prev === idx ? null : prev));
    },
    [resetCardTilt]
  );

  const handleCardMouseMove = useCallback((idx, e) => {
    latestTiltRef.current = { idx, x: e.clientX, y: e.clientY };
    if (moveRafRef.current !== null) return;

    moveRafRef.current = requestAnimationFrame(() => {
      moveRafRef.current = null;
      const { idx: targetIdx, x, y } = latestTiltRef.current;
      const el = cardRefs.current[targetIdx];
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (x - rect.left) / Math.max(1, rect.width)));
      const py = Math.min(1, Math.max(0, (y - rect.top) / Math.max(1, rect.height)));
      const rx = (0.5 - py) * 9;
      const ry = (px - 0.5) * 11;

      el.style.setProperty('--card-rx', `${rx.toFixed(2)}deg`);
      el.style.setProperty('--card-ry', `${ry.toFixed(2)}deg`);
      el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
    });
  }, []);

  const auraShift = hoveredIdx !== null ? hoveredIdx - (total - 1) / 2 : 0;

  return (
    <section id="work">
      <div className="c">
        <h2 className="st s3d" data-s3d="title">
          View My <span>Work</span>
        </h2>
      </div>

      {/* Panoramic 6-Card Side-by-Side 3D Showcase (Zero Scroll, All Visible) */}
      <div
        className={`work-panoramic-shell s3d${hoveredIdx !== null ? ' has-hover' : ''}`}
        data-s3d="rise"
        style={{
          '--active-hue': activeHue,
          '--aura-shift': auraShift
        }}
      >
        {/* Dynamic Colored Spotlight Aura following hovered project */}
        <div className="work-stage-aura" aria-hidden="true" />

        <div id="wg" className="work-panoramic-grid">
          {projectsData.map((project, idx) => {
            const indexNumber = `0${idx + 1}`;
            const isHovered = hoveredIdx === idx;
            const hasAnyHover = hoveredIdx !== null;
            const centerOffset = idx - (total - 1) / 2;

            // Compute smooth panoramic resting arc & neighbor parting offsets
            let pushX = 0;
            let arcY = Math.abs(centerOffset) * Math.abs(centerOffset) * 2.1;
            let arcRy = -centerOffset * 4.2;
            let dimScale = 0.88;
            let zIndex = 20 - Math.round(Math.abs(centerOffset));

            if (hasAnyHover) {
              if (isHovered) {
                pushX = idx === 0 ? 22 : idx === total - 1 ? -22 : 0;
                zIndex = 60;
              } else {
                const diff = idx - hoveredIdx;
                const sign = diff < 0 ? -1 : 1;
                const absD = Math.abs(diff);

                pushX = sign * (absD === 1 ? 20 : absD === 2 ? 12 : 6);
                arcY = 6 + absD * 2.8;
                arcRy = -sign * (5 + absD * 2);
                dimScale = Math.max(0.83, 0.92 - absD * 0.025);
                zIndex = 12 - absD;
              }
            }

            return (
              <div
                key={project.id}
                data-slot={idx}
                className={`work-slot-item${isHovered ? ' is-hovered' : ''}${
                  hasAnyHover && !isHovered ? ' is-dimmed' : ''
                }`}
                style={{
                  zIndex,
                  '--push-x': `${pushX}px`,
                  '--arc-y': `${arcY.toFixed(1)}px`,
                  '--arc-ry': `${arcRy.toFixed(2)}deg`,
                  '--dim-sc': dimScale.toFixed(3),
                  '--hu': project.hue || 210
                }}
                onMouseEnter={() => handleCardEnter(idx, project)}
                onMouseMove={(e) => handleCardMouseMove(idx, e)}
                onMouseLeave={() => handleCardLeave(idx)}
              >
                <article
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  className={`wk work-pan-card${isHovered ? ' is-hovered' : ''}`}
                  tabIndex={0}
                  aria-label={`Open ${project.title} case study`}
                  onFocus={() => handleCardEnter(idx, project)}
                  onBlur={() => handleCardLeave(idx)}
                  onClick={() => onSelectProject(project)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectProject(project);
                    }
                  }}
                >
                  {/* Clipped Specular Glare & Diagonal Light Sweep */}
                  <span className="wk-sheen-clip" aria-hidden="true">
                    <span className="wk-glare" />
                    <span className="wk-light-sweep" />
                  </span>

                  {/* Cover Preview Image */}
                  <div className="cv">
                    <img
                      src={project.image}
                      alt={`${project.title} preview`}
                      loading="eager"
                      decoding="async"
                    />
                    <i><s /><s /><s /></i>
                  </div>

                  {/* Project Index, Name & Animated Arrow Button */}
                  <div className="wk-head">
                    <div className="wk-meta">
                      <div className="n">{indexNumber}</div>
                      <h3>{project.title}</h3>
                    </div>

                    <button
                      type="button"
                      className="go"
                      tabIndex={-1}
                      aria-label={`Open ${project.title}`}
                      title={`Open ${project.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(project);
                      }}
                    >
                      <ArrowUpRight size={16} strokeWidth={2.5} className="arrow-primary" />
                      <ArrowUpRight size={16} strokeWidth={2.5} className="arrow-secondary" />
                    </button>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default memo(Works);
