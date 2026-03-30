import React, { useState } from "react";

// Bileşen Importları (Aynı kalıyor)
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
import MRMProfile from "./mrmprofile.jsx";
import CusProfile from "./customerprofile.jsx";
import AcProfile from "./actionprofile.jsx";
import KPIDashboard from "./kpi.jsx";
import KpiProfile from "./kpiprofile.jsx";

const RiskRouter = () => {
  const [risks] = useState([
    { id: "dashboard", name: "Dashboard", icon: "📊" },
    { id: "kpi", name: "Key Performance Indicators", icon: "📈" },
    { id: "bg-reg", name: "Business Risks", icon: "💼" },
    { id: "hs-reg", name: "Health & Safety Risks", icon: "🛡️" },
    { id: "leg-reg", name: "Legislations", icon: "⚖️" },
    { id: "env-reg", name: "Environmental Aspects", icon: "🌱" },
    { id: "eq-reg", name: "Equipment & Inventories", icon: "⚙️" },
    { id: "tr-reg", name: "Trainings", icon: "🎓" },
    { id: "doc-reg", name: "Documents", icon: "📄" },
    { id: "ven-reg", name: "Vendors", icon: "🤝" },
    { id: "cus-reg", name: "Customers", icon: "👥" },
    { id: "fb-reg", name: "Feedbacks", icon: "💬" },
    { id: "ear-reg", name: "Employee Appraisals", icon: "👤" },
    { id: "moc-reg", name: "Management Of Changes", icon: "🔄" },
    { id: "fl-reg", name: "Findings", icon: "🔍" },
    { id: "ao-reg", name: "Assurances & Oversights", icon: "📋" },
    { id: "mr-reg", name: "Management Review", icon: "📝" },
    { id: "ac-reg", name: "Action Logs", icon: "✅" },
  ]);

  const [selectedRisk, setSelectedRisk] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    // overflow-hidden sayesinde ekran dışına taşma olmaz
    <div className="pt-20 h-screen w-full bg-gray-50 overflow-hidden">
      <div className="flex h-full w-full">
        
        {/* SIDEBAR - Flex-Shrink-0 sayesinde içeriği asla ezmez */}
        <aside 
          className={`bg-white shadow-xl border-r border-blue-100 transition-all duration-300 ease-in-out flex flex-col flex-shrink-0
            ${isSidebarOpen ? "w-72" : "w-20"}`}
        >
          {/* Header / Burger */}
          <div 
            className="h-14 flex items-center justify-between px-5 border-b border-blue-50 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen && (
              <span className="text-sm font-bold text-blue-800 tracking-wider">DATABASES</span>
            )}
            <div className="flex items-center justify-center w-full md:w-auto">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </div>
          </div>

          {/* Nav List */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2 custom-scrollbar">
            <ul className="space-y-1">
              {risks.map((risk) => (
                <li key={risk.id}>
                  <button
                    onClick={() => setSelectedRisk(risk.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-all duration-200
                      ${selectedRisk === risk.id 
                        ? "bg-blue-600 text-white shadow-md" 
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}`}
                  >
                    <span className="text-xl min-w-[24px] flex justify-center">{risk.icon}</span>
                    <span className={`ml-4 text-sm font-medium transition-opacity duration-200 whitespace-nowrap
                      ${isSidebarOpen ? "opacity-100" : "opacity-0 w-0 hidden"}`}>
                      {risk.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* ANA İÇERİK - min-w-0 ve flex-1 kritik önemde */}
        <main className="flex-1 h-full min-w-0 bg-gray-50 overflow-auto">
          <div className="p-4 md:p-6 min-h-full">
             {/* Tabloların olduğu alan */}
            {selectedRisk === "bg-reg" ? <RisksAssessment /> : 
             selectedRisk === "hs-reg" ? <HsProfile /> : 
             selectedRisk === "leg-reg" ? <LegProfile /> : 
             selectedRisk === "env-reg" ? <EnvProfile /> : 
             selectedRisk === "eq-reg" ? <EiProfile /> : 
             selectedRisk === "tr-reg" ? <TrProfile /> : 
             selectedRisk === "doc-reg" ? <DocProfile /> : 
             selectedRisk === "ven-reg" ? <VenProfile /> : 
             selectedRisk === "cus-reg" ? <CusProfile /> : 
             selectedRisk === "fb-reg" ? <FbProfile /> : 
             selectedRisk === "ear-reg" ? <EarProfile /> : 
             selectedRisk === "moc-reg" ? <MocProfile /> : 
             selectedRisk === "fl-reg" ? <FProfile /> : 
             selectedRisk === "ao-reg" ? <AoProfile /> : 
             selectedRisk === "mr-reg" ? <MRMProfile /> : 
             selectedRisk === "ac-reg" ? <AcProfile /> : 
             selectedRisk === "kpi" ? <KpiProfile /> : 
             selectedRisk === "dashboard" ? <KPIDashboard /> : null}
          </div>
        </main>

      </div>
    </div>
  );
};

export default RiskRouter;