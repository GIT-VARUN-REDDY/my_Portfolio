import React, { useState, memo } from 'react';
import confetti from 'canvas-confetti';
import { personalInfo } from '../data/portfolioData';

export default memo(function Contact({ onShowToast }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2200);
      onShowToast('Email copied to clipboard: ' + personalInfo.email);
    } catch (err) {
      onShowToast('Email: ' + personalInfo.email);
    }
  };

  const handleResumeDownload = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      onShowToast('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onShowToast(`Thank you, ${formData.name}! Your message was dispatched.`);
      try {
        confetti({
          particleCount: 65,
          spread: 65,
          origin: { y: 0.7 }
        });
      } catch (err) {}

      // Mailto fallback
      const mailtoUrl = `mailto:${personalInfo.email}?subject=${encodeURIComponent(
        'Portfolio message from ' + formData.name
      )}&body=${encodeURIComponent(
        formData.message + '\n\n' + formData.name + ' (' + formData.email + ')'
      )}`;
      window.location.href = mailtoUrl;

      setFormData({ name: '', email: '', message: '' });
    }, 500);
  };

  return (
    <section id="contact">
      <div className="c">
        <h2 className="st s3d" data-s3d="title">
          Contact <span>Me</span>
        </h2>

        <div className="cg">
          {/* Left Column: Form */}
          <form className="s3d" data-s3d="door-left" id="fm" onSubmit={handleSubmit}>
            <input
              id="fn"
              name="name"
              placeholder="Name"
              aria-label="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              id="fe"
              name="email"
              type="email"
              placeholder="Email"
              aria-label="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              id="fx"
              name="message"
              placeholder="Message"
              aria-label="Message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button
              className="btn"
              type="submit"
              disabled={isSubmitting}
              style={{ justifySelf: 'start' }}
            >
              {isSubmitting ? 'Sending...' : 'Send message →'}
            </button>
          </form>

          {/* Right Column: Interactive Contact Pills Wave */}
          <div>
            {/* Click to Copy Email */}
            <button
              type="button"
              className="ic s3d"
              data-s3d="pill"
              data-idx="0"
              onClick={handleCopyEmail}
              title="Click to copy email"
              style={{ width: '100%', cursor: 'pointer', textAlign: 'left' }}
            >
              <span>
                <small>{emailCopied ? 'Copied to clipboard!' : 'Email (Click to copy)'}</small>
                {personalInfo.email}
              </span>
              <span>{emailCopied ? '✓' : '📋 ↗'}</span>
            </button>

            {/* LinkedIn */}
            <a
              className="ic s3d"
              data-s3d="pill"
              data-idx="1"
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                <small>LinkedIn</small>
                Varun Reddy Kandimalla
              </span>
              <span>↗</span>
            </a>

            {/* GitHub */}
            <a
              className="ic s3d"
              data-s3d="pill"
              data-idx="2"
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                <small>GitHub</small>
                GIT-VARUN-REDDY
              </span>
              <span>↗</span>
            </a>

            {/* Universal Resume Download */}
            <a
              className="ic rs s3d"
              data-s3d="pill"
              data-idx="3"
              href={personalInfo.resumeUrl}
              download="Varun_Reddy_Resume.pdf"
              onClick={handleResumeDownload}
              title="Download PDF Resume"
            >
              <span>
                <small>Resume</small>
                Download PDF
              </span>
              <span>↓</span>
            </a>

            {/* Phone */}
            <a
              className="ic s3d"
              data-s3d="pill"
              data-idx="4"
              href={personalInfo.phoneUrl}
            >
              <span>
                <small>Phone</small>
                {personalInfo.phone}
              </span>
              <span>↗</span>
            </a>

            {/* Location */}
            <div
              className="ic s3d"
              data-s3d="pill"
              data-idx="5"
              style={{ cursor: 'default' }}
            >
              <span>
                <small>Location</small>
                {personalInfo.location}
              </span>
              <span>📍</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
