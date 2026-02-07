'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { fetchTrades, updateTradeAction, Trade, TradeStatus } from '@/services/trades';
import withAuth from '@/components/withAuth';
import Link from 'next/link';
import TradeChat from '@/components/TradeChat';

function TradesDashboard() {
    const { user } = useAuth() || {};
    const { t } = useLocale();
    const [trades, setTrades] = useState<Trade[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [activeTradeChatId, setActiveTradeChatId] = useState<number | null>(null);

    const tr = (t as any).trades;

    const loadTrades = async () => {
        setIsLoading(true);
        try {
            const data = await fetchTrades(statusFilter);
            setTrades(data || []);
        } catch (err) {
            console.error("Failed to load trades:", err);
            setError("Could not load trades.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTrades();
    }, [statusFilter]);

    const handleAction = async (id: number, actionType: 'accept' | 'reject' | 'cancel' | 'complete') => {
        try {
            await updateTradeAction(id, actionType);
            loadTrades(); // Refresh list
        } catch (err: any) {
            alert(err.message || "Action failed");
        }
    };

    const StatusBadge = ({ status }: { status: TradeStatus }) => {
        const colors: Record<TradeStatus, string> = {
            pending: '#B8860B',
            accepted: '#2E8B57',
            rejected: '#CD5C5C',
            cancelled: '#808080',
            completed: '#BC6C25'
        };
        return (
            <span style={{
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                backgroundColor: `${colors[status]}22`,
                color: colors[status],
                border: `1px solid ${colors[status]}44`
            }}>
                {tr?.[`status_${status}`] || status}
            </span>
        );
    };

    const TradeCard = ({ trade }: { trade: Trade }) => {
        const isIncoming = trade.receiver.id === Number(user?.id);

        return (
            <div className="card-organic" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                        <StatusBadge status={trade.status} />
                        <span style={{ marginLeft: '1rem', fontSize: '0.85rem', color: '#888' }}>
                            {new Date(trade.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    {isIncoming && trade.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => handleAction(trade.id, 'accept')} className="oasis-button" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                                {tr?.action_accept || "Accept"}
                            </button>
                            <button onClick={() => handleAction(trade.id, 'reject')} className="button alert" style={{ margin: 0, padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                                {tr?.action_reject || "Reject"}
                            </button>
                        </div>
                    )}
                    {!isIncoming && trade.status === 'pending' && (
                        <button onClick={() => handleAction(trade.id, 'cancel')} className="button warning" style={{ margin: 0, padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                            {tr?.action_cancel || "Cancel"}
                        </button>
                    )}
                    {trade.status === 'accepted' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => setActiveTradeChatId(trade.id)} className="oasis-button" style={{ padding: '0.4rem 1.2rem', fontSize: '0.8rem', backgroundColor: 'var(--color-ochre)' }}>
                                💬 {tr?.action_chat || "Chat"}
                            </button>
                            <button onClick={() => handleAction(trade.id, 'complete')} className="oasis-button" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                                {tr?.action_complete || "Complete"}
                            </button>
                        </div>
                    )}
                    {trade.status === 'completed' && (
                        <button onClick={() => setActiveTradeChatId(trade.id)} className="oasis-button" style={{ padding: '0.4rem 1.2rem', fontSize: '0.8rem', backgroundColor: 'var(--color-ochre)' }}>
                            💬 {tr?.action_chat || "Chat"}
                        </button>
                    )}
                </div>

                <div className="grid-x grid-margin-x align-middle">
                    {/* Proposer Item */}
                    <div className="cell small-12 medium-5">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img src={trade.proposer_item.images?.[0]?.url || '/placeholder-item.png'} alt="" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                            <div>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-ochre)', fontWeight: 'bold' }}>{tr?.item_to_offer || "Offered"}</p>
                                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-clay)' }}>{trade.proposer_item.title}</h4>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>{tr?.proposer_label || "By"}: {trade.proposer.name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="cell small-12 medium-2 text-center" style={{ padding: '1rem 0' }}>
                        <span style={{ fontSize: '1.5rem' }}>↔️</span>
                    </div>

                    {/* Receiver Item */}
                    <div className="cell small-12 medium-5">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexDirection: 'row-reverse', textAlign: 'right' }}>
                            <img src={trade.receiver_item.images?.[0]?.url || '/placeholder-item.png'} alt="" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                            <div>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-ochre)', fontWeight: 'bold' }}>{tr?.item_to_receive || "Requested"}</p>
                                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-clay)' }}>{trade.receiver_item.title}</h4>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>{tr?.receiver_label || "To"}: {trade.receiver.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="trades-dashboard-page" style={{ backgroundColor: '#FDF8ED', minHeight: '100vh', padding: '4rem 1rem' }}>
            <div className="grid-container">
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', color: 'var(--color-clay)', fontWeight: 'bold', marginBottom: '1rem' }}>
                        {tr?.dashboard_title || "My Trades"}
                    </h1>
                    <Link href="/" style={{ color: 'var(--color-terracotta)', fontWeight: 'bold', textDecoration: 'underline' }}>
                        {t.search?.back_to_oasis || "Back to the Oasis"}
                    </Link>
                </div>

                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ maxWidth: '200px', borderRadius: '8px', border: '1px solid var(--color-sand)' }}
                    >
                        <option value="">{t.items?.all_status || "All Statuses"}</option>
                        <option value="pending">{tr?.status_pending || "Pending"}</option>
                        <option value="accepted">{tr?.status_accepted || "Accepted"}</option>
                        <option value="completed">{tr?.status_completed || "Completed"}</option>
                        <option value="rejected">{tr?.status_rejected || "Rejected"}</option>
                        <option value="cancelled">{tr?.status_cancelled || "Cancelled"}</option>
                    </select>
                </div>

                {isLoading ? (
                    <div className="text-center" style={{ padding: '4rem 0' }}>
                        <div className="loading-spinner" style={{ fontSize: '3rem', animation: 'spin 2s linear infinite' }}>⌛</div>
                    </div>
                ) : trades.length > 0 ? (
                    <div className="trades-list">
                        {trades.map(trade => (
                            <TradeCard key={trade.id} trade={trade} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center" style={{ padding: '6rem 0' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🏜️</div>
                        <h2 style={{ color: 'var(--color-clay)' }}>
                            {tr?.no_trades || "No active trades in this oasis yet."}
                        </h2>
                    </div>
                )}
            </div>

            {activeTradeChatId && (
                <TradeChat
                    tradeId={activeTradeChatId}
                    onClose={() => setActiveTradeChatId(null)}
                />
            )}
        </div>
    );
}

export default withAuth(TradesDashboard);
