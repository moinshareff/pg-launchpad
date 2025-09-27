import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OwnerDashboard from "./pages/OwnerDashboard";
import TenantsOccupancy from "@/pages/TenantsOccupancy";
import Payments from "@/pages/Payments";
import MyPgs from "./pages/MyPgs";
import PgDetail from "./pages/PgDetail";
import Bookings from "./pages/Bookings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Default to dashboard */}
          <Route path="/" element={<OwnerDashboard />} />
          {/* Create PGs wizard */}
          <Route path="/create" element={<Index />} />
          {/* Legacy/dashboard alias if needed */}
          <Route path="/owner" element={<OwnerDashboard />} />
          {/* Tenants & Occupancy */}
          <Route path="/tenants" element={<TenantsOccupancy />} />
          {/* Payments */}
          <Route path="/payments" element={<Payments />} />
          {/* My PGs list */}
          <Route path="/pgs" element={<MyPgs />} />
          {/* PG detail */}
          <Route path="/pgs/:name" element={<PgDetail />} />
          {/* Bookings */}
          <Route path="/bookings" element={<Bookings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
