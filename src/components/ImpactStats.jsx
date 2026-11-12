import React, { useState, useEffect, useRef, memo } from 'react';
import { impactStats } from '../data/portfolioData';
import { FolderGit2, Cpu, CheckCircle2, Zap } from 'lucide-react';

const iconMap = {
  FolderGit2,
  Cpu,
  CheckCircle2,
  Zap
};

const formatStat = (stat, rawVal) => {
  const rounded = Math.round(rawVal * 10) / 10;
  return (stat.value.includes('.') ? rounded.toFixed(1) : Math.floor(rounded)) + stat.suffix;
};

function ImpactStats() {
  const [isCounting, setIsCounting] = useState(false);
  const containerRef = useRef(null);
  const numberRefs = useRef([]);

  useEffect(() => {
    let rafId = null;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (rafId !== null) cancelAnimationFrame(rafId);
          setIsCounting(true);
          const startTime = performance.now();
          const duration = 2000;

          const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);

            for (let i = 0; i < impactStats.length; i++) {
              const el = numberRefs.current[i];
              if (el) {
                el.textContent = formatStat(impactStats[i], impactStats[i].numeric * eased);
              }
            }

            if (progress < 1) {
              rafId = requestAnimationFrame(tick);
            } else {
              rafId = null;
              setIsCounting(false);
            }
          };

          rafId = requestAnimationFrame(tick);
        } else {
          if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
          setIsCounting(false);
          for (let i = 0; i < impactStats.length; i++) {
            const el = numberRefs.current[i];
            if (el) {
              el.textContent = formatStat(impactStats[i], 0);
            }
          }
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="impact-stats-section" ref={containerRef}>
      <div className="c">
        <div className="stats-grid">
          {impactStats.map((stat, i) => {
            const Icon = iconMap[stat.icon] || Zap;
            const initialValue = formatStat(stat, stat.numeric);

            return (
              <div
                key={stat.id}
                className="stat-card s3d tilt"
                data-s3d="fan"
                data-idx={i}
              >
                <div className="stat-icon-wrap">
                  <Icon size={22} className="stat-icon" />
                </div>
                <div
                  ref={(el) => { numberRefs.current[i] = el; }}
                  className={`stat-number ${isCounting ? 'counting' : ''}`}
                >
                  {initialValue}
                </div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-desc">{stat.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default memo(ImpactStats);
