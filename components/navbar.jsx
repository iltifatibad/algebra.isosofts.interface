import React, { useState, useEffect } from "react";

const NavigationBar = () => {
  const [companyName, setCompanyName] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = document.cookie.split("; ").find(r => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";
    if (!token) return;

    Promise.allSettled([
      fetch(`https://isosofts.com/api/account/self?token=${token}`).then(r => r.json()),
      fetch(`https://isosofts.com/api/company/self?token=${token}`).then(r => r.json()),
    ]).then(([accResult, compResult]) => {
      if (accResult.status === "fulfilled") {
        const d = accResult.value;
        setUserName(d.fullName || d.name || (d.firstName ? `${d.firstName} ${d.lastName ?? ""}`.trim() : "") || d.username || "");
      }
      if (compResult.status === "fulfilled") {
        setCompanyName(compResult.value?.name || "");
      }
    });
  }, []);

  const initials = companyName
    ? companyName.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()
    : userName
    ? userName.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()
    : "A";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">

          {/* Left — logo + nav links */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Algebra
              </span>
            </div>

            <div className="hidden md:flex space-x-6">
              {["Home", "Services", "About", "Contact"].map(link => (
                <span
                  key={link}
                  onClick={() => { window.location.href = "https://www.isosofts.com"; }}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors cursor-pointer font-medium"
                >
                  {link}
                </span>
              ))}
            </div>
          </div>

          {/* Right — company badge + account button */}
          <div className="flex items-center gap-3">
            {(companyName || userName) && (
              <div className="hidden md:flex items-center gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-3 py-1.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm shrink-0">
                  <span className="text-white text-[10px] font-bold">{initials}</span>
                </div>
                <div className="leading-tight">
                  {companyName && (
                    <p className="text-[12px] font-semibold text-blue-800 leading-none">{companyName}</p>
                  )}
                  {userName && (
                    <p className="text-[11px] text-blue-500 leading-none mt-0.5">{userName}</p>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => { window.location.href = "https://www.isosofts.com/profile"; }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all shadow-md hover:shadow-lg"
            >
              <i className="fas fa-user text-xs" />
              Account
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
