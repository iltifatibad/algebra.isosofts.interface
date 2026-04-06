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
import MRMProfile from "./mrmprofile.jsx";
import CusProfile from "./customerprofile.jsx";
import AcProfile from "./actionprofile.jsx";
import KPIDashboard from "./kpi.jsx";
import KpiProfile from "./kpiprofile.jsx";
import OPIProfile from "./opiprofile.jsx";

const RiskRouter = () => {
  const [risks] = useState([
    { id: "dashboard", name: "Dashboard", icon: "📊" },
    { id: "kpi", name: "Key Performance Indicators", icon: "📈" },
    { id: "opi", name: "Operation Performance Indicator", icon: "📈" },
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
    { id: "ear-reg", name: "Employee Performance Appraisal", icon: "👤" },
    { id: "moc-reg", name: "Management Of Changes", icon: "🔄" },
    { id: "fl-reg", name: "Findings", icon: "🔍" },
    { id: "ao-reg", name: "Assurances & Oversights", icon: "📋" },
    { id: "mr-reg", name: "Management Review", icon: "📝" },
    { id: "ac-reg", name: "Action Log", icon: "✅" },
  ]);

  const [selectedRisk, setSelectedRisk] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =
          document.cookie
            .split("; ")
            .find((r) => r.startsWith("auth_token="))
            ?.split("=")
            .slice(1)
            .join("=") ?? "";

        // 1. Account al
        const accRes = await fetch(
          `http://localhost:7777/api/account/self?token=${token}`
        );
        const accData = await accRes.json();

        // 2. Company al
        const compRes = await fetch(
          `http://localhost:7777/api/company/self?token=${token}`
        );
        const compData = await compRes.json();

        setCompanyName(compData.name || "");
      } catch (err) {
        console.error("Error fetching company info:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pt-20 h-screen w-full bg-gray-50 overflow-hidden flex flex-col font-sans">
      <div className="flex flex-1 h-full w-full overflow-hidden">
        
        {/* SIDEBAR */}
        <aside 
          className={`bg-white shadow-2xl border-r border-blue-100 transition-all duration-300 ease-in-out flex flex-col flex-shrink-0 z-30
            ${isSidebarOpen ? "w-72" : "w-20"}`}
        >
          {/* Burger Header */}
          <div 
            className="h-16 flex items-center justify-between px-5 border-b border-blue-50 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen && (
              <span className="text-[11px] font-bold text-blue-800 tracking-[0.2em] uppercase">
                {companyName ? `${companyName} Databases` : "Databases"}
              </span>
            )}
            <div className={`flex items-center justify-center ${!isSidebarOpen ? 'w-full' : ''}`}>
               <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
               </svg>
            </div>
          </div>

          {/* Menü Listesi */}
          <nav className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-blue-200">
            <ul className="space-y-1">
              {risks.map((risk) => (
                <li key={risk.id}>
                  <button
                    onClick={() => setSelectedRisk(risk.id)}
                    title={!isSidebarOpen ? risk.name : ""}
                    className={`w-full flex items-center p-3 rounded-xl transition-all duration-200
                      ${selectedRisk === risk.id 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}`}
                  >
                    <span className="text-xl min-w-[24px] flex justify-center shrink-0">{risk.icon}</span>
                    <span className={`ml-4 text-sm font-semibold transition-all duration-300 whitespace-nowrap
                      ${isSidebarOpen ? "opacity-100 visible w-auto" : "opacity-0 invisible w-0 hidden"}`}>
                      {risk.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* ANA İÇERİK ALANI */}
        <main className="flex-1 min-w-0 h-full overflow-hidden bg-gray-50 relative">
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
           selectedRisk === "opi" ? <OPIProfile /> : 
           selectedRisk === "dashboard" ? <KPIDashboard /> : null}
        </main>
      </div>
    </div>
  );
};

export default RiskRouter;