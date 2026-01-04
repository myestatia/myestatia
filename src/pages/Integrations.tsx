import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings, CheckCircle2, AlertCircle, Plug } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const integrations = [
  {
    id: "email",
    name: "Email",
    description: "Connect your email account to automatically send and receive messages",
    logo: "✉️",
    status: "disconnected",
    category: "Email"
  },
  {
    id: "resales",
    name: "RESALES",
    description: "MLS Spain - Leading property portal in Costa del Sol",
    logo: "🏠",
    status: "disconnected",
    category: "MLS"
  },
  {
    id: "kommo",
    name: "Kommo",
    description: "CRM specialized in messaging for real estate",
    logo: "💬",
    status: "disconnected",
    category: "CRM"
  },
  {
    id: "inmobalia",
    name: "Inmobalia",
    description: "Comprehensive real estate management software",
    logo: "🏢",
    status: "disconnected",
    category: "CRM"
  },
  {
    id: "mls-usa",
    name: "MLS USA",
    description: "RESO Web API - Access to USA MLS listings",
    logo: "🇺🇸",
    status: "disconnected",
    category: "MLS"
  },
  {
    id: "habihub",
    name: "Habihub",
    description: "New build MLS - Development property management",
    logo: "🏗️",
    status: "disconnected",
    category: "MLS"
  },
  {
    id: "propertybase",
    name: "Propertybase",
    description: "Real estate CRM based on Salesforce",
    logo: "⚡",
    status: "disconnected",
    category: "CRM"
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "All-in-one CRM and marketing platform",
    logo: "🔶",
    status: "disconnected",
    category: "CRM"
  }
];

const Integrations = () => {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [urlBase, setUrlBase] = useState("");
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  const handleTestConnection = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      toast({
        title: "Connection successful",
        description: "The integration has been successfully configured",
      });
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    if (status === "connected") {
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Connected
        </Badge>
      );
    }
    if (status === "error") {
      return (
        <Badge variant="destructive">
          <AlertCircle className="mr-1 h-3 w-3" />
          Error
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-muted">
        Disconnected
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Integrations</h1>
          <p className="text-muted-foreground">
            Connect your favorite tools to automate your workflow with AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <Card key={integration.id} className="shadow-card hover:shadow-card-hover transition-all">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="text-4xl mb-2">{integration.logo}</div>
                  {getStatusBadge(integration.status)}
                </div>
                <CardTitle className="text-xl">{integration.name}</CardTitle>
                <CardDescription className="text-sm">
                  {integration.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedIntegration(integration.id)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <span className="text-2xl">{integration.logo}</span>
                        Configure {integration.name}
                      </DialogTitle>
                      <DialogDescription>
                        Connect {integration.name} to automatically sync leads and properties
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                      {/* Credentials */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Credentials</h3>
                        <div className="space-y-2">
                          <Label htmlFor="apiKey">API Key</Label>
                          <Input
                            id="apiKey"
                            type="password"
                            placeholder="Enter your API Key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                          />
                        </div>
                        {integration.category === "Email" && (
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="you@email.com"
                              value={urlBase}
                              onChange={(e) => setUrlBase(e.target.value)}
                            />
                          </div>
                        )}
                        {integration.category === "MLS" && (
                          <div className="space-y-2">
                            <Label htmlFor="urlBase">Base URL (optional)</Label>
                            <Input
                              id="urlBase"
                              placeholder="https://api.example.com"
                              value={urlBase}
                              onChange={(e) => setUrlBase(e.target.value)}
                            />
                          </div>
                        )}
                        <Button
                          className="bg-gradient-primary hover:opacity-90"
                          onClick={handleTestConnection}
                          disabled={testing}
                        >
                          <Plug className="mr-2 h-4 w-4" />
                          {testing ? "Testing connection..." : "Test connection"}
                        </Button>
                      </div>

                      {/* Modules - Only for CRM and MLS */}
                      {integration.category !== "Email" && (
                        <div className="space-y-4">
                          <h3 className="font-semibold">Modules to sync</h3>
                          <div className="space-y-3">
                            {integration.category === "CRM" && (
                              <>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="leads" defaultChecked />
                                  <label htmlFor="leads" className="text-sm cursor-pointer">
                                    Leads (webhooks/polling)
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="properties" defaultChecked />
                                  <label htmlFor="properties" className="text-sm cursor-pointer">
                                    Properties (two-way sync)
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="activities" />
                                  <label htmlFor="activities" className="text-sm cursor-pointer">
                                    Activities and Notes
                                  </label>
                                </div>
                              </>
                            )}
                            {integration.category === "MLS" && (
                              <div className="flex items-center space-x-2">
                                <Checkbox id="properties" defaultChecked />
                                <label htmlFor="properties" className="text-sm cursor-pointer">
                                  Properties (auto-sync)
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* AI Events */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">AI Trigger Events</h3>
                        <div className="space-y-3">
                          {integration.category === "CRM" && (
                            <>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="newLead" defaultChecked />
                                <label htmlFor="newLead" className="text-sm cursor-pointer">
                                  New lead → Automatically qualify and contact
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="newProperty" defaultChecked />
                                <label htmlFor="newProperty" className="text-sm cursor-pointer">
                                  New property → Detect matching leads and contact
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="birthday" />
                                <label htmlFor="birthday" className="text-sm cursor-pointer">
                                  Birthday/Key date → Personalized message
                                </label>
                              </div>
                            </>
                          )}
                          {integration.category === "MLS" && (
                            <>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="newProperty" defaultChecked />
                                <label htmlFor="newProperty" className="text-sm cursor-pointer">
                                  New property → Detect matching leads and contact
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="statusChange" />
                                <label htmlFor="statusChange" className="text-sm cursor-pointer">
                                  Property status change → Notify interested leads
                                </label>
                              </div>
                            </>
                          )}
                          {integration.category === "Email" && (
                            <>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="portalLeads" defaultChecked />
                                <label htmlFor="portalLeads" className="text-sm cursor-pointer">
                                  Real estate portal leads
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="campaignLeads" defaultChecked />
                                <label htmlFor="campaignLeads" className="text-sm cursor-pointer">
                                  Digital campaign leads
                                </label>
                              </div>
                              <div className="space-y-2 mt-4">
                                <Label htmlFor="customPrompt">Custom prompt (optional)</Label>
                                <Input
                                  id="customPrompt"
                                  placeholder="e.g.: Detect language and reply in that language..."
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button className="flex-1 bg-gradient-primary hover:opacity-90">
                          Save configuration
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Integrations;
