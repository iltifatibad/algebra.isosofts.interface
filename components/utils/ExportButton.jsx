import React from "react";
import { useUser } from "./UserContext.jsx";

const ExportButton = ({ moduleKey }) => {
  const { openExport } = useUser();
  return (
    <button
      onClick={() => openExport(moduleKey)}
      className="group p-3 rounded-xl bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm hover:shadow-md transition-all duration-300 ease-out"
      title="Export to Excel"
    >
      <i className="fas fa-file-excel text-lg transition-transform duration-300 group-hover:scale-110" />
    </button>
  );
};

export default ExportButton;
