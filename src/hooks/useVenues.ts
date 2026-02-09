import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VENUES } from "@/data/venues";

export type VenueEvent = {
  id: number | string;
  name: string;
  date: string;
  time: string;
  price: number;
  description: string;
  platform: string;
  crowd: number;
  capacity: number;
  enjoyment: number;
};

export type Venue = {
  id: number | string;
  name: string;
  location: string;
  description: string;
  events: VenueEvent[];
};

export function useVenues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    setIsLoading(true);

    // Start with static venues
    const staticVenues: Venue[] = VENUES.map((v) => ({
      id: v.id,
      name: v.name,
      location: v.location,
      description: v.description || "",
      events: v.events.map((e) => ({
        ...e,
        description: e.description || "",
      })),
    }));

    try {
      // Fetch DB venues
      const { data: dbVenues, error: venueError } = await supabase
        .from("venues")
        .select("*");

      if (venueError) {
        console.error("Error fetching venues:", venueError);
        setVenues(staticVenues);
        setIsLoading(false);
        return;
      }

      // Fetch DB events
      const { data: dbEvents, error: eventError } = await supabase
        .from("events")
        .select("*");

      if (eventError) {
        console.error("Error fetching events:", eventError);
        setVenues(staticVenues);
        setIsLoading(false);
        return;
      }

      // Map DB venues with their events
      const userVenues: Venue[] = (dbVenues || []).map((v) => ({
        id: v.id,
        name: v.name,
        location: v.location,
        description: v.description || "",
        events: (dbEvents || [])
          .filter((e) => e.venue_id === v.id)
          .map((e) => ({
            id: e.id,
            name: e.name,
            date: e.date,
            time: e.time,
            price: Number(e.price),
            description: e.description || "",
            platform: e.platform,
            crowd: e.crowd,
            capacity: e.capacity,
            enjoyment: Number(e.enjoyment),
          })),
      }));

      setVenues([...staticVenues, ...userVenues]);
    } catch (err) {
      console.error("Error loading venues:", err);
      setVenues(staticVenues);
    } finally {
      setIsLoading(false);
    }
  };

  const allEvents = venues.flatMap((venue) =>
    venue.events.map((event) => ({
      ...event,
      venue: venue.name,
    }))
  );

  return { venues, allEvents, isLoading, refetch: fetchVenues };
}
