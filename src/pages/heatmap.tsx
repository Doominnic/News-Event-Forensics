"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";
import Header from "../components/headerApp";
import eventsData from "../data/events.json"; // adjust path
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
} from "recharts";

import { CiWarning } from "react-icons/ci";
import { VscTarget } from "react-icons/vsc";
import { BsBuilding } from "react-icons/bs";
import { FaArrowTrendUp } from "react-icons/fa6";
import Heatmap from "../components/heatmap";
import type { Event } from "../types";
import RegionalImpactMap from "../components/regionalImpact";

const intensityColors = {
  low: "#22c55e", // green
  medium: "#eab308", // yellow
  high: "#f97316", // orange
  critical: "#ef4444", // red
};

const getIntensityLevel = (intensity: number) => {
  if (intensity >= 9) return "critical";
  if (intensity >= 7) return "high";
  if (intensity >= 5) return "medium";
  return "low";
};

const getIntensityColor = (intensity: number) => {
  return intensityColors[getIntensityLevel(intensity)];
};

// Format date in UTC to match JSON exactly
const formatUTCDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function HeatmapChartsPage() {
  // Intensity color function (same as EventCard)

  // Sort events chronologically
  const sortedEvents = useMemo(
    () =>
      [...eventsData].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ),
    []
  );

  // Prepare chart data
  const casualtiesData = useMemo(() => {
    return sortedEvents.map(event => ({
      date: formatUTCDate(event.timestamp),
      casualties: event.casualties.killed + event.casualties.injured,
      headline: event.headline,
      id: event.id,
    }));
  }, [sortedEvents]);

  // Prepare chart data for intensity
  const intensityData = useMemo(() => {
    return sortedEvents.map(event => ({
      date: formatUTCDate(event.timestamp),
      intensity: event.intensity,
      headline: event.headline,
      id: event.id,
    }));
  }, [sortedEvents]);

  const totalKilled = eventsData.reduce(
    (sum, event) => sum + event.casualties.killed,
    0
  );
  const buildingsDestroyed = eventsData.reduce(
    (sum, e) => sum + e.infrastructure_damage.buildings_destroyed,
    0
  );
  const totalEvents = eventsData.length;
  const avgIntensity =
    eventsData.reduce((sum, event) => sum + event.intensity, 0) / totalEvents;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 pb-10">
      <header className="sticky top-0 z-50">
        <Header />
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 px-4 md:px-8 lg:px-24 mt-6"
      >
        <div className="border-l-4 border-l-red-700 bg-white border border-gray-200 rounded-xl hover:shadow-lg">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-700/10 rounded-lg text-xl text-red-700">
                <CiWarning />
              </div>
              <div>
                <div className="text-2xl text-red-700">{totalKilled}</div>
                <div className="text-sm text-gray-500">Killed</div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-l-4 border-l-emerald-600 bg-white border border-gray-200 rounded-xl hover:shadow-lg">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600/10 rounded-lg text-xl text-emerald-600">
                <VscTarget />
              </div>
              <div>
                <div className="text-2xl">{totalEvents}</div>
                <div className="text-sm text-gray-500">Total Events</div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-l-4 border-l-yellow-500 bg-white border border-gray-200 rounded-xl hover:shadow-lg">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg text-xl text-yellow-500">
                <FaArrowTrendUp />
              </div>
              <div>
                <div className="text-2xl">{avgIntensity.toFixed(1)}</div>
                <div className="text-sm text-gray-500">Avg. Intensity</div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-l-4 border-l-orange-600 bg-white border border-gray-200 rounded-xl hover:shadow-lg">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600/10 rounded-lg text-xl text-orange-600">
                <BsBuilding />
              </div>
              <div>
                <div className="text-2xl text-red-700">
                  {buildingsDestroyed}
                </div>
                <div className="text-sm text-gray-500">Buildings Destroyed</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Casualties over time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 md:px-8 lg:px-24">
        <div className="w-full h-80 bg-white rounded-xl p-8 pt-4 border border-gray-200 hover:shadow-lg">
          <h2 className="mb-4 font-semibold">Casualties Over Time</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={casualtiesData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [value, "Casualties"]}
                labelFormatter={(_, payload) => {
                  if (!payload) return "";
                  return `Event: ${payload[0].payload.headline}`; // headline of that specific event
                }}
              />
              <Bar dataKey="casualties" fill="#ef4444">
                {casualtiesData.map(event => (
                  <Cell key={event.id} fill="#ef4444" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Intensity per event */}
        <div className="w-full h-80 bg-white rounded-xl p-8 pt-4 border border-gray-200 hover:shadow-lg">
          <h2 className="mb-4 font-semibold">Event Intensity</h2>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                dataKey="intensity"
                domain={[0, 10]}
                tick={{ fontSize: 12 }}
                label={{
                  value: "Intensity",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value: number) => [`${value}`, "Intensity"]}
                labelFormatter={(_, payload) =>
                  `Event: ${payload?.[0]?.payload.headline}`
                }
              />
              <Scatter data={intensityData} dataKey="intensity">
                {intensityData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getIntensityColor(entry.intensity)}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Optional: total events per day */}
        <div className="w-full h-80 bg-white rounded-xl p-8 pt-4 border border-gray-200 hover:shadow-lg">
          <h2 className="mb-4 font-semibold">Events by Category</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={eventsData.reduce(
                (acc: { category: string; count: number }[], event) => {
                  const existing = acc.find(
                    item => item.category === event.category
                  );
                  if (existing) {
                    existing.count += 1;
                  } else {
                    acc.push({ category: event.category, count: 1 });
                  }
                  return acc;
                },
                []
              )}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                formatter={value => [value, "Events"]}
                labelFormatter={label => `Category: ${label}`}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full h-80 bg-white rounded-xl p-8 pt-4 border border-gray-200 hover:shadow-lg">
          <h2 className="mb-4 font-semibold">Events Geography</h2>
          <Heatmap />
        </div>
      </div>
      <div className="px-4 md:px-8 lg:px-24 mt-4">
        <RegionalImpactMap events={eventsData as Event[]} />
      </div>
    </div>
  );
}
