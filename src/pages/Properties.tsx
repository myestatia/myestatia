import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Users, Send, Eye, Home, Euro, MapPin, Bed, Bath } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockProperties = [
  {
    id: "1",
    imagen: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
    titulo: "Villa de Lujo en Nueva Andalucía",
    precio: "450.000€",
    zona: "Nueva Andalucía",
    m2: "180m²",
    dormitorios: 3,
    banos: 2,
    estado: "Disponible",
    fuente: "Propio",
    leadsCompatibles: 8,
    nueva: true
  },
  {
    id: "2",
    imagen: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    titulo: "Apartamento Moderno Golden Mile",
    precio: "850.000€",
    zona: "Golden Mile",
    m2: "120m²",
    dormitorios: 2,
    banos: 2,
    estado: "Disponible",
    fuente: "RESALES",
    leadsCompatibles: 12,
    nueva: false
  },
  {
    id: "3",
    imagen: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    titulo: "Ático con Vistas Sierra Blanca",
    precio: "680.000€",
    zona: "Sierra Blanca",
    m2: "200m²",
    dormitorios: 4,
    banos: 3,
    estado: "Disponible",
    fuente: "Inmobalia",
    leadsCompatibles: 5,
    nueva: true
  }
];

const Properties = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleAddProperty = () => {
    toast({
      title: "Próximamente",
      description: "Formulario de añadir propiedad disponible pronto",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Propiedades</h1>
            <p className="text-muted-foreground">Gestiona tu inventario y conecta con leads compatibles</p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90" onClick={handleAddProperty}>
            <Plus className="mr-2 h-4 w-4" />
            Añadir Propiedad
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-card">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar propiedades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select defaultValue="todos">
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Fuente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las fuentes</SelectItem>
                  <SelectItem value="propio">Propio</SelectItem>
                  <SelectItem value="resales">RESALES</SelectItem>
                  <SelectItem value="inmobalia">Inmobalia</SelectItem>
                  <SelectItem value="mls">MLS USA</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="todos">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="reservada">Reservada</SelectItem>
                  <SelectItem value="vendida">Vendida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProperties.map((property) => (
            <Card key={property.id} className="shadow-card hover:shadow-card-hover transition-all overflow-hidden">
              <div className="relative">
                <img
                  src={property.imagen}
                  alt={property.titulo}
                  className="w-full h-48 object-cover"
                />
                {property.nueva && (
                  <Badge className="absolute top-3 right-3 bg-success text-success-foreground">
                    Nueva
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
                  <span className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    {property.m2}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bed className="h-3 w-3" />
                    {property.dormitorios}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="h-3 w-3" />
                    {property.banos}
                  </span>
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

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="mr-2 h-3 w-3" />
                    Ver
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-primary hover:opacity-90">
                    <Send className="mr-2 h-3 w-3" />
                    Enviar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Properties;
