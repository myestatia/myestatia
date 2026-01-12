import { Property } from "@/api/properties";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

interface PropertyTabsProps {
    property: Property;
    isEditing: boolean;
    formData: Partial<Property>;
    setFormData: (data: Partial<Property>) => void;
}

const PropertyTabs = ({
    property,
    isEditing,
    formData,
    setFormData
}: PropertyTabsProps) => {
    return (
        <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="leads">Matching Leads</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
                <Card className="shadow-card">
                    <CardHeader>
                        <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isEditing ? (
                            <Textarea
                                value={formData.description || ""}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={6}
                                className="bg-background"
                            />
                        ) : (
                            <p className="text-muted-foreground leading-relaxed">
                                {property.description || "No description available for this property."}
                            </p>
                        )}

                        <div className="mt-6">
                            <h3 className="font-semibold mb-3">Features</h3>
                            <div className="grid grid-cols-2 gap-y-2 gap-x-12 text-sm"> {/* Added gap-x-12 for separation */}
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground">Property Type</span>
                                    <span>{property.type || "Villa"}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground">Energy Certificate</span>
                                    {isEditing ? (
                                        <input
                                            className="w-20 text-right border rounded px-1"
                                            value={formData.energyCertificate || ""}
                                            onChange={(e) => setFormData({ ...formData, energyCertificate: e.target.value })}
                                        />
                                    ) : (
                                        <span>{property.energyCertificate || "Pending"}</span>
                                    )}
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground">Year Built</span>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            className="w-20 text-right border rounded px-1"
                                            value={formData.yearBuilt || ""}
                                            onChange={(e) => setFormData({ ...formData, yearBuilt: parseInt(e.target.value) || 0 })}
                                        />
                                    ) : (
                                        <span>{property.yearBuilt || "-"}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="leads" className="mt-4">
                <Card className="shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Suggested Leads
                            <Badge variant="secondary">{property.compatibleLeadsCount || 0}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {property.compatibleLeadsCount === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No specific compatible leads found automatically.
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                {/* TODO: Implement real leads list */}
                                <p>Found {property.compatibleLeadsCount} potential leads.</p>
                                <Button variant="link" className="mt-2">View compatible leads</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
                <Card className="shadow-card">
                    <CardContent className="p-6">
                        <div className="text-center py-8">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                            <h3 className="text-lg font-medium mb-1">No documents</h3>
                            <p className="text-muted-foreground mb-4">No documents attached to this property.</p>
                            <Button variant="outline">Upload Document</Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
};

export default PropertyTabs;
