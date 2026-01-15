import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { resetPassword, validateResetToken } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";

interface PasswordStrength {
    score: number; // 0-3: weak, medium, strong
    label: string;
    color: string;
    checks: {
        length: boolean;
        uppercase: boolean;
        lowercase: boolean;
        number: boolean;
        special: boolean;
    };
}

const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();
    const { toast } = useToast();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [isValidToken, setIsValidToken] = useState(false);

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                toast({
                    title: "Error",
                    description: "Token inválido",
                    variant: "destructive",
                });
                navigate("/auth");
                return;
            }

            try {
                await validateResetToken(token);
                setIsValidToken(true);
            } catch (error) {
                toast({
                    title: "Token inválido o expirado",
                    description: "El enlace de recuperación ha expirado o es inválido",
                    variant: "destructive",
                });
                setTimeout(() => navigate("/auth"), 3000);
            } finally {
                setIsValidating(false);
            }
        };

        validateToken();
    }, [token, navigate, toast]);

    const calculatePasswordStrength = (pwd: string): PasswordStrength => {
        const checks = {
            length: pwd.length >= 8,
            uppercase: /[A-Z]/.test(pwd),
            lowercase: /[a-z]/.test(pwd),
            number: /[0-9]/.test(pwd),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
        };

        const passedChecks = Object.values(checks).filter(Boolean).length;

        let score = 0;
        let label = "Muy débil";
        let color = "text-destructive";

        if (passedChecks >= 5 && pwd.length >= 12) {
            score = 3;
            label = "Fuerte";
            color = "text-green-600";
        } else if (passedChecks >= 4 && pwd.length >= 8) {
            score = 2;
            label = "Media";
            color = "text-yellow-600";
        } else if (passedChecks >= 2) {
            score = 1;
            label = "Débil";
            color = "text-orange-600";
        }

        return { score, label, color, checks };
    };

    const strength = calculatePasswordStrength(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Las contraseñas no coinciden",
                variant: "destructive",
            });
            return;
        }

        if (!strength.checks.length) {
            toast({
                title: "Contraseña muy débil",
                description: "La contraseña debe tener al menos 8 caracteres",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword(token!, password);
            toast({
                title: "Contraseña restablecida",
                description: "Tu contraseña ha sido actualizada exitosamente",
            });
            setTimeout(() => navigate("/auth"), 2000);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "No se pudo restablecer la contraseña",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const preventPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        toast({
            title: "Acción no permitida",
            description: "Por seguridad, no se permite pegar en este campo",
            variant: "destructive",
        });
    };

    if (isValidating) {
        return (
            <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
                <Card className="w-full max-w-md shadow-card">
                    <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Validating link...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!isValidToken) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-card">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                    <CardDescription>
                        Enter your new password. It should be secure and easy to remember.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onPaste={preventPaste}
                                    className="pl-10 pr-10"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Password Strength Indicator */}
                        {password && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Password strength:</span>
                                    <span className={`text-sm font-medium ${strength.color}`}>{strength.label}</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all ${strength.score === 3
                                            ? "bg-green-600"
                                            : strength.score === 2
                                                ? "bg-yellow-600"
                                                : strength.score === 1
                                                    ? "bg-orange-600"
                                                    : "bg-destructive"
                                            }`}
                                        style={{ width: `${(strength.score + 1) * 25}%` }}
                                    />
                                </div>
                                <div className="space-y-1 text-xs">
                                    <div className="flex items-center gap-2">
                                        {strength.checks.length ? (
                                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                                        ) : (
                                            <XCircle className="h-3 w-3 text-muted-foreground" />
                                        )}
                                        <span className={strength.checks.length ? "text-green-600" : "text-muted-foreground"}>
                                            At least 8 characters
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {strength.checks.uppercase ? (
                                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                                        ) : (
                                            <XCircle className="h-3 w-3 text-muted-foreground" />
                                        )}
                                        <span className={strength.checks.uppercase ? "text-green-600" : "text-muted-foreground"}>
                                            At least one uppercase letter
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {strength.checks.lowercase ? (
                                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                                        ) : (
                                            <XCircle className="h-3 w-3 text-muted-foreground" />
                                        )}
                                        <span className={strength.checks.lowercase ? "text-green-600" : "text-muted-foreground"}>
                                            At least one lowercase letter
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {strength.checks.number ? (
                                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                                        ) : (
                                            <XCircle className="h-3 w-3 text-muted-foreground" />
                                        )}
                                        <span className={strength.checks.number ? "text-green-600" : "text-muted-foreground"}>
                                            At least one number
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {strength.checks.special ? (
                                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                                        ) : (
                                            <XCircle className="h-3 w-3 text-muted-foreground" />
                                        )}
                                        <span className={strength.checks.special ? "text-green-600" : "text-muted-foreground"}>
                                            At least one special character (!@#$%^&*)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onPaste={preventPaste}
                                    className="pl-10 pr-10"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-xs text-destructive">Passwords do not match</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-primary hover:opacity-90"
                            disabled={isLoading || password !== confirmPassword || !strength.checks.length}
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPassword;
