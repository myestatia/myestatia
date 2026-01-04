import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Mic, User, Bot } from "lucide-react";

const mockLeads = [
  {
    id: "1",
    nombre: "Carlos Martínez",
    email: "carlos@email.com",
    telefono: "+34 612 345 678",
    estado: "New",
    idioma: "ES",
    origen: "Portal",
    presupuesto: "400-500K",
    zona: "Nueva Andalucía",
    tipologia: "Villa",
  },
  {
    id: "2",
    nombre: "Sarah Johnson",
    email: "sarah.j@email.com",
    telefono: "",
    estado: "Follow-up",
    idioma: "EN",
    origen: "Web",
    presupuesto: "800K-1M",
    zona: "Golden Mile",
    tipologia: "Apartment",
  },
  {
    id: "3",
    nombre: "Miguel Rodríguez",
    email: "miguel.r@email.com",
    telefono: "+34 623 456 789",
    estado: "Qualified",
    idioma: "ES",
    origen: "Inmobalia",
    presupuesto: "600-700K",
    zona: "Sierra Blanca",
    tipologia: "Apartment",
  },
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIActions = () => {
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get("leadId");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (leadId) {
      const lead = mockLeads.find((l) => l.id === leadId);
      if (lead) {
        setMessages([
          {
            role: "assistant",
            content: `📊 **Lead Summary: ${lead.nombre}**\n\n**Current Status:** ${lead.estado}\n**Budget:** ${lead.presupuesto}\n**Interested Zone:** ${lead.zona}\n**Type:** ${lead.tipologia}\n**Language:** ${lead.idioma}\n**Contact Channel:** ${lead.telefono ? "WhatsApp available" : "Email only (request phone)"}\n\n**Suggestions:**\n• Better qualification: ask for timing and financing\n• Send 3 properties matching their profile\n• Schedule follow-up call in next 48h\n\nHow can I help you with this lead?`,
          },
        ]);
      }
    }
  }, [leadId]);

  const handleSend = () => {
    if (!prompt.trim()) return;

    const userMessage: Message = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: "Understood. I'm processing your request and generating the corresponding actions. Results will be ready in a moment.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);

    setPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <div className="container mx-auto p-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Actions
          </h1>
          <p className="text-muted-foreground">
            Ask the agent for any action on your data: qualify leads, send properties, generate presentations...
          </p>
        </div>

        {/* Chat Interface */}
        <Card className="shadow-card mb-6">
          <CardContent className="p-6">
            <div className="space-y-4 mb-4 min-h-[400px] max-h-[500px] overflow-y-auto">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-20">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
                  <p className="text-lg">How can I help you today?</p>
                  <p className="text-sm mt-2">Type your request or use the suggestions below</p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                      }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Textarea
                placeholder="Type your request... (e.g. 'Qualify lead Carlos Martínez and send 3 properties')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[80px] resize-none"
              />
              <div className="flex flex-col gap-2">
                <Button
                  size="icon"
                  className="bg-gradient-primary hover:opacity-90"
                  onClick={handleSend}
                  disabled={!prompt.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card className="shadow-ai">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-sm mb-3">
                You have <span className="font-semibold text-primary">8 leads</span> without response in the last 24h
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-gradient-primary hover:opacity-90">
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Edit
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-sm mb-3">
                New properties match with <span className="font-semibold text-primary">12 leads</span>
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Preview
                </Button>
                <Button size="sm" className="flex-1 bg-gradient-primary hover:opacity-90">
                  Send
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-sm mb-3">
                <span className="font-semibold text-primary">3 leads</span> with high conversion probability
              </p>
              <Button size="sm" variant="outline" className="w-full">
                View details
              </Button>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-sm mb-3">
                <span className="font-semibold text-primary">5 leads</span> haven't been contacted in 3+ days
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-gradient-primary hover:opacity-90">
                  Reactivate
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIActions;
