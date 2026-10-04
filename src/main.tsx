
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import App from "./App";
import Awards from "./Awards";
import FindFilm from "./pages/FindFilm";
import MovieGallery from "./pages/MovieGallery";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/awards" element={<Awards />} />
        <Route path="/find" element={<FindFilm />} />
        <Route path="/find-film" element={<FindFilm />} />
        <Route path="/movie-gallery" element={<MovieGallery />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);