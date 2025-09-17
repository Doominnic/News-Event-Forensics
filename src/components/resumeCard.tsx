import type { Event } from "../types";

export default function ResumeCard({ events }: { events: Event[] }) {
  const totalEvents = events.length;

  const totalKilled = events.reduce((sum, e) => sum + e.casualties.killed, 0);
  const totalInjured = events.reduce((sum, e) => sum + e.casualties.injured, 0);

  const totalBuildings = events.reduce(
    (sum, e) => sum + e.infrastructure_damage.buildings_destroyed,
    0
  );
  const totalHospitals = events.reduce(
    (sum, e) => sum + e.infrastructure_damage.hospitals_impacted,
    0
  );

  return (
    <div className="bg-white shadow p-4 rounded-lg grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
      <div className="flex flex-col items-center justify-center">
        <p className="font-bold text-lg">{totalEvents}</p>
        <p className="text-gray-500">Events Tracked</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="font-bold text-lg text-red-700">{totalKilled}</p>
        <p className="text-gray-500">Total Killed</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="font-bold text-lg text-orange-700">{totalInjured}</p>
        <p className="text-gray-500">Total Injured</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="font-bold text-lg">{totalBuildings}</p>
        <p className="text-gray-500">Buildings Destroyed</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="font-bold text-lg">{totalHospitals}</p>
        <p className="text-gray-500">Hospitals Impacted</p>
      </div>
    </div>
  );
}
