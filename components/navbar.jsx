// NavigationBar.jsx
// Bu, Isosofts projesindeki navigation bar component'i. Tailwind CSS ve Font Awesome gerektirir.
// Kullanım: <NavigationBar showProfile={showProfile} setShowProfile={setShowProfile} />


import React from "react";

const NavigationBar = ({ showProfile, setShowProfile }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent animate-pulse">
              Algebra
            </div>
              <div className="hidden md:flex space-x-6">
                <span
                  onClick={() => { window.location.href = "https://www.isosofts.com"; }}
                  className="nav-link text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  Home
                </span>
                <span
                  onClick={() => { window.location.href = "https://www.isosofts.com"; }}
                  className="nav-link text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  Services
                </span>
                <span
                  onClick={() => { window.location.href = "https://www.isosofts.com"; }}
                  className="nav-link text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  About
                </span>
                <span
                  onClick={() => { window.location.href = "https://www.isosofts.com"; }}
                  className="nav-link text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  Contact
                </span>
              </div>
          </div>
          <button
            onClick={() => { window.location.href = "https://www.isosofts.com/profile"; }}
            className="rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <i className="fas fa-user mr-2"></i> Account
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
