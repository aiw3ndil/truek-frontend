'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, Notification } from '@/services/notifications';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotificationBell() {
    const { user } = useAuth() || {};
    const { t } = useLocale();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const tr = (t as any).notifications || {};
    const unreadCount = notifications.filter(n => !n.read).length;

    const loadNotifications = async () => {
        try {
            const data = await fetchNotifications();
            setNotifications(data);
        } catch (err) {
            console.error("Failed to load notifications:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            loadNotifications();
            const interval = setInterval(loadNotifications, 10000); // Poll every 10 seconds
            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id: number, link?: string) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            if (link) {
                setIsOpen(false);
                router.push(link);
            }
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        try {
            await deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error("Failed to delete notification:", err);
        }
    };

    if (!user) return null;

    return (
        <div className="notification-bell-container" style={{ position: 'relative' }} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    position: 'relative',
                    color: 'var(--color-clay)',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                🔔
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        backgroundColor: 'var(--color-terracotta)',
                        color: 'white',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        fontSize: '0.65rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        border: '2px solid white'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    width: '320px',
                    maxHeight: '400px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    zIndex: 2000,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid #eee'
                }}>
                    <div style={{
                        padding: '1rem',
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#f9f9f9'
                    }}>
                        <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-clay)' }}>{tr.title || "Notifications"}</h4>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllAsRead} style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '0.75rem',
                                color: 'var(--color-terracotta)',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}>
                                {tr.mark_all_read || "Mark all as read"}
                            </button>
                        )}
                    </div>

                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {isLoading ? (
                            <div style={{ padding: '2rem', textAlign: 'center' }}>
                                <div className="loading-spinner" style={{ animation: 'spin 2s linear infinite' }}>⌛</div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏜️</div>
                                {tr.empty || "No notifications yet"}
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    onClick={() => handleMarkAsRead(n.id, n.link)}
                                    style={{
                                        padding: '1rem',
                                        borderBottom: '1px solid #f0f0f0',
                                        backgroundColor: n.read ? 'white' : 'rgba(214, 162, 107, 0.05)',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = n.read ? 'white' : 'rgba(214, 162, 107, 0.05)')}
                                >
                                    {!n.read && (
                                        <div style={{
                                            position: 'absolute',
                                            left: '5px',
                                            top: '20px',
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--color-terracotta)'
                                        }} />
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-clay)' }}>{n.title}</span>
                                        <button onClick={(e) => handleDelete(e, n.id)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '0.9rem' }}>×</button>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', lineHeight: '1.2' }}>{n.message}</p>
                                    <span style={{ fontSize: '0.65rem', color: '#aaa', marginTop: '0.3rem', display: 'block' }}>
                                        {new Date(n.created_at).toLocaleString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
