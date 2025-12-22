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

export interface PropertyFilters {
    minPrice?: number;
    maxPrice?: number;
    minRooms?: number;
    zone?: string;
    status?: string;
    search?: string;
}

export const getProperties = async (filters?: PropertyFilters): Promise<Property[]> => {
    const params = new URLSearchParams();
    if (filters) {
        if (filters.minPrice) params.append('minBudget', filters.minPrice.toString());
        if (filters.maxPrice) params.append('maxBudget', filters.maxPrice.toString());
        if (filters.minRooms) params.append('minRooms', filters.minRooms.toString());
        if (filters.zone) params.append('address', filters.zone); // Using address as zone filter for now
        if (filters.search) params.append('address', filters.search); // Search also maps to address/zone
    }

    return fetchClient<Property[]>(`/properties/search?${params.toString()}`);
};

export const getProperty = async (id: string): Promise<Property> => {
    return fetchClient<Property>(`/properties/${id}`);
};

export const createProperty = async (data: Partial<Property>): Promise<Property> => {
    return fetchClient<Property>('/properties', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const updateProperty = async (id: string, data: Partial<Property>): Promise<Property> => {
    return fetchClient<Property>(`/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};
