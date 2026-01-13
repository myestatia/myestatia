export interface EmailConfig {
    id: string;
    companyId: string;
    authMethod: "password" | "oauth2";
    imapHost: string;
    imapPort: number;
    imapUsername: string;
    // Password is never returned from API for security
    inboxFolder: string;
    pollIntervalSecs: number;
    isEnabled: boolean;
    lastSyncAt?: string;
}

export interface EmailConfigRequest {
    imapHost: string;
    imapPort: number;
    imapUsername: string;
    imapPassword: string; // Only sent on create/update
    inboxFolder: string;
    pollIntervalSecs: number;
}

export interface EmailConfigTestResponse {
    success: boolean;
    message: string;
}
