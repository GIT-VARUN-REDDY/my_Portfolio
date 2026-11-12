import React, { useState, useEffect, useRef, memo } from 'react';
import { Sun, Moon, Command, Menu, X, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { personalInfo } from '../data/portfolioData';

const SECTION_IDS = ['home', 'work', 'skills', 'journey', 'contact'];

function Navbar({ theme, toggleTheme, onOpenCommandPalette }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrolledRef = useRef(false);
  const activeRef = useRef('home');

  const handleResumeClick = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.25 }
      });
    } catch (e) { }
  };

  useEffect(() => {
    let sectionMetrics = [];
    let docHeight = document.documentElement.scrollHeight;
    let vh = window.innerHeight || 800;
    let rafId = null;

    const measureSections = () => {
      vh = window.innerHeight || 800;
      docHeight = document.documentElement.scrollHeight;
      sectionMetrics = [];
      for (let i = 0; i < SECTION_IDS.length; i++) {
        const id = SECTION_IDS[i];
        const el = document.getElementById(id);
        if (el) {
          sectionMetrics.push({
            id,
            top: el.offsetTop,
            bottom: el.offsetTop + el.offsetHeight
          });
        }
      }
    };

    const updateNavState = () => {
      rafId = null;
      const sy = window.scrollY;
      const nextScrolled = sy > 35;
      if (nextScrolled !== scrolledRef.current) {
        scrolledRef.current = nextScrolled;
        setScrolled(nextScrolled);
      }

      let nextActive = activeRef.current;
      if (vh + sy >= docHeight - 40) {
        nextActive = 'contact';
      } else {
        const scrollPosition = sy + vh * 0.35;
        for (let i = 0; i < sectionMetrics.length; i++) {
          const sec = sectionMetrics[i];
          if (scrollPosition >= sec.top && scrollPosition < sec.bottom) {
            nextActive = sec.id;
            break;
          }
        }
      }

      if (nextActive !== activeRef.current) {
        activeRef.current = nextActive;
        setActiveSection(nextActive);
      }
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateNavState);
      }
    };

    const onResize = () => {
      measureSections();
      onScroll();
    };

    measureSections();
    updateNavState();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    document.fonts?.ready?.then(onResize);

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(onResize)
      : null;
    const mainEl = document.querySelector('main');
    if (resizeObserver && mainEl) {
      resizeObserver.observe(mainEl);
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      resizeObserver?.disconnect();
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Works', href: '#work', id: 'work' },
    { name: 'Skills', href: '#skills', id: 'skills' },
    { name: 'Journey', href: '#journey', id: 'journey' }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header id="hd" className={scrolled ? 'sc' : ''}>
      <nav className="c">
        <a
          href="#home"
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          Portfolio
        </a>

        {/* Desktop Navigation */}
        <ul className="nl desktop-only" id="nl">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={isActive ? 'on' : ''}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.name}
                </a>
              </li>
            );
          })}
          <li>
            <a
              href="#contact"
              className="btn btn-sm"
              onClick={(e) => handleNavClick(e, '#contact')}
            >
              Contact me
            </a>
          </li>
        </ul>

        {/* Actions Bar */}
        <div className="nav-actions">
          {/* Command Palette Trigger */}
          <button
            type="button"
            className="cmd-trigger-btn"
            onClick={onOpenCommandPalette}
            title="Press Ctrl+K or Cmd+K"
            aria-label="Open Command Palette"
          >
            <Command size={13} />
            <span className="cmd-key">Ctrl K</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={(e) => toggleTheme(e)}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? (
              <Sun size={17} className="theme-icon sun" />
            ) : (
              <Moon size={17} className="theme-icon moon" />
            )}
          </button>

          {/* Universal Resume Button */}
          <a
            href={personalInfo.resumeUrl}
            download="Varun_Reddy_Resume.pdf"
            className="btn btn-sm desktop-only rs"
            onClick={handleResumeClick}
            title="Download Varun's Resume (PDF)"
          >
            <Download size={14} />
            <span>Resume</span>
          </a>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="tg"
            id="tg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in">
          <ul className="mobile-links">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                className="btn btn-sm btn-block"
                onClick={(e) => handleNavClick(e, '#contact')}
              >
                Contact me
              </a>
            </li>
            <li className="mobile-extra">
              <a
                href={personalInfo.resumeUrl}
                download="Varun_Reddy_Resume.pdf"
                className="btn btn-secondary btn-sm btn-block"
                onClick={handleResumeClick}
              >
                <Download size={15} />
                <span>Download Resume</span>
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default memo(Navbar);
