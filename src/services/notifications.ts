import { API_URL } from './auth';

export interface Notification {
    id: number;
    title: string;
    message: string;
    link: string;
    read: boolean;
    notification_type: string;
    created_at: string;
}

function getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function fetchNotifications(): Promise<Notification[]> {
    const response = await fetch(`${API_URL}/notifications`, {
        headers: {
            ...getAuthHeader()
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch notifications');
    }

    return response.json();
}

export async function markNotificationAsRead(id: number): Promise<Notification> {
    const response = await fetch(`${API_URL}/notifications/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({ read: true })
    });

    if (!response.ok) {
        throw new Error('Failed to mark notification as read');
    }

    return response.json();
}

export async function markAllNotificationsAsRead(): Promise<void> {
    const response = await fetch(`${API_URL}/notifications/mark_all_as_read`, {
        method: 'POST',
        headers: {
            ...getAuthHeader()
        }
    });

    if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
    }
}

export async function deleteNotification(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: {
            ...getAuthHeader()
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete notification');
    }
}
