import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MessageSquare, Mail, Eye, Sparkles, Clock, TrendingUp, Flame, Target, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getLeads } from "@/api/leads";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import LeadCreateModal from "@/components/LeadCreateModal";

const Leads = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [kpiFilter, setKpiFilter] = useState<"todos" | "nuevos" | "calientes">("todos");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: leadsData, isLoading, error } = useQuery({
    queryKey: ['leads'],
    queryFn: getLeads,
  });

  const handleAddLead = () => {
    setIsCreateModalOpen(true);
  };

  const getEstadoColor = (estado: string) => {
    const colors = {
      "New": "bg-primary/10 text-primary border-primary/20",
      "Follow-up": "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      "Qualified": "bg-success/10 text-success border-success/20",
      "Visit": "bg-blue-500/10 text-blue-600 border-blue-500/20",
      "Offer": "bg-purple-500/10 text-purple-600 border-purple-500/20",
      "Closed": "bg-green-500/10 text-green-600 border-green-500/20",
      "Sleeping": "bg-gray-500/10 text-gray-600 border-gray-500/20"
    };
    return colors[estado as keyof typeof colors] || colors["New"];
  };

  const mapStatus = (status?: string) => {
    if (!status) return "New";
    const map: Record<string, string> = {
      "new": "New",
      "qualified": "Qualified",
      "contacted": "Follow-up",
      "closed": "Closed",
      "visit": "Visit",
      "offer": "Offer",
      "sleeping": "Sleeping"
    };
    return map[status.toLowerCase()] || status;
  };

  const leads = leadsData?.map(lead => ({
    id: lead.id,
    nombre: lead.name,
    email: lead.email,
    telefono: lead.phone || "",
    estado: mapStatus(lead.status),
    idioma: lead.language || "ES",
    origen: lead.source || "Web",
    presupuesto: lead.budget ? `${lead.budget.toLocaleString()}€` : null,
    zona: lead.zone || null,
    tipologia: lead.propertyType || null,
    propiedadesSugeridas: lead.suggestedPropertiesCount || 0,
    ultimaActividad: lead.lastInteraction
      ? `${formatDistanceToNow(new Date(lead.lastInteraction), { addSuffix: true, locale: enUS })}`
      : "No activity",
    canal: lead.channel || "Web"
  })) || [];

  const filteredLeads = leads.filter((lead) => {
    if (kpiFilter === "nuevos" && lead.estado !== "New") return false;
    if (kpiFilter === "calientes" && !["Qualified", "Visit", "Offer"].includes(lead.estado)) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!lead.nombre.toLowerCase().includes(query) &&
        !lead.email.toLowerCase().includes(query) &&
        !lead.telefono.includes(query)) {
        return false;
      }
    }

    if (estadoFilter !== "todos" && lead.estado.toLowerCase() !== estadoFilter.toLowerCase()) {
      // Simple mapping check or exact match
      return false;
    }

    return true;
  });

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading leads...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error loading leads</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Leads</h1>
            <p className="text-muted-foreground">Manage your contacts and accelerate conversions with AI</p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90" onClick={handleAddLead}>
            <Plus className="mr-2 h-4 w-4" />
            Create Lead
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Leads</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Total registered</p>
            </CardContent>
          </Card>

          <Card
            className="shadow-card hover:shadow-card-hover transition-shadow cursor-pointer hover:scale-[1.02]"
            onClick={() => setKpiFilter(kpiFilter === "nuevos" ? "todos" : "nuevos")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">New Leads</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.filter(l => l.estado === "New").length}</div>
              <p className="text-xs text-muted-foreground mt-1">Pending contact</p>
            </CardContent>
          </Card>

          <Card
            className="shadow-card hover:shadow-card-hover transition-shadow cursor-pointer hover:scale-[1.02]"
            onClick={() => setKpiFilter(kpiFilter === "calientes" ? "todos" : "calientes")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Hot Leads</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leads.filter(l => ["Qualified", "Visit", "Offer"].includes(l.estado)).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">High probability</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Response Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Filters */}
          <Card className="mb-6 shadow-card">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">All</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Follow-up</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="visit">Visit</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="sleeping">Sleeping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Leads List */}
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <Card key={lead.id} className="shadow-card hover:shadow-card-hover transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{lead.nombre}</h3>
                        <Badge variant="outline" className={getEstadoColor(lead.estado)}>
                          {lead.estado}
                        </Badge>
                        <Badge variant="outline" className="bg-muted">
                          {lead.idioma}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          {lead.canal === "WhatsApp" ? <MessageSquare className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                          {lead.canal}
                        </span>
                        <span>{lead.email}</span>
                        {lead.telefono && <span>{lead.telefono}</span>}
                        <span className="text-xs">{lead.ultimaActividad}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {lead.presupuesto && (
                          <Badge variant="secondary" className="text-xs">
                            {lead.presupuesto}
                          </Badge>
                        )}
                        {lead.zona && (
                          <Badge variant="secondary" className="text-xs">
                            {lead.zona}
                          </Badge>
                        )}
                        {lead.tipologia && (
                          <Badge variant="secondary" className="text-xs">
                            {lead.tipologia}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs bg-primary/5 text-primary">
                          {lead.propiedadesSugeridas} suggested properties
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/leads/${lead.id}`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-gradient-primary text-primary-foreground border-0 hover:opacity-90"
                      onClick={() => navigate(`/ai-actions?leadId=${lead.id}`)}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Actions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredLeads.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No leads found.
              </div>
            )}
          </div>
        </div>
      </div>
      <LeadCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Leads;
