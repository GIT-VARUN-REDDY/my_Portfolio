import React, { useState, useEffect } from 'react';
import { Download, ArrowRight, ArrowDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { personalInfo } from '../data/portfolioData';

export default function Hero({ onOpenContact }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(135);

  const roles = [
    "AI Engineer",
    "MERN Stack Developer",
    "App Developer",
    "Web Developer"
  ];

  // Typewriter effect
  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timer;

    if (!isDeleting && displayText === currentRole) {
      timer = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
      setTypingSpeed(135);
    } else {
      timer = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting
            ? currentRole.substring(0, prev.length - 1)
            : currentRole.substring(0, prev.length + 1)
        );
        setTypingSpeed(isDeleting ? 65 : 135);
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, typingSpeed]);

  const handleResumeDownload = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  // Circular rotating badge text
  const badgeText = "EXPLORE MORE • LET’S • ";
  const chars = badgeText.split('');

  return (
    <section className="hero" id="home">
      <div className="c" id="hi">
        <div id="hero-txt" className="hero-scroll-layer">
          <p className="sub hero-enter" style={{ animationDelay: '0.05s' }}>
            Hi! I’m Varun Reddy Kandimalla
          </p>
          
          <h1 className="hero-enter" style={{ animationDelay: '0.16s' }}>
            Full-Stack Developer &amp;<br />
            <em id="ty">{displayText}</em>
          </h1>

          <p className="hd hero-enter" style={{ animationDelay: '0.28s' }}>
            MERN stack developer building scalable full-stack web apps, REST APIs and secure auth systems, with a passion for AI-assisted development. I build any website full-stack, and apps too.
          </p>

          {/* Action Buttons */}
          <div className="hero-actions hero-enter" style={{ animationDelay: '0.38s' }}>
            <a
              href={personalInfo.resumeUrl}
              download="Varun_Reddy_Resume.pdf"
              className="btn rs"
              onClick={handleResumeDownload}
              title="Download PDF Resume"
            >
              <Download size={16} />
              <span>Download resume</span>
            </a>

            <a
              href="#work"
              className="btn btn-secondary"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Explore works</span>
              <ArrowRight size={15} className="btn-arrow" />
            </a>

            <a
              href="#contact"
              className="btn btn-ghost"
              onClick={(e) => {
                e.preventDefault();
                onOpenContact?.();
              }}
            >
              <span>Contact me</span>
            </a>
          </div>
        </div>

        {/* 3D Hero Avatar Card with Mouse & Scroll Parallax */}
        <div className="hc hero-enter-card" id="hc">
          <div className="b1"></div>
          <div className="b2"></div>
          <div className="ph">
            <img
              src="/hero-avatar.webp"
              alt="Varun Reddy Kandimalla"
              width="300"
              height="380"
              loading="eager"
            />
          </div>

          {/* Rotating Circular Badge */}
          <div className="bd">
            <div className="t">
              {chars.map((char, i) => {
                const deg = (360 / chars.length) * i;
                return (
                  <span
                    key={i}
                    style={{
                      transform: `rotate(${deg}deg)`,
                      transformOrigin: '0 56px'
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
            <a
              href="#about"
              aria-label="Scroll to About"
              title="Explore More"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <ArrowDown size={20} color="var(--first-d)" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
