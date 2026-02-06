'use client';

import Image from 'next/image';
import { useLocale } from '@/context/LocaleContext';
import { useState, useEffect } from 'react';
import { fetchItems, Item } from '@/services/items';
import ImageSlider from '@/components/ImageSlider';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { t } = useLocale();
  const router = useRouter();
  const [searchToggle, setSearchToggle] = useState<'objects' | 'users'>('objects');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);

  useEffect(() => {
    async function getItems() {
      setIsLoadingItems(true);
      try {
        const data = await fetchItems();
        setItems(data || []);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setIsLoadingItems(false);
      }
    }
    getItems();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (searchToggle === 'objects') {
      router.push(`/search/items?query=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/search/users?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="landing-page" style={{ backgroundColor: '#2b1d0e', minHeight: '100vh', width: '100%' }}>
      {/* Hero Section */}
      <section className="hero-section" style={{
        position: 'relative',
        padding: '6rem 1rem',
        textAlign: 'center',
        background: '#2b1d0e',
        borderRadius: '0 0 100px 100px',
        overflow: 'hidden',
        marginBottom: '1rem'
      }}>
        <div className="grid-container">
          <div className="grid-x grid-padding-x align-center">
            <div className="cell large-10">
              <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', color: 'var(--color-sand)' }}>
                {t.page.title}
              </h1>
              <p style={{ fontSize: '1.3rem', marginBottom: '3.5rem', color: 'var(--color-sand)', opacity: 0.9, maxWidth: '800px', margin: '0 auto 3.5rem' }}>
                {t.page.description}
              </p>

              {/* Refined Segmented Search */}
              <form onSubmit={handleSearch} className="search-container card-organic" style={{
                maxWidth: '750px',
                margin: '0 auto',
                textAlign: 'left',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
                padding: '2.5rem',
                border: 'none',
                borderRadius: '30px'
              }}>
                <div className="search-toggle" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', borderBottom: '2px solid var(--color-sand)', paddingBottom: '1.2rem' }}>
                  <button
                    type="button"
                    onClick={() => setSearchToggle('objects')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontWeight: '800',
                      fontSize: '1.1rem',
                      color: searchToggle === 'objects' ? 'var(--color-terracotta)' : 'var(--color-ochre)',
                      borderBottom: searchToggle === 'objects' ? '4px solid var(--color-terracotta)' : 'none',
                      cursor: 'pointer',
                      padding: '0.5rem 0',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Objetos activos
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchToggle('users')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontWeight: '800',
                      fontSize: '1.1rem',
                      color: searchToggle === 'users' ? 'var(--color-terracotta)' : 'var(--color-ochre)',
                      borderBottom: searchToggle === 'users' ? '4px solid var(--color-terracotta)' : 'none',
                      cursor: 'pointer',
                      padding: '0.5rem 0',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Usuarios Ofreciendo/Buscando
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchToggle === 'objects' ? "Escribe qué buscas..." : "Escribe quién buscas..."}
                    style={{
                      flex: 1,
                      minWidth: '250px',
                      padding: '1.3rem',
                      fontSize: '1.2rem',
                      outline: 'none',
                      border: '1px solid #ddd'
                    }}
                  />
                  <button type="submit" className="oasis-button" style={{ padding: '0 3rem', fontSize: '1.1rem' }}>
                    {searchToggle === 'objects' ? 'Buscar Objetos' : 'Buscar Usuarios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section" style={{ padding: '0 1rem', backgroundColor: '#2b1d0e' }}>
        <div className="grid-container">
          <h2 style={{
            textAlign: 'center',
            fontSize: '3rem',
            marginBottom: '4rem',
            color: 'var(--color-sand)',
            fontWeight: 'bold'
          }}>
            {t.how_it_works.section_title}
          </h2>

          <div className="grid-x grid-padding-x align-center" style={{ gap: '2rem', marginBottom: '3rem' }}>
            {/* Step 1 */}
            <div className="cell large-4 medium-6 small-12">
              <div className="card-organic" style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  fontSize: '5rem',
                  marginBottom: '1.5rem',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }}>
                  📤
                </div>
                <h3 style={{
                  fontSize: '1.8rem',
                  marginBottom: '1rem',
                  color: 'var(--color-terracotta)',
                  fontWeight: 'bold'
                }}>
                  {t.how_it_works.step1_title}
                </h3>
                <p style={{
                  fontSize: '1.1rem',
                  color: 'var(--color-clay)',
                  lineHeight: '1.6'
                }}>
                  {t.how_it_works.step1_description}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="cell large-4 medium-6 small-12">
              <div className="card-organic" style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  fontSize: '5rem',
                  marginBottom: '1.5rem',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }}>
                  🔍
                </div>
                <h3 style={{
                  fontSize: '1.8rem',
                  marginBottom: '1rem',
                  color: 'var(--color-terracotta)',
                  fontWeight: 'bold'
                }}>
                  {t.how_it_works.step2_title}
                </h3>
                <p style={{
                  fontSize: '1.1rem',
                  color: 'var(--color-clay)',
                  lineHeight: '1.6'
                }}>
                  {t.how_it_works.step2_description}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="cell large-4 medium-6 small-12">
              <div className="card-organic" style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  fontSize: '5rem',
                  marginBottom: '1.5rem',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }}>
                  🤝
                </div>
                <h3 style={{
                  fontSize: '1.8rem',
                  marginBottom: '1rem',
                  color: 'var(--color-terracotta)',
                  fontWeight: 'bold'
                }}>
                  {t.how_it_works.step3_title}
                </h3>
                <p style={{
                  fontSize: '1.1rem',
                  color: 'var(--color-clay)',
                  lineHeight: '1.6'
                }}>
                  {t.how_it_works.step3_description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="feed-section" style={{ padding: '6rem 1rem', backgroundColor: '#FDF8ED', borderRadius: '100px 100px 0 0' }}>
        <div className="grid-container">
          <h2 style={{
            textAlign: 'center',
            fontSize: '3rem',
            marginBottom: '4rem',
            color: 'var(--color-clay)',
            fontWeight: 'bold'
          }}>
            {t.items?.discover_treasures_title || "Discover Treasures"}
          </h2>

          {isLoadingItems ? (
            <div className="text-center" style={{ color: 'var(--color-clay)', padding: '4rem 0' }}>
              <div className="loading-spinner" style={{ fontSize: '3rem', animation: 'spin 2s linear infinite' }}>⌛</div>
              <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>{t.items?.loading || "Loading artifacts..."}</p>
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
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      cursor: 'pointer'
                    }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-10px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
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
                <div className="cell text-center" style={{ padding: '4rem 0', width: '100%' }}>
                  <p style={{ fontSize: '1.2rem', color: 'var(--color-clay)', fontStyle: 'italic' }}>
                    {t.items?.no_items_message || "The bazaar is quiet... for now."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Bazaar Image Section */}
      <section style={{
        width: '100%',
        height: '400px',
        overflow: 'hidden',
        margin: 0,
        padding: 0
      }}>
        <img
          src="/bazaar.png"
          alt={t.page.bazaar_alt}
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



