import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/headerApp";
import ResumeCard from "./components/resumeCard";
import eventsData from "./data/events.json";
import EventCard from "./components/eventCard";

// React Icons
import { VscTarget, VscFilter } from "react-icons/vsc";
import { SlPlane, SlPeople } from "react-icons/sl";
import { GiHumanTarget } from "react-icons/gi";
import { MdBlock } from "react-icons/md";
import { CiSearch } from "react-icons/ci";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState(eventsData);
  const [selectedEventIndex, setSelectedEventIndex] = useState(-1);
  const [expandedEventIndex, setExpandedEventIndex] = useState<number | null>(
    null
  );

  const timelineRef = useRef<HTMLDivElement>(null);

  const eventCategories = [
    { value: "all", label: "All Events", icon: VscFilter },
    { value: "airstrike", label: "Airstrikes", icon: VscTarget },
    { value: "drone_strike", label: "Drone Strikes", icon: SlPlane },
    { value: "humanitarian", label: "Blockades", icon: MdBlock },
    { value: "ground raid", label: "Ground Raids", icon: SlPeople },
    { value: "shooting/aid", label: "Mass Shootings", icon: GiHumanTarget },
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setSelectedEventIndex(prev => Math.max(0, prev - 1));
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedEventIndex(prev =>
            Math.min(filteredEvents.length - 1, prev + 1)
          );
          break;
        case "Enter":
          e.preventDefault();
          if (selectedEventIndex >= 0) {
            setExpandedEventIndex(prev =>
              prev === selectedEventIndex ? null : selectedEventIndex
            );
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredEvents, selectedEventIndex]);

  // Auto-scroll to selected event
  useEffect(() => {
    if (selectedEventIndex >= 0 && timelineRef.current) {
      const eventElements =
        timelineRef.current.querySelectorAll("[data-event-index]");
      const targetElement = eventElements[selectedEventIndex] as HTMLElement;
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [selectedEventIndex]);

  // Filter + sort events
  useEffect(() => {
    let filtered = [...eventsData];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        event =>
          event.headline.toLowerCase().includes(term) ||
          event.location.place.toLowerCase().includes(term) ||
          event.actors.some(actor => actor.toLowerCase().includes(term))
      );
    }

    filtered.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    setFilteredEvents(filtered);
    setSelectedEventIndex(-1); // reset selection when filter changes
  }, [searchTerm, selectedCategory]);

  const getDotColor = (intensity: number) => {
    if (intensity >= 10) return "bg-red-700";
    if (intensity >= 8) return "bg-orange-700";
    if (intensity >= 6) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const getMonthYearLabel = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", { month: "short", year: "numeric" });
  };
  const earliestMonth = filteredEvents[0]
    ? getMonthYearLabel(filteredEvents[0].timestamp)
    : "";
  const latestMonth = filteredEvents[filteredEvents.length - 1]
    ? getMonthYearLabel(filteredEvents[filteredEvents.length - 1].timestamp)
    : "";

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50">
        <Header />
      </header>

      <div className="flex flex-1 relative transition-all duration-300 bg-gray-100">
        <div className="flex flex-col transition-all duration-300 w-full px-0 md:px-8 lg:px-24">
          {/* Search + category */}
          <motion.div
            className="flex flex-col flex-wrap gap-2 p-4 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events, locations, or actors..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-100 bg-white rounded focus:outline-none focus:ring-1 focus:ring-gray-200"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 ">
              {eventCategories.map(category => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.value;
                return (
                  <motion.div
                    key={category.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => setSelectedCategory(category.value)}
                      className={`flex items-center gap-2 px-3 py-1 rounded border ${
                        isSelected
                          ? "bg-zinc-700 text-white border-zinc-700"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {category.label}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Resume Card */}
          <div className="p-4 pt-0">
            <ResumeCard events={filteredEvents} />
          </div>

          <p className="text-gray-500 text-sm w-full text-center">
            Use ↑↓ to navigate, Enter to select
          </p>

          {/* Timeline Events */}
          <div
            className="flex-1 relative overflow-auto p-4 rounded-lg bg-gray-100"
            ref={timelineRef}
          >
            <div
              className="absolute left-10 top-0 bottom-0 w-0.5 z-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(209, 213, 219, 0), rgba(209, 213, 219, 1) 10%, rgba(209, 213, 219, 1) 90%, rgba(209, 213, 219, 0))",
              }}
            />

            {earliestMonth && (
              <div className="absolute left-14 -translate-x-full top-0 text-gray-400 text-xs font-semibold">
                {earliestMonth}
              </div>
            )}
            {latestMonth && (
              <div className="absolute left-14 bottom-8 -translate-x-full text-gray-400 text-xs font-semibold">
                {latestMonth}
              </div>
            )}

            <AnimatePresence>
              {filteredEvents.length === 0 ? (
                <motion.div
                  key="no-events"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-500 mt-10"
                >
                  No events found
                </motion.div>
              ) : (
                filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id ?? index}
                    data-event-index={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="relative mb-8 flex"
                  >
                    <div
                      className={`absolute left-8 top-14 w-3 h-3 rounded-full z-10 ${getDotColor(
                        event.intensity
                      )}`}
                    />
                    <div className="pl-16 flex-1 z-10">
                      {/* 👇 Pass selected state */}
                      <EventCard
                        key={event.id}
                        event={event}
                        selected={index === selectedEventIndex}
                        expanded={index === expandedEventIndex}
                        onToggle={() =>
                          setExpandedEventIndex(prev =>
                            prev === index ? null : index
                          )
                        }
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
