import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer>
      <div className="c s3d" data-s3d="curtain">
        <h4>Collaborate with Varun and start your journey in full-stack development today.</h4>
        <div className="fl">
          <a href="#home" onClick={(e) => scrollToSection(e, '#home')}>Home</a>
          <a href="#work" onClick={(e) => scrollToSection(e, '#work')}>Work</a>
          <a href="#skills" onClick={(e) => scrollToSection(e, '#skills')}>Skills</a>
          <a href="#journey" onClick={(e) => scrollToSection(e, '#journey')}>Journey</a>
          <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')}>Contact</a>
        </div>
        <div className="footer-bottom-row">
          <small>© 2026 Varun Reddy Kandimalla. All rights reserved.</small>
          <button
            type="button"
            className="back-to-top-btn"
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Scroll to Top"
          >
            <span>Back to top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}
