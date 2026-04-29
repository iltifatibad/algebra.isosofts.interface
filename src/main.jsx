import { useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Nav from "../components/navbar.jsx";
import RiskRouter from "../components/riskrouter.jsx";
import ToastContainer from "../components/utils/ToastContainer.jsx";
import IntroScreen from "../components/IntroScreen.jsx";

function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <BrowserRouter>
      {!introDone && <IntroScreen onDone={() => setIntroDone(true)} />}
      <Nav />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<RiskRouter />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
