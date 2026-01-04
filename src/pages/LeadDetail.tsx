import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MessageSquare, Mail, Send, Sparkles, Mic, ArrowLeft, Home, Euro, MapPin, Calendar, Phone, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getLead, updateLead } from "@/api/leads";
import { getConversations, sendMessage } from "@/api/conversations";
import { getProperties } from "@/api/properties";
import { format } from "date-fns";

const LeadDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [aiPrompt, setAiPrompt] = useState("");
  const [recording, setRecording] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    language: "es",
    budget: "",
    zone: "",
    propertyType: "villa",
    notes: "",
  });

  const { data: lead, isLoading: isLoadingLead } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => getLead(id!),
    enabled: !!id,
  });

  // Update form data when lead data is loaded
  if (lead && formData.name === "" && !isLoadingLead) {
    setFormData({
      name: lead.name || "",
      email: lead.email || "",
      phone: lead.phone || "",
      language: lead.language?.toLowerCase() || "es",
      budget: lead.budget?.toString() || "",
      zone: lead.zone || "",
      propertyType: lead.propertyType?.toLowerCase() || "villa",
      notes: lead.notes || "",
    });
  }

  const { data: conversations } = useQuery({
    queryKey: ['conversations', id],
    queryFn: () => getConversations(id!),
    enabled: !!id,
  });

  // Fetch properties for matching tab (mock logic for now: fetch all)
  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: () => getProperties(),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => sendMessage(id!, { senderType: 'agent', content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', id] });
      setMessageInput("");
    },
  });

  const updateLeadMutation = useMutation({
    mutationFn: (data: any) => updateLead(id!, {
      ...data,
      budget: data.budget ? parseFloat(data.budget) : 0,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      toast({
        title: "Lead updated",
        description: "Changes have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not save changes.",
        variant: "destructive",
      });
    }
  });

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    sendMessageMutation.mutate(messageInput);
  };

  const handleUpdateLead = () => {
    updateLeadMutation.mutate(formData);
  };

  if (isLoadingLead) {
    return <div className="flex justify-center items-center min-h-screen">Loading lead...</div>;
  }

  if (!lead) {
    return <div className="flex justify-center items-center min-h-screen">Lead not found</div>;
  }

  // Flatten messages from all conversations and sort by timestamp
  const allMessages = conversations?.flatMap(c => c.messages).sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <div className="container mx-auto p-6">
        <Button variant="ghost" onClick={() => navigate("/leads")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Leads
        </Button>

        {/* Header Card */}
        <Card id="lead-header-card" className="shadow-card mb-6" >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{lead.name}</h1>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1) || "New"}
                  </Badge>
                  <Badge variant="outline" className="bg-muted">{lead.language.charAt(0).toUpperCase() + lead.language.slice(1) || "ES"}</Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {lead.email}
                  </span>
                  {lead.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {lead.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {lead.source || "Real Estate Portal"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Select defaultValue={lead.status?.charAt(0).toUpperCase() || "New"}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Follow-up</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="visit">Visit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2" id="lead-info">
              <Badge variant="secondary">
                <Euro className="mr-1 h-3 w-3" />
                {lead.budget ? `${lead.budget.toLocaleString()}€` : "N/A"}
              </Badge>
              <Badge variant="secondary">
                <MapPin className="mr-1 h-3 w-3" />
                {lead.zone || "N/A"}
              </Badge>
              <Badge variant="secondary">
                <Home className="mr-1 h-3 w-3" />
                {lead.propertyType.charAt(0).toUpperCase() + lead.propertyType.slice(1) || "N/A"}
              </Badge>
              <Badge variant="secondary">
                <Calendar className="mr-1 h-3 w-3" />
                3-6 meses
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="lead-content">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="conversation" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="conversation">Conversation</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="matching">Matching</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="conversation" className="space-y-4 mt-4" id="lead-conversation">
                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                      {allMessages.length === 0 ? (
                        <p className="text-center text-muted-foreground">No messages yet.</p>
                      ) : (
                        allMessages.map((msg) => (
                          <div key={msg.id} className="space-y-2">
                            <div className={`flex gap-2 ${msg.senderType === "lead" ? "justify-start" : "justify-end"}`}>
                              <div className={`max-w-[80%] rounded-lg p-3 ${msg.senderType === "lead"
                                ? "bg-muted"
                                : "bg-gradient-primary text-primary-foreground"
                                }`}>
                                <div className="flex items-center gap-2 mb-1">
                                  {msg.channel === "WhatsApp" ? <MessageSquare className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                                  <span className="text-xs opacity-80">
                                    {format(new Date(msg.timestamp), "HH:mm")}
                                  </span>
                                </div>
                                <p className="text-sm">{msg.content}</p>
                              </div>
                            </div>
                            {msg.aiSummary && (
                              <div className="ml-8 p-3 rounded-lg bg-primary/5 border border-primary/20">
                                <div className="flex items-start gap-2">
                                  <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                  <p className="text-sm text-muted-foreground">{msg.aiSummary}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="space-y-4" id="lead-conversation-input">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          className={recording ? "bg-destructive text-destructive-foreground" : ""}
                          onClick={() => setRecording(!recording)}
                        >
                          <Mic className="h-4 w-4" />
                        </Button>
                        <Button
                          className="bg-gradient-primary hover:opacity-90"
                          onClick={handleSendMessage}
                          disabled={sendMessageMutation.isPending}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="justify-start">
                          <Sparkles className="mr-2 h-4 w-4 text-primary" />
                          Qualify lead
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <Sparkles className="mr-2 h-4 w-4 text-primary" />
                          Propose 3 properties
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <Sparkles className="mr-2 h-4 w-4 text-primary" />
                          Request availability
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <Sparkles className="mr-2 h-4 w-4 text-primary" />
                          Re-engage lead
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="datos" className="space-y-4 mt-4" id="lead-data">
                <Card className="shadow-card">
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Language</Label>
                        <Select
                          value={formData.language}
                          onValueChange={(val) => setFormData({ ...formData, language: val })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Budget</Label>
                        <Input
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          type="number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Preferred Zone</Label>
                        <Input
                          value={formData.zone}
                          onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={formData.propertyType}
                          onValueChange={(val) => setFormData({ ...formData, propertyType: val })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="villa">Villa</SelectItem>
                            <SelectItem value="apartamento">Apartment</SelectItem>
                            <SelectItem value="atico">Penthouse</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        placeholder="Add notes about the lead..."
                        rows={4}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>
                    <Button
                      className="bg-gradient-primary hover:opacity-90"
                      onClick={handleUpdateLead}
                      disabled={updateLeadMutation.isPending}
                    >
                      {updateLeadMutation.isPending ? "Saving..." : "Save changes"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="matching" className="space-y-4 mt-4" id="lead-matching">
                {properties?.slice(0, 2).map((prop) => (
                  <Card key={prop.id} className="shadow-card hover:shadow-card-hover transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={prop.image || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop"}
                          alt="Property"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-bold text-lg">{prop.price}€</p>
                              <p className="text-sm text-muted-foreground">{prop.zone || prop.address}</p>
                            </div>
                            <Badge className="bg-success text-success-foreground">
                              95% match
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                            <span>{prop.area}m²</span>
                            <span>{prop.rooms} bed</span>
                            <span>{prop.bathrooms} bath</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Add to presentation
                            </Button>
                            <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                              <MessageSquare className="mr-2 h-3 w-3" />
                              Send via WhatsApp
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="documentos" className="mt-4">
                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground text-center py-8">
                      No documents shared yet
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="shadow-ai">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Quick AI Actions
                </h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    Generate presentation
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    Request availability
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    Escalate to human
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card" id="lead-activity">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    <div>
                      <p className="text-muted-foreground">Message received</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-success mt-1.5" />
                    <div>
                      <p className="text-muted-foreground">Lead qualified by AI</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    <div>
                      <p className="text-muted-foreground">Lead created</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
