import React, { useState } from "react";

// Bileşen Importları
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
    <div className="pt-20 h-screen overflow-hidden bg-gray-50 flex flex-col">
      <div className="flex flex-1 h-full overflow-hidden">
        
        {/* SIDEBAR */}
        <aside 
          className={`bg-white shadow-2xl border-r border-blue-100 transition-all duration-300 ease-in-out flex flex-col z-20
            ${isSidebarOpen ? "w-72" : "w-20"}`}
        >
          {/* Burger Header */}
          <div 
            className="h-16 flex items-center justify-between px-6 border-b border-blue-50 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen && (
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent truncate">
                DATABASES
              </span>
            )}
            
            {/* Burger Icon */}
            <div className="flex items-center justify-center">
              <svg 
                className={`w-6 h-6 text-blue-600 transition-transform duration-300 ${!isSidebarOpen ? "rotate-180" : ""}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
            <ul className="space-y-1">
              {risks.map((risk) => (
                <li key={risk.id}>
                  <button
                    onClick={() => setSelectedRisk(risk.id)}
                    title={!isSidebarOpen ? risk.name : ""}
                    className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group
                      ${selectedRisk === risk.id 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}`}
                  >
                    <span className="text-xl min-w-[32px] flex justify-center">
                      {risk.icon}
                    </span>
                    
                    <span className={`ml-4 font-medium transition-all duration-300 whitespace-nowrap overflow-hidden
                      ${isSidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
                      {risk.name}
                    </span>

                    {/* Tooltip for closed state (CSS only fallback) */}
                    {!isSidebarOpen && (
                        <div className="absolute left-20 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                            {risk.name}
                        </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 h-full overflow-y-auto bg-gray-50 relative p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
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