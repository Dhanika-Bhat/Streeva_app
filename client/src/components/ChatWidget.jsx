import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { API } from '../context/AuthContext';
import './ChatWidget.css';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! 👋 Welcome to Streeva! I'm your AI assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEnd = useRef(null);

    useEffect(() => {
        messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const res = await API.post('/chat', {
                message: userMsg,
                history: messages.map(m => ({ role: m.role, content: m.content })),
            });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again! 😊" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-widget">
            {isOpen && (
                <div className="chat-panel glass">
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <Bot size={20} />
                            <div>
                                <span className="chat-title">Streeva Assistant</span>
                                <span className="chat-status">● Online</span>
                            </div>
                        </div>
                        <button className="chat-close" onClick={() => setIsOpen(false)}><X size={18} /></button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`chat-msg ${msg.role}`}>
                                <div className="chat-msg-icon">
                                    {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                                </div>
                                <div className="chat-msg-content markdown-body">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="chat-msg assistant">
                                <div className="chat-msg-icon"><Bot size={16} /></div>
                                <div className="chat-msg-content typing">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEnd} />
                    </div>

                    <div className="chat-input-area">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            placeholder="Ask me anything..."
                            className="chat-input"
                        />
                        <button onClick={sendMessage} className="chat-send" disabled={loading || !input.trim()}>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}

            <button className="chat-fab" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>
        </div>
    );
}
