import { useState, useEffect } from "react";
import { supabase } from "@/supabase-client";
import { Button } from "../Navbar/button";
import { Input } from "../Input";
import { Textarea } from "../Textarea";
import { toast } from "sonner";

export default function AdminEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  // Fetch events
  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });
    if (error) toast.error(error.message);
    else setEvents(data || []);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Add event
  const addEvent = async () => {
    if (!title || !date || !time) {
      toast.error("Please fill in required fields");
      return;
    }

    const { error } = await supabase.from("events").insert([
      { title, description, date, time, location },
    ]);

    if (error) toast.error(error.message);
    else {
      toast.success("Event added!");
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setLocation("");
      fetchEvents();
    }
  };

  // Delete event
  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Event deleted!");
      fetchEvents();
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Events</h2>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-6">
        <Input
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-2"
        />
        <Textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-2"
        />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mb-2"
        />
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="mb-2"
        />
        <Input
          placeholder="Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mb-2"
        />
        <Button onClick={addEvent} className="w-full">
          Add Event
        </Button>
      </div>

      {/* Event List */}
      <ul className="space-y-3">
        {events.map((event) => (
          <li
            key={event.id}
            className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm">{event.description}</p>
              <p className="text-xs text-gray-500">
                {event.date} at {event.time} — {event.location || "No location"}
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => deleteEvent(event.id)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
