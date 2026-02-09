import { useState } from "react";
import { MapPin, Clock, Calendar, DollarSign, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useVenues } from "@/hooks/useVenues";
import { Skeleton } from "@/components/ui/skeleton";

const VenueEvents = () => {
  const { venues, isLoading } = useVenues();
  const [sortBy, setSortBy] = useState<"date" | "price">("date");
  const [selectedVenueId, setSelectedVenueId] = useState<number | string | null>(null);

  const selectedVenue = selectedVenueId != null
    ? venues.find(v => v.id === selectedVenueId) || venues[0]
    : venues[0];

  if (isLoading || !selectedVenue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }
  
  const sortedEvents = [...selectedVenue.events].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return a.price - b.price;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Discover
          </Link>
          
          <div className="bg-card rounded-xl shadow-lg border border-border p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {selectedVenue.name}
                </h1>
                <p className="text-muted-foreground mb-1">
                  {selectedVenue.location}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedVenue.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 bg-card rounded-xl shadow-lg border border-border p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">Venue:</span>
            <div className="flex flex-wrap gap-2">
                {venues.map((venue) => (
                  <button
                    key={String(venue.id)}
                    onClick={() => setSelectedVenueId(venue.id)}
                    className={`px-3 py-1 rounded border transition-colors ${
                      selectedVenue?.id === venue.id 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {venue.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">Sort by:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy("date")}
                  className={`px-3 py-1 rounded border transition-colors ${
                    sortBy === "date" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  Date
                </button>
                <button
                  onClick={() => setSortBy("price")}
                  className={`px-3 py-1 rounded border transition-colors ${
                    sortBy === "price" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  Price
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map((event) => (
            <div 
              key={event.id}
              className="bg-card rounded-xl shadow-lg border border-border p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="mb-4">
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {event.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formatDate(event.date)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{event.time}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="text-lg font-semibold text-primary">
                    ${event.price}
                  </span>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors">
                Get Tickets
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VenueEvents;