import { useState } from "react";
import type { Event } from "../types";
import { CiWarning } from "react-icons/ci";
import { BsBuilding, BsHospital } from "react-icons/bs";
import { HiOutlineBolt } from "react-icons/hi2";
import { LuDroplets } from "react-icons/lu";
import { motion } from "framer-motion";
import { useGroupedRegions } from "../hooks/useGroupedRegions"; // the hook we created
import FilteredEventsContainer from "../components/filteredEventsContainer";

// Mock: replace this with your actual events data
import eventsData from "../data/events.json";

export default function RegionalImpactMapPage() {
  const groupedRegions = useGroupedRegions(eventsData as Event[]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Get the events of the selected group from the hook
  const selectedEvents =
    groupedRegions.find(g => g.name === selectedGroup)?.events || [];

  const getColor = (intensity: number) => {
    if (intensity >= 10) return "border-red-700";
    if (intensity >= 8) return "border-orange-600";
    if (intensity >= 6) return "border-yellow-500";
    return "bg-gray-400";
  };

  return (
    <div className="container mx-auto p-10 bg-white border border-gray-200 rounded-xl">
      <h1 className="text-2xl font-semibold">Regional Impact Map</h1>
      <p className="text-gray-500 mb-6 font-thin">
        Click on a region to filter timeline events
      </p>

      {/* Regional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groupedRegions.map(group => (
          <motion.div
            key={group.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`cursor-pointer border-l-4 ${getColor(
              group.averageIntensity
            )} bg-white border border-gray-200 hover:shadow-lg border-gray-200 rounded-xl`}
            onClick={() =>
              setSelectedGroup(selectedGroup === group.name ? null : group.name)
            }
          >
            <div className="p-4 flex flex-col gap-2">
              <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
              <p>
                <strong>Average Intensity:</strong>{" "}
                <span className={getColor(group.averageIntensity)}>
                  {group.averageIntensity.toFixed(1)}
                </span>
              </p>
              <div className="grid grid-cols-2">
                <p className="flex items-center">
                  <h2 className="font-semibold mr-1">Total Events: </h2>{" "}
                  {group.totalEvents}
                </p>
                <p className="text-red-700 flex items-center gap-1">
                  <span className="flex items-center gap-1">
                    <CiWarning /> Casualties:
                  </span>
                  {group.totalCasualties}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div className="flex items-center gap-1">
                  <BsBuilding />
                  Buildings destroyed:{" "}
                  {group.totalInfrastructureDamage.buildings_destroyed}
                </div>
                <div className="flex items-center gap-1">
                  <HiOutlineBolt />
                  Power outages: {group.totalInfrastructureDamage.power_outages}
                </div>
                <div className="flex items-center gap-1">
                  <BsHospital />
                  Hospitals impacted:{" "}
                  {group.totalInfrastructureDamage.hospitals_impacted}
                </div>
                <div className="flex items-center gap-1">
                  <LuDroplets />
                  Water disruption:{" "}
                  {group.totalInfrastructureDamage.water_disruption}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filtered Events Container */}
      <FilteredEventsContainer
        events={selectedEvents} // only events from the selected region
        selectedRegion={selectedGroup}
        onClearRegion={() => setSelectedGroup(null)}
      />
    </div>
  );
}
