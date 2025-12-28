import React, { useState, useEffect } from "react";

import RisksAssessment from "./profile.jsx";
import HsProfile from "./hsprofile.jsx";
import LegProfile from "./legprofile.jsx";
import EnvProfile from "./envprofile.jsx";
import EiProfile from "./eiprofile.jsx";
import TrProfile from "./trprofile.jsx";
import DocProfile from "./docprofile.jsx";
import VenProfile from "./venprofile.jsx";
import FbProfile from "./fbprofile.jsx";
import EarProfile from "./earprofile.jsx";
import MocProfile from "./mocprofile.jsx";
import FProfile from "./flog.jsx";
import AoProfile from "./aoprofile.jsx";
import KPIDashboard from "./kpi.jsx";

const RiskRouter = () => {
  // Sample data - gerçek projede API'den veya props'tan gelebilir
  const [risks, setRisks] = useState([
    { id: "kpi", name: "Key Performance Indicators" },
    { id: "bg-reg", name: "Business Risks" },
    { id: "hs-reg", name: "Health & Safety Risks" },
    { id: "leg-reg", name: "Legislation" },
    { id: "env-reg", name: "Environmental Aspects & Impact" },
    { id: "eq-reg", name: "Equipment & Inventory" },
    { id: "tr-reg", name: "Training" },
    { id: "doc-reg", name: "Document" },
    { id: "ven-reg", name: "Vendor" },
    { id: "cus-reg", name: "Customer" },
    { id: "fb-reg", name: "Feedback" },
    { id: "ear-reg", name: "Employee Appraisal Register" },
    { id: "moc-reg", name: "Management Of Changes" },
    { id: "fl-reg", name: "Findings Log" },
    { id: "ao-reg", name: "Assurance & Oversight" },
    { id: "mr-reg", name: "Management Review Meeting" },
    { id: "ac-reg", name: "Action Logs" },

    // Diğer risk kategorileri eklenebilir
  ]);
  const [selectedOption, setSelectedOption] = useState("e-chart");
  const [selectedRisk, setSelectedRisk] = useState("");
  const [isOpenReg, setIsOpenReg] = useState(false);

  return (
    <div className="pt-20 h-screen overflow-hidden">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-lg border-r border-blue-100 fixed left-0 top-20 h-full overflow-y-auto z-10">
          <div
            className="p-6 border-b border-blue-100 cursor-pointer select-none" // Tıklanabilir hale getirdim
            onClick={() => setIsOpenReg(!isOpenReg)} // Tıkla aç/kapat
          >
            <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent flex items-center justify-between">
              <span>Risks</span> {/* Başlık metni */}
              {/* Açma/Kapama İkonu */}
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${isOpenReg ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </h2>
          </div>

          {/* Liste Bölümü - Conditional Render */}
          <nav
            className={`transition-all duration-300 ease-in-out ${isOpenReg ? "max-h-[83vh] p-4 overflow-auto" : "max-h-0 p-0 overflow-hidden"}`}
          >
            <ul className={`space-y-2 ${isOpenReg ? "block" : "hidden"}`}>
              {risks.map((risk) => (
                <li key={risk.id}>
                  <button
                    onClick={() => {
                      setSelectedRisk(risk.id);
                      console.log(
                        "SELECTED RISK (henüz state güncellenmeden):",
                        risk.id,
                      );
                    }}
                    className={[
                      "w-full text-left px-4 py-3 !rounded-button transition-all duration-300 cursor-pointer", // whitespace-nowrap kaldırıldı (önceki sorun için)
                      selectedRisk === risk.id
                        ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
                    ].join(" ")}
                  >
                    {risk.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>{" "}
        {selectedRisk === "bg-reg" ? (
          <RisksAssessment />
        ) : selectedRisk === "hs-reg" ? (
          <HsProfile />
        ) : selectedRisk === "leg-reg" ? (
          <LegProfile />
        ) : selectedRisk === "env-reg" ? (
          <EnvProfile />
        ) : selectedRisk === "eq-reg" ? (
          <EiProfile />
        ) : selectedRisk === "tr-reg" ? (
          <TrProfile />
        ) : selectedRisk === "doc-reg" ? (
          <DocProfile />
        ) : selectedRisk === "ven-reg" ? (
          <VenProfile />
        ) : selectedRisk === "cus-reg" ? (
          <VenProfile />
        ) : selectedRisk === "fb-reg" ? (
          <FbProfile />
        ) : selectedRisk === "ear-reg" ? (
          <EarProfile />
        ) : selectedRisk === "moc-reg" ? (
          <MocProfile />
        ) : selectedRisk === "fl-reg" ? (
          <FProfile />
        ) : selectedRisk === "ao-reg" ? (
          <AoProfile />
        ) : selectedRisk === "kpi" ? (
          <KPIDashboard />
        ) : null}
      </div>
    </div>
  );
};

export default RiskRouter;
