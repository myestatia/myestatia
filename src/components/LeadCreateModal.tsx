import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLead } from "@/api/leads";
import { useToast } from "@/hooks/use-toast";

interface LeadCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LeadCreateModal = ({ isOpen, onClose }: LeadCreateModalProps) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        language: "es",
        source: "web",
    });

    const createMutation = useMutation({
        mutationFn: createLead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leads"] });
            toast({
                title: "Lead created",
                description: "The lead has been successfully created.",
            });
            setFormData({ name: "", email: "", phone: "", language: "es", source: "web" });
            onClose();
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Could not create the lead. Please try again.",
                variant: "destructive",
            });
        },
    });

    const handleSubmit = () => {
        if (!formData.name || !formData.email) {
            toast({
                title: "Validation Error",
                description: "Name and Email are required.",
                variant: "destructive",
            });
            return;
        }
        createMutation.mutate(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Lead</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name *
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email *
                        </Label>
                        <Input
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Phone
                        </Label>
                        <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="language" className="text-right">
                            Language
                        </Label>
                        <Select
                            value={formData.language}
                            onValueChange={(val) => setFormData({ ...formData, language: val })}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="de">German</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="source" className="text-right">
                            Source
                        </Label>
                        <Select
                            value={formData.source}
                            onValueChange={(val) => setFormData({ ...formData, source: val })}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="web">Web</SelectItem>
                                <SelectItem value="idealista">Idealista</SelectItem>
                                <SelectItem value="fotocasa">Fotocasa</SelectItem>
                                <SelectItem value="referral">Referral</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={createMutation.isPending}>
                        {createMutation.isPending ? "Creating..." : "Create Lead"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LeadCreateModal;
