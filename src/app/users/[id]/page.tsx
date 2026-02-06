'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { fetchItems, Item } from '@/services/items';
import { fetchUserById, UserSearchResult } from '@/services/users';
import { useLocale } from '@/context/LocaleContext';
import ImageSlider from '@/components/ImageSlider';
import Link from 'next/link';

export default function UserInventoryPage() {
    const { id } = useParams();
    const { t } = useLocale();
    const [user, setUser] = useState<UserSearchResult | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadInventory() {
            if (!id) return;
            setIsLoading(true);
            try {
                const [userData, itemsData] = await Promise.all([
                    fetchUserById(id as string),
                    fetchItems(id as string)
                ]);
                setUser(userData);
                setItems(itemsData || []);
            } catch (error) {
                console.error("Failed to load inventory:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadInventory();
    }, [id]);

    if (isLoading) {
        const inv = (t as any).inventory;
        return (
            <div className="search-results-page" style={{ backgroundColor: '#FDF8ED', minHeight: '100vh', padding: '4rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                    <div className="loading-spinner" style={{ fontSize: '3rem', animation: 'spin 2s linear infinite' }}>⌛</div>
                    <p style={{ fontSize: '1.2rem', marginTop: '1rem', color: 'var(--color-clay)' }}>
                        {inv?.loading_user || "Finding explorer..."}
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        const s = (t as any).search;
        return (
            <div className="search-results-page" style={{ backgroundColor: '#FDF8ED', minHeight: '100vh', padding: '4rem 1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '1.5rem', color: 'var(--color-clay)' }}>
                    {s?.no_users_found || "Explorer not found"}
                </p>
                <Link href="/" style={{ color: 'var(--color-terracotta)', textDecoration: 'underline' }}>
                    {s?.back_to_oasis || "Back to the Oasis"}
                </Link>
            </div>
        );
    }

    const inv = (t as any).inventory;

    return (
        <div className="inventory-page" style={{ backgroundColor: '#FDF8ED', minHeight: '100vh' }}>
            {/* Header Profile Section */}
            <section style={{
                backgroundColor: '#2b1d0e',
                padding: '6rem 1rem',
                borderRadius: '0 0 100px 100px',
                textAlign: 'center',
                color: 'var(--color-sand)'
            }}>
                <div className="grid-container">
                    <div style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-sand)',
                        border: '6px solid var(--color-terracotta)',
                        margin: '0 auto 2rem',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {user.picture ? (
                            <img src={user.picture} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ fontSize: '4rem', color: 'var(--color-terracotta)', fontWeight: 'bold' }}>
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        {inv?.title?.replace('{name}', user.name) || `Inventory of ${user.name}`}
                    </h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                        {inv?.items_count?.replace('{count}', items.length.toString()) || `${items.length} items found`}
                    </p>
                    <Link href="/" style={{ color: 'var(--color-sand)', fontWeight: 'bold', marginTop: '1.5rem', display: 'inline-block', opacity: 0.8 }}>
                        {inv?.back_link ? `← ${inv.back_link}` : "← Back to the Oasis"}
                    </Link>
                </div>
            </section>

            {/* Items Section */}
            <section style={{ padding: '6rem 1rem' }}>
                <div className="grid-container">
                    <div className="grid-x grid-padding-x" style={{ gap: '2rem 0' }}>
                        {items.length > 0 ? (
                            items.map(item => (
                                <div key={item.id} className="cell large-4 medium-6 small-12">
                                    <div className="card-organic" style={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <div style={{ height: '250px', marginBottom: '1.5rem', borderRadius: '15px', overflow: 'hidden' }}>
                                            <ImageSlider images={item.images} alt={item.title} />
                                        </div>
                                        <h3 style={{ fontSize: '1.5rem', color: 'var(--color-clay)', marginBottom: '0.8rem', fontWeight: 'bold' }}>{item.title}</h3>
                                        <p style={{ color: '#666', flex: 1, lineHeight: '1.5' }}>
                                            {item.description.length > 120 ? `${item.description.substring(0, 120)}...` : item.description}
                                        </p>
                                        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                                            <button className="oasis-button" style={{ padding: '0.7rem 2rem' }}>
                                                {t.items?.trade_button || "Trade"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="cell text-center" style={{ padding: '4rem 0', width: '100%' }}>
                                <p style={{ fontSize: '1.2rem', color: 'var(--color-clay)', fontStyle: 'italic' }}>
                                    {inv?.no_items || "Este explorador aún no ha encontrado tesoros."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Bazaar Image Section */}
            <section style={{
                width: '100%',
                height: '300px',
                overflow: 'hidden',
                marginTop: '2rem'
            }}>
                <img
                    src="/bazaar.png"
                    alt={inv?.inventory_alt || "Bazaar"}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        filter: 'sepia(0.2)'
                    }}
                />
            </section>
        </div>
    );
}
