import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Users, Send, Eye, Home, MapPin, Bed, Bath } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getProperties } from "@/api/properties";
import PropertyCreateModal from "@/components/PropertyCreateModal";
import { useDebounce } from "@/hooks/use-debounce";
import ShareDialog from "@/components/property/ShareDialog";
import { Property } from "@/api/properties";

const Properties = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filters state
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRooms, setMinRooms] = useState("");
  const [zone, setZone] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);
  const debouncedMinRooms = useDebounce(minRooms, 500);
  const debouncedZone = useDebounce(zone, 500);

  const { data: propertiesData, isLoading, error } = useQuery({
    queryKey: ['properties', debouncedSearch, debouncedMinPrice, debouncedMaxPrice, debouncedMinRooms, debouncedZone],
    queryFn: () => getProperties({
      search: debouncedSearch,
      minPrice: debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
      maxPrice: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
      minRooms: debouncedMinRooms ? Number(debouncedMinRooms) : undefined,
      zone: debouncedZone,
    }),
    placeholderData: (previousData) => previousData,
  });

  const handleAddProperty = () => {
    setIsCreateModalOpen(true);
  };

  const properties = propertiesData?.map(prop => ({
    id: prop.id,
    imagen: prop.image || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop", // Fallback image
    titulo: prop.title,
    precio: prop.price ? `${prop.price.toLocaleString()}€` : "N/A",
    zona: prop.zone || prop.address || "N/A",
    m2: prop.area ? `${prop.area}m²` : "N/A",
    dormitorios: prop.rooms || 0,
    banos: prop.bathrooms || 0,
    estado: prop.status?.charAt(0).toUpperCase() + prop.status?.slice(1) || "Available",
    fuente: prop.source?.charAt(0).toUpperCase() + prop.source?.slice(1) || "Owned",
    leadsCompatibles: prop.compatibleLeadsCount || 0,
    nueva: prop.isNew || false,
    original: prop
  })) || [];

  /* Client-side filtering removed in favor of API search */
  const finalProperties = properties;

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading properties...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error loading properties</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6" id="properties-header">
          <div>
            <h1 className="text-3xl font-bold mb-2">Properties</h1>
            <p className="text-muted-foreground">Manage your inventory and connect with compatible leads</p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90" onClick={handleAddProperty}>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-card" id="properties-filters">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sources</SelectItem>
                  <SelectItem value="owned">Owned</SelectItem>
                  <SelectItem value="resales">RESALES</SelectItem>
                  <SelectItem value="inmobalia">Inmobalia</SelectItem>
                  <SelectItem value="mls">MLS USA</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="properties-grid">
          {finalProperties.map((property) => (
            <Card key={property.id} className="shadow-card hover:shadow-card-hover transition-all overflow-hidden">
              <div className="relative">
                <img
                  src={property.imagen}
                  alt={property.titulo}
                  className="w-full h-48 object-cover"
                />
                {property.nueva && (
                  <Badge className="absolute top-3 right-3 bg-success text-success-foreground">
                    New
                  </Badge>
                )}
                <Badge className="absolute top-3 left-3 bg-background/90 text-foreground">
                  {property.fuente}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg mb-1">{property.titulo}</h3>
                  <p className="text-2xl font-bold text-primary mb-2">{property.precio}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3" />
                    <span>{property.zona}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm mb-4 text-muted-foreground">
                  {property.m2 !== "N/A" && (
                    <span className="flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      {property.m2}
                    </span>
                  )}
                  {property.dormitorios > 0 && (
                    <span className="flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      {property.dormitorios}
                    </span>
                  )}
                  {property.banos > 0 && (
                    <span className="flex items-center gap-1">
                      <Bath className="h-3 w-3" />
                      {property.banos}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="bg-muted">
                    {property.estado}
                  </Badge>
                  {property.leadsCompatibles > 0 && (
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      <Users className="mr-1 h-3 w-3" />
                      {property.leadsCompatibles} leads
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2" id="property-actions">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/properties/${property.id}`)}>
                    <Eye className="mr-2 h-3 w-3" />
                    View
                  </Button>
                  <ShareDialog property={property.original as Property}>
                    <Button size="sm" className="flex-1 bg-gradient-primary hover:opacity-90">
                      <Send className="mr-2 h-3 w-3" />
                      Send
                    </Button>
                  </ShareDialog>
                </div>
              </CardContent>
            </Card>
          ))}
          {finalProperties.length === 0 && (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              No properties found.
            </div>
          )}
        </div>
      </div>
      <PropertyCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Properties;
