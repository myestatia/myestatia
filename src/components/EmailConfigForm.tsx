import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle2, AlertCircle, Mail, Trash2, Plug, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { emailConfigApi } from "@/lib/api/emailConfigApi";
import type { EmailConfig, EmailConfigRequest } from "@/types/emailConfig.types";

interface EmailConfigFormProps {
    companyId: string;
}

const GOOGLE_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>`;

export const EmailConfigForm = ({ companyId }: EmailConfigFormProps) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [config, setConfig] = useState<EmailConfig | null>(null);
    const { toast } = useToast();

    // Form state
    const [formData, setFormData] = useState<EmailConfigRequest>({
        imapHost: "imap.gmail.com",
        imapPort: 993,
        imapUsername: "",
        imapPassword: "",
        inboxFolder: "INBOX",
        pollIntervalSecs: 300,
    });

    const [isEnabled, setIsEnabled] = useState(true);
    const [testStatus, setTestStatus] = useState<"idle" | "success" | "error">("idle");
    const [useManualIMAP, setUseManualIMAP] = useState(false);

    // Load existing configuration
    useEffect(() => {
        loadConfig();
    }, [companyId]);

    // Listen for OAuth success message from popup
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
                toast({
                    title: "✓ Gmail Connected",
                    description: "Your Gmail account has been connected successfully",
                });
                // Reload config to show OAuth2 status
                setTimeout(() => loadConfig(), 1000);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const loadConfig = async () => {
        try {
            setLoading(true);
            const data = await emailConfigApi.getConfig(companyId);
            if (data) {
                setConfig(data);
                setFormData({
                    imapHost: data.imapHost || "imap.gmail.com",
                    imapPort: data.imapPort || 993,
                    imapUsername: data.imapUsername || "",
                    imapPassword: "", // Never returned from API
                    inboxFolder: data.inboxFolder || "INBOX",
                    pollIntervalSecs: data.pollIntervalSecs || 300,
                });
                setIsEnabled(data.isEnabled);
                // If config uses OAuth2, don't show manual IMAP
                if (data.authMethod === "oauth2") {
                    setUseManualIMAP(false);
                }
            } else {
                setUseManualIMAP(false); // Default to OAuth2 for new configs
            }
        } catch (error: any) {
            console.error("Error loading config:", error);
            if (error.response?.status !== 404) {
                toast({
                    title: "Error",
                    description: error.response?.data?.message || "Failed to load email configuration",
                    variant: "destructive",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleConnect = () => {
        const width = 600;
        const height = 700;
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);

        const authUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/auth/google/connect?company_id=${companyId}`;

        window.open(
            authUrl,
            'Google Authorization',
            `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
        );
    };

    const handleDisconnectGmail = async () => {
        if (!confirm("Are you sure you want to disconnect Gmail? You can reconnect anytime.")) {
            return;
        }

        try {
            await emailConfigApi.disconnectGmail(companyId);
            toast({
                title: "✓ Gmail Disconnected",
                description: "Gmail has been disconnected successfully",
            });
            setConfig(null);
            setFormData({
                imapHost: "imap.gmail.com",
                imapPort: 993,
                imapUsername: "",
                imapPassword: "",
                inboxFolder: "INBOX",
                pollIntervalSecs: 300,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to disconnect Gmail",
                variant: "destructive",
            });
        }
    };

    const handleTestConnection = async () => {
        try {
            setTesting(true);
            setTestStatus("idle");
            const result = await emailConfigApi.testConnection(companyId);
            if (result.success) {
                setTestStatus("success");
                toast({
                    title: "✓ Connection successful",
                    description: result.message,
                });
            } else {
                setTestStatus("error");
                toast({
                    title: "✗ Connection failed",
                    description: result.message,
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            setTestStatus("error");
            toast({
                title: "✗ Connection failed",
                description: error.response?.data?.message || "Failed to test connection",
                variant: "destructive",
            });
        } finally {
            setTesting(false);
        }
    };

    const handleSave = async () => {
        // Validation
        if (!formData.imapUsername || !formData.imapHost) {
            toast({
                title: "Validation error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        if (config === null && !formData.imapPassword) {
            toast({
                title: "Validation error",
                description: "Password is required for initial setup",
                variant: "destructive",
            });
            return;
        }

        try {
            setSaving(true);
            if (config) {
                // Update existing
                const updateData = { ...formData };
                if (!formData.imapPassword) {
                    delete (updateData as any).imapPassword; // Don't send empty password
                }
                await emailConfigApi.updateConfig(companyId, updateData);
                toast({
                    title: "✓ Configuration updated",
                    description: "Email configuration has been updated successfully",
                });
            } else {
                // Create new
                await emailConfigApi.createConfig(companyId, formData);
                toast({
                    title: "✓ Configuration saved",
                    description: "Email configuration has been created successfully",
                });
            }
            await loadConfig();
            setTestStatus("idle");
        } catch (error: any) {
            console.error("Error saving config:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to save configuration",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete the email configuration?")) {
            return;
        }

        try {
            await emailConfigApi.deleteConfig(companyId);
            toast({
                title: "✓ Configuration deleted",
                description: "Email configuration has been removed",
            });
            setConfig(null);
            setFormData({
                imapHost: "imap.gmail.com",
                imapPort: 993,
                imapUsername: "",
                imapPassword: "",
                inboxFolder: "INBOX",
                pollIntervalSecs: 300,
            });
            setTestStatus("idle");
            setUseManualIMAP(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete configuration",
                variant: "destructive",
            });
        }
    };

    const handleToggleEnabled = async (enabled: boolean) => {
        try {
            await emailConfigApi.toggleEnabled(companyId, enabled);
            setIsEnabled(enabled);
            setConfig(config ? { ...config, isEnabled: enabled } : null);
            toast({
                title: enabled ? "✓ Email sync enabled" : "Email sync disabled",
                description: enabled
                    ? "Email monitoring will resume within 10 minutes"
                    : "Email monitoring has been stopped",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to toggle email sync",
                variant: "destructive",
            });
        }
    };

    const getStatusBadge = () => {
        if (!config) {
            return (
                <Badge variant="outline" className="bg-muted">
                    Not Configured
                </Badge>
            );
        }
        if (!config.isEnabled) {
            return (
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Disabled
                </Badge>
            );
        }
        if (config.authMethod === "oauth2") {
            return (
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Gmail Connected
                </Badge>
            );
        }
        return (
            <Badge className="bg-success/10 text-success border-success/20">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Active (IMAP)
            </Badge>
        );
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    const isOAuth2 = config?.authMethod === "oauth2";

    return (
        <Card className="shadow-card">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Email Configuration
                        </CardTitle>
                        <CardDescription>
                            Configure Gmail to automatically ingest leads from Fotocasa and Idealista
                        </CardDescription>
                    </div>
                    {getStatusBadge()}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {config && config.lastSyncAt && (
                    <div className="text-sm text-muted-foreground">
                        Last sync: {new Date(config.lastSyncAt).toLocaleString()}
                    </div>
                )}

                {/* OAuth2 Google Option (Recommended) */}
                {!isOAuth2 && !useManualIMAP && (
                    <div className="space-y-4">
                        <Alert>
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription className="ml-2">
                                <strong>Recommended:</strong> Connect with Google for the easiest and most secure setup.
                            </AlertDescription>
                        </Alert>

                        <Button
                            onClick={handleGoogleConnect}
                            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium"
                            size="lg"
                        >
                            <span dangerouslySetInnerHTML={{ __html: GOOGLE_LOGO_SVG }} className="mr-2" />
                            Connect with Google
                        </Button>
                    </div>
                )}

                {/* OAuth2 Connected Status */}
                {isOAuth2 && (
                    <div className="space-y-4">
                        <Alert className="border-green-500/20 bg-green-500/10">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="ml-2">
                                <strong>Gmail Connected</strong> - Your inbox is being monitored for new leads.
                            </AlertDescription>
                        </Alert>

                        <Button
                            variant="outline"
                            onClick={handleDisconnectGmail}
                            className="w-full"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Disconnect Gmail
                        </Button>
                    </div>
                )}

                {/* Manual IMAP Configuration Form */}
                {useManualIMAP && !isOAuth2 && (
                    <>
                        <Alert>
                            <AlertDescription>
                                <strong>Gmail users:</strong> You need to create an{" "}
                                <a
                                    href="https://support.google.com/accounts/answer/185833"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline"
                                >
                                    App Password
                                </a>{" "}
                                (enable 2FA first). Don't use your regular password.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="imapHost">IMAP Host *</Label>
                                    <Input
                                        id="imapHost"
                                        value={formData.imapHost}
                                        onChange={(e) => setFormData({ ...formData, imapHost: e.target.value })}
                                        placeholder="imap.gmail.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="imapPort">Port *</Label>
                                    <Input
                                        id="imapPort"
                                        type="number"
                                        value={formData.imapPort}
                                        onChange={(e) => setFormData({ ...formData, imapPort: parseInt(e.target.value) || 993 })}
                                        placeholder="993"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="imapUsername">Email Address *</Label>
                                <Input
                                    id="imapUsername"
                                    type="email"
                                    value={formData.imapUsername}
                                    onChange={(e) => setFormData({ ...formData, imapUsername: e.target.value })}
                                    placeholder="your-company@gmail.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="imapPassword">
                                    Password * {config && "(leave empty to keep current password)"}
                                </Label>
                                <Input
                                    id="imapPassword"
                                    type="password"
                                    value={formData.imapPassword}
                                    onChange={(e) => setFormData({ ...formData, imapPassword: e.target.value })}
                                    placeholder={config ? "••••••••" : "App password"}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="inboxFolder">Inbox Folder</Label>
                                    <Input
                                        id="inboxFolder"
                                        value={formData.inboxFolder}
                                        onChange={(e) => setFormData({ ...formData, inboxFolder: e.target.value })}
                                        placeholder="INBOX"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pollInterval">Poll Interval (seconds)</Label>
                                    <Input
                                        id="pollInterval"
                                        type="number"
                                        value={formData.pollIntervalSecs}
                                        onChange={(e) =>
                                            setFormData({ ...formData, pollIntervalSecs: parseInt(e.target.value) || 300 })
                                        }
                                        placeholder="300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Test Connection */}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleTestConnection}
                                disabled={testing || !config}
                                className="flex-1"
                            >
                                {testing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Testing...
                                    </>
                                ) : (
                                    <>
                                        <Plug className="mr-2 h-4 w-4" />
                                        Test Connection
                                    </>
                                )}
                            </Button>
                            {testStatus === "success" && (
                                <CheckCircle2 className="h-10 w-10 text-success" />
                            )}
                            {testStatus === "error" && (
                                <AlertCircle className="h-10 w-10 text-destructive" />
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t">
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 bg-gradient-primary hover:opacity-90"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    `${config ? "Update" : "Save"} Configuration`
                                )}
                            </Button>
                            {config && (
                                <Button variant="destructive" onClick={handleDelete}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </>
                )}

                {/* Enable/Disable Toggle */}
                {config && (
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                        <div>
                            <Label htmlFor="enable-sync" className="text-base font-medium">
                                Enable Email Sync
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Monitor inbox and automatically create leads
                            </p>
                        </div>
                        <Switch
                            id="enable-sync"
                            checked={isEnabled}
                            onCheckedChange={handleToggleEnabled}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
