import { API_URL } from './auth';

export interface MessageSender {
    id: number;
    name: string;
    picture: string | null;
}

export interface Message {
    id: number;
    content: string;
    sender: MessageSender;
    created_at: string;
}

function getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function fetchMessages(tradeId: number): Promise<Message[]> {
    const response = await fetch(`${API_URL}/trades/${tradeId}/messages`, {
        headers: {
            ...getAuthHeader()
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch messages');
    }

    return response.json();
}

export async function sendMessage(tradeId: number, content: string): Promise<Message> {
    const response = await fetch(`${API_URL}/trades/${tradeId}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({ message: { content } })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.errors?.join(', ') || 'Failed to send message');
    }

    return response.json();
}
