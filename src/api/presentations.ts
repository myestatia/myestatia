import { fetchClient } from './client';

export interface PropertyMatch {
    property: {
        id: string;
        reference: string;
        title: string;
        address?: string;
        zone?: string;
        price?: number;
        area?: number;
        rooms?: number;
        bathrooms?: number;
        image?: string;
        description?: string;
        status?: string;
    };
    matchPercent: number;
    isInquired: boolean;
    isDismissed: boolean;
}

export interface Presentation {
    lead: {
        id: string;
        name: string;
        email: string;
        phone?: string;
    };
    properties: Array<{
        id: string;
        reference: string;
        title: string;
        address?: string;
        zone?: string;
        price?: number;
        area?: number;
        rooms?: number;
        bathrooms?: number;
        image?: string;
        description?: string;
        status?: string;
    }>;
    contactPhone: string;
}

export interface CreatePresentationResponse {
    token: string;
    url: string;
}

export const getMatchingProperties = async (leadId: string): Promise<PropertyMatch[]> => {
    return fetchClient<PropertyMatch[]>(`/presentations/matching-properties/${leadId}`);
};

export const createPresentation = async (
    leadId: string,
    propertyIds: string[]
): Promise<CreatePresentationResponse> => {
    return fetchClient<CreatePresentationResponse>('/presentations', {
        method: 'POST',
        body: JSON.stringify({ leadId, propertyIds }),
    });
};

export const getPresentation = async (token: string): Promise<Presentation> => {
    return fetchClient<Presentation>(`/public/presentations/${token}`);
};
