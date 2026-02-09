
import { useState } from "react";
import RatingStars from "./RatingStars";
import { Ticket, Users, DollarSign } from "lucide-react";
import { useVenues } from "@/hooks/useVenues";

const TICKET_PLATFORMS = ["All", "Eventbrite", "Partiful", "Dice", "Posh"];

const getCostRatio = (price: number, enjoyment: number) => (enjoyment > 0 ? (price / enjoyment).toFixed(1) : "N/A");

const EventComparisonTable = () => {
  const { venues, allEvents: flatEvents } = useVenues();
  const [platformFilter, setPlatformFilter] = useState("All");
  const [venueFilter, setVenueFilter] = useState("All");
  const [sortKey, setSortKey] = useState<"enjoyment" | "cost" | "crowd" | "ratio">("enjoyment");

  const allEvents = flatEvents;
  
  const filtered = allEvents.filter(ev => {
    const platformMatch = platformFilter === "All" || ev.platform === platformFilter;
    const venueMatch = venueFilter === "All" || ev.venue === venueFilter;
    return platformMatch && venueMatch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "crowd") return b.crowd - a.crowd;
    if (sortKey === "cost") return a.price - b.price;
    if (sortKey === "enjoyment") return b.enjoyment - a.enjoyment;
    if (sortKey === "ratio") return Number(getCostRatio(a.price, a.enjoyment)) - Number(getCostRatio(b.price, b.enjoyment));
    return 0;
  });

  return (
    <div className="w-full bg-card rounded-xl shadow-lg border border-border p-6 overflow-x-auto animate-fade-in">
      <div className="mb-4 flex flex-wrap gap-4 items-end justify-between">
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            Venue:{" "}
            <select
              value={venueFilter}
              className="bg-muted border border-border rounded px-3 py-1 ml-2"
              onChange={e => setVenueFilter(e.target.value)}
            >
              <option value="All">All</option>
              {venues.map(venue => (
                <option key={String(venue.id)} value={venue.name}>{venue.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            Platform:{" "}
            <select
              value={platformFilter}
              className="bg-muted border border-border rounded px-3 py-1 ml-2"
              onChange={e => setPlatformFilter(e.target.value)}
            >
              {TICKET_PLATFORMS.map(name => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded border transition-colors ${sortKey === "enjoyment" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            onClick={() => setSortKey("enjoyment")}
          >
            Enjoyment
          </button>
          <button
            className={`px-3 py-1 rounded border transition-colors ${sortKey === "crowd" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            onClick={() => setSortKey("crowd")}
          >
            Crowd
          </button>
          <button
            className={`px-3 py-1 rounded border transition-colors ${sortKey === "cost" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            onClick={() => setSortKey("cost")}
          >
            Cost
          </button>
          <button
            className={`px-3 py-1 rounded border transition-colors ${sortKey === "ratio" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            onClick={() => setSortKey("ratio")}
          >
            Cost/Enjoyment
          </button>
        </div>
      </div>
      <table className="min-w-full table-auto text-left rounded border-collapse">
        <thead>
          <tr className="bg-secondary text-secondary-foreground">
            <th className="py-2 px-3 font-semibold text-base">Event</th>
            <th className="py-2 px-3 font-semibold text-base">Platform</th>
            <th className="py-2 px-3 font-semibold text-base"><span className="flex items-center gap-1"><Users className="w-4 h-4" /> Crowd</span></th>
            <th className="py-2 px-3 font-semibold text-base"><span className="flex items-center gap-1"><Ticket className="w-4 h-4" />Capacity</span></th>
            <th className="py-2 px-3 font-semibold text-base"><span className="flex items-center gap-1">Enjoyment</span></th>
            <th className="py-2 px-3 font-semibold text-base"><span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />Cost</span></th>
            <th className="py-2 px-3 font-semibold text-base">Cost/Enjoyment</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(ev => (
            <tr key={ev.id} className="border-t border-border hover:bg-accent/20 transition-colors">
              <td className="py-3 px-3 font-medium">{ev.name}</td>
              <td className="py-3 px-3">{ev.platform}</td>
              <td className="py-3 px-3">{ev.crowd}</td>
              <td className="py-3 px-3">{ev.capacity}</td>
              <td className="py-3 px-3"><RatingStars rating={ev.enjoyment} /></td>
              <td className="py-3 px-3">${ev.price}</td>
              <td className="py-3 px-3">{getCostRatio(ev.price, ev.enjoyment)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-xs mt-2 text-muted-foreground">Enjoyment = avg. user submitted ratings, updated live</div>
    </div>
  );
};

export default EventComparisonTable;
