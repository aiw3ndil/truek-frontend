'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { fetchUsers, UserSearchResult } from '@/services/users';
import { useLocale } from '@/context/LocaleContext';
import Link from 'next/link';

function SearchUsersContent() {
    const { t } = useLocale();
    const searchParams = useSearchParams();
    const query = searchParams.get('query') || '';
    const [users, setUsers] = useState<UserSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function performSearch() {
            setIsLoading(true);
            try {
                const results = await fetchUsers(query);
                setUsers(results || []);
            } catch (error) {
                console.error("Search users failed:", error);
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
                        Exploradores: "{query}"
                    </h1>
                    <p style={{ color: 'var(--color-ochre)', fontSize: '1.2rem' }}>
                        Hemos encontrado {users.length} aventureros en este oasis
                    </p>
                    <Link href="/" style={{ color: 'var(--color-terracotta)', fontWeight: 'bold', marginTop: '1rem', display: 'inline-block', textDecoration: 'underline' }}>
                        ← Volver al Oasis
                    </Link>
                </div>

                {isLoading ? (
                    <div className="text-center" style={{ padding: '4rem 0' }}>
                        <div className="loading-spinner" style={{ fontSize: '3rem', animation: 'spin 2s linear infinite' }}>⌛</div>
                        <p style={{ fontSize: '1.2rem', marginTop: '1rem', color: 'var(--color-clay)' }}>Buscando aventureros...</p>
                    </div>
                ) : (
                    <div className="grid-x grid-padding-x" style={{ gap: '2rem 0' }}>
                        {users.length > 0 ? (
                            users.map(user => (
                                <div key={user.id} className="cell large-4 medium-6 small-12">
                                    <div className="card-organic" style={{
                                        textAlign: 'center',
                                        height: '100%',
                                        padding: '2rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        transition: 'all 0.3s ease'
                                    }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <div style={{
                                            width: '120px',
                                            height: '120px',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--color-sand)',
                                            border: '4px solid var(--color-terracotta)',
                                            marginBottom: '1.5rem',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {user.picture ? (
                                                <img src={user.picture} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span style={{ fontSize: '3rem', color: 'var(--color-terracotta)', fontWeight: 'bold' }}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <h3 style={{ fontSize: '1.5rem', color: 'var(--color-clay)', marginBottom: '0.5rem', fontWeight: 'bold' }}>{user.name}</h3>
                                        <p style={{ color: '#888', fontStyle: 'italic', marginBottom: '1.5rem' }}>Explorer from the dunes</p>
                                        <button className="oasis-button" style={{ width: '100%', marginTop: 'auto' }}>
                                            Ver Inventario
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="cell text-center" style={{ padding: '6rem 0', width: '100%' }}>
                                <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🐫</div>
                                <h2 style={{ color: 'var(--color-clay)', marginBottom: '1rem' }}>No hay nadie con ese nombre</h2>
                                <p style={{ color: '#666', fontSize: '1.1rem' }}>Quizás se lo haya tragado una tormenta de arena...</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchUsersPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchUsersContent />
        </Suspense>
    );
}
