import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { projectsData } from '../data/portfolioData';

export default function Works({ onSelectProject }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [hoverSuppressed, setHoverSuppressed] = useState(false);
  const [selectedFlashIdx, setSelectedFlashIdx] = useState(null);

  const viewportRef = useRef(null);
  const suppressCleanupRef = useRef(null);
  const flashTimerRef = useRef(null);
  const touchStartRef = useRef(null);

  const total = projectsData.length;

  const suppressHoverUntilMove = useCallback((clientX, clientY) => {
    if (suppressCleanupRef.current) {
      suppressCleanupRef.current();
    }

    setHoveredIdx(null);
    setHoverSuppressed(true);

    const startX = typeof clientX === 'number' ? clientX : null;
    const startY = typeof clientY === 'number' ? clientY : null;
    let timerId = null;

    const cleanup = () => {
      if (timerId) clearTimeout(timerId);
      setHoverSuppressed(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('pointerdown', cleanup);
      suppressCleanupRef.current = null;
    };

    const onMove = (e) => {
      if (startX === null || startY === null) {
        cleanup();
        return;
      }
      const distSq = (e.clientX - startX) ** 2 + (e.clientY - startY) ** 2;
      if (distSq > 16) cleanup();
    };

    timerId = setTimeout(cleanup, 480);
    suppressCleanupRef.current = cleanup;

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('pointerdown', cleanup, { passive: true });
  }, []);

  useEffect(() => {
    return () => {
      if (suppressCleanupRef.current) suppressCleanupRef.current();
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, []);

  const selectProjectIndex = useCallback(
    (nextIdx, event = null) => {
      const normalized = ((nextIdx % total) + total) % total;
      suppressHoverUntilMove(event?.clientX, event?.clientY);
      setActiveIndex(normalized);

      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      setSelectedFlashIdx(null);
      requestAnimationFrame(() => {
        setSelectedFlashIdx(normalized);
        flashTimerRef.current = setTimeout(() => setSelectedFlashIdx(null), 950);
      });
    },
    [total, suppressHoverUntilMove]
  );

  const stepCarousel = useCallback(
    (direction, event = null) => {
      selectProjectIndex(activeIndex + direction, event);
    },
    [activeIndex, selectProjectIndex]
  );

  const handleStageMouseMove = (e) => {
    const vp = viewportRef.current;
    if (!vp) return;
    const rect = vp.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
    const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
    vp.style.setProperty('--stage-rx', `${(-ny * 4.5).toFixed(2)}deg`);
    vp.style.setProperty('--stage-ry', `${(nx * 6).toFixed(2)}deg`);
  };

  const handleStageMouseLeave = () => {
    setHoveredIdx(null);
    const vp = viewportRef.current;
    if (vp) {
      vp.style.setProperty('--stage-rx', '0deg');
      vp.style.setProperty('--stage-ry', '0deg');
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now()
      };
    }
  };

  const handleTouchEnd = (e) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || !e.changedTouches || e.changedTouches.length !== 1) return;

    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    const elapsed = Date.now() - start.time;

    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2 && elapsed < 650) {
      stepCarousel(dx < 0 ? 1 : -1);
    }
  };

  const getSlotPositionClass = (idx) => {
    let diff = (idx - activeIndex + total) % total;
    if (diff > total / 2) diff -= total;
    if (diff === 0) return 'pos-center slot-front';
    if (diff === -1) return 'pos-left slot-flank';
    if (diff === 1) return 'pos-right slot-flank';
    if (diff === -2) return 'pos-far-left';
    if (diff === 2) return 'pos-far-right';
    return 'pos-back';
  };

  const activeProject = projectsData[activeIndex];
  const activeHue = activeProject?.hue || 215;

  return (
    <section id="work">
      <div className="c">
        <h2 className="st s3d" data-s3d="title">
          View My <span>Work</span>
        </h2>

        {/* DarkSense-Style 3D Orbital Carousel Stage */}
        <div
          className="work-carousel-shell s3d"
          data-s3d="rise"
          style={{ '--active-hue': activeHue }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              stepCarousel(-1);
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              stepCarousel(1);
            }
          }}
        >
          <div
            ref={viewportRef}
            id="wg"
            className={`work-stage-viewport${hoverSuppressed ? ' hover-suppressed' : ''}${
              !hoverSuppressed && hoveredIdx !== null ? ' inspect-flank-active' : ''
            }`}
            onMouseMove={handleStageMouseMove}
            onMouseLeave={handleStageMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Dynamic Radial Spotlight Aura behind Center Project */}
            <div className="work-stage-aura" aria-hidden="true" />

            {/* Circular 3D Orbit Project Cards */}
            {projectsData.map((project, idx) => {
              const indexNumber = `0${idx + 1}`;
              const posClass = getSlotPositionClass(idx);
              const isCenter = idx === activeIndex;
              const isInspected = !hoverSuppressed && hoveredIdx === idx && !isCenter;
              const isFlank = posClass.includes('slot-flank');

              return (
                <article
                  key={project.id}
                  className={`wk work-slot ${posClass}${isInspected ? ' is-hover-inspected' : ''}${
                    selectedFlashIdx === idx ? ' slot-selected-flash' : ''
                  }`}
                  tabIndex={isCenter || isFlank ? 0 : -1}
                  aria-label={
                    isCenter ? `Open ${project.title} case study` : `Bring ${project.title} to center`
                  }
                  onMouseEnter={() => {
                    if (!hoverSuppressed && isFlank) {
                      setHoveredIdx(idx);
                    }
                  }}
                  onMouseLeave={() => {
                    if (hoveredIdx === idx) {
                      setHoveredIdx(null);
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isCenter) {
                      onSelectProject(project);
                    } else {
                      selectProjectIndex(idx, e);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      if (isCenter) {
                        onSelectProject(project);
                      } else {
                        selectProjectIndex(idx);
                      }
                    }
                  }}
                >
                  {/* Cover Preview Image */}
                  <div className="cv" style={{ '--hu': project.hue || 210 }}>
                    <img
                      src={project.image}
                      alt={`${project.title} preview`}
                      loading="lazy"
                    />
                    <i><s /><s /><s /></i>
                  </div>

                  {/* Project Index, Name & Animated Arrow Button */}
                  <div className="wk-head">
                    <div>
                      <div className="n">{indexNumber}</div>
                      <h3>{project.title}</h3>
                    </div>

                    <button
                      type="button"
                      className="go"
                      aria-label={`Open ${project.title}`}
                      title={isCenter ? `Open ${project.title}` : `Switch to ${project.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCenter) {
                          onSelectProject(project);
                        } else {
                          selectProjectIndex(idx, e);
                        }
                      }}
                    >
                      <ArrowUpRight size={18} strokeWidth={2.5} className="arrow-primary" />
                      <ArrowUpRight size={18} strokeWidth={2.5} className="arrow-secondary" />
                    </button>
                  </div>
                </article>
              );
            })}

            {/* Left / Right Floating Frosted Loop Chevrons */}
            <button
              type="button"
              className="stage-loop-nav loop-nav-prev"
              onClick={(e) => {
                e.stopPropagation();
                stepCarousel(-1, e);
              }}
              aria-label="Previous Project"
              title="Previous Project"
            >
              <ChevronLeft size={20} strokeWidth={2.3} />
            </button>

            <button
              type="button"
              className="stage-loop-nav loop-nav-next"
              onClick={(e) => {
                e.stopPropagation();
                stepCarousel(1, e);
              }}
              aria-label="Next Project"
              title="Next Project"
            >
              <ChevronRight size={20} strokeWidth={2.3} />
            </button>
          </div>

          {/* Caption Pill & Carousel Pagination Dots */}
          <div className="work-carousel-footer">
            <div className="work-loop-dots" role="tablist" aria-label="Project Switcher">
              {projectsData.map((project, idx) => (
                <button
                  key={project.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === activeIndex}
                  aria-label={`Select ${project.title}`}
                  title={project.title}
                  className={`loop-dot${idx === activeIndex ? ' active' : ''}`}
                  onClick={(e) => selectProjectIndex(idx, e)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
