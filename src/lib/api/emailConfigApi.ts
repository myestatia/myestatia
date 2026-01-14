import { client } from "@/api/client";
import type {
    EmailConfig,
    EmailConfigRequest,
    EmailConfigTestResponse,
} from "@/types/emailConfig.types";

const BASE_URL = "/companies";

export const emailConfigApi = {
    /**
     * Get email configuration for a company
     */
    async getConfig(companyId: string): Promise<EmailConfig | null> {
        try {
            const response = await client.get<EmailConfig>(
                `${BASE_URL}/${companyId}/email-config`
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null; // No config exists
            }
            throw error;
        }
    },

    /**
     * Create email configuration for a company
     */
    async createConfig(
        companyId: string,
        data: EmailConfigRequest
    ): Promise<EmailConfig> {
        const response = await client.post<EmailConfig>(
            `${BASE_URL}/${companyId}/email-config`,
            data
        );
        return response.data;
    },

    /**
     * Update existing email configuration
     */
    async updateConfig(
        companyId: string,
        data: Partial<EmailConfigRequest>
    ): Promise<EmailConfig> {
        const response = await client.put<EmailConfig>(
            `${BASE_URL}/${companyId}/email-config`,
            data
        );
        return response.data;
    },

    /**
     * Delete email configuration
     */
    async deleteConfig(companyId: string): Promise<void> {
        await client.delete(`${BASE_URL}/${companyId}/email-config`);
    },

    /**
     * Test IMAP connection with current configuration
     */
    async testConnection(companyId: string): Promise<EmailConfigTestResponse> {
        const response = await client.post<EmailConfigTestResponse>(
            `${BASE_URL}/${companyId}/email-config/test`
        );
        return response.data;
    },

    /**
     * Enable or disable email sync
     */
    async toggleEnabled(companyId: string, enabled: boolean): Promise<void> {
        await client.patch(`${BASE_URL}/${companyId}/email-config/toggle`, {
            enabled,
        });
    },

    /**
     * Disconnect Gmail OAuth2
     */
    async disconnectGmail(companyId: string): Promise<void> {
        await client.post(`/auth/google/disconnect`, { companyId });
    },
};
