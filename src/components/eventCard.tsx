import type { Event } from "../types";
import { GoClock } from "react-icons/go";
import { CiLocationOn, CiWarning } from "react-icons/ci";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { BsBuilding, BsHospital } from "react-icons/bs";
import { HiOutlineBolt } from "react-icons/hi2";
import { LuDroplets } from "react-icons/lu";
import { FaExternalLinkAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function EventCard({
  event,
  selected = false,
  expanded = false,
  onToggle,
}: {
  event: Event;
  selected?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}) {
  const getColor = (intensity: number) => {
    if (intensity >= 10)
      return {
        bgTag: "bg-red-700",
        bgCard: "bg-red-50",
        border: "focus-within:border-red-700",
        keyboardBorder: "border-red-700 border-2",
      };
    if (intensity >= 8)
      return {
        bgTag: "bg-orange-600",
        bgCard: "bg-orange-50",
        border: "focus-within:border-orange-600",
        keyboardBorder: "border-orange-600 border-2",
      };
    if (intensity >= 6)
      return {
        bgTag: "bg-yellow-500",
        bgCard: "bg-yellow-50",
        border: "focus-within:border-yellow-500",
        keyboardBorder: "border-yellow-500 border-2",
      };
    return { bgTag: "bg-gray-400", bgCard: "bg-white" };
  };

  const colors = getColor(event.intensity);

  return (
    <div
      className={`hover:shadow-lg border border-gray-200 ${
        colors.border
      } cursor-pointer rounded-xl overflow-hidden flex flex-col p-4 transition-all duration-200
        focus-within:border-2 ${colors.bgCard} ${
        selected ? `${colors.keyboardBorder}` : ""
      }`}
      tabIndex={0}
    >
      {/* Main info */}
      <div className="flex justify-between items-start gap-4">
        <div className="p-0 flex-1 flex flex-col gap-1">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <GoClock />
            {new Date(event.timestamp).toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              timeZone: "UTC",
            }) + " UTC"}
          </p>
          <h2 className="font-bold text-lg">{event.headline}</h2>
          <p className="text-red-700 flex items-center gap-1">
            <CiWarning />
            {event.casualties.killed} killed, {event.casualties.injured} injured
          </p>
          <p className="mt-2 text-sm text-gray-600 flex items-center gap-1">
            <CiLocationOn />
            {event.location.place}
          </p>
        </div>

        <div className="flex flex-col gap-2 items-end">
          <div className="tags flex flex-col md:flex-row gap-2">
            <span
              className={`rounded-lg h-[25px] flex items-center justify-center px-2 text-xs whitespace-nowrap text-white ${colors.bgTag}`}
            >
              Intensity: {event.intensity}
            </span>
            <span
              className={`rounded-lg h-[25px] flex items-center justify-center px-2 text-xs text-white ${colors.bgTag}`}
            >
              {event.category}
            </span>
          </div>

          {/* Chevron toggle */}
          <button
            className="mt-2 text-gray-500 hover:text-gray-700"
            onClick={onToggle}
          >
            {expanded ? <HiChevronUp size={20} /> : <HiChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Expanded section with animation */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-4 pt-4 text-sm space-y-2"
          >
            {/* Actors */}
            <p className="flex flex-col gap-2">
              <h2 className="font-semibold">Actors Involved</h2>
              <div className="flex gap-2">
                {event.actors.map((actor, index) => (
                  <span
                    key={index}
                    className="bg-white border border-gray-200 px-3 py-1 rounded-xl w-fit"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </p>

            {/* Infrastructure damage */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h2 className="mb-2 font-semibold">Infrastructure Impact</h2>
              <div className="grid grid-cols-2 gap-2">
                <span className="flex gap-1 items-center">
                  <BsBuilding />
                  {event.infrastructure_damage.buildings_destroyed} buildings
                  destroyed
                </span>

                <span className="flex gap-1 items-center">
                  <HiOutlineBolt />
                  Power:
                  {`${
                    event.infrastructure_damage.power_outages
                      ? " Disrupted"
                      : " Intact"
                  }`}
                </span>
                <span className="flex gap-1 items-center">
                  <BsHospital />
                  {event.infrastructure_damage.hospitals_impacted} hospitals
                  impacted
                </span>
                <span className="flex gap-1 items-center">
                  <LuDroplets />
                  Water:
                  {`${
                    event.infrastructure_damage.water_disruption
                      ? " Disrupted"
                      : " Intact"
                  }`}
                </span>
              </div>
            </div>

            {/* Sources */}
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold">Sources</h2>
              <ul className="list-none">
                {event.sources.map((source, index) => (
                  <li
                    key={index}
                    className="w-full bg-white rounded-lg p-2 cursor-pointer border border-gray-200 hover:bg-gray-200"
                  >
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 flex justify-between items-center"
                    >
                      {source.name}
                      <FaExternalLinkAlt />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
