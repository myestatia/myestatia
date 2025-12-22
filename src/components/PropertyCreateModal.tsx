import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProperty } from "@/api/properties";
import { useToast } from "@/hooks/use-toast";

interface PropertyCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PropertyCreateModal = ({ isOpen, onClose }: PropertyCreateModalProps) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        zone: "",
        rooms: "",
        bathrooms: "",
        area: "",
        status: "available",
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => createProperty({
            ...data,
            price: data.price ? parseFloat(data.price) : 0,
            rooms: data.rooms ? parseInt(data.rooms) : 0,
            bathrooms: data.bathrooms ? parseInt(data.bathrooms) : 0,
            area: data.area ? parseFloat(data.area) : 0,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["properties"] });
            toast({
                title: "Property created",
                description: "The property has been successfully created.",
            });
            setFormData({
                title: "",
                price: "",
                zone: "",
                rooms: "",
                bathrooms: "",
                area: "",
                status: "available"
            });
            onClose();
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Could not create the property. Please try again.",
                variant: "destructive",
            });
        },
    });

    const handleSubmit = () => {
        if (!formData.title || !formData.price) {
            toast({
                title: "Validation Error",
                description: "Title and Price are required.",
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
                    <DialogTitle>Add New Property</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title *
                        </Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price (€) *
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="zone" className="text-right">
                            Zone
                        </Label>
                        <Input
                            id="zone"
                            value={formData.zone}
                            onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="area" className="text-right">
                            Area (m²)
                        </Label>
                        <Input
                            id="area"
                            type="number"
                            value={formData.area}
                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="rooms" className="text-right">
                            Rooms
                        </Label>
                        <Input
                            id="rooms"
                            type="number"
                            value={formData.rooms}
                            onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bathrooms" className="text-right">
                            Baths
                        </Label>
                        <Input
                            id="bathrooms"
                            type="number"
                            value={formData.bathrooms}
                            onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Status
                        </Label>
                        <Select
                            value={formData.status}
                            onValueChange={(val) => setFormData({ ...formData, status: val })}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="reserved">Reserved</SelectItem>
                                <SelectItem value="sold">Sold</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={createMutation.isPending}>
                        {createMutation.isPending ? "Creating..." : "Create Property"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PropertyCreateModal;
