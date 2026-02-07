'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { fetchMessages, sendMessage, Message } from '@/services/messages';

interface TradeChatProps {
    tradeId: number;
    onClose: () => void;
}

export default function TradeChat({ tradeId, onClose }: TradeChatProps) {
    const { user } = useAuth() || {};
    const { t } = useLocale();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const chatTr = (t as any).trades?.chat || {};

    const loadMessages = async () => {
        try {
            const data = await fetchMessages(tradeId);
            setMessages(data);
            setIsLoading(false);
        } catch (err) {
            console.error("Failed to load messages:", err);
        }
    };

    useEffect(() => {
        loadMessages();
        // Poll for new messages every 5 seconds
        const interval = setInterval(loadMessages, 5000);
        return () => clearInterval(interval);
    }, [tradeId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        try {
            await sendMessage(tradeId, newMessage);
            setNewMessage('');
            loadMessages();
        } catch (err: any) {
            alert(err.message || "Failed to send message");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="trade-chat-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(43, 29, 14, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <div className="trade-chat-container" style={{
                width: '100%',
                maxWidth: '500px',
                height: '80vh',
                backgroundColor: '#FDF8ED',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                border: '2px solid var(--color-ochre)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--color-clay)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h3 style={{ margin: 0, color: 'white' }}>{chatTr.title || "Explorer Chat"}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                {/* Messages Area */}
                <div ref={scrollRef} style={{
                    flex: 1,
                    padding: '1.5rem',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    {isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <div className="loading-spinner" style={{ fontSize: '2rem', animation: 'spin 2s linear infinite' }}>⌛</div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
                            {chatTr.no_messages || "No messages yet. Say hello!"}
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.sender.id === Number(user?.id);
                            return (
                                <div key={msg.id} style={{
                                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: isMe ? 'flex-end' : 'flex-start'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '0.3rem'
                                    }}>
                                        {!isMe && msg.sender.picture && (
                                            <img src={msg.sender.picture} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                                        )}
                                        <span style={{ fontSize: '0.7rem', color: '#666' }}>{msg.sender.name}</span>
                                    </div>
                                    <div style={{
                                        padding: '0.8rem 1.2rem',
                                        borderRadius: isMe ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                                        backgroundColor: isMe ? 'var(--color-terracotta)' : 'white',
                                        color: isMe ? 'white' : 'var(--color-clay)',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                        border: isMe ? 'none' : '1px solid #eee'
                                    }}>
                                        {msg.content}
                                    </div>
                                    <span style={{ fontSize: '0.6rem', color: '#999', marginTop: '0.3rem' }}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} style={{
                    padding: '1.5rem',
                    backgroundColor: 'white',
                    display: 'flex',
                    gap: '0.8rem',
                    borderTop: '1px solid #eee'
                }}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={chatTr.placeholder || "Write a message..."}
                        style={{
                            flex: 1,
                            padding: '0.8rem 1.2rem',
                            borderRadius: '30px',
                            border: '1px solid #ddd',
                            fontSize: '0.9rem'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="oasis-button"
                        style={{
                            padding: '0.8rem 1.5rem',
                            borderRadius: '30px',
                            margin: 0,
                            opacity: (!newMessage.trim() || isSending) ? 0.6 : 1
                        }}
                    >
                        {chatTr.send || "Send"}
                    </button>
                </form>
            </div>
        </div>
    );
}
