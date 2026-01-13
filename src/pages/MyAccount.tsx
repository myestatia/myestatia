import { useState } from "react";
import Header from "@/components/Header";
import { EmailConfigForm } from "@/components/EmailConfigForm";
import { ProfileTab } from "@/components/ProfileTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const MyAccount = () => {
    const { agent } = useAuth();
    const [activeTab, setActiveTab] = useState("email");

    if (!agent) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <Header />

            <div className="container mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">My Account</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
                        <TabsTrigger value="email" className="gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                        </TabsTrigger>
                        <TabsTrigger value="profile" className="gap-2">
                            <User className="h-4 w-4" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="gap-2">
                            <Settings className="h-4 w-4" />
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="email" className="mt-6">
                        <EmailConfigForm companyId={agent.company_id} />
                    </TabsContent>

                    <TabsContent value="profile" className="mt-6">
                        <ProfileTab
                            agentId={agent.id}
                            companyId={agent.company_id}
                            initialAgentName={agent.name}
                            initialAgentEmail={agent.email}
                            initialRole={agent.role}
                        />
                    </TabsContent>

                    <TabsContent value="settings" className="mt-6">
                        <Card className="shadow-card">
                            <CardHeader>
                                <CardTitle>Settings</CardTitle>
                                <CardDescription>
                                    Configure your preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Additional settings coming soon...
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default MyAccount;
