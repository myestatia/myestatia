import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PropertySidebar = () => {
    return (
        <div className="space-y-4">
            <Card className="shadow-card">
                <CardHeader>
                    <CardTitle className="text-base">Internal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div>
                        <span className="block text-muted-foreground mb-1">Owner</span>
                        <span className="font-medium">Protected Data</span>
                    </div>
                    <div>
                        <span className="block text-muted-foreground mb-1">Listing Agent</span>
                        <span className="font-medium">Main Agent</span>
                    </div>
                    <div>
                        <span className="block text-muted-foreground mb-1">Commission</span>
                        <span className="font-medium">5%</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PropertySidebar;
