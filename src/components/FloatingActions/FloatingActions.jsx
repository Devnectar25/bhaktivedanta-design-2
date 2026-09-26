import React, { useState, useEffect, useRef } from 'react';
import { getHospitalSettings, defaultHospitalSettings } from '../../utils/api';
import './FloatingActions.css';

export default function FloatingActions() {
  const [settings, setSettings] = useState(defaultHospitalSettings);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Namaste! 🙏 Welcome to Bhaktivedanta Hospital & Research Institute. How can I assist you with your healthcare needs today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      showChips: true
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch live settings and listen to updates
  useEffect(() => {
    const fetchSettings = () => {
      getHospitalSettings().then((res) => {
        if (res && typeof res === 'object') {
          setSettings((prev) => ({ ...prev, ...res }));
        }
      }).catch((err) => {
        console.warn('FloatingActions could not fetch settings:', err);
      });
    };

    fetchSettings();

    const handleSync = () => {
      fetchSettings();
    };

    window.addEventListener('hospital_settings_updated', handleSync);
    window.addEventListener('admin_data_updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('hospital_settings_updated', handleSync);
      window.removeEventListener('admin_data_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const cleanWhatsapp = (settings.contactWhatsapp || '8400146262').replace(/[^0-9]/g, '');
  const cleanEmergency = (settings.emergencyPhone || '079 6900 2221').replace(/\s+/g, '');
  const whatsappUrl = `https://wa.me/91${cleanWhatsapp}?text=${encodeURIComponent('Hello Bhaktivedanta Hospital, I would like to inquire about healthcare services.')}`;

  // Smart bot response logic
  const generateBotReply = (userQuery) => {
    const query = (userQuery || '').toLowerCase().trim();

    if (query.includes('appointment') || query.includes('book') || query.includes('consult')) {
      return {
        text: 'You can easily book doctor appointments online through our official Hospital EHR Portal or by calling our desk.',
        actionType: 'appointment'
      };
    }

    if (query.includes('emergency') || query.includes('urgent') || query.includes('ambulance') || query.includes('icu') || query.includes('casualty')) {
      return {
        text: `🚨 For immediate emergency assistance, call our 24/7 Emergency & Trauma Hotline: ${settings.emergencyPhone || '079 6900 2221'}.`,
        actionType: 'emergency'
      };
    }

    if (query.includes('whatsapp') || query.includes('chat') || query.includes('message')) {
      return {
        text: `You can chat directly with our hospital patient coordinator on WhatsApp at +91 ${settings.contactWhatsapp || '8400146262'}.`,
        actionType: 'whatsapp'
      };
    }

    if (query.includes('doctor') || query.includes('specialist') || query.includes('physician')) {
      return {
        text: 'We have over 100+ senior consultants and super-specialists across Cardiology, Oncology, Orthopaedics, Nephrology, Spiritual Care, and more.',
        actionType: 'doctors'
      };
    }

    if (query.includes('location') || query.includes('address') || query.includes('where') || query.includes('map') || query.includes('reach')) {
      return {
        text: `🏥 Bhaktivedanta Hospital & Research Institute is located at:\n${settings.contactAddress || 'Mira Road East, Thane, Maharashtra 401107'}.`,
        actionType: 'location'
      };
    }

    if (query.includes('timing') || query.includes('time') || query.includes('hour') || query.includes('opd') || query.includes('visit')) {
      return {
        text: '⏰ OPD Timings: Monday to Saturday, 8:00 AM to 8:00 PM.\n🚨 Emergency & Trauma Services: Open 24 Hours, 365 Days a year.\nVisiting hours for IPD wards: 5:00 PM to 7:00 PM.'
      };
    }

    if (query.includes('spiritual') || query.includes('prayer') || query.includes('counsel')) {
      return {
        text: 'Our holistic Spiritual Care Department offers daily prayers, spiritual counseling, and retreats to support emotional and mental healing alongside clinical treatments.'
      };
    }

    // Default polite response
    return {
      text: `Thank you for reaching out! For general inquiries, you can call us at ${settings.contactPhone || '079-69002222'} or connect directly via WhatsApp. How else may I assist you?`,
      showChips: true
    };
  };

  const handleSend = (textToSend) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    // Simulate natural bot typing delay
    setTimeout(() => {
      const replyData = generateBotReply(text);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyData.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType: replyData.actionType,
        showChips: replyData.showChips
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 450);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDownGlobal = (e) => {
      if (e.key === 'Escape' && isChatOpen) {
        setIsChatOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDownGlobal);
    return () => window.removeEventListener('keydown', handleKeyDownGlobal);
  }, [isChatOpen]);

  return (
    <>
      {/* Floating Action Buttons Container (Hidden while chatbot window is open) */}
      {!isChatOpen && (
        <div className="floating-actions-container">
          {/* 1. WhatsApp Floating Action Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="floating-action-btn whatsapp-float-btn"
            aria-label="Chat with us on WhatsApp"
          >
            <div className="whatsapp-pulse"></div>
            {/* Authentic WhatsApp SVG Icon */}
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <path d="M12.031 2C6.496 2 2 6.496 2 12.031c0 1.907.533 3.69 1.458 5.214L2.053 22l4.896-1.399A9.972 9.972 0 0012.03 22c5.536 0 10.031-4.496 10.031-10.031C22.062 6.496 17.567 2 12.031 2zm0 18.25c-1.57 0-3.048-.431-4.322-1.183l-.31-.183-3.195.913.923-3.097-.202-.325A8.17 8.17 0 013.812 12.03c0-4.53 3.689-8.219 8.219-8.219 4.53 0 8.219 3.689 8.219 8.219 0 4.531-3.689 8.22-8.219 8.22zm4.512-6.177c-.247-.123-1.464-.723-1.691-.806-.227-.082-.392-.123-.557.123-.165.247-.639.806-.783.971-.144.165-.288.185-.535.062-.247-.123-1.042-.384-1.986-1.226-.734-.655-1.23-1.464-1.374-1.711-.144-.247-.015-.38.108-.503.111-.111.247-.288.371-.432.124-.144.165-.247.247-.412.082-.165.041-.309-.02-.432-.062-.124-.557-1.341-.763-1.836-.2-.482-.403-.417-.557-.425l-.474-.008c-.165 0-.432.062-.659.309-.227.247-.866.846-.866 2.063s.887 2.393 1.01 2.558c.124.165 1.745 2.664 4.227 3.737.59.255 1.051.408 1.41.522.593.188 1.133.162 1.56.098.476-.071 1.464-.599 1.67-1.176.206-.577.206-1.072.144-1.176-.062-.103-.227-.165-.474-.288z" />
            </svg>
            <span className="floating-tooltip">Chat on WhatsApp</span>
          </a>

          {/* 2. Chatbot Floating Action Button */}
          <button
            onClick={toggleChat}
            className="floating-action-btn chatbot-float-btn"
            aria-label="Open Hospital Assistant"
          >
            <img 
              src="/chatbot-avatar.png" 
              alt="Bhaktivedanta Care Assistant" 
              className="chatbot-btn-avatar-img"
            />
            <span className="floating-tooltip">Chat with Care Assistant</span>
          </button>
        </div>
      )}

      {/* Interactive Chatbot Modal Dialog */}
      {isChatOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar">
                <img 
                  src="/chatbot-avatar.png" 
                  alt="Bhaktivedanta Care Assistant" 
                  className="chatbot-header-avatar-img"
                />
                <span className="online-indicator"></span>
              </div>
              <div className="chatbot-title-box">
                <h4>Bhaktivedanta Care Bot</h4>
                <p>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  Online • 24/7 AI Hospital Desk
                </p>
              </div>
            </div>

            <div className="chatbot-header-actions">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="chatbot-header-whatsapp-btn"
                title="Switch to WhatsApp"
                aria-label="Switch to WhatsApp"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12.031 2C6.496 2 2 6.496 2 12.031c0 1.907.533 3.69 1.458 5.214L2.053 22l4.896-1.399A9.972 9.972 0 0012.03 22c5.536 0 10.031-4.496 10.031-10.031C22.062 6.496 17.567 2 12.031 2zm0 18.25c-1.57 0-3.048-.431-4.322-1.183l-.31-.183-3.195.913.923-3.097-.202-.325A8.17 8.17 0 013.812 12.03c0-4.53 3.689-8.219 8.219-8.219 4.53 0 8.219 3.689 8.219 8.219 0 4.531-3.689 8.22-8.219 8.22zm4.512-6.177c-.247-.123-1.464-.723-1.691-.806-.227-.082-.392-.123-.557.123-.165.247-.639.806-.783.971-.144.165-.288.185-.535.062-.247-.123-1.042-.384-1.986-1.226-.734-.655-1.23-1.464-1.374-1.711-.144-.247-.015-.38.108-.503.111-.111.247-.288.371-.432.124-.144.165-.247.247-.412.082-.165.041-.309-.02-.432-.062-.124-.557-1.341-.763-1.836-.2-.482-.403-.417-.557-.425l-.474-.008c-.165 0-.432.062-.659.309-.227.247-.866.846-.866 2.063s.887 2.393 1.01 2.558c.124.165 1.745 2.664 4.227 3.737.59.255 1.051.408 1.41.522.593.188 1.133.162 1.56.098.476-.071 1.464-.599 1.67-1.176.206-.577.206-1.072.144-1.176-.062-.103-.227-.165-.474-.288z" />
                </svg>
              </a>
              <button
                onClick={toggleChat}
                className="chatbot-close-btn"
                title="Close chat"
                aria-label="Close chat"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.map((m) => (
              <div key={m.id} className={`chat-bubble ${m.sender}`}>
                <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>

                {/* Interactive Action Cards */}
                {m.actionType === 'appointment' && (
                  <div className="chat-action-card">
                    <a
                      href="https://his.bhaktivedantahospital.com/EHR/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chat-action-card-btn primary"
                    >
                      <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                      <span>Book Online Appointment</span>
                    </a>
                  </div>
                )}

                {m.actionType === 'emergency' && (
                  <div className="chat-action-card">
                    <a
                      href={`tel:${cleanEmergency}`}
                      className="chat-action-card-btn emergency"
                    >
                      <span className="material-symbols-outlined text-[16px]">call</span>
                      <span>Call {settings.emergencyPhone || '079 6900 2221'}</span>
                    </a>
                  </div>
                )}

                {m.actionType === 'whatsapp' && (
                  <div className="chat-action-card">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chat-action-card-btn whatsapp"
                    >
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                      <span>Open WhatsApp Chat</span>
                    </a>
                  </div>
                )}

                {m.actionType === 'doctors' && (
                  <div className="chat-action-card">
                    <a
                      href="/#doctors"
                      onClick={() => setIsChatOpen(false)}
                      className="chat-action-card-btn primary"
                    >
                      <span className="material-symbols-outlined text-[16px]">person_search</span>
                      <span>View Doctors Directory</span>
                    </a>
                  </div>
                )}

                {m.actionType === 'location' && settings.mapUrl && (
                  <div className="chat-action-card">
                    <a
                      href={settings.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chat-action-card-btn primary"
                    >
                      <span className="material-symbols-outlined text-[16px]">map</span>
                      <span>Open in Google Maps</span>
                    </a>
                  </div>
                )}

                {/* Quick Suggestion Chips attached to greeting or fallback */}
                {m.showChips && (
                  <div style={{ marginTop: '8px' }}>
                    <div className="chatbot-chips-title">Quick Topics</div>
                    <div className="chatbot-chips-grid">
                      <button
                        className="chip-btn highlight"
                        onClick={() => handleSend('Book an appointment')}
                      >
                        📅 Book Appointment
                      </button>
                      <button
                        className="chip-btn"
                        onClick={() => handleSend('Emergency contact helpline')}
                      >
                        🚨 Emergency 24/7
                      </button>
                      <button
                        className="chip-btn"
                        onClick={() => handleSend('Find doctors and specialities')}
                      >
                        👨‍⚕️ Doctors Directory
                      </button>
                      <button
                        className="chip-btn"
                        onClick={() => handleSend('Hospital address and location')}
                      >
                        📍 Hospital Address
                      </button>
                      <button
                        className="chip-btn"
                        onClick={() => handleSend('OPD timings')}
                      >
                        ⏰ OPD Timings
                      </button>
                      <button
                        className="chip-btn"
                        onClick={() => handleSend('Chat on WhatsApp')}
                      >
                        💬 WhatsApp
                      </button>
                    </div>
                  </div>
                )}

                <div className="chat-time">{m.time}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="chatbot-footer">
            <div className="chatbot-input-row">
              <input
                type="text"
                className="chatbot-input"
                placeholder="Ask a question or select a topic..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="button"
                className="chatbot-send-btn"
                onClick={() => handleSend()}
                disabled={!inputVal.trim()}
                title="Send message"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
