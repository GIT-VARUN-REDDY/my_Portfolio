import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ArrowRight, Download, Sun, Moon, 
  MessageSquare, Mail, Github, Linkedin, ExternalLink, X, Code2
} from 'lucide-react';
import { personalInfo, projectsData } from '../data/portfolioData';

export default function CommandPalette({
  isOpen,
  onClose,
  theme,
  toggleTheme,
  onOpenChat,
  onSelectProject,
  onShowToast
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const allItems = [
    // Navigation
    {
      id: 'nav-home',
      label: 'Jump to Home',
      category: 'Navigation',
      icon: ArrowRight,
      action: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'nav-about',
      label: 'Jump to About Me',
      category: 'Navigation',
      icon: ArrowRight,
      action: () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'nav-projects',
      label: 'Jump to Works',
      category: 'Navigation',
      icon: ArrowRight,
      action: () => {
        document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'nav-skills',
      label: 'Jump to Technical Skills',
      category: 'Navigation',
      icon: ArrowRight,
      action: () => {
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'nav-journey',
      label: 'Jump to Journey & Timeline',
      category: 'Navigation',
      icon: ArrowRight,
      action: () => {
        document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'nav-contact',
      label: 'Jump to Contact',
      category: 'Navigation',
      icon: ArrowRight,
      action: () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },

    // Actions
    {
      id: 'act-resume',
      label: 'Download Resume (PDF)',
      category: 'Actions',
      icon: Download,
      action: () => {
        const link = document.createElement('a');
        link.href = personalInfo.resumeUrl;
        link.download = 'Varun_Reddy_Kandimalla_Resume.pdf';
        link.click();
        onShowToast('Downloading Varun Reddy Resume PDF...');
        onClose();
      }
    },
    {
      id: 'act-theme',
      label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      category: 'Actions',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => {
        toggleTheme();
        onClose();
      }
    },
    {
      id: 'act-chat',
      label: "Ask Varun's AI Avatar",
      category: 'Actions',
      icon: MessageSquare,
      action: () => {
        onClose();
        onOpenChat();
      }
    },
    {
      id: 'act-copy-email',
      label: 'Copy Email Address (varunreddy0429@gmail.com)',
      category: 'Actions',
      icon: Mail,
      action: () => {
        navigator.clipboard.writeText(personalInfo.email);
        onShowToast('Email copied to clipboard!');
        onClose();
      }
    },
    {
      id: 'act-github',
      label: 'Visit GitHub Profile',
      category: 'External',
      icon: Github,
      action: () => {
        window.open(personalInfo.github, '_blank');
        onClose();
      }
    },
    {
      id: 'act-linkedin',
      label: 'Visit LinkedIn Profile',
      category: 'External',
      icon: Linkedin,
      action: () => {
        window.open(personalInfo.linkedin, '_blank');
        onClose();
      }
    },

    // Projects
    ...projectsData.map((p) => ({
      id: `proj-${p.id}`,
      label: `View Project: ${p.title} (${p.category})`,
      category: 'Projects',
      icon: Code2,
      action: () => {
        onClose();
        onSelectProject(p);
      }
    }))
  ];

  const filteredItems = allItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="command-palette-backdrop" onClick={onClose}>
      <div 
        className="command-palette-modal animate-pop" 
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="palette-input-row">
          <Search size={18} className="palette-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="palette-search-input"
            placeholder="Type a command or search (e.g. Resume, Projects, Theme, AI)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <button
            type="button"
            className="palette-close-btn"
            onClick={onClose}
          >
            <span className="kbd-shortcut">ESC</span>
          </button>
        </div>

        <div className="palette-results-list">
          {filteredItems.length === 0 ? (
            <div className="palette-empty">No results found for "{query}"</div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  className={`palette-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="palette-item-icon">
                    <Icon size={16} />
                  </div>
                  <div className="palette-item-text">
                    <span className="palette-item-label">{item.label}</span>
                  </div>
                  <span className="palette-item-category">{item.category}</span>
                </div>
              );
            })
          )}
        </div>

        <div className="palette-footer">
          <span className="palette-tip">
            <span className="kbd-shortcut">↑</span> <span className="kbd-shortcut">↓</span> to navigate
          </span>
          <span className="palette-tip">
            <span className="kbd-shortcut">↵</span> to select
          </span>
          <span className="palette-tip">
            <span className="kbd-shortcut">esc</span> to close
          </span>
        </div>
      </div>
    </div>
  );
}

