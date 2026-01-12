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
    energyCertificate?: string;
    yearBuilt?: number;
    type?: string;
}

export interface PropertyFilters {
    minPrice?: number;
    maxPrice?: number;
    minRooms?: number;
    zone?: string;
    status?: string;
    source?: string;
    search?: string;
}

export const getProperties = async (filters?: PropertyFilters): Promise<Property[]> => {
    const params = new URLSearchParams();
    if (filters) {
        if (filters.minPrice) params.append('minBudget', filters.minPrice.toString());
        if (filters.maxPrice) params.append('maxBudget', filters.maxPrice.toString());
        if (filters.minRooms) params.append('minRooms', filters.minRooms.toString());
        if (filters.zone) params.append('address', filters.zone);
        if (filters.status && filters.status !== 'all') params.append('status', filters.status);
        if (filters.search) params.append('q', filters.search);
        // source is mapped to 'origin' in backend filtering via 'source' param in handler
        if (filters.source && filters.source !== 'all') params.append('source', filters.source);
    }

    return fetchClient<Property[]>(`/properties/search?${params.toString()}`);
};

export const getProperty = async (id: string): Promise<Property> => {
    return fetchClient<Property>(`/properties/${id}`);
};

export const createProperty = async (data: Partial<Property>, imageFile?: File): Promise<Property> => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (imageFile) {
        formData.append('image', imageFile);
    }

    return fetchClient<Property>('/properties', {
        method: 'POST',
        body: formData,
        // checks for headers and removes Content-Type to let browser set boundary
        headers: {},
    });
};

export interface PropertySubtype {
    id: string;
    name: string;
    displayName: string;
    type: string;
}

export const getSubtypes = async (type?: string): Promise<PropertySubtype[]> => {
    let url = '/property-subtypes';
    if (type) {
        url += `?type=${type}`;
    }
    return fetchClient<PropertySubtype[]>(url);
};

export const updateProperty = async (id: string, data: Partial<Property>): Promise<Property> => {
    return fetchClient<Property>(`/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

