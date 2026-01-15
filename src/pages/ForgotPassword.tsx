import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";
import { requestPasswordReset } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast({
                title: "Error",
                description: "Por favor ingrese su correo electrónico",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await requestPasswordReset(email);
            setSubmitted(true);
            toast({
                title: "Solicitud enviada",
                description: response.message,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Ocurrió un error al procesar su solicitud",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-card">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 mb-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/auth")}
                            className="gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Return to login
                        </Button>
                    </div>
                    <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
                    <CardDescription>
                        {submitted
                            ? "Check your email"
                            : "Enter your email and we'll send you a link to reset your password"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {submitted ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                                <p className="text-sm text-center">
                                    If the user exists, they will receive an email to reset their password.
                                    Please check your spam folder.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => navigate("/auth")}
                            >
                                Return to login
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-gradient-primary hover:opacity-90"
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending..." : "Send reset link"}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;
