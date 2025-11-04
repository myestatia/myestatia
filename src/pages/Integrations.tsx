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
    id: "resales",
    nombre: "RESALES",
    descripcion: "MLS España - Portal líder de propiedades en la Costa del Sol",
    logo: "🏠",
    estado: "desconectado",
    categoria: "MLS"
  },
  {
    id: "kommo",
    nombre: "Kommo",
    descripcion: "CRM especializado en mensajería para inmobiliarias",
    logo: "💬",
    estado: "desconectado",
    categoria: "CRM"
  },
  {
    id: "inmobalia",
    nombre: "Inmobalia",
    descripcion: "Software de gestión inmobiliaria integral",
    logo: "🏢",
    estado: "desconectado",
    categoria: "CRM"
  },
  {
    id: "mls-usa",
    nombre: "MLS USA",
    descripcion: "RESO Web API - Acceso a listados MLS de Estados Unidos",
    logo: "🇺🇸",
    estado: "desconectado",
    categoria: "MLS"
  },
  {
    id: "propertybase",
    nombre: "Propertybase",
    descripcion: "CRM inmobiliario basado en Salesforce",
    logo: "⚡",
    estado: "desconectado",
    categoria: "CRM"
  },
  {
    id: "hubspot",
    nombre: "HubSpot",
    descripcion: "Plataforma CRM y marketing todo en uno",
    logo: "🔶",
    estado: "desconectado",
    categoria: "CRM"
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
        title: "Conexión exitosa",
        description: "La integración se ha configurado correctamente",
      });
    }, 2000);
  };

  const getEstadoBadge = (estado: string) => {
    if (estado === "conectado") {
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Conectado
        </Badge>
      );
    }
    if (estado === "error") {
      return (
        <Badge variant="destructive">
          <AlertCircle className="mr-1 h-3 w-3" />
          Error
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-muted">
        Desconectado
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Integraciones</h1>
          <p className="text-muted-foreground">
            Conecta tus herramientas favoritas para automatizar tu flujo de trabajo con IA
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <Card key={integration.id} className="shadow-card hover:shadow-card-hover transition-all">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="text-4xl mb-2">{integration.logo}</div>
                  {getEstadoBadge(integration.estado)}
                </div>
                <CardTitle className="text-xl">{integration.nombre}</CardTitle>
                <CardDescription className="text-sm">
                  {integration.descripcion}
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
                      Configurar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <span className="text-2xl">{integration.logo}</span>
                        Configurar {integration.nombre}
                      </DialogTitle>
                      <DialogDescription>
                        Conecta {integration.nombre} para sincronizar leads y propiedades automáticamente
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                      {/* Credenciales */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Credenciales</h3>
                        <div className="space-y-2">
                          <Label htmlFor="apiKey">API Key</Label>
                          <Input
                            id="apiKey"
                            type="password"
                            placeholder="Ingresa tu API Key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                          />
                        </div>
                        {integration.categoria === "MLS" && (
                          <div className="space-y-2">
                            <Label htmlFor="urlBase">URL Base (opcional)</Label>
                            <Input
                              id="urlBase"
                              placeholder="https://api.ejemplo.com"
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
                          {testing ? "Probando conexión..." : "Probar conexión"}
                        </Button>
                      </div>

                      {/* Módulos */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Módulos a sincronizar</h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="leads" defaultChecked />
                            <label htmlFor="leads" className="text-sm cursor-pointer">
                              Leads (webhooks/polling)
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="properties" defaultChecked />
                            <label htmlFor="properties" className="text-sm cursor-pointer">
                              Propiedades (sincronización bidireccional)
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="activities" />
                            <label htmlFor="activities" className="text-sm cursor-pointer">
                              Actividades y Notas
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Eventos IA */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Eventos que disparan IA</h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="newLead" defaultChecked />
                            <label htmlFor="newLead" className="text-sm cursor-pointer">
                              Nuevo lead → Cualificar y contactar automáticamente
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="newProperty" defaultChecked />
                            <label htmlFor="newProperty" className="text-sm cursor-pointer">
                              Nueva propiedad → Detectar leads compatibles y contactar
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="birthday" />
                            <label htmlFor="birthday" className="text-sm cursor-pointer">
                              Cumpleaños/fecha clave → Mensaje personalizado
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button className="flex-1 bg-gradient-primary hover:opacity-90">
                          Guardar configuración
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
