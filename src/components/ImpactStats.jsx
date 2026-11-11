import React, { useState, useEffect, useRef } from 'react';
import { impactStats } from '../data/portfolioData';
import { FolderGit2, Cpu, CheckCircle2, Zap } from 'lucide-react';

const iconMap = {
  FolderGit2,
  Cpu,
  CheckCircle2,
  Zap
};

export default function ImpactStats() {
  const [counts, setCounts] = useState(impactStats.map((s) => s.numeric));
  const [isCounting, setIsCounting] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let rafId;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          cancelAnimationFrame(rafId);
          setIsCounting(true);
          const startTime = performance.now();
          const duration = 2400;

          const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);

            setCounts(
              impactStats.map((stat) => {
                const val = stat.numeric * eased;
                return Math.round(val * 10) / 10;
              })
            );

            if (progress < 1) {
              rafId = requestAnimationFrame(tick);
            } else {
              setIsCounting(false);
            }
          };

          rafId = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(rafId);
          setCounts(impactStats.map(() => 0));
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="impact-stats-section" ref={containerRef}>
      <div className="c">
        <div className="stats-grid">
          {impactStats.map((stat, i) => {
            const Icon = iconMap[stat.icon] || Zap;
            const val = counts[i];
            const displayValue =
              (stat.value.includes('.') ? val.toFixed(1) : Math.floor(val)) + stat.suffix;

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
                <div className={`stat-number ${isCounting ? 'counting' : ''}`}>{displayValue}</div>
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
