import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Discover from "./pages/Discover";
import Index from "./pages/Index";
import VenueEvents from "./pages/VenueEvents";
import NotFound from "./pages/NotFound";
import EventMap from "./pages/EventMap";
import Auth from "./pages/Auth";
import AddVenue from "./pages/AddVenue";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Discover />} />
          <Route path="/compare" element={<Index />} />
          <Route path="/venue-events" element={<VenueEvents />} />
          <Route path="/map" element={<EventMap />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/add-venue" element={<AddVenue />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
