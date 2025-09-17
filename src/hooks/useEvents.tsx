import { useEffect, useState } from "react";
import type { Event } from "../types"; // 👈 usar "type" aquí
import data from "../data/events.json";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    setEvents(data as Event[]);
  }, []);

  return events;
}
