import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { personalInfo, projectsData } from '../data/portfolioData';

const SUGGESTED_QUESTIONS = [
  "What's your tech stack?",
  "Tell me about your experience",
  "Tell me about your projects",
  "Are you available for hire?"
];

const INITIAL_MESSAGE = {
  id: 1,
  sender: 'bot',
  text: "Hey there! I'm Varun's AI Assistant. Ask me anything about Varun's resume, experience, skills, projects, or how to get in touch!"
};

const RESUME_SECTIONS = [
  {
    key: 'experience',
    keywords: ['experience', 'intern', 'internship', 'work history', 'ample', 'ey', 'gds', 'job', 'company', 'career', 'background'],
    answer:
      'Varun is currently a Technical Associate Intern at Ample Semiconductors (Sep 2026 – Present). Previously, he was a MERN Stack Developer Intern at EY Global Delivery Services (Dec 2024 – Jan 2025), where he built full-stack apps with React, Node.js, Express, and MongoDB.'
  },
  {
    key: 'education',
    keywords: ['education', 'degree', 'college', 'btech', 'b.tech', 'ece', 'graduat', 'cgpa', 'university', 'study', 'qualification'],
    answer:
      'Varun graduated with a B.Tech in Electronics and Communication Engineering (ECE) from Teegala Krishna Reddy Engineering College in April 2026 (CGPA: 8.0/10).'
  },
  {
    key: 'certifications',
    keywords: ['certif', 'credential', 'ibm', 'skillsbuild', 'aicte', 'course'],
    answer:
      'Varun holds the EY GDS AICTE MERN Stack Certification and IBM SkillsBuild Career Management Essentials certification.'
  },
  {
    key: 'skills',
    keywords: ['skill', 'stack', 'tech', 'language', 'frontend', 'backend', 'database', 'tool', 'mern', 'react', 'node', 'python', 'flutter', 'api', 'ai work', 'ai'],
    answer:
      'Technical skills from his resume: Languages (C, C++, Python, Java, JavaScript), Frontend (HTML, CSS, React.js, Bootstrap, Tailwind CSS), Backend & DBs (Node.js, Express.js, REST APIs, JWT, MongoDB, MySQL), AI (Prompt Engineering, ChatGPT, API Integration & Management), plus Flutter, Git/GitHub, Linux CLI, Vercel, and Render.'
  },
  {
    key: 'projects',
    keywords: ['project', 'projects', 'portfolio', 'built', 'app', 'apps', 'website', 'websites', 'work'],
    answer:
      'Varun has built 6 production projects: ElectroCirco (50+ hardware labs & firmware generator), SK Holidays & Events (travel & events platform), DreamLoom (MERN AI storybook PDF generator), DocMeet (healthcare booking & symptom triage), PPTxplains (voice-driven AI slide assistant), and spider-mind (Flutter + 3D web task tracker).'
  },
  {
    key: 'contact',
    keywords: ['hire', 'available', 'contact', 'email', 'mail', 'phone', 'call', 'reach', 'location', 'bengaluru', 'bangalore', 'github', 'linkedin', 'resume', 'cv', 'download'],
    answer: `Varun is based in ${personalInfo.location} and open to full-time roles and projects. You can email him at ${personalInfo.email}, call ${personalInfo.phone}, check github.com/GIT-VARUN-REDDY, or download his resume directly from the top bar.`
  },
  {
    key: 'about',
    keywords: ['who', 'varun', 'about', 'bio', 'summary', 'introduce', 'yourself', 'him'],
    answer:
      'Varun Reddy Kandimalla is a MERN Stack Developer, Full-Stack Builder, and B.Tech ECE graduate (2026) based in Bengaluru. He builds scalable web apps, REST APIs, Flutter mobile apps, and AI-integrated products.'
  }
];

const GREETING_RE = /^(hi|hello|hey|hii+|hola|namaste|good\s*(morning|afternoon|evening)|how are you|thanks?|thank you|ty|ok|okay|cool|nice|great|bye|goodbye)[!.,?\s]*$/i;
const FOLLOW_UP_RE = /^(any\s*more|tell\s*me\s*more|more(\s+info|\s+details|\s+about\s+(him|varun))?|anything\s*else|what\s*else|go\s*on|continue|next|and)[!.,?\s]*$/i;
const OFF_TOPIC_RE = /\b(weather|forecast|temperature|news|recipe|cook|joke|poem|homework|solve|calculate|equation|capital\s+of|president|prime\s+minister|movie|song|lyrics|cricket|football|soccer|bitcoin|crypto|stock\s+price|translate)\b/i;

const POLITE_REJECTION =
  "Sorry, I can only answer questions about Varun Reddy's resume, experience, projects, skills, education, and how to contact him. Feel free to ask about any of those!";

