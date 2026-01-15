import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { fetchClient } from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import InvitationRequestModal from "@/components/InvitationRequestModal";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetchClient<{ token: string; agent: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      login(response.token, response.agent);

      toast({
        title: "Welcome!",
        description: "You have successfully logged in",
      });
      navigate("/ai-actions");
    } catch (error: any) {
      console.error(error);
      let title = "Error";
      let message = error.message || "An error occurred during authentication";

      if (message.includes("401") || message.includes("Unauthorized")) {
        title = "Access Denied";
        message = "Incorrect email or password. Please check your credentials.";
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md shadow-card-hover border-border">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">MyEstatia</CardTitle>
          </div>
          <CardDescription>
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
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
              {loading ? "Loading..." : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="text-center text-sm space-y-2">
            <p className="text-muted-foreground">Don't have an account?</p>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setShowInvitationModal(true)}
            >
              Request Invitation
            </Button>
          </div>
        </CardContent>
      </Card>

      <InvitationRequestModal
        open={showInvitationModal}
        onOpenChange={setShowInvitationModal}
      />
    </div>
  );
};

export default Auth;
