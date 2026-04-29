import React from "react";

const EmptyRow = ({ colSpan = 25 }) => (
  <tr>
    <td colSpan={colSpan} className="py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
          <i className="fas fa-inbox text-3xl text-slate-300" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-400">No data found</p>
          <p className="text-xs text-slate-300 mt-1">Add a new record using the button above</p>
        </div>
      </div>
    </td>
  </tr>
);

export default EmptyRow;
