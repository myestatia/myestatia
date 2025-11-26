import { fetchClient } from './client';

export interface Lead {
    id: string;
    name: string;
    email: string;
    phone?: string;
    status?: string;
    language?: string;
    source?: string;
    budget?: number;
    zone?: string;
    propertyType?: string;
    channel?: string;
    suggestedPropertiesCount?: number;
    lastInteraction?: string;
    assignedAgent?: string;
    companyId?: string;
    propertyId?: string;
    rooms?: number;
    parking?: boolean;
}

export const getLeads = async (): Promise<Lead[]> => {
    return fetchClient<Lead[]>('/leads');
};

export const getLead = async (id: string): Promise<Lead> => {
    return fetchClient<Lead>(`/leads/${id}`);
};
