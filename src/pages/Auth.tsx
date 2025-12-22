import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Sparkles, Building2 } from "lucide-react";
import { fetchClient } from "@/api/client";
import { useAuth } from "@/context/AuthContext";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin
        ? { email, password }
        : { email, password, name, company_name: companyName };

      const response = await fetchClient<{ token: string; agent: any }>(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      login(response.token, response.agent);

      toast({
        title: isLogin ? "¡Bienvenido!" : "¡Cuenta creada!",
        description: isLogin
          ? "Has iniciado sesión correctamente"
          : "Tu cuenta ha sido creada exitosamente",
      });
      navigate("/ai-actions");
    } catch (error: any) {
      console.error(error);
      let title = "Error";
      let message = error.message || "Ha ocurrido un error durante la autenticación";

      if (message.includes("401") || message.includes("Unauthorized")) {
        title = isLogin ? "Acceso Denegado" : "Error de Registro";
        message = "Usuario y/o contraseña incorrectas. Por favor asegúrate de que tus credenciales son correctas.";
      }

      toast({
        title: title,
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    toast({
      title: "Próximamente",
      description: "Autenticación con Google estará disponible pronto",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md shadow-card-hover border-border">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">MyEstatia</CardTitle>
          </div>
          <CardDescription>
            {isLogin ? "Inicia sesión en tu cuenta" : "Crea una nueva cuenta"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Nombre de la Inmobiliaria</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company"
                      placeholder="Inmobiliaria Ejemplar"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      className="border-border pl-9"
                    />
                  </div>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-border"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90" disabled={loading}>
              {loading ? "Cargando..." : isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">O continúa con</span>
            </div>
          </div>

          {/* Google Auth - Disabled until implemented
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleAuth}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
               ...
            </svg>
            Google
          </Button>
          */}

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};



export default Auth;
