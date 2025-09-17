export interface Event {
  id: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
    place: string;
  };
  headline: string;
  category: string;
  actors: string[];
  media: string[];
  intensity: number;
  casualties: {
    killed: number;
    injured: number;
  };
  infrastructure_damage: {
    buildings_destroyed: number;
    roads_damaged: number;
    hospitals_impacted: number;
    power_outages: boolean;
    water_disruption: boolean;
  };
  sources: {
    type: string;
    name: string;
    url: string;
  }[];
}
