import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import PremiumMotion from "@/components/PremiumMotion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Create from "./pages/Create";
import QuickCreate from "./pages/QuickCreate";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import AdminLanding from "./pages/AdminLanding";
import GiPrivateLanding from "./pages/GiPrivateLanding";
import ClientWorkspace from "./pages/ClientWorkspace";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PremiumMotion />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<Create />} />
          <Route path="/rapido" element={<QuickCreate />} />
          <Route path="/quick" element={<QuickCreate />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/admin/landing" element={<AdminLanding />} />
          <Route path="/gi-checkout-7f4c9e" element={<GiPrivateLanding />} />

          {/* Public client portfolio routes: these never require Supabase login. */}
          <Route path="/portfolio" element={<ClientWorkspace />} />
          <Route path="/app/portfolio" element={<ClientWorkspace />} />
          <Route path="/branding" element={<ClientWorkspace />} />
          <Route path="/reels-clientes" element={<ClientWorkspace />} />
          <Route path="/apresentacao-marca" element={<ClientWorkspace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
