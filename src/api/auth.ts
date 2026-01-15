import { fetchClient } from './client';

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
}

export interface GenericResponse {
    message: string;
}

export const requestPasswordReset = async (email: string): Promise<GenericResponse> => {
    try {
        const response = await fetchClient<GenericResponse>('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to request password reset');
    }
};

export const resetPassword = async (token: string, password: string): Promise<GenericResponse> => {
    try {
        const response = await fetchClient<GenericResponse>('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, password }),
        });
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data || 'Failed to reset password');
    }
};

export const validateResetToken = async (token: string): Promise<GenericResponse> => {
    try {
        const response = await fetchClient<GenericResponse>(`/auth/validate-reset-token/${token}`, {
            method: 'GET',
        });
        return response;
    } catch (error: any) {
        throw new Error('Invalid or expired token');
    }
};
