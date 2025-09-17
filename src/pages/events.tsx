import events from "../data/events.json";
import EventCard from "../components/eventCard";

export default function Events() {
  return (
    <div className="grid grid-cols-1 events-container gap-6 p-6">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
