
import AnalyticsCard from "./AnalyticsCard";
import { useState } from "react";
import { TrendingUp, Users } from "lucide-react";

const ORGANIZER_EVENTS = [
  {
    id: 1,
    name: "Sunset Groove Festival",
    capacity: 300,
    crowd: 230,
  },
];

const OrganizerPanel = () => {
  const [boosted, setBoosted] = useState(false);

  // For MVP, just show first event as managed by this organizer
  const ev = ORGANIZER_EVENTS[0];

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="bg-card rounded-xl shadow-lg border border-border p-6 flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">{ev.name}</h2>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Live Crowd: <span className="font-semibold text-foreground">{ev.crowd}</span>
            </span>
            <span className="flex items-center gap-2">
              Capacity: <span className="font-semibold text-foreground">{ev.capacity}</span>
            </span>
            <span className="flex items-center gap-2">
              {ev.crowd >= ev.capacity ? (
                <span className="text-red-500">Full</span>
              ) : (
                <span className="text-green-600">Open</span>
              )}
            </span>
          </div>
        </div>
        <button
          onClick={() => setBoosted(true)}
          disabled={boosted}
          className={`transition px-6 py-2 text-base bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg shadow font-semibold border border-black/5 hover:scale-105 disabled:opacity-50`}
        >
          {boosted ? (
            <span className="flex items-center gap-2">
              Boosted <TrendingUp className="w-4 h-4 animate-bounce" />
            </span>
          ) : (
            "Boost This Event"
          )}
        </button>
      </div>
      <AnalyticsCard eventId={ev.id} />
    </div>
  );
};

export default OrganizerPanel;
