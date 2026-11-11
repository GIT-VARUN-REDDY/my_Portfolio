import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, User, Download, ExternalLink } from 'lucide-react';
import { aiAvatarKnowledge, personalInfo } from '../data/portfolioData';

export default function ChatAvatar({ isOpen, setIsOpen, onShowToast }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hey there! I'm Varun's AI Assistant. Ask me anything about Varun's skills, experience, projects, or how to get in touch!"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "What's your tech stack?",
    "Can I get your resume?",
    "Tell me about your AI work",
    "Are you available for hire?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const findBestResponse = (query) => {
    const q = query.toLowerCase();

    for (const item of aiAvatarKnowledge) {
      if (item.keywords.some((kw) => q.includes(kw))) {
        return item.answer;
      }
    }

    return "I'm Varun's AI avatar! Varun is a Full-Stack & AI Engineer specializing in React, Node.js, Python, and PyTorch. Feel free to download his resume or email him directly at varunreddy0429@gmail.com!";
  };

  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate smart thinking delay
    setTimeout(() => {
      const responseText = findBestResponse(query);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: responseText
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
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
                <span className="chat-header-status">Powered by Knowledge Base</span>
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
            {suggestedQuestions.map((q) => (
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
              disabled={!inputText.trim()}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

