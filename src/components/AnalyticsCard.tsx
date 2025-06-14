
import { ChartBar, Users } from "lucide-react";

const DEMO_ANALYTICS = {
  totalGuests: 253,
  returning: 87,
  avgAge: 27,
  enjoyment: 4.5,
  ratingBreakdown: [5, 12, 35, 73, 128],
};

const AnalyticsCard = ({ eventId }: { eventId: number }) => {
  return (
    <div className="bg-secondary rounded-xl border border-border p-6 w-full grid grid-cols-1 md:grid-cols-2 gap-6 shadow-lg">
      <div>
        <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
          <ChartBar className="w-6 h-6 text-primary" /> Guests Analytics
        </h3>
        <ul className="text-md text-muted-foreground space-y-2">
          <li>
            <span className="font-bold text-foreground">{DEMO_ANALYTICS.totalGuests}</span> total guests
          </li>
          <li>
            <span className="font-bold text-foreground">{DEMO_ANALYTICS.returning}</span> returning
          </li>
          <li>
            <span className="font-bold text-foreground">{DEMO_ANALYTICS.avgAge}</span> avg guest age
          </li>
          <li>
            <span className="font-bold text-foreground">{DEMO_ANALYTICS.enjoyment.toFixed(1)}</span> avg enjoyment rating
          </li>
        </ul>
      </div>
      <div className="border border-accent rounded-lg p-4 flex flex-col items-center justify-center bg-background/90">
        <div className="w-full flex flex-col items-center">
          <div className="font-medium text-foreground mb-2">Rating Distribution</div>
          <div className="flex items-end gap-2 h-16 w-full justify-center">
            {DEMO_ANALYTICS.ratingBreakdown.map((val, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-yellow-400/90 border border-yellow-200 flex items-end justify-center"
                style={{ height: `${5 + val / 3}px`, width: "22px" }}
                title={`${5 - idx} stars`}
              >
                <span className="text-xs font-semibold text-yellow-900 px-1">{val}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-muted-foreground flex gap-4 w-full justify-between">
            {[5, 4, 3, 2, 1].map((n) => (
              <span key={n} className="w-6 text-center">{n}★</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
