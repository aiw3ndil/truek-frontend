'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { fetchItems, Item } from '@/services/items';
import { createTrade } from '@/services/trades';

interface TradeModalProps {
    receiverItem: Item;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TradeModal({ receiverItem, onClose, onSuccess }: TradeModalProps) {
    const { user } = useAuth() || {};
    const { t } = useLocale();
    const [myItems, setMyItems] = useState<Item[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const tr = (t as any).trades;

    useEffect(() => {
        async function loadMyItems() {
            if (!user) return;
            setIsLoading(true);
            try {
                const items = await fetchItems(user.id);
                // Only show available items
                setMyItems(items.filter(item => item.status === 'available') || []);
            } catch (err) {
                console.error("Failed to load your items:", err);
                setError("Could not load your items.");
            } finally {
                setIsLoading(false);
            }
        }
        loadMyItems();
    }, [user]);

    const handleConfirm = async () => {
        if (!selectedItemId || !user) return;

        setIsSubmitting(true);
        setError(null);
        try {
            await createTrade({
                receiver_id: receiverItem.user?.id || receiverItem.user_id,
                proposer_item_id: selectedItemId,
                receiver_item_id: receiverItem.id
            });
            onSuccess();
        } catch (err: any) {
            setError(err.message || "Failed to propose trade");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="trade-modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
        }} onClick={onClose}>
            <div className="trade-modal-content" style={{
                backgroundColor: '#FDF8ED',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2rem',
                position: 'relative',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }} onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'rgba(0,0,0,0.05)',
                        border: 'none',
                        fontSize: '1.8rem',
                        cursor: 'pointer',
                        color: 'var(--color-clay)',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e: any) => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
                    onMouseOut={(e: any) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                    aria-label="Close"
                >✕</button>

                <h2 style={{ color: 'var(--color-clay)', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>
                    {tr?.initiation_title || "Propose a Trade"}
                </h2>

                <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'rgba(188, 108, 37, 0.05)', borderRadius: '15px' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-ochre)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        {tr?.item_to_receive || "Item to receive"}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '10px', overflow: 'hidden' }}>
                            <img src={receiverItem.images[0]?.url || '/placeholder-item.png'} alt={receiverItem.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                            <h4 style={{ color: 'var(--color-clay)', margin: 0 }}>{receiverItem.title}</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>{tr?.receiver_label || "Receiver"}: {receiverItem.user?.name}</p>
                        </div>
                    </div>
                </div>

                <p style={{ color: 'var(--color-clay)', fontWeight: 'bold', marginBottom: '1rem' }}>
                    {tr?.select_your_item || "Select which of your treasures to offer:"}
                </p>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                        <div className="loading-spinner" style={{ fontSize: '2rem', animation: 'spin 2s linear infinite' }}>⌛</div>
                    </div>
                ) : myItems.length > 0 ? (
                    <div className="my-items-selection" style={{ display: 'grid', gap: '1rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                        {myItems.map(item => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedItemId(item.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    border: `2px solid ${selectedItemId === item.id ? 'var(--color-terracotta)' : 'var(--color-sand)'}`,
                                    backgroundColor: selectedItemId === item.id ? 'rgba(188, 108, 37, 0.05)' : 'white',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden' }}>
                                    <img src={item.images[0]?.url || '/placeholder-item.png'} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <span style={{ flex: 1, fontWeight: '600', color: 'var(--color-clay)' }}>{item.title}</span>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    border: '2px solid var(--color-clay)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {selectedItemId === item.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-terracotta)' }} />}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#FFF5F5', borderRadius: '12px', color: '#C53030' }}>
                        <p>{tr?.no_items_to_offer || "You don't have any items to offer! Create one first."}</p>
                    </div>
                )}

                {error && (
                    <div style={{ marginTop: '1rem', padding: '0.8rem', backgroundColor: '#FFF5F5', borderRadius: '8px', color: '#C53030', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <button onClick={onClose} className="button clear" style={{ flex: 1, color: 'var(--color-clay)' }}>
                        {t.items?.cancel_button || "Cancel"}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedItemId || isSubmitting}
                        className="oasis-button"
                        style={{ flex: 2, opacity: (!selectedItemId || isSubmitting) ? 0.6 : 1 }}
                    >
                        {isSubmitting ? "..." : (tr?.confirm_proposal || "Send Proposal")}
                    </button>
                </div>
            </div>
        </div>
    );
}
