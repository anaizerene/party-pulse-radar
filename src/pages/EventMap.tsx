import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { VENUES } from "@/data/venues";
import { VENUE_COORDINATES } from "@/data/venueCoordinates";
import VenueMapMarker from "@/components/VenueMapMarker";
import "leaflet/dist/leaflet.css";

const EventMap = () => {
  const navigate = useNavigate();

  const venuesWithCoords = VENUES.filter((v) => VENUE_COORDINATES[v.name]);

  return (
    <div className="h-screen w-screen relative">
      {/* Map controls overlay */}
      <div className="absolute top-4 left-4 z-[1000] flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate("/")}
          className="gap-2 shadow-lg bg-card/90 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Legend */}
      <div
        className="absolute bottom-6 left-4 z-[1000] rounded-xl px-4 py-3 shadow-lg"
        style={{
          background: "rgba(15, 15, 20, 0.9)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.1)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div className="text-xs font-semibold text-white mb-2">Legend</div>
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "#39ff14", boxShadow: "0 0 6px #39ff14" }}
            />
            <span className="text-gray-300">Live Occupancy</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⭐</span>
            <span className="text-gray-300">Enjoyment Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: "#a78bfa", fontWeight: 700 }}>$</span>
            <span className="text-gray-300">Avg Ticket Price</span>
          </div>
        </div>
      </div>

      <MapContainer
        center={[40.685, -73.975]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {venuesWithCoords.map((venue) => {
          const coords = VENUE_COORDINATES[venue.name];
          return (
            <VenueMapMarker
              key={venue.id}
              name={venue.name}
              lat={coords.lat}
              lng={coords.lng}
              events={venue.events}
            />
          );
        })}
      </MapContainer>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
};

export default EventMap;
