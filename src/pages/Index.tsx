import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Zap, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col justify-center">
      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16 space-y-8">
          <header className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-12 w-12 text-primary" />
              <h1 className="text-5xl font-bold">MyEstatia</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-Powered Real Estate CRM. Manage leads, properties, and integrations via a simple ChatGPT-like interface.
            </p>
          </header>

          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-primary hover:opacity-90 shadow-ai text-lg"
              onClick={() => navigate("/ai-actions")}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Start Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/ai-actions")}
            >
              View Demo
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Target className="h-6 w-6 text-primary" />}
            title="Operational AI"
            description="The AI agent qualifies leads, matches them with properties, and automatically contacts them via WhatsApp or Email."
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-primary" />}
            title="Powerful Integrations"
            description="Connect RESALES, Kommo, Inmobalia, MLS USA, and more. Sync data in real-time effortlessly."
          />
          <FeatureCard
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
            title="Simple Management"
            description="Minimalist ChatGPT-like interface. Manage leads, properties, and conversations from a single place."
          />
        </section>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="text-center p-6 rounded-lg hover:bg-card/50 transition-colors">
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

export default Index;
