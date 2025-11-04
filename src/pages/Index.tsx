import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Zap, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold">MyEstatia</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            CRM inmobiliario potenciado con IA. Gestiona leads, propiedades e integraciones desde una interfaz simple tipo ChatGPT.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 shadow-ai text-lg"
              onClick={() => navigate("/auth")}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Comenzar Ahora
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/leads")}
            >
              Ver Demo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">IA Operacional</h3>
            <p className="text-muted-foreground text-sm">
              El agente IA cualifica leads, hace matching con propiedades y contacta automáticamente por WhatsApp o Email
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Integraciones Potentes</h3>
            <p className="text-muted-foreground text-sm">
              Conecta RESALES, Kommo, Inmobalia, MLS USA y más. Sincroniza datos en tiempo real sin esfuerzo
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Gestión Simple</h3>
            <p className="text-muted-foreground text-sm">
              Interfaz minimalista tipo ChatGPT. Gestiona leads, propiedades y conversaciones desde un solo lugar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
