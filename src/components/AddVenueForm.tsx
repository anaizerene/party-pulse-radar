import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AddEventForm from "./AddEventForm";

const AddVenueForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdVenueId, setCreatedVenueId] = useState<string | null>(null);

  if (!user) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">You need to sign in to add a venue.</p>
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) {
      toast.error("Name and location are required");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("venues")
      .insert({
        name: name.trim(),
        location: location.trim(),
        description: description.trim() || null,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Venue created! Now add events below.");
      setCreatedVenueId(data.id);
    }
    setLoading(false);
  };

  if (createdVenueId) {
    return (
      <div className="space-y-6 max-w-xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-lg font-semibold text-primary">✓ Venue "{name}" created!</p>
            <p className="text-sm text-muted-foreground mt-1">Add events to this venue below.</p>
          </CardContent>
        </Card>
        <AddEventForm venueId={createdVenueId} userId={user.id} />
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => {
              setCreatedVenueId(null);
              setName("");
              setLocation("");
              setDescription("");
              setLat("");
              setLng("");
            }}
          >
            Add Another Venue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Venue</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="venue-name">Venue Name *</Label>
            <Input id="venue-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} placeholder="e.g. House of Yes" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venue-location">Location *</Label>
            <Input id="venue-location" value={location} onChange={(e) => setLocation(e.target.value)} required maxLength={200} placeholder="e.g. Brooklyn, NY" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venue-desc">Description</Label>
            <Textarea id="venue-desc" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} placeholder="Brief description of the venue" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="venue-lat">Latitude</Label>
              <Input id="venue-lat" type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="40.6892" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue-lng">Longitude</Label>
              <Input id="venue-lng" type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="-73.9857" />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Venue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddVenueForm;
