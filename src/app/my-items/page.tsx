'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import withAuth from '@/components/withAuth';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { fetchItems, deleteItem, Item } from '@/services/items';

function MyItemsPage() {
    const auth = useAuth();
    const { t } = useLocale();
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async (itemId: number) => {
        if (!confirm(t.items?.confirm_delete || "Are you sure?")) return;

        try {
            await deleteItem(localStorage.getItem('token') || '', itemId);
            setItems(prev => prev.filter(i => i.id !== itemId));
        } catch (err: any) {
            alert(err.message || 'Failed to delete item');
        }
    };

    useEffect(() => {
        async function loadItems() {
            if (auth && auth.user) {
                try {
                    // Assuming the backend filters by user when user_id is passed, or we might need to filter client side if API is generic
                    // Based on items.ts implementation, passing user_id as argument appends query param
                    const data = await fetchItems(auth.user.id);
                    // If the API returns all items when filtering is not fully implemented on backend, we might need client side filtering
                    // But assuming fetchItems logic holds.
                    // However, if the backend strictly uses specific params (like q[user_id_eq]), we might need to adjust.
                    // For now, trusting items.ts fetchItems implementation which uses ?user_id=...
                    setItems(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }
        }
        loadItems();
    }, [auth]);

    return (
        <div className="grid-container" style={{ padding: '2rem 0' }}>
            <div className="grid-x grid-margin-x align-center">
                <div className="cell large-10">
                    <div className="flex-container align-justify align-middle mb-2" style={{ marginBottom: '2rem' }}>
                        <h1 style={{ color: 'var(--color-clay)', margin: 0 }}>{t.items?.my_items_title || "My Items"}</h1>
                        <Link href="/items/new" className="oasis-button">
                            {t.items?.create_item_button || "Create New Item"}
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center" style={{ padding: '3rem' }}>
                            <p style={{ color: 'var(--color-clay)', fontSize: '1.2rem' }}>{t.items?.loading || "Loading..."}</p>
                        </div>
                    ) : error ? (
                        <div className="callout alert" style={{ borderRadius: '12px' }}>
                            {error}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center" style={{ padding: '3rem', background: 'rgba(255,255,255,0.5)', borderRadius: '12px' }}>
                            <p style={{ color: 'var(--color-clay)', fontSize: '1.2rem' }}>{t.items?.no_items_message || "You haven't posted any items yet."}</p>
                            <Link href="/items/new" className="oasis-button" style={{ marginTop: '1rem', display: 'inline-block' }}>
                                {t.items?.create_item_button || "Create New Item"}
                            </Link>
                        </div>
                    ) : (
                        <div className="grid-x grid-margin-x small-up-1 medium-up-2 large-up-3">
                            {items.map((item) => (
                                <div key={item.id} className="cell" style={{ marginBottom: '2rem' }}>
                                    <div className="card-organic" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{
                                            height: '200px',
                                            backgroundColor: 'var(--color-sand)',
                                            marginBottom: '1rem',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {item.images && item.images.length > 0 ? (
                                                <img src={item.images[0].url || '/placeholder-image.jpg'} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span style={{ color: 'var(--color-terracotta)', fontSize: '2rem' }}>📦</span>
                                            )}
                                        </div>
                                        <h3 style={{ fontSize: '1.2rem', color: 'var(--color-clay)', marginBottom: '0.5rem' }}>{item.title}</h3>
                                        <p style={{ color: '#666', flex: 1 }}>{item.description.substring(0, 100)}{item.description.length > 100 ? '...' : ''}</p>
                                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                            <Link href={`/items/${item.id}/edit`} className="button small expanded secondary" style={{ margin: 0, fontWeight: '600' }}>
                                                {t.items?.edit_button || "Edit"}
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="button small expanded alert"
                                                style={{ margin: 0, fontWeight: '600', backgroundColor: '#cc4b37' }}
                                            >
                                                {t.items?.delete_button || "Delete"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default withAuth(MyItemsPage);
