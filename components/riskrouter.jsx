import { useState, useEffect } from "react";
import { UserProvider } from "./utils/UserContext.jsx";
import ExportModal from "./utils/ExportModal.jsx";
import GraphView from "./graphview.jsx";

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
  const [userName, setUserName] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [exportModuleKey, setExportModuleKey] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  // On mobile default sidebar closed
  useEffect(() => {
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, []);

  // Global draggable modals — position:fixed + top/left approach (transform fails inside flex)
  useEffect(() => {
    const attached = new WeakSet();
    const cleanups = [];

    const makeDraggable = (box) => {
      if (attached.has(box)) return;
      attached.add(box);

      let dragging = false;
      let lifted  = false;
      let startX, startY, origX, origY;
      let activeOv = null;

      const onDown = (e) => {
        if (e.target.closest("button, input, select, textarea, a, label")) return;
        const ov = box.closest(".modal-overlay");
        if (!ov) return;
        e.preventDefault();
        const raw = getComputedStyle(ov).transform;
        const t = (raw && raw !== "none") ? new DOMMatrix(raw) : new DOMMatrix();
        origX  = t.m41; origY  = t.m42;
        startX = e.clientX; startY = e.clientY;
        activeOv = ov;
        dragging = true;
        lifted   = false;
        box.style.userSelect = "none";
      };

      const onMove = (e) => {
        if (!dragging || !activeOv) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (!lifted) {
          // Only move to body once the mouse has moved ≥5px (real drag, not a click)
          if (Math.hypot(dx, dy) < 5) return;
          lifted = true;
          activeOv._origParent = activeOv.parentNode;
          activeOv._origNext   = activeOv.nextSibling;
          activeOv.style.zIndex = "999999";
          document.body.appendChild(activeOv);
          box.style.cursor = "grabbing";
        }

        activeOv.style.transform = `translate(${origX + dx}px, ${origY + dy}px)`;
      };

      const onUp = () => {
        if (!dragging) return;
        dragging = false;
        box.style.userSelect = "";
        box.style.cursor     = "";
        if (lifted && activeOv?._origParent) {
          activeOv._origParent.insertBefore(activeOv, activeOv._origNext || null);
          delete activeOv._origParent;
          delete activeOv._origNext;
        }
        lifted   = false;
        activeOv = null;
      };

      box.addEventListener("mousedown", onDown);
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      cleanups.push(() => {
        box.removeEventListener("mousedown", onDown);
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      });
    };

    const scan = (root) => {
      if (root.nodeType !== 1) return;
      if (root.classList?.contains("modal-box")) makeDraggable(root);
      root.querySelectorAll?.(".modal-box").forEach(makeDraggable);
    };

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) m.addedNodes.forEach(scan);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    document.querySelectorAll(".modal-box").forEach(makeDraggable);

    return () => {
      observer.disconnect();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
        const token =
          document.cookie
            .split("; ")
            .find((r) => r.startsWith("auth_token="))
            ?.split("=")
            .slice(1)
            .join("=") ?? "";

        const accRes = await fetch(
          `https://isosofts.com/api/account/self?token=${token}`,
          { signal }
        );
        const accData = await accRes.json();
        setIsSuperAdmin(
          accData?.role === "superadmin" ||
          accData?.isSuperAdmin === true ||
          accData?.type === "superadmin"
        );
        const name =
          accData?.fullName ||
          accData?.name ||
          (accData?.firstName ? `${accData.firstName} ${accData.lastName ?? ""}`.trim() : "") ||
          accData?.username || "";
        setUserName(name);

        const compRes = await fetch(
          `https://isosofts.com/api/company/self?token=${token}`,
          { signal }
        );
        const compData = await compRes.json();

        setCompanyName(compData.name || "");
      } catch (err) {
        if (err.name !== "AbortError") console.error("Error fetching company info:", err);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  const openExport = (key) => {
    setExportModuleKey(key ?? null);
    setShowExport(true);
  };

  const handleNavSelect = (id) => {
    setSelectedRisk(id);
    setShowGraph(false);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  // Listen for navbar System Map button
  useEffect(() => {
    const handler = () => setShowGraph(true);
    window.addEventListener("algebra:openSystemMap", handler);
    return () => window.removeEventListener("algebra:openSystemMap", handler);
  }, []);

  return (
    <UserProvider value={{ isSuperAdmin, openExport }}>
    <div className="pt-20 h-screen w-full bg-gray-50 overflow-hidden flex flex-col font-sans">
      <div className="flex flex-1 h-full w-full overflow-hidden relative" style={{ zIndex: 200 }}>

        {/* Mobile backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-[400] lg:hidden"
            style={{ top: "80px" }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
            bg-white shadow-2xl border-r border-blue-100
            transition-all duration-300 ease-in-out flex flex-col flex-shrink-0
            fixed top-20 bottom-0 left-0 lg:relative lg:top-auto lg:bottom-auto lg:left-auto z-[500]
            ${isSidebarOpen
              ? "w-72 translate-x-0"
              : "w-72 -translate-x-full lg:translate-x-0 lg:w-20"}
          `}
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
            <div className={`flex items-center justify-center ${!isSidebarOpen ? "w-full" : ""}`}>
               <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
               </svg>
            </div>
          </div>

          {/* Menu List */}
          <nav className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-blue-200">
            <ul className="space-y-1">
              {risks.map((risk) => (
                <li key={risk.id}>
                  <button
                    onClick={() => handleNavSelect(risk.id)}
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

          {/* Export All button */}
          <div className="p-2 border-t border-blue-50 flex flex-col gap-1.5">
            <button
              onClick={() => { setExportModuleKey(null); setShowExport(true); }}
              title={!isSidebarOpen ? "Export All" : ""}
              className="w-full flex items-center p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all duration-200"
            >
              <i className="fas fa-file-excel text-lg min-w-[24px] flex justify-center" />
              <span className={`ml-4 text-sm font-semibold transition-all duration-300 whitespace-nowrap
                ${isSidebarOpen ? "opacity-100 visible w-auto" : "opacity-0 invisible w-0 hidden"}`}>
                Export All
              </span>
            </button>

            <button
              onClick={() => setShowGraph(true)}
              title={!isSidebarOpen ? "System Map" : ""}
              className="w-full flex items-center p-3 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all duration-200"
            >
              <i className="fas fa-diagram-project text-lg min-w-[24px] flex justify-center" />
              <span className={`ml-4 text-sm font-semibold transition-all duration-300 whitespace-nowrap
                ${isSidebarOpen ? "opacity-100 visible w-auto" : "opacity-0 invisible w-0 hidden"}`}>
                System Map
              </span>
            </button>
          </div>

        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 h-full overflow-hidden bg-gray-50 relative">
          <style>{`@keyframes sectionFadeIn{from{opacity:0}to{opacity:1}}.section-enter{animation:sectionFadeIn 0.22s cubic-bezier(0.16,1,0.3,1) both}.modal-overlay{pointer-events:none;z-index:9999!important}.modal-box{pointer-events:auto;cursor:grab;border:1.5px solid #93c5fd !important;box-shadow:0 8px 40px rgba(59,130,246,0.18),0 2px 8px rgba(0,0,0,0.10) !important}.modal-box button,.modal-box input,.modal-box select,.modal-box textarea,.modal-box a,.modal-box label{cursor:auto}.modal-box:active{cursor:grabbing}`}</style>

          {/* Mobile hamburger — shown when sidebar is closed */}
          {!showGraph && (
            <button
              className="lg:hidden absolute top-4 left-4 z-10 w-10 h-10 rounded-xl bg-white border border-blue-100 shadow-md flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {showGraph ? (
            <GraphView onClose={() => setShowGraph(false)} />
          ) : (
            <div key={selectedRisk} className="section-enter h-full">
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
             selectedRisk === "dashboard" ? <KPIDashboard companyName={companyName} userName={userName} /> : null}
            </div>
          )}
        </main>
      </div>
    </div>

    <ExportModal
      isOpen={showExport}
      onClose={() => setShowExport(false)}
      moduleKey={exportModuleKey}
    />
    </UserProvider>
  );
};

export default RiskRouter;
