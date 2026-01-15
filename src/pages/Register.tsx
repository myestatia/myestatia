import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { validateInvitation, registerWithToken } from "@/api/invitations";
import { useAuth } from "@/context/AuthContext";

const Register = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { login } = useAuth();

    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [invitation, setInvitation] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const checkInvitation = async () => {
            if (!token) {
                setError("Invalid invitation link");
                setLoading(false);
                return;
            }

            try {
                const inv = await validateInvitation(token);
                setInvitation(inv);
                setLoading(false);
            } catch (err: any) {
                console.error(err);
                if (err.message.includes("404")) {
                    setError("Invitation not found");
                } else if (err.message.includes("410") || err.message.includes("already used")) {
                    setError("This invitation has already been used");
                } else if (err.message.includes("expired")) {
                    setError("This invitation has expired");
                } else {
                    setError("Invalid invitation");
                }
                setLoading(false);
            }
        };

        checkInvitation();
    }, [token]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "Passwords don't match",
                description: "Please make sure both passwords are the same",
                variant: "destructive",
            });
            return;
        }

        if (password.length < 8) {
            toast({
                title: "Password too short",
                description: "Password must be at least 8 characters long",
                variant: "destructive",
            });
            return;
        }

        setRegistering(true);

        try {
            const response = await registerWithToken(token!, {
                name,
                email: invitation.email,
                password,
            });

            login(response.token, response.agent);

            toast({
                title: "Account created!",
                description: "Welcome to MyEstatia",
            });

            navigate("/ai-actions");
        } catch (err: any) {
            console.error(err);
            toast({
                title: "Registration failed",
                description: err.message || "Failed to create account. Please try again.",
                variant: "destructive",
            });
        } finally {
            setRegistering(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
                <Card className="w-full max-w-md shadow-card-hover">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Validating invitation...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
                <Card className="w-full max-w-md shadow-card-hover">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <AlertCircle className="h-12 w-12 text-destructive" />
                        </div>
                        <CardTitle>Invalid Invitation</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => navigate("/")}
                            className="w-full bg-gradient-primary hover:opacity-90"
                        >
                            Go to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
            <Card className="w-full max-w-md shadow-card-hover border-border">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <CardTitle className="text-2xl font-bold">MyEstatia</CardTitle>
                    </div>
                    <CardDescription>Complete your registration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-success/10 border border-success/20 rounded-lg p-3 flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                            <p className="font-medium text-success">Valid Invitation</p>
                            <p className="text-muted-foreground">
                                Registering as: <span className="font-medium">{invitation?.email}</span>
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="border-border"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email (Read-only)</Label>
                            <Input
                                id="email"
                                type="email"
                                value={invitation?.email || ""}
                                readOnly
                                disabled
                                className="border-border bg-muted"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                className="border-border"
                            />
                            <p className="text-xs text-muted-foreground">
                                Must be at least 8 characters long
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                                className="border-border"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-primary hover:opacity-90"
                            disabled={registering}
                        >
                            {registering ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="text-primary hover:underline"
                        >
                            Already have an account? Sign in
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;
