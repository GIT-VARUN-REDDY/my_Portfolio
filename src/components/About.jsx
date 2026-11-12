import React, { memo } from 'react';
import { Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { personalInfo } from '../data/portfolioData';

export default memo(function About() {
  const handleResumeDownload = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.65 }
      });
    } catch (e) { }
  };

  return (
    <section className="ab" id="about">
      <div className="c">
        {/* Left Column: Bio & Action Buttons */}
        <div>
          <h2 className="s3d" data-s3d="door-left" data-idx="0">
            About Me: B.Tech ECE graduate turned <span>full-stack</span> developer who builds <span>websites</span>, <span>apps</span> and <span>AI</span> products end to end.
          </h2>
          <p className="s3d" data-s3d="door-left" data-idx="1">
            Graduated in April 2026 from Teegala Krishna Reddy Engineering College. Technical Associate Intern at Ample Semiconductors since September 2026. If you have a project in mind, check out my work and let’s build it together.
          </p>
          <p className="s3d" data-s3d="door-left" data-idx="2">
            From scalable web architectures and REST APIs to cross-platform mobile apps and generative AI integrations, I focus on clean code, thoughtful design, and measurable real-world impact.
          </p>
          <p className="s3d about-actions-row" data-s3d="door-left" data-idx="3">
            <a
              className="btn"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Let's talk
            </a>
            <a
              className="btn btn-secondary rs"
              href={personalInfo.resumeUrl}
              download="Varun_Reddy_Resume.pdf"
              onClick={handleResumeDownload}
            >
              <Download size={15} />
              <span>Download resume</span>
            </a>
          </p>
        </div>

        {/* Right Column: 3D Quick Facts Tilt Card */}
        <div className="quick-facts-card s3d tilt" data-s3d="door-right" data-idx="0">
          <p className="quick-facts-title">Quick facts</p>
          <ul className="quick-facts-list">
            <li>
              <span>📍</span> <strong>Based in Bengaluru, India</strong>
            </li>
            <li>
              <span>💼</span> <strong>Technical Associate Intern @ Ample Semiconductors</strong>
            </li>
            <li>
              <span>🚀</span> <strong>Former MERN Stack Intern @ EY GDS</strong>
            </li>
            <li>
              <span>🎓</span> <strong>B.Tech in ECE (Graduated April 2026)</strong>
            </li>
            <li>
              <span>💡</span> <strong>Building full-stack web, Flutter apps &amp; Gemini AI</strong>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
});
