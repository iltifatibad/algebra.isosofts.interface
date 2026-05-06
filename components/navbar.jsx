import React, { useState, useEffect } from "react";

const NavigationBar = () => {
  const [companyName, setCompanyName] = useState("");
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = document.cookie.split("; ").find(r => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";
    if (!token) return;

    Promise.allSettled([
      fetch(`https://isosofts.com/api/account/self?token=${token}`).then(r => r.json()),
      fetch(`https://isosofts.com/api/company/self?token=${token}`).then(r => r.json()),
    ]).then(([accResult, compResult]) => {
      if (accResult.status === "fulfilled") {
        const d = accResult.value;
        const combinedName = (d.firstName && d.lastName) ? `${d.firstName} ${d.lastName}`.trim() : "";
        setUserName(combinedName || d.fullName || d.name || d.firstName || d.username || "");
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

  const navLinks = [
    { label: "Home",     href: "https://www.isosofts.com/#home" },
    { label: "Services", href: "https://www.isosofts.com/#services" },
    { label: "About",    href: "https://www.isosofts.com/#about" },
    { label: "Contact",  href: "https://www.isosofts.com/#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">

          {/* Left — logo + desktop nav links */}
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
              {navLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Right — company badge + account button */}
          <div className="flex items-center gap-3">
            {(companyName || userName) && (
              <div className="hidden md:flex items-center gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-3 py-1.5">
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
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all shadow-md hover:shadow-lg"
            >
              <i className="fas fa-user text-xs" />
              Account
            </button>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 mt-3 pt-3 pb-2 space-y-1">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
              >
                {label}
              </a>
            ))}
            <div className="pt-2 border-t border-gray-100">
              {(companyName || userName) && (
                <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
                  <div className="leading-tight min-w-0">
                    {userName && <p className="text-xs font-semibold text-blue-800 truncate leading-none">{userName}</p>}
                    {companyName && <p className="text-[10px] text-blue-500 truncate leading-none mt-0.5">{companyName}</p>}
                  </div>
                </div>
              )}
              <button
                onClick={() => { window.location.href = "https://www.isosofts.com/profile"; setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-white bg-gradient-to-r from-blue-600 to-blue-800 font-semibold"
              >
                <i className="fas fa-user text-xs" />
                Account
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
