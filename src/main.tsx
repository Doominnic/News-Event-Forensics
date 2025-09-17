import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";

import "./index.css";
import HeatmapChartsPage from "./pages/heatmap.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/heatmap" element={<HeatmapChartsPage />} />
    </Routes>
  </BrowserRouter>
);
