import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Mail, Phone, User, Edit2, Save, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { agentApi, companyApi, type Agent, type Company } from "@/lib/api/agentApi";

interface ProfileTabProps {
    agentId: string;
    companyId: string;
    initialAgentName: string;
    initialAgentEmail: string;
    initialRole: string;
}

export const ProfileTab = ({ agentId, companyId, initialAgentName, initialAgentEmail, initialRole }: ProfileTabProps) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [company, setCompany] = useState<Company | null>(null);
    const [agentName, setAgentName] = useState(initialAgentName);
    const [editedName, setEditedName] = useState(initialAgentName);
    const { toast } = useToast();

    useEffect(() => {
        loadCompanyData();
    }, [companyId]);

    const loadCompanyData = async () => {
        try {
            setLoading(true);
            const companyData = await companyApi.getCompany(companyId);
            setCompany(companyData);
        } catch (error: any) {
            console.error("Error loading company:", error);
            toast({
                title: "Error",
                description: "Failed to load company information",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveName = async () => {
        if (!editedName.trim()) {
            toast({
                title: "Validation error",
                description: "Name cannot be empty",
                variant: "destructive",
            });
            return;
        }

        try {
            setSaving(true);
            await agentApi.updateAgent(agentId, { name: editedName });
            setAgentName(editedName);
            setEditing(false);
            toast({
                title: "✓ Profile updated",
                description: "Your name has been updated successfully",
            });
        } catch (error: any) {
            console.error("Error updating agent:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update profile",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditedName(agentName);
        setEditing(false);
    };

    const getRoleBadge = (role: string) => {
        const roleColors: Record<string, string> = {
            admin: "bg-purple-500/10 text-purple-600 border-purple-500/20",
            agent: "bg-blue-500/10 text-blue-600 border-blue-500/20",
            manager: "bg-green-500/10 text-green-600 border-green-500/20",
        };

        return (
            <Badge className={roleColors[role.toLowerCase()] || "bg-muted"}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </Badge>
        );
    };

    if (loading) {
        return (
            <Card className="shadow-card">
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Personal Information Card */}
            <Card className="shadow-card">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Personal Information
                            </CardTitle>
                            <CardDescription>Your profile details and role</CardDescription>
                        </div>
                        {getRoleBadge(initialRole)}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Name - Editable */}
                    <div className="space-y-2">
                        <Label htmlFor="agent-name" className="text-sm font-medium text-muted-foreground">
                            Full Name
                        </Label>
                        {editing ? (
                            <div className="flex gap-2">
                                <Input
                                    id="agent-name"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    placeholder="Enter your name"
                                    disabled={saving}
                                />
                                <Button
                                    size="icon"
                                    onClick={handleSaveName}
                                    disabled={saving}
                                    className="bg-gradient-primary hover:opacity-90"
                                >
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                </Button>
                                <Button size="icon" variant="outline" onClick={handleCancelEdit} disabled={saving}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="text-base font-medium flex-1">{agentName}</div>
                                <Button size="icon" variant="ghost" onClick={() => setEditing(true)}>
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Email - Read-only */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                        <div className="flex items-center gap-2 text-base">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {initialAgentEmail}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Company Information Card */}
            {company && (
                <Card className="shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Company Information
                        </CardTitle>
                        <CardDescription>Your company details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Company Name */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Company Name</Label>
                            <div className="text-base font-semibold">{company.name}</div>
                        </div>

                        {/* Company Email */}
                        {company.email1 && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Company Email</Label>
                                    <div className="flex items-center gap-2 text-base">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <a href={`mailto:${company.email1}`} className="text-primary hover:underline">
                                            {company.email1}
                                        </a>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Company Phone */}
                        {company.phone1 && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Company Phone</Label>
                                    <div className="flex items-center gap-2 text-base">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <a href={`tel:${company.phone1}`} className="text-primary hover:underline">
                                            {company.phone1}
                                        </a>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Address */}
                        {company.address && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                                    <div className="text-base">
                                        {company.address}
                                        {company.city && `, ${company.city}`}
                                        {company.postalCode && ` ${company.postalCode}`}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Website */}
                        {company.website && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Website</Label>
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-base text-primary hover:underline"
                                    >
                                        {company.website}
                                    </a>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
