import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import events from "../data/events.json";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Heatmap() {
  return (
    <MapContainer
      center={[31.5, 34.47]}
      zoom={10}
      style={{ height: "50vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {events.map(e => (
        <Marker
          key={e.id}
          position={[e.location.lat, e.location.lng]}
          icon={icon}
        >
          <Popup>
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold">{e.headline}</h3>
              <p className="m-0">
                {new Date(e.timestamp).toLocaleString("en-US", {
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "UTC",
                }) + " UTC"}
              </p>

              <div className="flex items-center ">
                <h2 className="font-semibold mr-2">Casualties:</h2>
                <p>
                  Killed: {e.casualties.killed} — Injured:{" "}
                  {e.casualties.injured}
                </p>
              </div>
              <div>
                <h2 className="font-semibold">Infrastructure Damage</h2>
                <p>
                  Buildings destroyed:{" "}
                  {e.infrastructure_damage.buildings_destroyed}
                </p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
