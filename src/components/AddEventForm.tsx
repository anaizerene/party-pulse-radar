import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface AddEventFormProps {
  venueId: string;
  userId: string;
}

const PLATFORMS = ["Eventbrite", "Dice", "Partiful", "Posh", "Other"];

const AddEventForm = ({ venueId, userId }: AddEventFormProps) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("0");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("Other");
  const [capacity, setCapacity] = useState("0");
  const [loading, setLoading] = useState(false);
  const [addedCount, setAddedCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date || !time) {
      toast.error("Name, date, and time are required");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("events").insert({
      venue_id: venueId,
      user_id: userId,
      name: name.trim(),
      date,
      time,
      price: parseFloat(price) || 0,
      description: description.trim() || null,
      platform,
      crowd: 0,
      capacity: parseInt(capacity) || 0,
      enjoyment: 0,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Event "${name}" added!`);
      setAddedCount((c) => c + 1);
      setName("");
      setDate("");
      setTime("");
      setPrice("0");
      setDescription("");
      setPlatform("Other");
      setCapacity("0");
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Add Event
          {addedCount > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              {addedCount} event{addedCount > 1 ? "s" : ""} added
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-name">Event Name *</Label>
            <Input id="event-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={150} placeholder="e.g. DJ Night" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-date">Date *</Label>
              <Input id="event-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-time">Time *</Label>
              <Input id="event-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-price">Ticket Price ($)</Label>
              <Input id="event-price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-capacity">Capacity</Label>
              <Input id="event-capacity" type="number" min="0" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-desc">Description</Label>
            <Textarea id="event-desc" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} placeholder="What's the event about?" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Event"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddEventForm;
