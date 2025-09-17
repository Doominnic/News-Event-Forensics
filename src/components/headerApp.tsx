"use client";
import { GoClock } from "react-icons/go";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const view = location.pathname === "/heatmap" ? "statistics" : "timeline";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/30 border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row items-center justify-between">
      {/* Title */}
      <div className="text-center md:text-left">
        <h1 className="text-lg md:text-xl font-bold text-gray-900">
          Gaza Crisis Investigation
        </h1>
        <p className="text-sm mb-4 md:text-base text-gray-700">
          July 2025 • Interactive Timeline & Geographic Analysis
        </p>
      </div>

      {/* Toggle */}
      <div className="grid p-1 rounded-xl grid-cols-2 bg-gray-200">
        <button
          className={`flex items-center gap-2 transition-all duration-200 rounded-xl px-4 py-1 ${
            view === "timeline" ? "bg-white" : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => navigate("/")}
        >
          <GoClock />
          Timeline
        </button>
        <button
          className={`flex items-center gap-2 transition-all duration-200 rounded-xl px-4 py-1 ${
            view === "statistics" ? "bg-white" : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => navigate("/heatmap")}
        >
          <CiLocationOn />
          Heatmap
        </button>
      </div>
    </header>
  );
}
