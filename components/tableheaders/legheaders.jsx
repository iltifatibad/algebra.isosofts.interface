import React from "react";

const LegHeaders = ({ activeHeader }) => {
  if (activeHeader) {
    return (
      <thead className="bg-white">
        {/* İlk satır - üst header */}
        <tr className="h-12 border-b border-gray-200">
          <th
            className="min-w-[60px] border-r border-gray-200 sticky left-0 top-0 z-30 bg-slate-50 text-xs font-medium text-gray-700"
            rowSpan={2}
          >
            #
          </th>
          <th
            className="min-w-[140px] border-r border-gray-200 sticky top-0 z-20 bg-slate-50 text-xs font-medium text-gray-700"
            rowSpan={2}
          >
            Process
          </th>
          <th
            className="min-w-[160px] border-r border-gray-200 sticky top-0 z-20 bg-slate-50 text-xs font-medium text-gray-700"
            rowSpan={2}
          >
            Legislation
          </th>
          <th
            className="min-w-[140px] border-r border-gray-200 sticky top-0 z-20 bg-slate-50 text-xs font-medium text-gray-700"
            rowSpan={2}
          >
            Section
          </th>
          <th
            className="min-w-[220px] border-r border-gray-200 sticky top-0 z-20 bg-slate-50 text-xs font-medium text-gray-700"
            rowSpan={2}
          >
            Requirement
          </th>
          <th
            className="min-w-[260px] border-r border-gray-200 sticky top-0 z-20 bg-slate-50 text-xs font-medium text-gray-700"
            rowSpan={2}
          >
            Risk Of Violation
          </th>
          <th
            className="min-w-[180px] border-r border-gray-200 sticky top-0 z-20 bg-slate-50 text-xs font-medium text-gray-700"
            rowSpan={2}
          >
            Affected Positions
          </th>
          <th
            className="border-r border-gray-200 sticky top-0 z-20 bg-slate-50 text-xs font-medium text-gray-700"
            colSpan={3}
          >
            Initial Risk
          </th>
          <th
            className="border-r border-gray-200 sticky top-0 z-20 bg-slate-50 text-xs font-medium text-gray-700"
            colSpan={3}
          >
            Residual Risk / Opportunity Level
          </th>
        </tr>

        {/* İkinci satır - alt header (severity, likelihood, level) */}
        <tr className="h-10 border-b border-gray-200">
          <th className="border-r border-gray-200 sticky top-[48px] z-20 bg-blue-50/70 text-xs font-medium text-gray-600">
            Severity
          </th>
          <th className="border-r border-gray-200 sticky top-[48px] z-20 bg-blue-50/70 text-xs font-medium text-gray-600">
            Likelihood
          </th>
          <th className="border-r border-gray-200 sticky top-[48px] z-20 bg-blue-50/70 text-xs font-medium text-gray-600">
            Level
          </th>
          <th className="border-r border-gray-200 sticky top-[48px] z-20 bg-blue-50/70 text-xs font-medium text-gray-600">
            Severity
          </th>
          <th className="border-r border-gray-200 sticky top-[48px] z-20 bg-blue-50/70 text-xs font-medium text-gray-600">
            Likelihood
          </th>
          <th className="border-r border-gray-200 sticky top-[48px] z-20 bg-blue-50/70 text-xs font-medium text-gray-600">
            Level
          </th>
        </tr>
      </thead>
    );
  } else {
    return (
      <thead className="bg-white">
        {/* İlk satır - Action Plan & Monitoring başlığı */}
        <tr className="h-12 border-b border-gray-200">
          <th
            className="min-w-[140px] border-r border-gray-200 sticky left-0 top-0 z-30 bg-slate-50 text-xs font-medium text-gray-700"
            rowSpan={2}
          >
            #
          </th>
          <th
            className="border-r border-gray-200 sticky top-0 z-20 bg-slate-50 text-xs font-medium text-gray-700"
            colSpan={11}
          >
            Action Plan
          </th>
          <th
            className="border-r border-gray-200 sticky top-0 z-20 bg-slate-50 text-xs font-medium text-gray-700"
            colSpan={12}
          >
            Monitoring
          </th>
        </tr>

        {/* İkinci satır - detaylı başlıklar + aylar */}
        <tr className="h-10 border-b border-gray-200">
          <th className="min-w-[180px] border-r border-gray-200 sticky top-[48px] z-20 bg-blue-50/70 text-xs font-medium text-gray-600">
            Action
          </th>
          <th className="min-w-[140px] border-r border-gray-200 sticky top-[48px] z-20 bg-blue-50/70 text-xs font-medium text-gray-600">
            Action Raise Date
          </th>
          <th className="min-w-[120px] border-r border-gray-200 sticky top-[48px] z-20 bg-blue-50/70 text-xs font-medium text-gray-600">
            Resources
          </th>
          <th className="min-w-[140px] border-r border-gray-200 sticky top-[48px] z-20 bg-blue-50/70 text-xs font-medium text-gray-600">
            Relative Function
          </th>
          <th className="min-w-[140px] border-r border-gray-200 sticky top-[48px] z-20 bg-blue-50/70 text-xs font-medium text-gray-600">
            Responsible
          </th>
          <th className="min-w-[120px] border-r border-gray-200 sticky top-[48px] z-20 bg-blue-50/70 text-xs font-medium text-gray-600">
            Deadline
          </th>
          <th className="min-w-[140px] border-r border-gray-200 sticky top-[48px] z-20 bg-blue-50/70 text-xs font-medium text-gray-600">
            Action Confirmation
          </th>
          <th className="min-w-[120px] border-r border-gray-200 sticky top-[48px] z-20 bg-blue-50/70 text-xs font-medium text-gray-600">
            Action Status
          </th>
          <th className="min-w-[120px] border-r border-gray-200 sticky top-[48px] z-20 bg-blue-50/70 text-xs font-medium text-gray-600">
            Completion Date
          </th>
          <th className="min-w-[140px] border-r border-gray-200 sticky top-[48px] z-20 bg-blue-50/70 text-xs font-medium text-gray-600">
            Verification Status
          </th>
          <th className="min-w-[180px] border-r border-gray-200 sticky top-[48px] z-20 bg-blue-50/70 text-xs font-medium text-gray-600">
            Comment
          </th>

          {/* Aylar */}
          {[
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ].map((month) => (
            <th
              key={month}
              className="min-w-[100px] border-r border-gray-200 sticky top-[48px] z-20 bg-blue-50/70 text-xs font-medium text-gray-600"
            >
              {month}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
};

export default LegHeaders;