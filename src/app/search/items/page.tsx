'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { fetchItems, Item } from '@/services/items';
import { useLocale } from '@/context/LocaleContext';
import ImageSlider from '@/components/ImageSlider';
import Link from 'next/link';

function SearchItemsContent() {
    const { t } = useLocale();
    const searchParams = useSearchParams();
    const query = searchParams.get('query') || '';
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function performSearch() {
            setIsLoading(true);
            try {
                const results = await fetchItems(undefined, query);
                setItems(results || []);
            } catch (error) {
                console.error("Search items failed:", error);
            } finally {
                setIsLoading(false);
            }
        }
        performSearch();
    }, [query]);

    return (
        <div className="search-results-page" style={{ backgroundColor: '#FDF8ED', minHeight: '100vh', padding: '4rem 1rem' }}>
            <div className="grid-container">
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', color: 'var(--color-clay)', fontWeight: 'bold', marginBottom: '1rem' }}>
                        Resultados para "{query}"
                    </h1>
                    <p style={{ color: 'var(--color-ochre)', fontSize: '1.2rem' }}>
                        Hemos encontrado {items.length} objetos en el bazaar
                    </p>
                    <Link href="/" style={{ color: 'var(--color-terracotta)', fontWeight: 'bold', marginTop: '1rem', display: 'inline-block', textDecoration: 'underline' }}>
                        ← Volver al Oasis
                    </Link>
                </div>

                {isLoading ? (
                    <div className="text-center" style={{ padding: '4rem 0' }}>
                        <div className="loading-spinner" style={{ fontSize: '3rem', animation: 'spin 2s linear infinite' }}>⌛</div>
                        <p style={{ fontSize: '1.2rem', marginTop: '1rem', color: 'var(--color-clay)' }}>Buscando en las dunas...</p>
                    </div>
                ) : (
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
                                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.9rem', color: 'var(--color-terracotta)', fontWeight: '600' }}>
                                                {item.user?.name || "Explorer"}
                                            </span>
                                            <button className="oasis-button" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
                                                {t.items?.trade_button || "Trade"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="cell text-center" style={{ padding: '6rem 0', width: '100%' }}>
                                <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🏜️</div>
                                <h2 style={{ color: 'var(--color-clay)', marginBottom: '1rem' }}>Vaya, no hemos encontrado nada</h2>
                                <p style={{ color: '#666', fontSize: '1.1rem' }}>Prueba con otros términos de búsqueda.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchItemsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchItemsContent />
        </Suspense>
    );
}
