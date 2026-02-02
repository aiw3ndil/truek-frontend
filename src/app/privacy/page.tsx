'use client';

import { useLocale } from '@/context/LocaleContext';

export default function PrivacyPage() {
    const { t } = useLocale();

    return (
        <div className="privacy-container" style={{
            backgroundColor: '#2b1d0e',
            minHeight: '100vh',
            padding: '4rem 1rem'
        }}>
            <div className="grid-container">
                <div className="grid-x grid-padding-x align-center">
                    <div className="cell large-10">
                        <div className="card-organic" style={{ padding: '4rem' }}>
                            <h1 className="display-font" style={{ fontSize: '3rem', marginBottom: '2rem', color: 'var(--color-clay)' }}>Privacidad</h1>
                            <div style={{ borderTop: '2px solid var(--color-sand)', paddingTop: '2rem' }}>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--color-terracotta)' }}>Política de Privacidad</h2>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.9 }}>
                                    Tu privacidad es nuestra prioridad absoluta. En este bazar del desierto, tus datos están protegidos como un tesoro escondido.
                                    No compartimos información con terceros ni rastreamos tus movimientos comerciales.
                                </p>
                                {/* Fallback to terms paragraph if specific privacy translation is missing or keep it general */}
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.9, marginTop: '1.5rem' }}>
                                    Implementamos las medidas de seguridad más avanzadas para garantizar que tu experiencia sea segura y privada.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
