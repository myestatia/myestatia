import { fetchClient } from './client';

export interface RequestInvitationRequest {
    email: string;
    companyName: string;
}

export interface RequestInvitationResponse {
    message: string;
    success: boolean;
}

export interface Invitation {
    id: string;
    token: string;
    email: string;
    companyId: string;
    used: boolean;
    usedAt?: string;
    expiresAt: string;
    createdAt: string;
}

export const requestInvitation = async (email: string, companyName: string): Promise<RequestInvitationResponse> => {
    return fetchClient<RequestInvitationResponse>('/invitations/request', {
        method: 'POST',
        body: JSON.stringify({ email, companyName }),
    });
};

export const validateInvitation = async (token: string): Promise<Invitation> => {
    return fetchClient<Invitation>(`/invitations/validate/${token}`);
};

export interface RegisterWithTokenRequest {
    name: string;
    email: string;
    password: string;
}

export interface RegisterWithTokenResponse {
    token: string;
    agent: any;
}

export const registerWithToken = async (
    invitationToken: string,
    data: RegisterWithTokenRequest
): Promise<RegisterWithTokenResponse> => {
    return fetchClient<RegisterWithTokenResponse>(`/auth/register/${invitationToken}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};
