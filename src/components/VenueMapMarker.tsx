import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";
import RatingStars from "@/components/RatingStars";

type VenueEvent = {
  id: number;
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

type VenueMapMarkerProps = {
  name: string;
  lat: number;
  lng: number;
  events: VenueEvent[];
};

const VenueMapMarker = ({ name, lat, lng, events }: VenueMapMarkerProps) => {
  const totalCrowd = events.reduce((sum, e) => sum + e.crowd, 0);
  const totalCapacity = events.reduce((sum, e) => sum + e.capacity, 0);
  const occupancy = totalCapacity > 0 ? Math.round((totalCrowd / totalCapacity) * 100) : 0;
  const avgEnjoyment = events.length > 0
    ? +(events.reduce((sum, e) => sum + e.enjoyment, 0) / events.length).toFixed(1)
    : 0;
  const avgPrice = events.length > 0
    ? Math.round(events.reduce((sum, e) => sum + e.price, 0) / events.length)
    : 0;

  // Neon green intensity based on occupancy
  const greenIntensity = occupancy > 75 ? "0 0 12px #39ff14, 0 0 24px #39ff14" : occupancy > 50 ? "0 0 8px #39ff14" : "0 0 4px #39ff1480";

  const icon = useMemo(() => {
    return L.divIcon({
      className: "venue-map-marker",
      html: `
        <div style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: auto;
          cursor: pointer;
        ">
          <!-- Floating card -->
          <div style="
            background: rgba(15, 15, 20, 0.92);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(57, 255, 20, 0.3);
            border-radius: 12px;
            padding: 8px 12px;
            min-width: 140px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            font-family: 'Poppins', sans-serif;
          ">
            <div style="font-size: 11px; font-weight: 600; color: #fff; margin-bottom: 6px; text-align: center; line-height: 1.2;">
              ${name}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
              <!-- Occupancy dot -->
              <div style="display: flex; align-items: center; gap: 4px;">
                <div style="
                  width: 10px; height: 10px;
                  border-radius: 50%;
                  background: #39ff14;
                  box-shadow: ${greenIntensity};
                  animation: pulse 2s ease-in-out infinite;
                "></div>
                <span style="font-size: 10px; color: #39ff14; font-weight: 600;">${occupancy}%</span>
              </div>
              <!-- Rating star -->
              <div style="display: flex; align-items: center; gap: 2px;">
                <span style="font-size: 11px;">⭐</span>
                <span style="font-size: 10px; color: #fbbf24; font-weight: 600;">${avgEnjoyment}</span>
              </div>
              <!-- Price -->
              <div style="display: flex; align-items: center;">
                <span style="font-size: 10px; color: #a78bfa; font-weight: 700;">$${avgPrice}</span>
              </div>
            </div>
          </div>
          <!-- Arrow pointer -->
          <div style="
            width: 0; height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid rgba(15, 15, 20, 0.92);
            margin-top: -1px;
          "></div>
          <!-- Map pin dot -->
          <div style="
            width: 8px; height: 8px;
            border-radius: 50%;
            background: #39ff14;
            box-shadow: 0 0 8px #39ff14;
            margin-top: 2px;
          "></div>
        </div>
      `,
      iconSize: [160, 100],
      iconAnchor: [80, 100],
      popupAnchor: [0, -100],
    });
  }, [name, occupancy, avgEnjoyment, avgPrice, greenIntensity]);

  return (
    <Marker position={[lat, lng]} icon={icon}>
      <Popup>
        <div style={{ fontFamily: "'Poppins', sans-serif", maxWidth: 260 }}>
          <h3 className="font-bold text-sm mb-2">{name}</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {events.map((event) => {
              const eventOccupancy = event.capacity > 0 ? Math.round((event.crowd / event.capacity) * 100) : 0;
              return (
                <div key={event.id} className="border-b border-border pb-2 last:border-0">
                  <div className="font-medium text-xs">{event.name}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>{event.date} · {event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs" style={{ color: "#39ff14" }}>●{eventOccupancy}%</span>
                    <RatingStars rating={event.enjoyment} />
                    <span className="text-xs font-bold" style={{ color: "#a78bfa" }}>
                      {event.price === 0 ? "Free" : `$${event.price}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default VenueMapMarker;
