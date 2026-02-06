'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { createItem } from '@/services/items';

function CreateItemPage() {
    const auth = useAuth();
    const router = useRouter();
    const { t } = useLocale();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    // Use stable IDs for keys to prevent input recreation and loss of focus/file
    const [imageFields, setImageFields] = useState<{ id: number; file: File | null }[]>([{ id: Date.now(), file: null }]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const addImageField = () => {
        setImageFields([...imageFields, { id: Date.now(), file: null }]);
    };

    const removeImageField = (index: number) => {
        const newFields = [...imageFields];
        newFields.splice(index, 1);
        setImageFields(newFields);
    };

    const handleFileChange = (index: number, file: File | null) => {
        const newFields = [...imageFields];
        newFields[index].file = file;
        setImageFields(newFields);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth || !auth.user) return;

        setIsLoading(true);
        setMessage(null);

        try {
            // Filter out null files
            const validImages = imageFields.map(f => f.file).filter((f): f is File => f !== null);

            await createItem(localStorage.getItem('token') || '', {
                title,
                description,
                status: 'available',
                images: validImages
            });
            router.push('/my-items');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to create item' });
            setIsLoading(false);
        }
    };

    return (
        <div className="grid-container" style={{ padding: '2rem 0' }}>
            <div className="grid-x grid-margin-x align-center">
                <div className="cell medium-8 large-6">
                    <div className="card-organic">
                        <h2 className="text-center mb-2" style={{ color: 'var(--color-clay)', marginBottom: '1.5rem' }}>{t.items?.create_item_title || "Create New Item"}</h2>

                        {message && (
                            <div className={`callout ${message.type === 'success' ? 'success' : 'alert'}`} style={{ borderRadius: '12px', border: 'none', background: message.type === 'success' ? 'rgba(72, 192, 178, 0.2)' : 'rgba(188, 108, 37, 0.2)', color: 'var(--color-clay)' }}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="grid-y grid-margin-y">
                                <div className="cell">
                                    <label style={{ color: 'var(--color-clay)', fontWeight: '600' }}>
                                        {t.items?.item_title_label || "Title"}
                                        <input
                                            type="text"
                                            className="search-input"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            style={{ marginTop: '0.5rem' }}
                                        />
                                    </label>
                                </div>
                                <div className="cell">
                                    <label style={{ color: 'var(--color-clay)', fontWeight: '600' }}>
                                        {t.items?.item_description_label || "Description"}
                                        <textarea
                                            className="search-input"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                            rows={4}
                                            style={{ marginTop: '0.5rem', resize: 'vertical' }}
                                        />
                                    </label>
                                </div>
                                <div className="cell">
                                    <label style={{ color: 'var(--color-clay)', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                                        {t.items?.item_image_label || "Images"}
                                    </label>

                                    <div className="grid-x grid-margin-x">
                                        {imageFields.map((field, index) => (
                                            <div key={field.id} className="cell small-6 medium-4 large-3 mb-2" style={{ position: 'relative' }}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(index, e.target.files ? e.target.files[0] : null)}
                                                    style={{ fontSize: '0.8rem', overflow: 'hidden' }}
                                                />
                                                {index > 0 && (
                                                    <button type="button" onClick={() => removeImageField(index)} style={{ position: 'absolute', right: '0', top: '-10px', background: 'var(--color-terracotta)', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', lineHeight: '20px', textAlign: 'center', cursor: 'pointer', border: 'none', fontSize: '0.9rem' }}>
                                                        &times;
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        <div className="cell small-6 medium-4 large-3 mb-2">
                                            <button
                                                type="button"
                                                onClick={addImageField}
                                                style={{
                                                    width: '100%',
                                                    height: '42px',
                                                    border: '2px dashed var(--color-terracotta)',
                                                    borderRadius: '8px',
                                                    background: 'rgba(188, 108, 37, 0.1)',
                                                    color: 'var(--color-terracotta)',
                                                    fontSize: '1.5rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="cell text-center" style={{ marginTop: '2rem' }}>
                                    <button type="submit" className="oasis-button" disabled={isLoading}>
                                        {isLoading ? (t.items?.saving || "Saving...") : (t.items?.create_submit_button || "Create Item")}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withAuth(CreateItemPage);
