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
    estado: "Nuevo",
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
    estado: "En seguimiento",
    idioma: "EN",
    origen: "Web",
    presupuesto: "800K-1M",
    zona: "Golden Mile",
    tipologia: "Apartamento",
  },
  {
    id: "3",
    nombre: "Miguel Rodríguez",
    email: "miguel.r@email.com",
    telefono: "+34 623 456 789",
    estado: "Cualificado",
    idioma: "ES",
    origen: "Inmobalia",
    presupuesto: "600-700K",
    zona: "Sierra Blanca",
    tipologia: "Apartamento",
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
            content: `📊 **Resumen del Lead: ${lead.nombre}**\n\n**Estado actual:** ${lead.estado}\n**Presupuesto:** ${lead.presupuesto}\n**Zona de interés:** ${lead.zona}\n**Tipología:** ${lead.tipologia}\n**Idioma:** ${lead.idioma}\n**Canal de contacto:** ${lead.telefono ? "WhatsApp disponible" : "Solo email (solicitar teléfono)"}\n\n**Sugerencias:**\n• Cualificar mejor: preguntar timing y financiación\n• Enviar 3 propiedades que encajen con su perfil\n• Agendar llamada de seguimiento en las próximas 48h\n\n¿En qué puedo ayudarte con este lead?`,
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
        content: "Entendido. Estoy procesando tu solicitud y generando las acciones correspondientes. En un momento tendrás los resultados.",
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
            Acciones IA
          </h1>
          <p className="text-muted-foreground">
            Pídele al agente cualquier acción sobre tus datos: cualificar leads, enviar propiedades, generar presentaciones...
          </p>
        </div>

        {/* Chat Interface */}
        <Card className="shadow-card mb-6">
          <CardContent className="p-6">
            <div className="space-y-4 mb-4 min-h-[400px] max-h-[500px] overflow-y-auto">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-20">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
                  <p className="text-lg">¿En qué puedo ayudarte hoy?</p>
                  <p className="text-sm mt-2">Escribe tu solicitud o usa las sugerencias de abajo</p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
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
                placeholder="Escribe tu solicitud... (ej: 'Cualifica al lead Carlos Martínez y envíale 3 propiedades')"
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

        {/* Sugerencias IA */}
        <Card className="shadow-ai">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Sugerencias IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-sm mb-3">
                Tienes <span className="font-semibold text-primary">8 leads</span> sin respuesta en las últimas 24h
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-gradient-primary hover:opacity-90">
                  Aprobar
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Editar
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-sm mb-3">
                Nuevas propiedades encajan con <span className="font-semibold text-primary">12 leads</span>
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Previsualizar
                </Button>
                <Button size="sm" className="flex-1 bg-gradient-primary hover:opacity-90">
                  Enviar
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-sm mb-3">
                <span className="font-semibold text-primary">3 leads</span> con alta probabilidad de conversión
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Ver detalles
              </Button>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-sm mb-3">
                <span className="font-semibold text-primary">5 leads</span> llevan más de 3 días sin contacto
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-gradient-primary hover:opacity-90">
                  Reactivar
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Revisar
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
