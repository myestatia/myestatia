import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createProperty, getSubtypes } from "@/api/properties";
import { useToast } from "@/hooks/use-toast";

interface PropertyCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PropertyCreateModal = ({ isOpen, onClose }: PropertyCreateModalProps) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [formData, setFormData] = useState<{
        title: string;
        price: string;
        description: string;
        zone: string;
        address: string;
        city: string;
        province: string;
        rooms: string;
        bathrooms: string;
        area: string;
        status: string;
        type: string;
        subtypeId: string;
        yearBuilt: string;
        energyCertificate: string;
        image: File | null;
        isNew: boolean;
    }>({
        title: "",
        price: "",
        description: "",
        zone: "",
        address: "",
        city: "",
        province: "",
        rooms: "",
        bathrooms: "",
        area: "",
        status: "available",
        type: "",
        subtypeId: "",
        yearBuilt: "",
        energyCertificate: "",
        image: null,
        isNew: false,
    });

    const { data: subtypes, isLoading: isLoadingSubtypes } = useQuery({
        queryKey: ['subtypes', formData.type],
        queryFn: () => getSubtypes(formData.type),
        enabled: !!formData.type,
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => {
            const { image, ...rest } = data;
            const propertyData = {
                ...rest,
                price: rest.price ? parseFloat(rest.price) : 0,
                rooms: rest.rooms ? parseInt(rest.rooms) : 0,
                bathrooms: rest.bathrooms ? parseInt(rest.bathrooms) : 0,
                area: rest.area ? parseFloat(rest.area) : 0,
                yearBuilt: rest.yearBuilt ? parseInt(rest.yearBuilt) : 0,
                energyCertificate: rest.energyCertificate || "",
            };
            return createProperty(propertyData, image);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["properties"] });
            toast({
                title: "Property created",
                description: "The property has been successfully created.",
            });
            setFormData({
                title: "",
                price: "",
                description: "",
                zone: "",
                address: "",
                city: "",
                province: "",
                rooms: "",
                bathrooms: "",
                area: "",
                status: "available",
                type: "",
                subtypeId: "",
                yearBuilt: "",
                energyCertificate: "",
                image: null,
                isNew: false,
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
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Add New Property</DialogTitle>
                </DialogHeader>
                <div id="property-form" className="grid gap-4 py-4 overflow-y-auto px-1">
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
                            type="text"
                            value={formData.price ? new Intl.NumberFormat('es-ES').format(parseFloat(formData.price.replace(/\./g, ''))) : ''}
                            onChange={(e) => {
                                // Remove points to get raw number
                                const rawValue = e.target.value.replace(/\./g, '');
                                // Check if it is a number
                                if (/^\d*$/.test(rawValue)) {
                                    setFormData({ ...formData, price: rawValue });
                                }
                            }}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4" id="property-description">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <textarea
                            id="description"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4" id="property-image">
                        <Label htmlFor="image" className="text-right">Image</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setFormData({ ...formData, image: file });
                                }
                            }}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4" id="property-address">
                        <Label htmlFor="address" className="text-right">Address</Label>
                        <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4" id="property-city">
                        <Label htmlFor="city" className="text-right">City</Label>
                        <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4" id="property-province">
                        <Label htmlFor="province" className="text-right">Province</Label>
                        <Input
                            id="province"
                            value={formData.province}
                            onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4" id="property-zone">
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
                    <div className="grid grid-cols-4 items-center gap-4" id="property-area">
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
                    <div className="grid grid-cols-4 items-center gap-4" id="property-rooms">
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
                    <div className="grid grid-cols-4 items-center gap-4" id="property-bathrooms">
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
                    <div className="grid grid-cols-4 items-center gap-4" id="property-year-built">
                        <Label htmlFor="yearBuilt" className="text-right">
                            Year Built
                        </Label>
                        <Input
                            id="yearBuilt"
                            type="number"
                            value={formData.yearBuilt}
                            onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4" id="property-energy-certificate">
                        <Label htmlFor="energyCertificate" className="text-right">Energy Cert.</Label>
                        <Input
                            id="energyCertificate"
                            type="text"
                            value={formData.energyCertificate}
                            onChange={(e) => setFormData({ ...formData, energyCertificate: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4" id="property-type">
                        <Label htmlFor="type" className="text-right">Type</Label>
                        <Select
                            value={formData.type}
                            onValueChange={(val) => {
                                setFormData({ ...formData, type: val, subtypeId: "" });
                            }}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="APARTMENT">Apartment</SelectItem>
                                <SelectItem value="HOUSE">House</SelectItem>
                                <SelectItem value="LAND">Land</SelectItem>
                                <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4" id="property-subtype">
                        <Label htmlFor="subtype" className="text-right">Subtype</Label>
                        <Select
                            value={formData.subtypeId}
                            onValueChange={(val) => setFormData({ ...formData, subtypeId: val })}
                            disabled={!formData.type}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder={isLoadingSubtypes ? "Loading..." : "Select Subtype"} />
                            </SelectTrigger>
                            <SelectContent>
                                {subtypes?.map((st) => (
                                    <SelectItem key={st.id} value={st.id}>{st.displayName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4" id="property-status">
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
                    <div className="grid grid-cols-4 items-center gap-4" id="property-is-new">
                        <Label htmlFor="isNew" className="text-right">
                            New Property
                        </Label>
                        <div className="flex items-center space-x-2 col-span-3">
                            <input
                                type="checkbox"
                                id="isNew"
                                checked={formData.isNew}
                                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-muted-foreground">Yes</span>
                        </div>
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
