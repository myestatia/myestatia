import { fetchClient } from './client';

export interface Message {
    id: string;
    senderType: 'lead' | 'agent' | 'ai';
    content: string;
    timestamp: string;
    channel?: string;
    aiSummary?: string;
}

export interface Conversation {
    id: string;
    leadId: string;
    channel?: string;
    messages: Message[];
    createdAt: string;
}

export const getConversations = async (leadId: string): Promise<Conversation[]> => {
    // Assuming the backend returns a list of conversations for a lead
    return fetchClient<Conversation[]>(`/lead/${leadId}/conversations`);
};

export const sendMessage = async (leadId: string, message: { senderType: string; content: string }): Promise<Message> => {
    return fetchClient<Message>(`/conversations/${leadId}/messages`, {
        method: 'POST',
        body: JSON.stringify(message),
    });
};
