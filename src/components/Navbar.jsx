import React, { useState, useEffect } from 'react';
import { Sun, Moon, Command, Menu, X, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { personalInfo } from '../data/portfolioData';

export default function Navbar({ theme, toggleTheme, onOpenCommandPalette }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    const handleScroll = () => {
      setScrolled(window.scrollY > 35);

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40) {
        setActiveSection('contact');
        return;
      }

      const sections = ['home', 'work', 'skills', 'journey', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