function findResumeFallback(query, history) {
  const q = query.trim().toLowerCase();
  if (!q) return POLITE_REJECTION;

  if (OFF_TOPIC_RE.test(q) && !q.includes('varun')) {
    return POLITE_REJECTION;
  }

  if (GREETING_RE.test(q)) {
    if (/thank|ty/i.test(q)) {
      return "You're welcome! Let me know if you'd like to hear more about Varun's projects, experience, or how to reach him.";
    }
    if (/bye|goodbye/i.test(q)) {
      return 'Thanks for visiting Varun’s portfolio! Feel free to reach out anytime at varunreddy0429@gmail.com.';
    }
    return "Hi! Ask me anything about Varun's resume — his experience at Ample Semiconductors and EY GDS, his 6 projects, technical skills, education, or contact info.";
  }

  // Direct match for any of the 6 projects by name
  const matchedProject = projectsData.find(
    (p) => q.includes(p.title.toLowerCase()) || q.includes(p.id.toLowerCase())
  );
  if (matchedProject) {
    const linkPart = matchedProject.demo
      ? ` Live at ${matchedProject.demo}.`
      : matchedProject.github
        ? ` Code on ${matchedProject.github}.`
        : '';
    return `${matchedProject.title} (${matchedProject.category}): ${matchedProject.description}${linkPart}`;
  }

  // Match resume sections
  for (const section of RESUME_SECTIONS) {
    if (section.keywords.some((kw) => q.includes(kw))) {
      return section.answer;
    }
  }

  // Handle follow-up queries like "any more" / "what else" by sharing the next uncovered resume section
  if (FOLLOW_UP_RE.test(q)) {
    const priorBotText = history
      .filter((m) => m.sender === 'bot')
      .map((m) => m.text.toLowerCase())
      .join(' ');

    const unseen = RESUME_SECTIONS.find((sec) => {
      if (sec.key === 'experience') return !priorBotText.includes('ample semiconductors');
      if (sec.key === 'projects') return !priorBotText.includes('electrocirco');
      if (sec.key === 'education') return !priorBotText.includes('teegala krishna reddy');
      if (sec.key === 'certifications') return !priorBotText.includes('skillsbuild');
      if (sec.key === 'skills') return !priorBotText.includes('express.js');
      if (sec.key === 'contact') return !priorBotText.includes(personalInfo.email);
      return false;
    });

    if (unseen) return unseen.answer;
    return `That covers the key highlights of Varun's resume! If you'd like to discuss a role or project, reach him at ${personalInfo.email} or ${personalInfo.phone}.`;
  }

  // Unrelated topics are politely rejected
  return POLITE_REJECTION;
}

export default function ChatAvatar({ isOpen, setIsOpen }) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [providerLabel, setProviderLabel] = useState('Resume & Portfolio AI');
  const messagesEndRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleSend = async (textToSend) => {
    const query = (textToSend ?? inputText).trim();
    if (!query || isTyping) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query
    };

    const historySnapshot = messages.slice(-8);
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    let replyText = '';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history: historySnapshot }),
        signal: controller.signal
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.reply) {
          replyText = data.reply;
          setProviderLabel(data.provider === 'xai' ? 'Powered by Grok AI' : 'Powered by Groq AI');
        }
      }
    } catch (err) {
      if (err?.name === 'AbortError') return;
    }

    if (!replyText) {
      replyText = findResumeFallback(query, historySnapshot);
      setProviderLabel('Resume Assistant');
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        sender: 'bot',
        text: replyText
      }
    ]);
    setIsTyping(false);
  };

  return (
    <div className="chat-avatar-container">
      {/* Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          className="chat-launcher-btn animate-bounce-subtle"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
          title="Ask Varun's AI Avatar"
        >
          <div className="launcher-pulse"></div>
          <Bot size={22} className="launcher-bot-icon" />
          <span className="launcher-tooltip">Ask Varun's AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window animate-pop">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-profile">
              <div className="chat-avatar-badge">
                <Bot size={18} />
                <span className="online-indicator"></span>
              </div>
              <div>
                <h4 className="chat-header-name">Varun's AI Assistant</h4>
                <span className="chat-header-status">{providerLabel}</span>
              </div>
            </div>

            <button
              type="button"
              className="chat-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Suggestions Bar */}
          <div className="chat-suggestions-bar">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                className="chat-suggestion-chip"
                onClick={() => handleSend(q)}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="chat-messages-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="bubble-avatar bot">
                    <Bot size={14} />
                  </div>
                )}

                <div className={`chat-bubble ${msg.sender}`}>
                  <p>{msg.text}</p>
                </div>

                {msg.sender === 'user' && (
                  <div className="bubble-avatar user">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble-row bot-row">
                <div className="bubble-avatar bot">
                  <Bot size={14} />
                </div>
                <div className="chat-bubble bot typing-bubble">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            className="chat-input-bar"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              className="chat-input-field"
              placeholder="Ask about Varun's resume..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              type="submit"
              className="chat-send-btn"
              aria-label="Send message"
              disabled={!inputText.trim() || isTyping}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
