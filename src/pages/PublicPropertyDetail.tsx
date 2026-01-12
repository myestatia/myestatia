import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { client as api } from "@/api/client";
import { Property } from "@/api/properties";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Home, Bed, Bath, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PublicPropertyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery<{ property: Property, contactPhone: string }>({
        queryKey: ["public-property", id],
        queryFn: async () => {
            const response = await api.get(`/public/properties/${id}`);
            return response.data;
        },
    });

    const property = data?.property;
    const contactPhone = data?.contactPhone;

    const handleWhatsApp = () => {
        if (!contactPhone || !property) return;
        const shareText = `Hola, estoy interesado en la propiedad: ${property.title} (${property.reference}).\nLink: ${window.location.href}`;
        const url = `https://wa.me/${contactPhone.replace(/\D/g, '')}?text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank');
    };

    const handleCall = () => {
        if (!contactPhone) return;
        window.location.href = `tel:${contactPhone}`;
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="flex flex-col h-screen items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Property not found</h1>
                <p className="text-muted-foreground">The link might be expired or invalid.</p>
                <Button onClick={() => navigate("/")}>Go Home</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <div className="max-w-5xl mx-auto px-4 pt-8">
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </div>

                <Card className="overflow-hidden shadow-xl border-none">
                    <div className="relative h-[400px] w-full">
                        <img
                            src={property.image || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop"}
                            alt={property.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                            <Badge className="bg-primary text-white text-lg px-4 py-1">
                                {property.status || "Available"}
                            </Badge>
                            {property.isNew && (
                                <Badge className="bg-success text-success-foreground text-lg px-4 py-1">
                                    New
                                </Badge>
                            )}
                        </div>
                    </div>

                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold mb-2">{property.title}</h1>
                                <div className="flex items-center gap-2 text-muted-foreground mb-6">
                                    <MapPin className="h-5 w-5" />
                                    <span className="text-lg">{property.address || property.zone || "Contact for address"}</span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 py-6 border-y border-slate-100 italic">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-muted-foreground uppercase tracking-wider">Price</span>
                                        <span className="text-3xl font-extrabold text-primary">
                                            {property.price ? `${property.price.toLocaleString()}€` : "Consult"}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-muted-foreground uppercase tracking-wider">Reference</span>
                                        <span className="text-xl font-semibold">{property.reference}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-muted-foreground uppercase tracking-wider">Size</span>
                                        <div className="flex items-center gap-2">
                                            <Home className="h-5 w-5 text-primary" />
                                            <span className="text-xl font-semibold">{property.area || 0} m²</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-muted-foreground uppercase tracking-wider">Rooms</span>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2">
                                                <Bed className="h-5 w-5 text-primary" />
                                                <span className="text-xl font-semibold">{property.rooms || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Bath className="h-5 w-5 text-primary" />
                                                <span className="text-xl font-semibold">{property.bathrooms || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose max-w-none">
                                    <h3 className="text-xl font-bold mb-4">Description</h3>
                                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                        {property.description || "No description available for this property."}
                                    </p>
                                </div>
                            </div>

                            <div className="w-full md:w-80 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <h3 className="text-lg font-bold mb-4">Interested?</h3>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Contact our agents to schedule a visit or for more information.
                                </p>
                                <Button className="w-full mb-3 bg-emerald-600 hover:bg-emerald-700" size="lg" onClick={handleWhatsApp} disabled={!contactPhone}>
                                    Contact via WhatsApp
                                </Button>
                                <Button variant="outline" className="w-full" size="lg" onClick={handleCall} disabled={!contactPhone}>
                                    {contactPhone ? `Call: ${contactPhone}` : "Call us"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PublicPropertyDetail;
