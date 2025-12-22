import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProperty, updateProperty, Property } from "@/api/properties";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import PropertyHeader from "@/components/property/PropertyHeader";
import PropertyTabs from "@/components/property/PropertyTabs";
import PropertySidebar from "@/components/property/PropertySidebar";

const PropertyDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<Property>>({});

    const { data: property, isLoading } = useQuery({
        queryKey: ['property', id],
        queryFn: () => getProperty(id!),
        enabled: !!id,
    });

    useEffect(() => {
        if (property) {
            setFormData(property);
        }
    }, [property]);

    const updateMutation = useMutation({
        mutationFn: (data: Partial<Property>) => updateProperty(id!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['property', id] });
            setIsEditing(false);
            toast({
                title: "Property updated",
                description: "The property details have been successfully updated.",
            });
        },
        onError: (error) => {
            toast({
                title: "Error updating property",
                description: "Failed to update property details. Please try again.",
                variant: "destructive",
            });
            console.error(error);
        },
    });

    const handleSave = () => {
        updateMutation.mutate(formData);
    };

    const handleCancel = () => {
        if (property) {
            setFormData(property);
        }
        setIsEditing(false);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading property...</div>;
    }

    if (!property) {
        return <div className="flex justify-center items-center min-h-screen">Property not found</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <Header />

            <div className="container mx-auto p-6">
                <Button variant="ghost" onClick={() => navigate("/properties")} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Properties
                </Button>

                {/* Header Card */}
                <PropertyHeader
                    property={property}
                    isEditing={isEditing}
                    formData={formData}
                    setFormData={setFormData}
                    setIsEditing={setIsEditing}
                    updateMutation={updateMutation}
                    onCancel={handleCancel}
                    onSave={handleSave}
                />

                {/* Main Content Tabs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <PropertyTabs
                            property={property}
                            isEditing={isEditing}
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </div>

                    {/* Sidebar info */}
                    <div className="col-span-1">
                        <PropertySidebar />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;
