import { Property } from "@/api/properties";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Share2, Edit, Save, X, Home, Bed, Bath } from "lucide-react";
import { format } from "date-fns";
import { UseMutationResult } from "@tanstack/react-query";
import ShareDialog from "./ShareDialog";

interface PropertyHeaderProps {
    property: Property;
    isEditing: boolean;
    formData: Partial<Property>;
    setFormData: (data: Partial<Property>) => void;
    setIsEditing: (isEditing: boolean) => void;
    updateMutation: UseMutationResult<any, Error, Partial<Property>, unknown>;
    onCancel: () => void;
    onSave: () => void;
}

const PropertyHeader = ({
    property,
    isEditing,
    formData,
    setFormData,
    setIsEditing,
    updateMutation,
    onCancel,
    onSave
}: PropertyHeaderProps) => {
    return (
        <Card className="shadow-card mb-6">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <img
                        src={property.image || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop"}
                        alt={property.title}
                        className="w-full md:w-1/3 h-64 object-cover rounded-lg"
                    />
                    <div className="flex-1" id="property-header">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold">{property.title}</h1>
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                        {property.status.charAt(0).toUpperCase() + property.status.slice(1) || "Available"}
                                    </Badge>
                                    {property.isNew && <Badge className="bg-success text-success-foreground">New</Badge>}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                    <MapPin className="h-4 w-4" />
                                    <span>{property.address || property.zone || "Address not available"}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {isEditing ? (
                                    <>
                                        <Button variant="outline" size="sm" onClick={onCancel}>
                                            <X className="mr-2 h-4 w-4" />
                                            Cancel
                                        </Button>
                                        <Button size="sm" onClick={onSave} disabled={updateMutation.isPending}>
                                            <Save className="mr-2 h-4 w-4" />
                                            {updateMutation.isPending ? "Saving..." : "Save"}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <ShareDialog property={property} />
                                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {isEditing ? (
                            <div className="grid grid-cols-1 gap-4 mb-4">
                                <Input
                                    value={formData.title || ""}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Property Title"
                                    className="text-lg font-bold"
                                />
                                <Input
                                    value={formData.zone || ""}
                                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                                    placeholder="Zone / Address"
                                />
                            </div>
                        ) : null}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Price</span>
                                {isEditing ? (
                                    <Input
                                        type="number"
                                        value={formData.price || ""}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-primary">
                                        {property.price ? `${property.price.toLocaleString()}€` : "Consult"}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Reference</span>
                                <span className="font-medium">{property.reference}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Created At</span>
                                <span className="font-medium">
                                    {property.createdAt ? format(new Date(property.createdAt), "dd/MM/yyyy") : "-"}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Source</span>
                                <span className="font-medium">{property.source || "Own"}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Badge variant="secondary" className="px-3 py-1">
                                <Home className="mr-2 h-4 w-4" />
                                {isEditing ? (
                                    <Input
                                        className="h-6 w-20 px-1 py-0 ml-1 text-xs"
                                        type="number"
                                        value={formData.area || ""}
                                        onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                                    />
                                ) : (
                                    `${property.area || 0} m²`
                                )}
                            </Badge>
                            <Badge variant="secondary" className="px-3 py-1">
                                <Bed className="mr-2 h-4 w-4" />
                                {isEditing ? (
                                    <Input
                                        className="h-6 w-16 px-1 py-0 ml-1 text-xs"
                                        type="number"
                                        value={formData.rooms || ""}
                                        onChange={(e) => setFormData({ ...formData, rooms: Number(e.target.value) })}
                                    />
                                ) : (
                                    `${property.rooms || 0} Bedrooms`
                                )}
                            </Badge>
                            <Badge variant="secondary" className="px-3 py-1">
                                <Bath className="mr-2 h-4 w-4" />
                                {isEditing ? (
                                    <Input
                                        className="h-6 w-16 px-1 py-0 ml-1 text-xs"
                                        type="number"
                                        value={formData.bathrooms || ""}
                                        onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                                    />
                                ) : (
                                    `${property.bathrooms || 0} Bathrooms`
                                )}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PropertyHeader;
