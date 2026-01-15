import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Leads from "./pages/Leads";
import LeadDetail from "./pages/LeadDetail";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Integrations from "./pages/Integrations";
import AIActions from "./pages/AIActions";
import PublicPropertyDetail from "./pages/PublicPropertyDetail";
import PresentationView from "./pages/PresentationView";
import MyAccount from "./pages/MyAccount";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="/" element={<Index />} />
            <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
            <Route path="/leads/:id" element={<ProtectedRoute><LeadDetail /></ProtectedRoute>} />
            <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
            <Route path="/properties/:id" element={<ProtectedRoute><PropertyDetail /></ProtectedRoute>} />
            <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
            <Route path="/ai-actions" element={<ProtectedRoute><AIActions /></ProtectedRoute>} />
            <Route path="/my-account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
            <Route path="/p/:id" element={<PublicPropertyDetail />} />
            <Route path="/presentations/:token" element={<PresentationView />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
