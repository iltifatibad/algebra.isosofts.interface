import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Router import'ları eklendi
import "./index.css";
import App from "./App.jsx";
import Mai from "../components/mainpage.jsx";
import Nav from "../components/navbar.jsx";
import Profile from "../components/profile.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Mai />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/app" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
