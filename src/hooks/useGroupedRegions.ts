import type { Event } from "../types";

type GroupedRegion = {
  name: string;
  events: Event[]; // <-- store events here
  totalEvents: number;
  averageIntensity: number;
  totalCasualties: number;
  totalInfrastructureDamage: {
    buildings_destroyed: number;
    power_outages: number;
    hospitals_impacted: number;
    water_disruption: number;
  };
};

export function useGroupedRegions(events: Event[]): GroupedRegion[] {
  const regionsMap: Record<string, Event[]> = {};

  // Define your region groups
  const regionGroups = {
    "Northern Gaza": [
      "Northern Gaza (near aid distribution)",
      "Northern Gaza (aid queue site)",
      "Northern Gaza (Zikim entry routes / aid queues)",
      "Northern Gaza (aid/queue sites)",
      "Northern Gaza (food distribution centre)",
      "Northern Gaza (Zikim crossing area)",
      "Beit Lahia (north Gaza)",
    ],
    "Central Gaza": [
      "Deir al-Balah / Central Gaza",
      "Gaza City (central market)",
    ],
    "Southern Gaza": [
      "Southern Gaza (aid convoy area)",
      "Khan Younis / aid queue areas",
      "Rafah / aid site region",
    ],
    "Gaza City": [
      "Gaza City (residential)",
      "Gaza City (al-Tuffah / Al-Ahli area)",
      "Gaza City (residential neighbourhoods)",
    ],
    "Gaza Strip": [
      "Gaza Strip (various)",
      "Gaza Strip (food/humanitarian context)",
      "Gaza (various) - aid access context",
      "Gaza (near a medical centre)",
      "Gaza (hospital site)",
      "Gaza (near medical centre)",
    ],
  };

  // Initialize empty arrays for each group
  Object.keys(regionGroups).forEach(groupName => {
    regionsMap[groupName] = [];
  });

  // Assign events to groups
  events.forEach(event => {
    const region = Object.entries(regionGroups).find(([groupName, places]) =>
      places.includes(event.location.place)
    );
    if (region) {
      regionsMap[region[0]].push(event);
    }
  });

  // Build final groupedRegions array
  return Object.entries(regionsMap).map(([name, events]) => {
    const totalEvents = events.length;
    const averageIntensity =
      totalEvents > 0
        ? events.reduce((sum, e) => sum + e.intensity, 0) / totalEvents
        : 0;
    const totalCasualties = events.reduce(
      (sum, e) => sum + e.casualties.killed + e.casualties.injured,
      0
    );
    const totalInfrastructureDamage = events.reduce(
      (acc, e) => {
        acc.buildings_destroyed += e.infrastructure_damage.buildings_destroyed;
        acc.power_outages += e.infrastructure_damage.power_outages ? 1 : 0;
        acc.hospitals_impacted += e.infrastructure_damage.hospitals_impacted;
        acc.water_disruption += e.infrastructure_damage.water_disruption
          ? 1
          : 0;
        return acc;
      },
      {
        buildings_destroyed: 0,
        power_outages: 0,
        hospitals_impacted: 0,
        water_disruption: 0,
      }
    );

    return {
      name,
      events, // <-- include the actual events here
      totalEvents,
      averageIntensity,
      totalCasualties,
      totalInfrastructureDamage,
    };
  });
}
