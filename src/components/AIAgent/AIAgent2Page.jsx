import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, FileText, Download, Upload } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import Header from '../LandingPage/Header';
import './AIAgent2Page.css';

const API_KEY = "AIzaSyDduRZiFh6oWz43BDQXPSsfU7pIuT8BNac";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

const AIAgent2Page = ({ user, onPageChange, onLogout, documentsUploaded = true }) => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { text: "Hello! I am the MANUDOCS AI Agent. Ask me anything, and I'll provide a concise, genuine answer.", sender: "ai" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatBoxRef = useRef(null);

    const addMessage = (text, sender) => {
        setMessages(prev => [...prev, { text, sender }]);
        setTimeout(() => {
            if (chatBoxRef.current) {
                chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
            }
        }, 100);
    };

    const sendMessage = async () => {
        const userText = input.trim();
        if (!userText || loading) return;

        addMessage(userText, 'user');
        setInput('');
        setLoading(true);

        try {
            const payload = {
                contents: [{ parts: [{ text: userText }] }],
                systemInstruction: {
                    parts: [{
                        text: "You are a highly precise, to-the-point AI assistant. Answer questions concisely and factually, without conversational filler or pleasantries. Your goal is to provide genuine, direct answers."
                    }]
                },
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't get a response. Please try again.";
            addMessage(aiResponse, 'ai');
        } catch (error) {
            console.error('Error sending message:', error);
            addMessage("I'm sorry, an error occurred. Please try again later.", 'ai');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                user={user}
                onPageChange={onPageChange}
                onLogout={onLogout}
                documentsUploaded={documentsUploaded}
            />

            <div className="ai2-container" style={{ position: 'relative', paddingTop: '45px' }}>

                <div style={{ position: 'absolute', top: 100, left: 20, zIndex: 10 }}>
                    <button
                        onClick={handleBackToHome}
                        style={{
                            alignItems: 'center', display: 'flex',
                            background: '#528a64',
                            color: '#fff',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#456b57';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#528a64';
                        }}
                    >
                        ← Home
                    </button>
                </div>

                <div className="ai2-header">
                    <div className="ai2-logo">
                        <img
                            src="https://i.postimg.cc/qhqjBrYN/mnuverse.jpg"
                            height="70"
                            width="60"
                            alt="Manudocs Logo"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                console.warn('Logo image failed to load');
                            }}
                        />
                    </div>
                    <div className="ai2-title">MANUDOCS AI</div>
                </div>

                <div className="ai2-chat-box" ref={chatBoxRef}>
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`ai2-message ${msg.sender === 'user' ? 'ai2-user-message' : 'ai2-ai-message'}`}
                            dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br>') }}
                        />
                    ))}
                    {loading && (
                        <div className="ai2-loading-indicator">
                            <div className="ai2-dot"></div>
                            <div className="ai2-dot"></div>
                            <div className="ai2-dot"></div>
                        </div>
                    )}
                </div>

                <div className="ai2-input-area">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                        maxLength={1000}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        style={{
                            opacity: loading || !input.trim() ? 0.6 : 1,
                            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIAgent2Page;
