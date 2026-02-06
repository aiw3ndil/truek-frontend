'use client';

import { useState } from 'react';
import { ItemImage } from '@/services/items';

interface ImageSliderProps {
    images: ItemImage[];
    alt: string;
}

export default function ImageSlider({ images, alt }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--color-sand)',
                color: 'var(--color-terracotta)',
                fontSize: '2rem'
            }}>
                📦
            </div>
        );
    }

    const nextSlide = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: '8px'
        }}>
            <img
                src={images[currentIndex].url || '/placeholder-image.jpg'}
                alt={`${alt} - ${currentIndex + 1}`}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'opacity 0.3s ease-in-out'
                }}
            />

            {images.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        style={{
                            position: 'absolute',
                            left: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(255, 255, 255, 0.7)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-clay)',
                            fontWeight: 'bold',
                            zIndex: 2,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        ❮
                    </button>
                    <button
                        onClick={nextSlide}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(255, 255, 255, 0.7)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-clay)',
                            fontWeight: 'bold',
                            zIndex: 2,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        ❯
                    </button>
                    <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                    }}>
                        {currentIndex + 1} / {images.length}
                    </div>
                </>
            )}
        </div>
    );
}
