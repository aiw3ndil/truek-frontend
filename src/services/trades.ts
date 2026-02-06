import { API_URL } from './auth';

export type TradeStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';

export interface TradeUser {
    id: number;
    name: string;
    email?: string;
    picture: string | null;
}

export interface TradeItem {
    id: number;
    title: string;
    description?: string;
    images?: { url: string; position: number }[];
}

export interface Trade {
    id: number;
    status: TradeStatus;
    proposer: TradeUser;
    receiver: TradeUser;
    proposer_item: TradeItem;
    receiver_item: TradeItem;
    created_at: string;
    updated_at: string;
}

export interface CreateTradeData {
    receiver_id: number;
    proposer_item_id: number;
    receiver_item_id: number;
}

function getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function fetchTrades(status?: string): Promise<Trade[]> {
    const queryParams = status ? `?status=${status}` : '';
    const response = await fetch(`${API_URL}/trades${queryParams}`, {
        headers: {
            ...getAuthHeader()
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch trades');
    }

    return response.json();
}

export async function fetchTradeById(id: string): Promise<Trade> {
    const response = await fetch(`${API_URL}/trades/${id}`, {
        headers: {
            ...getAuthHeader()
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch trade details');
    }

    return response.json();
}

export async function createTrade(data: CreateTradeData): Promise<Trade> {
    const response = await fetch(`${API_URL}/trades`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({ trade: data })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.join(', ') || 'Failed to create trade');
    }

    return response.json();
}

export async function updateTradeAction(id: number, actionType: 'accept' | 'reject' | 'cancel' | 'complete'): Promise<Trade> {
    const response = await fetch(`${API_URL}/trades/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({ action_type: actionType })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.errors?.join(', ') || 'Failed to update trade');
    }

    return response.json();
}
