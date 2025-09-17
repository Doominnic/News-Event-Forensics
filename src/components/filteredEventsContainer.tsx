import { motion, AnimatePresence } from "framer-motion";
import type { Event } from "../types";

export default function FilteredEventsContainer({
  events,
  selectedRegion,
  onClearRegion,
}: {
  events: Event[];
  selectedRegion: string | null;
  onClearRegion: () => void;
}) {
  return (
    <AnimatePresence>
      {selectedRegion && events.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <div className="border rounded-xl border-gray-200 bg-white overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="font-semibold text-lg">
                Events in {selectedRegion}
              </h2>
              <button
                className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100"
                onClick={onClearRegion}
              >
                Clear Filter
              </button>
            </div>

            {/* List of Events */}
            <div className="p-4 flex flex-col gap-4">
              {events
                .sort(
                  (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime()
                )
                .map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-3 rounded-lg border border-gray-200 cursor-pointer transition-all duration-200 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold mb-1">
                          {event.headline}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>
                            {new Date(event.timestamp).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>Intensity {event.intensity}</span>
                          <span>•</span>
                          <span>
                            Casualties:{" "}
                            {event.casualties.killed + event.casualties.injured}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {event.category}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
