import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Router import'ları eklendi
import "./index.css";
import App from "./App.jsx";
import Mai from "../components/mainpage.jsx";
import Nav from "../components/navbar.jsx";
import Profile from "../components/profile.jsx";
import RiskRouter from "../components/riskrouter.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Nav />
    <Routes>
      <Route path="/" element={<RiskRouter />} />
      {/* <Route path="/profile" element={<RiskRouter />} /> */}
      {/* <Route path="/app" element={<App />} /> */}
    </Routes>
  </BrowserRouter>,
);
