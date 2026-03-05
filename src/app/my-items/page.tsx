'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ImageSlider from '@/components/ImageSlider';
import withAuth from '@/components/withAuth';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { searchItems, deleteItem, Item } from '@/services/items';

import { toast } from 'sonner';

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
            toast.error(err.message || 'Failed to delete item');
        }
    };

    useEffect(() => {
        async function loadItems() {
            if (auth && auth.user) {
                try {
                    const data = await searchItems(auth.user.id);
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

    // Group items by region
    const groupedItems = useMemo(() => {
        const groups: Record<string, Item[]> = {};
        items.forEach(item => {
            const region = item.region || 'Unknown';
            if (!groups[region]) {
                groups[region] = [];
            }
            groups[region].push(item);
        });
        return groups;
    }, [items]);

    const regionNames: Record<string, string> = {
        'es': 'España',
        'fi': 'Finlandia',
        'en': 'International / English',
        'Unknown': 'Sin región / Desconocido'
    };

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
                        Object.entries(groupedItems).map(([region, regionItems]) => (
                            <div key={region} style={{ marginBottom: '3rem' }}>
                                <div style={{ borderBottom: '2px solid var(--color-sand)', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
                                    <h2 style={{ color: 'var(--color-terracotta)', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                                        📍 {regionNames[region] || region}
                                    </h2>
                                    <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>
                                        {regionItems.length} {regionItems.length === 1 ? 'objeto' : 'objetos'} en esta región
                                    </p>
                                </div>
                                
                                <div className="grid-x grid-margin-x small-up-1 medium-up-2 large-up-3">
                                    {regionItems.map((item) => (
                                        <div key={item.id} className="cell" style={{ marginBottom: '2rem' }}>
                                            <div className="card-organic" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                <div style={{
                                                    height: '200px',
                                                    backgroundColor: 'var(--color-sand)',
                                                    marginBottom: '1rem',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <ImageSlider images={item.images} alt={item.title} />
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
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default withAuth(MyItemsPage);
