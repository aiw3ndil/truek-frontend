'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { fetchItem, updateItem, Item } from '@/services/items';

function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const auth = useAuth();
    const router = useRouter();
    const { t } = useLocale();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageFields, setImageFields] = useState<{ id: number; file: File | null }[]>([{ id: Date.now(), file: null }]);
    const [currentItem, setCurrentItem] = useState<Item | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
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

    useEffect(() => {
        async function loadItem() {
            try {
                const item = await fetchItem(id);
                setCurrentItem(item);
                setTitle(item.title);
                setDescription(item.description);
                // Only load data if user is owner. But the endpoint should technically allow viewing.
                // The protection is mainly on update.
                if (auth?.user && item.user_id !== parseInt(auth.user.id) && item.user?.id !== parseInt(auth.user.id)) {
                    // Basic frontend check, backend handles authorize_item_owner
                    setMessage({ type: 'error', text: 'Unauthorized' });
                    setTimeout(() => router.push('/my-items'), 2000);
                }
            } catch (error: any) {
                setMessage({ type: 'error', text: error.message || 'Failed to load item' });
            } finally {
                setIsLoading(false);
            }
        }
        if (auth && auth.user) {
            loadItem();
        }
    }, [id, auth, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth || !auth.user) return;

        setIsSaving(true);
        setMessage(null);

        try {
            const validImages = imageFields.map(f => f.file).filter((f): f is File => f !== null);

            await updateItem(localStorage.getItem('token') || '', id, {
                title,
                description,
                status: currentItem?.status || 'available',
                images: validImages
                // We are NOT handling image deletion in this simple UI yet, just adding new ones or updating text
            });
            setMessage({ type: 'success', text: 'Item updated successfully!' });
            // Reload item data to show new image if added? or redirect?
            setTimeout(() => router.push('/my-items'), 1500);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update item' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="text-center p-5">Loading...</div>;

    return (
        <div className="grid-container" style={{ padding: '2rem 0' }}>
            <div className="grid-x grid-margin-x align-center">
                <div className="cell medium-8 large-6">
                    <div className="card-organic">
                        <h2 className="text-center mb-2" style={{ color: 'var(--color-clay)', marginBottom: '1.5rem' }}>Edit Item</h2>

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
                                    <p style={{ fontWeight: '600', color: 'var(--color-clay)' }}>Current Images:</p>
                                    {currentItem?.images && currentItem.images.length > 0 ? (
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {currentItem.images.map(img => (
                                                <img key={img.id} src={img.url || '/placeholder-image.jpg'} alt="Item" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                                            ))}
                                        </div>
                                    ) : <p style={{ fontStyle: 'italic', color: '#888' }}>No images</p>}
                                </div>
                                <div className="cell">
                                    <label style={{ color: 'var(--color-clay)', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                                        Add New Images
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
                                    <button type="submit" className="oasis-button" disabled={isSaving}>
                                        {isSaving ? (t.items?.loading || "Saving...") : "Update Item"}
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

export default withAuth(EditItemPage);
