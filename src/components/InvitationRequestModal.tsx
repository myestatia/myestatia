import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { requestInvitation } from "@/api/invitations";
import { Loader2, Building2, Mail } from "lucide-react";

interface InvitationRequestModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const InvitationRequestModal = ({ open, onOpenChange }: InvitationRequestModalProps) => {
    const [email, setEmail] = useState("");
    const [companyName, setCompanyName] = useState("");
    const { toast } = useToast();

    const requestMutation = useMutation({
        mutationFn: () => requestInvitation(email, companyName),
        onSuccess: (data) => {
            toast({
                title: data.success ? "Request Submitted" : "Information",
                description: data.message,
            });
            if (data.success) {
                setEmail("");
                setCompanyName("");
                onOpenChange(false);
            }
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to request invitation. Please try again.",
                variant: "destructive",
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !companyName) {
            toast({
                title: "Missing Information",
                description: "Please provide both email and company name.",
                variant: "destructive",
            });
            return;
        }
        requestMutation.mutate();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Request Invitation</DialogTitle>
                    <DialogDescription>
                        To access MyEstatia, you need a valid invitation from your real estate company.
                        If you have one, please enter your email and company name below.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="companyName">Real Estate Company Name</Label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="companyName"
                                placeholder="Your Company Name"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div className="bg-muted p-3 rounded-md text-sm text-muted-foreground">
                        <p>
                            If there are available invitations for your company, a registration link will be sent to your email.
                        </p>
                        <p className="mt-2">
                            No invitations available? Contact{" "}
                            <a href="mailto:myestatia@gmail.com" className="text-primary hover:underline">
                                myestatia@gmail.com
                            </a>
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-primary hover:opacity-90"
                            disabled={requestMutation.isPending}
                        >
                            {requestMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Request"
                            )}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default InvitationRequestModal;
