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

const mockMessages = [
  {
    id: "1",
    canal: "WhatsApp",
    mensaje: "Hola, estoy interesado en propiedades en Nueva Andalucía",
    autor: "lead",
    fecha: "10:30",
    resumenIA: "Lead interesado en zona Nueva Andalucía. Perfil comprador activo."
  },
  {
    id: "2",
    canal: "WhatsApp",
    mensaje: "Perfecto Carlos, ¿tienes un presupuesto estimado para tu búsqueda?",
    autor: "IA",
    fecha: "10:32",
    resumenIA: null
  },
  {
    id: "3",
    canal: "WhatsApp",
    mensaje: "Entre 400 y 500 mil euros aproximadamente",
    autor: "lead",
    fecha: "10:45",
    resumenIA: "Presupuesto cualificado: 400-500K. Lead solvente para matching."
  }
];

const mockProperties = [
  {
    id: "1",
    imagen: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
    precio: "450.000€",
    zona: "Nueva Andalucía",
    m2: "180m²",
    dormitorios: 3,
    banos: 2,
    score: 95
  },
  {
    id: "2",
    imagen: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
    precio: "485.000€",
    zona: "Nueva Andalucía",
    m2: "200m²",
    dormitorios: 4,
    banos: 3,
    score: 92
  }
];

const LeadDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [aiPrompt, setAiPrompt] = useState("");
  const [recording, setRecording] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <div className="container mx-auto p-6">
        <Button variant="ghost" onClick={() => navigate("/leads")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Leads
        </Button>

        {/* Header Card */}
        <Card className="shadow-card mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">Carlos Martínez</h1>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Nuevo
                  </Badge>
                  <Badge variant="outline" className="bg-muted">ES</Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    carlos@email.com
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    +34 612 345 678
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Portal Inmobiliario
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="nuevo">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nuevo">Nuevo</SelectItem>
                    <SelectItem value="seguimiento">En seguimiento</SelectItem>
                    <SelectItem value="cualificado">Cualificado</SelectItem>
                    <SelectItem value="visita">Visita</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                <Euro className="mr-1 h-3 w-3" />
                400-500K
              </Badge>
              <Badge variant="secondary">
                <MapPin className="mr-1 h-3 w-3" />
                Nueva Andalucía
              </Badge>
              <Badge variant="secondary">
                <Home className="mr-1 h-3 w-3" />
                Villa
              </Badge>
              <Badge variant="secondary">
                <Calendar className="mr-1 h-3 w-3" />
                3-6 meses
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="conversacion" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="conversacion">Conversación</TabsTrigger>
                <TabsTrigger value="datos">Datos</TabsTrigger>
                <TabsTrigger value="matching">Matching</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
              </TabsList>

              <TabsContent value="conversacion" className="space-y-4 mt-4">
                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                      {mockMessages.map((msg) => (
                        <div key={msg.id} className="space-y-2">
                          <div className={`flex gap-2 ${msg.autor === "lead" ? "justify-start" : "justify-end"}`}>
                            <div className={`max-w-[80%] rounded-lg p-3 ${
                              msg.autor === "lead" 
                                ? "bg-muted" 
                                : "bg-gradient-primary text-primary-foreground"
                            }`}>
                              <div className="flex items-center gap-2 mb-1">
                                {msg.canal === "WhatsApp" ? <MessageSquare className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                                <span className="text-xs opacity-80">{msg.fecha}</span>
                              </div>
                              <p className="text-sm">{msg.mensaje}</p>
                            </div>
                          </div>
                          {msg.resumenIA && (
                            <div className="ml-8 p-3 rounded-lg bg-primary/5 border border-primary/20">
                              <div className="flex items-start gap-2">
                                <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-muted-foreground">{msg.resumenIA}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Pregunta al Agente IA sobre este lead..."
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
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
                        <Button className="bg-gradient-primary hover:opacity-90">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="justify-start">
                          <Sparkles className="mr-2 h-4 w-4 text-primary" />
                          Cualificar lead
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <Sparkles className="mr-2 h-4 w-4 text-primary" />
                          Proponer 3 propiedades
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <Sparkles className="mr-2 h-4 w-4 text-primary" />
                          Pedir disponibilidad
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <Sparkles className="mr-2 h-4 w-4 text-primary" />
                          Reenganchar lead
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="datos" className="space-y-4 mt-4">
                <Card className="shadow-card">
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nombre</Label>
                        <Input defaultValue="Carlos Martínez" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input defaultValue="carlos@email.com" />
                      </div>
                      <div className="space-y-2">
                        <Label>Teléfono</Label>
                        <Input defaultValue="+34 612 345 678" />
                      </div>
                      <div className="space-y-2">
                        <Label>Idioma</Label>
                        <Select defaultValue="es">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Presupuesto</Label>
                        <Input defaultValue="400-500K" />
                      </div>
                      <div className="space-y-2">
                        <Label>Zona preferida</Label>
                        <Input defaultValue="Nueva Andalucía" />
                      </div>
                      <div className="space-y-2">
                        <Label>Tipología</Label>
                        <Select defaultValue="villa">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="villa">Villa</SelectItem>
                            <SelectItem value="apartamento">Apartamento</SelectItem>
                            <SelectItem value="atico">Ático</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Timing</Label>
                        <Select defaultValue="3-6">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urgente">Urgente</SelectItem>
                            <SelectItem value="1-3">1-3 meses</SelectItem>
                            <SelectItem value="3-6">3-6 meses</SelectItem>
                            <SelectItem value="6+">+6 meses</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Notas</Label>
                      <Textarea placeholder="Añadir notas sobre el lead..." rows={4} />
                    </div>
                    <Button className="bg-gradient-primary hover:opacity-90">
                      Guardar cambios
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="matching" className="space-y-4 mt-4">
                {mockProperties.map((prop) => (
                  <Card key={prop.id} className="shadow-card hover:shadow-card-hover transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={prop.imagen}
                          alt="Property"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-bold text-lg">{prop.precio}</p>
                              <p className="text-sm text-muted-foreground">{prop.zona}</p>
                            </div>
                            <Badge className="bg-success text-success-foreground">
                              {prop.score}% match
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                            <span>{prop.m2}</span>
                            <span>{prop.dormitorios} dorm</span>
                            <span>{prop.banos} baños</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Añadir a presentación
                            </Button>
                            <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                              <MessageSquare className="mr-2 h-3 w-3" />
                              Enviar por WhatsApp
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
                      No hay documentos compartidos todavía
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
                  Acciones IA Rápidas
                </h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    Generar presentación
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    Solicitar disponibilidad
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    Escalar a humano
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Actividad Reciente</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    <div>
                      <p className="text-muted-foreground">Mensaje recibido</p>
                      <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-success mt-1.5" />
                    <div>
                      <p className="text-muted-foreground">Lead cualificado por IA</p>
                      <p className="text-xs text-muted-foreground">Hace 3 horas</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    <div>
                      <p className="text-muted-foreground">Lead creado</p>
                      <p className="text-xs text-muted-foreground">Hace 5 horas</p>
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
