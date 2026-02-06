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
