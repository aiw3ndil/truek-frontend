import { API_URL } from './auth';

export interface ItemImage {
    id: number;
    url: string | null;
}

export interface Item {
    id: number;
    title: string;
    description: string;
    status: string;
    user_id: number;
    user?: {
        id: number;
        name: string;
        picture: string | null;
    };
    created_at: string;
    updated_at: string;
    images: ItemImage[];
}

export async function searchItems(userId?: number | string, query?: string, region?: string): Promise<Item[]> {
    const url = new URL(`${API_URL}/items`);
    if (userId) {
        url.searchParams.append('user_id', userId.toString());
    }
    if (query) {
        url.searchParams.append('query', query);
    }
    if (region) {
        url.searchParams.append('region', region);
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error('Failed to fetch items');
    }
    return response.json();
}

export async function fetchItem(id: string): Promise<Item> {
    const response = await fetch(`${API_URL}/items/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch item');
    }
    return response.json();
}

export async function createItem(token: string, data: { title: string; description: string; status: string; images: File[] }): Promise<Item> {
    const formData = new FormData();
    formData.append('item[title]', data.title);
    formData.append('item[description]', data.description);
    formData.append('item[status]', data.status);

    data.images.forEach((image, index) => {
        formData.append(`item[item_images_attributes][${index}][file]`, image);
        formData.append(`item[item_images_attributes][${index}][position]`, index.toString());
    });

    const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors ? errorData.errors.join(', ') : 'Failed to create item');
    }
    return response.json();
}

export async function updateItem(token: string, id: string | number, data: { title?: string; description?: string; status?: string; images?: File[]; imagesToDelete?: number[] }): Promise<Item> {
    const formData = new FormData();
    if (data.title) formData.append('item[title]', data.title);
    if (data.description) formData.append('item[description]', data.description);
    if (data.status) formData.append('item[status]', data.status);

    let imageIndex = 0;
    if (data.images) {
        data.images.forEach((image) => {
            formData.append(`item[item_images_attributes][${imageIndex}][file]`, image);
            formData.append(`item[item_images_attributes][${imageIndex}][position]`, imageIndex.toString());
            imageIndex++;
        });
    }

    if (data.imagesToDelete) {
        data.imagesToDelete.forEach((imageId) => {
            formData.append(`item[item_images_attributes][${imageIndex}][id]`, imageId.toString());
            formData.append(`item[item_images_attributes][${imageIndex}][_destroy]`, '1');
            imageIndex++;
        });
    }

    const response = await fetch(`${API_URL}/items/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors ? errorData.errors.join(', ') : 'Failed to update item');
    }
    return response.json();
}

export async function deleteItem(token: string, id: number): Promise<void> {
    const response = await fetch(`${API_URL}/items/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete item');
    }
}
