import { useState } from "react";
import { MapPin, Clock, Calendar, DollarSign, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const VENUE_EVENTS = [
  {
    id: 1,
    name: "Queer Comedy Night",
    date: "2025-08-02",
    time: "8:00 PM",
    price: 15,
    description: "Stand-up comedy featuring LGBTQ+ comedians",
  },
  {
    id: 2,
    name: "Drag Bingo Extravaganza",
    date: "2025-08-05",
    time: "7:30 PM", 
    price: 20,
    description: "Bingo night hosted by Brooklyn's finest drag queens",
  },
  {
    id: 3,
    name: "Karaoke & Cocktails",
    date: "2025-08-08",
    time: "9:00 PM",
    price: 10,
    description: "Sing your heart out with signature cocktails",
  },
  {
    id: 4,
    name: "Pride Dance Party",
    date: "2025-08-12",
    time: "10:00 PM",
    price: 25,
    description: "DJ spinning house, pop, and pride anthems",
  },
  {
    id: 5,
    name: "Trivia Tuesday",
    date: "2025-08-15",
    time: "7:00 PM",
    price: 8,
    description: "Weekly trivia night with prizes and drinks",
  },
  {
    id: 6,
    name: "Live Jazz & Blues",
    date: "2025-08-18",
    time: "8:30 PM",
    price: 18,
    description: "Local jazz musicians performing original pieces",
  },
  {
    id: 7,
    name: "Open Mic Night",
    date: "2025-08-22",
    time: "8:00 PM",
    price: 5,
    description: "Share your talent - music, poetry, comedy welcome",
  },
  {
    id: 8,
    name: "90s Throwback Party",
    date: "2025-08-25",
    time: "9:30 PM",
    price: 22,
    description: "Dancing to the best hits from the 90s",
  },
  {
    id: 9,
    name: "Wine Tasting Event",
    date: "2025-08-28",
    time: "6:30 PM",
    price: 35,
    description: "Curated wine selection with cheese pairings",
  },
  {
    id: 10,
    name: "Costume Contest",
    date: "2025-08-30",
    time: "9:00 PM",
    price: 15,
    description: "Best costume wins cash prize and bragging rights",
  },
  {
    id: 11,
    name: "Acoustic Sessions",
    date: "2025-09-02",
    time: "7:30 PM",
    price: 12,
    description: "Intimate acoustic performances by local artists",
  },
  {
    id: 12,
    name: "Game Night Social",
    date: "2025-09-05",
    time: "7:00 PM",
    price: 8,
    description: "Board games, card games, and social gaming",
  },
];

const VenueEvents = () => {
  const [sortBy, setSortBy] = useState<"date" | "price">("date");

  const sortedEvents = [...VENUE_EVENTS].sort((a, b) => {
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
            Back to Dashboard
          </Link>
          
          <div className="bg-card rounded-xl shadow-lg border border-border p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  The Bush Dyke Bar
                </h1>
                <p className="text-muted-foreground mb-1">
                  Brooklyn, NY • LGBTQ+ Friendly Venue
                </p>
                <p className="text-sm text-muted-foreground">
                  A welcoming community space hosting diverse events and entertainment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 bg-card rounded-xl shadow-lg border border-border p-4">
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