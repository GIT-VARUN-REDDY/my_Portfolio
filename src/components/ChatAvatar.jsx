import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { aiAvatarKnowledge } from '../data/portfolioData';

const SUGGESTED_QUESTIONS = [
  "What's your tech stack?",
  "Can I get your resume?",
  "Tell me about your AI work",
  "Are you available for hire?"
];

const INITIAL_MESSAGE = {
  id: 1,
  sender: 'bot',
  text: "Hey there! I'm Varun's AI Assistant. Ask me anything about Varun's skills, experience, projects, or how to get in touch!"
};

const findBestResponse = (query) => {
  const q = query.toLowerCase();

  for (const item of aiAvatarKnowledge) {
    if (item.keywords.some((kw) => q.includes(kw))) {
      return item.answer;
    }
  }

  return "I'm Varun's AI avatar! Varun is a Full-Stack & AI Engineer specializing in React, Node.js, Python, and API integration. Feel free to download his resume or email him directly at varunreddy0429@gmail.com!";
};

export default function ChatAvatar({ isOpen, setIsOpen }) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [providerLabel, setProviderLabel] = useState('Powered by Grok AI');
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
      replyText = findBestResponse(query);
      setProviderLabel('Instant Knowledge Base');
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
              placeholder="Ask anything about Varun..."
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
