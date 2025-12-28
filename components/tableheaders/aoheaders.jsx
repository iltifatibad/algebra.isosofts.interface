import React from "react";

const AoHeaders = ({ activeHeader }) => {
  if (activeHeader) {
    return (
      <thead>
        {/* First header row - fixed height for sticky positioning */}
        <tr className="h-13">
          <th
            className="min-w-15 border-r border-blue-500 sticky left-[-1px] top-0 z-21 bg-white -ml-px"
            rowSpan={2}
          >
            #
          </th>
          <th
            className="min-w-15 border-r border-blue-500 sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            A&O Activity Description
          </th>
          <th
            className="min-w-15 border-r border-blue-500 sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Auditor / Inspector
          </th>
          <th
            className="min-w-15 border-r border-blue-500 sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Auditee / Inspectee
          </th>
          <th
            className="min-w-15 border-r border-blue-500 sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Reviewed Premises
          </th>
          <th
            className="min-w-50 border-r border-blue-500 sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Reviewed Process
          </th>
          <th
            className="min-w-50 border-r border-blue-500 sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Reference To ISO Clauses
          </th>
          <th
            className="min-w-15 border-r border-blue-500 sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Frequency
          </th>

          <th
            className="min-w-15 border-r border-blue-500 sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Audit Date
          </th>

          <th
            className="min-w-15 border-r border-blue-500 sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Next Audit Date
          </th>

          <th
            className="min-w-15 border-r border-blue-500 sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Days Left To Next Examination
          </th>

          <th
            className="min-w-15 border-r border-blue-500 sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Audit Status
          </th>
        </tr>

        {/* Second header row - fixed height, sticky at top-12 (48px) */}
      </thead>
    );
  } else {
    return (
      <thead>
        {/* First header row */}
        <tr className="w-full h-12">
          <th
            className="min-w-35 border-r border-blue-500 sticky left-[-1px] top-0 z-21 bg-white -ml-px"
            rowSpan={2}
          >
            #
          </th>

          <th
            className="min-w-15 border-r border-blue-500 sticky top-0 z-20 bg-blue-100"
            colSpan={11}
          >
            Action Plan
          </th>

          <th
            className="min-w-15 border-r border-blue-500 sticky top-0 z-20 bg-blue-100"
            colSpan={12}
          >
            Monitoring
          </th>
        </tr>

        {/* Second header row */}
        <tr className="h-12">
          <th className="min-w-15 border-r border-blue-500 sticky top-12 z-20 bg-blue-200">
            Action
          </th>
          <th className="min-w-30 border-r border-blue-500 sticky top-12 z-20 bg-blue-200">
            Action Raise Date
          </th>
          <th className="min-w-30 border-r border-blue-500 sticky top-12 z-20 bg-blue-200">
            Resources
          </th>
          <th className="min-w-30 border-r border-blue-500 sticky top-12 z-20 bg-blue-200">
            Relactive Function
          </th>
          <th className="min-w-30 border-r border-blue-500 sticky top-12 z-20 bg-blue-200">
            Responsible
          </th>
          <th className="min-w-30 border-r border-blue-500 sticky top-12 z-20 bg-blue-200">
            Deadline
          </th>
          <th className="min-w-30 border-r border-blue-500 sticky top-12 z-20 bg-blue-200">
            Action Confirmation
          </th>
          <th className="min-w-30 border-r border-blue-500 sticky top-12 z-20 bg-blue-200">
            Action Status
          </th>
          <th className="min-w-30 border-r border-blue-500 sticky top-12 z-20 bg-blue-200">
            Compilation Date
          </th>
          <th className="min-w-30 border-r border-blue-500 sticky top-12 z-20 bg-blue-200">
            Status Of Verification
          </th>
          <th className="min-w-30 border-r border-blue-500 sticky top-12 z-20 bg-blue-200">
            Comment
          </th>

          {/* ⭐ NEW: Month columns under "Monitoring" */}
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month) => (
            <th
              key={month}
              className="min-w-30 border-r border-blue-500 sticky top-12 z-20 bg-blue-200"
            >
              {month}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
};

export default AoHeaders;
