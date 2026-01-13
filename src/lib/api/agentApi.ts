import { client } from "@/api/client";

export interface Company {
    id: string;
    name: string;
    email1?: string;
    email2?: string;
    phone1?: string;
    phone2?: string;
    address?: string;
    postalCode?: string;
    city?: string;
    province?: string;
    country?: string;
    website?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Agent {
    id: string;
    name: string;
    email: string;
    role: string;
    companyId: string;
    createdAt?: string;
}

export interface UpdateAgentRequest {
    name: string;
}

export const agentApi = {
    async getAgent(id: string): Promise<Agent> {
        const response = await client.get<Agent>(`/agents/${id}`);
        return response.data;
    },

    async updateAgent(id: string, data: UpdateAgentRequest): Promise<Agent> {
        const response = await client.put<Agent>(`/agents/${id}`, data);
        return response.data;
    },
};

export const companyApi = {
    async getCompany(id: string): Promise<Company> {
        const response = await client.get<Company>(`/companies/${id}`);
        return response.data;
    },
};
