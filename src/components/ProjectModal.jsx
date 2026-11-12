import React, { useEffect } from 'react';
import { X, ExternalLink, Github, CheckCircle2, Layers, Cpu, Star } from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-content animate-pop" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header Image */}
        <div className="modal-image-wrap">
          <img
            src={project.image}
            alt={project.title}
            className="modal-image"
            decoding="async"
          />
          <div className="modal-badge-overlay">
            <span className="modal-category-badge">{project.category}</span>
            {project.metrics && (
              <span className="modal-metrics-badge">
                <Star size={12} fill="currentColor" /> {project.metrics}
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="modal-title-row">
            <div>
              <h3 className="modal-title">{project.title}</h3>
              <p className="modal-tagline">{project.tagline}</p>
            </div>
          </div>

          {/* Action Links */}
          <div className="modal-actions-bar">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                <span>Live Demo</span>
                <ExternalLink size={14} />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <span>Source Code</span>
                <Github size={14} />
              </a>
            )}
          </div>

          {/* Description */}
          <div className="modal-section">
            <h4 className="modal-section-title">Overview</h4>
            <p className="modal-text">{project.description}</p>
          </div>

          {/* Architecture Details if available */}
          {project.architecture && (
            <div className="modal-section">
              <h4 className="modal-section-title">
                <Layers size={16} /> Architecture & Stack
              </h4>
              <p className="modal-text">{project.architecture}</p>
            </div>
          )}

          {/* Key Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="modal-section">
              <h4 className="modal-section-title">
                <CheckCircle2 size={16} /> Key Features & Innovations
              </h4>
              <ul className="modal-highlights-list">
                {project.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Tags */}
          <div className="modal-section">
            <h4 className="modal-section-title">
              <Cpu size={16} /> Technologies Used
            </h4>
            <div className="modal-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="tech-badge">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

