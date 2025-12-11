import { fetchClient } from './client';

export interface Property {
    id: string;
    reference: string;
    companyId: string;
    title: string;
    address?: string;
    rooms?: number;
    price?: number;
    description?: string;
    createdAt?: string;
    image?: string;
    area?: number;
    bathrooms?: number;
    status?: string;
    source?: string;
    compatibleLeadsCount?: number;
    isNew?: boolean;
    zone?: string;
}

export const getProperties = async (): Promise<Property[]> => {
    // In a real scenario, this might use /properties/search or /properties/{company_id}/companies
    // For now, we'll assume a general list endpoint or search with empty filters
    return fetchClient<Property[]>('/properties/search');
};

export const getProperty = async (id: string): Promise<Property> => {
    return fetchClient<Property>(`/properties/${id}`);
};
