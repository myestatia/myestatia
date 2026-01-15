import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Home, Bed, Bath, MapPin, Copy, Check } from "lucide-react";
import { getMatchingProperties, createPresentation } from "@/api/presentations";
import { useToast } from "@/hooks/use-toast";

interface PropertySelectionModalProps {
    leadId: string;
    leadName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const PropertySelectionModal = ({ leadId, leadName, open, onOpenChange }: PropertySelectionModalProps) => {
    const { toast } = useToast();
    const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
    const [presentationUrl, setPresentationUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const { data: matches, isLoading, error } = useQuery({
        queryKey: ['matching-properties', leadId],
        queryFn: async () => {
            const result = await getMatchingProperties(leadId);
            return result;
        },
        enabled: open,
        retry: false,
    });

    // Log any errors
    if (error) {
        console.error('Error fetching matching properties:', error);
    }

    const createPresentationMutation = useMutation({
        mutationFn: () => createPresentation(leadId, selectedPropertyIds),
        onSuccess: (data) => {
            setPresentationUrl(data.url);
            toast({
                title: "Presentation created",
                description: "The presentation link has been generated successfully.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to create presentation. Please try again.",
                variant: "destructive",
            });
        },
    });

    const handleToggleProperty = (propertyId: string) => {
        setSelectedPropertyIds(prev =>
            prev.includes(propertyId)
                ? prev.filter(id => id !== propertyId)
                : [...prev, propertyId]
        );
    };

    const handleGeneratePresentation = () => {
        if (selectedPropertyIds.length === 0) {
            toast({
                title: "No properties selected",
                description: "Please select at least one property.",
                variant: "destructive",
            });
            return;
        }
        createPresentationMutation.mutate();
    };

    const handleCopyUrl = () => {
        if (presentationUrl) {
            navigator.clipboard.writeText(presentationUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast({
                title: "Copied!",
                description: "Presentation link copied to clipboard.",
            });
        }
    };

    const handleClose = () => {
        setSelectedPropertyIds([]);
        setPresentationUrl(null);
        setCopied(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Presentation for {leadName}</DialogTitle>
                    <DialogDescription>
                        Select properties to include in the presentation. Properties are sorted by relevance.
                    </DialogDescription>
                </DialogHeader>

                {presentationUrl ? (
                    <div className="space-y-4">
                        <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                            <h3 className="font-semibold text-success mb-2">Presentation Created!</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Share this link with the lead. It will expire in 7 days.
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={presentationUrl}
                                    readOnly
                                    className="flex-1 px-3 py-2 border rounded-md bg-background text-sm"
                                />
                                <Button onClick={handleCopyUrl} variant="outline" size="sm">
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                        <Button onClick={handleClose} className="w-full">
                            Close
                        </Button>
                    </div>
                ) : (
                    <>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {matches && matches.length > 0 ? (
                                    <>
                                        <div className="space-y-3">
                                            {matches.map((match) => (
                                                <Card
                                                    key={match.property.id}
                                                    className={`cursor-pointer transition-all ${selectedPropertyIds.includes(match.property.id)
                                                        ? 'border-primary bg-primary/5'
                                                        : 'hover:border-primary/50'
                                                        } ${match.isDismissed ? 'opacity-50' : ''}`}
                                                    onClick={() => !match.isDismissed && handleToggleProperty(match.property.id)}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex gap-4">
                                                            <Checkbox
                                                                checked={selectedPropertyIds.includes(match.property.id)}
                                                                onCheckedChange={() => handleToggleProperty(match.property.id)}
                                                                disabled={match.isDismissed}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                            <img
                                                                src={match.property.image || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop"}
                                                                alt={match.property.title}
                                                                className="w-24 h-24 object-cover rounded-lg"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex items-start justify-between mb-2">
                                                                    <div>
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <p className="font-bold text-lg">
                                                                                {match.property.price ? `${match.property.price.toLocaleString()}€` : 'Consult'}
                                                                            </p>
                                                                            {match.isInquired && !match.isDismissed && (
                                                                                <Badge className="bg-primary text-primary-foreground">
                                                                                    Inquired
                                                                                </Badge>
                                                                            )}
                                                                            {match.isDismissed && (
                                                                                <Badge variant="destructive">
                                                                                    Dismissed
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                                            <MapPin className="h-3 w-3" />
                                                                            {match.property.zone || match.property.address || 'Location not specified'}
                                                                        </p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <Badge className="bg-success text-success-foreground">
                                                                            {match.matchPercent}% match
                                                                        </Badge>
                                                                        <p className="text-xs text-muted-foreground font-mono mt-1">
                                                                            {match.property.reference}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-4 text-sm text-muted-foreground">
                                                                    <span className="flex items-center gap-1">
                                                                        <Home className="h-3 w-3" />
                                                                        {match.property.area || 0}m²
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        <Bed className="h-3 w-3" />
                                                                        {match.property.rooms || 0} bed
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        <Bath className="h-3 w-3" />
                                                                        {match.property.bathrooms || 0} bath
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>

                                        <div className="flex gap-2 pt-4 border-t">
                                            <Button
                                                onClick={handleGeneratePresentation}
                                                disabled={selectedPropertyIds.length === 0 || createPresentationMutation.isPending}
                                                className="flex-1 bg-gradient-primary hover:opacity-90"
                                            >
                                                {createPresentationMutation.isPending ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Generating...
                                                    </>
                                                ) : (
                                                    `Generate Presentation (${selectedPropertyIds.length} selected)`
                                                )}
                                            </Button>
                                            <Button onClick={handleClose} variant="outline">
                                                Cancel
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-muted-foreground">No properties available for this lead.</p>
                                        {error && (
                                            <p className="text-destructive text-sm mt-2">
                                                Error: {error instanceof Error ? error.message : 'Unknown error'}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PropertySelectionModal;
