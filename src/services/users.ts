import { API_URL } from './auth';

export interface UserSearchResult {
    id: number;
    name: string;
    email: string;
    picture: string | null;
    created_at: string;
}

export async function fetchUsers(query?: string): Promise<UserSearchResult[]> {
    const url = new URL(`${API_URL}/users`);
    if (query) {
        url.searchParams.append('query', query);
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return response.json();
}
export async function fetchUserById(id: string): Promise<UserSearchResult> {
    try {
        const response = await fetch(`${API_URL}/users/${id}`);
        if (response.ok) {
            return response.json();
        }
    } catch (e) {
        console.warn(`Direct fetch for user ${id} failed, trying list fallback...`);
    }

    // Fallback: fetch all and filter
    const users = await fetchUsers();
    const user = users.find(u => u.id.toString() === id);
    if (!user) {
        throw new Error('Failed to fetch user');
    }
    return user;
}
