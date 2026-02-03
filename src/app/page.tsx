'use client';

import Image from 'next/image';
import { useLocale } from '@/context/LocaleContext';
import { useState } from 'react';

export default function Home() {
  const { t } = useLocale();
  const [searchToggle, setSearchToggle] = useState<'objects' | 'users'>('objects');

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
        marginBottom: '2rem'
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
              <div className="search-container card-organic" style={{
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
                  <button className="oasis-button" style={{ padding: '0 3rem', fontSize: '1.1rem' }}>
                    {searchToggle === 'objects' ? 'Buscar Objetos' : 'Buscar Usuarios'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section" style={{ padding: '4rem 1rem', backgroundColor: '#2b1d0e' }}>
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

          <div className="grid-x grid-padding-x align-center" style={{ gap: '2rem' }}>
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
    </div>
  );
}



