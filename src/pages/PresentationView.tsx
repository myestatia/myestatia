import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPresentation } from "@/api/presentations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, MapPin, Home, Bed, Bath, MessageSquare, Phone } from "lucide-react";

const PresentationView = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    const { data: presentation, isLoading, error } = useQuery({
        queryKey: ['presentation', token],
        queryFn: () => getPresentation(token!),
        enabled: !!token,
        retry: false,
    });

    const handlePrevious = () => {
        if (presentation && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (presentation && currentIndex < presentation.properties.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleWhatsApp = (property: typeof presentation.properties[0]) => {
        if (!presentation?.contactPhone) return;
        const shareText = `Hello, I'm interested in the property: ${property.title} (${property.reference}).}`;
        const url = `https://wa.me/${presentation.contactPhone.replace(/\D/g, '')}?text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank');
    };

    const handleCall = () => {
        if (!presentation?.contactPhone) return;
        window.location.href = `tel:${presentation.contactPhone}`;
    };

    // Keyboard navigation
    useState(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'ArrowRight') handleNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !presentation) {
        return (
            <div className="flex flex-col h-screen items-center justify-center gap-4 bg-slate-50">
                <h1 className="text-2xl font-bold">Presentation Not Found</h1>
                <p className="text-muted-foreground">
                    {error && 'status' in (error as any) && (error as any).status === 410
                        ? 'This presentation has expired.'
                        : 'The link might be invalid or expired.'}
                </p>
                <Button onClick={() => navigate("/")}>Go Home</Button>
            </div>
        );
    }

    if (presentation.properties.length === 0) {
        return (
            <div className="flex flex-col h-screen items-center justify-center gap-4 bg-slate-50">
                <h1 className="text-2xl font-bold">No Properties</h1>
                <p className="text-muted-foreground">This presentation doesn't contain any properties.</p>
                <Button onClick={() => navigate("/")}>Go Home</Button>
            </div>
        );
    }

    const currentProperty = presentation.properties[currentIndex];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Property Presentation</h1>
                        <p className="text-sm text-muted-foreground">
                            For {presentation.lead.name}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            {currentIndex + 1} / {presentation.properties.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Carousel Container */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="relative">
                    {/* Navigation Buttons */}
                    {currentIndex > 0 && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-12 w-12 rounded-full bg-white shadow-lg hover:bg-slate-50"
                            onClick={handlePrevious}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                    )}
                    {currentIndex < presentation.properties.length - 1 && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-12 w-12 rounded-full bg-white shadow-lg hover:bg-slate-50"
                            onClick={handleNext}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    )}

                    {/* Property Card */}
                    <Card className="overflow-hidden shadow-xl border-none">
                        <div className="relative h-[400px] w-full">
                            <img
                                src={currentProperty.image || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop"}
                                alt={currentProperty.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4 flex gap-2">
                                <Badge className="bg-primary text-white text-lg px-4 py-1">
                                    {currentProperty.status || "Available"}
                                </Badge>
                            </div>
                        </div>

                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                <div className="flex-1">
                                    <h2 className="text-4xl font-bold mb-2">{currentProperty.title}</h2>
                                    <div className="flex items-center gap-2 text-muted-foreground mb-6">
                                        <MapPin className="h-5 w-5" />
                                        <span className="text-lg">
                                            {currentProperty.address || currentProperty.zone || "Contact for address"}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 py-6 border-y border-slate-100">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-muted-foreground uppercase tracking-wider">Price</span>
                                            <span className="text-3xl font-extrabold text-primary">
                                                {currentProperty.price ? `${currentProperty.price.toLocaleString()}€` : "Consult"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-muted-foreground uppercase tracking-wider">Reference</span>
                                            <span className="text-xl font-semibold">{currentProperty.reference}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-muted-foreground uppercase tracking-wider">Size</span>
                                            <div className="flex items-center gap-2">
                                                <Home className="h-5 w-5 text-primary" />
                                                <span className="text-xl font-semibold">{currentProperty.area || 0} m²</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-muted-foreground uppercase tracking-wider">Rooms</span>
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2">
                                                    <Bed className="h-5 w-5 text-primary" />
                                                    <span className="text-xl font-semibold">{currentProperty.rooms || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Bath className="h-5 w-5 text-primary" />
                                                    <span className="text-xl font-semibold">{currentProperty.bathrooms || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="prose max-w-none">
                                        <h3 className="text-xl font-bold mb-4">Description</h3>
                                        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                            {currentProperty.description || "No description available for this property."}
                                        </p>
                                    </div>
                                </div>

                                <div className="w-full md:w-80 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                    <h3 className="text-lg font-bold mb-4">Interested?</h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        Contact us to schedule a visit or for more information about this property.
                                    </p>
                                    <Button
                                        className="w-full mb-3 bg-emerald-600 hover:bg-emerald-700"
                                        size="lg"
                                        onClick={() => handleWhatsApp(currentProperty)}
                                        disabled={!presentation.contactPhone}
                                    >
                                        <MessageSquare className="mr-2 h-5 w-5" />
                                        Contact via WhatsApp
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        size="lg"
                                        onClick={handleCall}
                                        disabled={!presentation.contactPhone}
                                    >
                                        <Phone className="mr-2 h-5 w-5" />
                                        {presentation.contactPhone ? `Call: ${presentation.contactPhone}` : "Call us"}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dots Indicator */}
                    {presentation.properties.length > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            {presentation.properties.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-2 rounded-full transition-all ${index === currentIndex
                                        ? 'w-8 bg-primary'
                                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                                        }`}
                                    aria-label={`Go to property ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PresentationView;
