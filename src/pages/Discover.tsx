import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Calendar, MapPin, Users, Star, Ticket, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { EVENT_CATEGORIES, getAllStaticEvents, categorizeEventsLocally, fetchAndCategorizeEvents, type Event, type CategorizedEvents } from "@/lib/api/events";
import RatingStars from "@/components/RatingStars";

const Discover = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('popular');
  const [categorizedEvents, setCategorizedEvents] = useState<CategorizedEvents>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load and categorize events on mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      // Start with local categorization for instant display
      const staticEvents = getAllStaticEvents();
      const localCategories = categorizeEventsLocally(staticEvents);
      setCategorizedEvents(localCategories);
      setIsLoading(false);

      // Then try to fetch fresh data from platforms
      if (refresh) {
        const { categorizedEvents: freshCategories, error } = await fetchAndCategorizeEvents();
        if (!error && Object.keys(freshCategories).length > 0) {
          // Merge with local categories
          const merged = { ...localCategories };
          Object.entries(freshCategories).forEach(([cat, events]) => {
            if (merged[cat]) {
              // Add new events that aren't already there
              const existingIds = new Set(merged[cat].map(e => e.id));
              const newEvents = (events as Event[]).filter(e => !existingIds.has(e.id));
              merged[cat] = [...merged[cat], ...newEvents];
            } else {
              merged[cat] = events as Event[];
            }
          });
          setCategorizedEvents(merged);
          toast.success('Events refreshed from live platforms!');
        } else if (error) {
          toast.error('Could not fetch live data, showing cached events');
        }
      }
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Error loading events');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const getCategoryEvents = (categoryId: string): Event[] => {
    const category = EVENT_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return [];
    return categorizedEvents[category.name] || [];
  };

  const currentEvents = getCategoryEvents(activeCategory);
  const currentCategory = EVENT_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Hero Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Discover Events
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Find your vibe. Events curated by category from DICE, Eventbrite, Partiful & more.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => loadEvents(true)}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Live Data'}
              </Button>
              <Button onClick={() => navigate('/')} variant="secondary" className="gap-2">
                Compare Events <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="flex flex-wrap gap-2 h-auto bg-transparent justify-start mb-8">
            {EVENT_CATEGORIES.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-full border border-border hover:bg-muted transition-colors"
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {getCategoryEvents(category.id).length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Category Content */}
          {EVENT_CATEGORIES.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.name}
                </h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-20 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : getCategoryEvents(category.id).length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground text-lg">
                    No events found in this category yet.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => loadEvents(true)}
                  >
                    Try Refreshing Live Data
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getCategoryEvents(category.id).map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Quick Navigation Footer */}
      <footer className="border-t border-border bg-muted/30 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="ghost" onClick={() => navigate('/')}>
              Compare Events
            </Button>
            <Button variant="ghost" onClick={() => navigate('/venue-events')}>
              Venue Events
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Event Card Component
const EventCard = ({ event }: { event: Event }) => {
  const crowdPercentage = event.capacity ? Math.round((event.crowd / event.capacity) * 100) : 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {event.name}
            </CardTitle>
            {event.venue && (
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {event.venue}
              </CardDescription>
            )}
          </div>
          <Badge variant="outline" className="shrink-0">
            {event.platform}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>

        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {event.date} · {event.time}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{event.crowd}</span>
              <span className="text-xs text-muted-foreground">({crowdPercentage}%)</span>
            </div>
            <RatingStars rating={event.enjoyment} />
          </div>
          <div className="flex items-center gap-1 font-bold text-primary">
            <Ticket className="w-4 h-4" />
            {event.price === 0 ? 'Free' : `$${event.price}`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Discover;
