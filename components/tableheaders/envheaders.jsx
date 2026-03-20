import React from "react";

const EnvHeaders = ({ activeHeader }) => {
  if (activeHeader) {
    return (
      <thead>
        {/* MAIN HEADER */}
        <tr className="h-[52px]">
          <th
            rowSpan={2}
            className="min-w-[60px] border-r border-white sticky left-0 top-0 z-30 bg-white"
          >
            #
          </th>
          <th
            rowSpan={2}
            className="min-w-[120px] border-r border-white sticky top-0 z-20 bg-blue-100"
          >
            Process
          </th>
          <th
            rowSpan={2}
            className="min-w-[120px] border-r border-white sticky top-0 z-20 bg-blue-100"
          >
            Aspect
          </th>
          <th
            rowSpan={2}
            className="min-w-[120px] border-r border-white sticky top-0 z-20 bg-blue-100"
          >
            Impact
          </th>
          <th
            rowSpan={2}
            className="min-w-[160px] border-r border-white sticky top-0 z-20 bg-blue-100"
          >
            Affected Receptors
          </th>
          <th
            rowSpan={2}
            className="min-w-[200px] border-r border-white sticky top-0 z-20 bg-blue-100"
          >
            Existing Controls
          </th>

          <th
            colSpan={5}
            className="border-r border-white sticky top-0 z-20 bg-blue-100"
            style={{ minWidth: 600 }}
          >
            İnitial Significance
          </th>

          <th
            colSpan={5}
            className="border-r border-white sticky top-0 z-20 bg-blue-100"
            style={{ minWidth: 600 }}
          >
            Residual significance
          </th>
        </tr>

        {/* SUB HEADERS — TEK SATIR */}
        <tr className="h-[48px]">
          {/* Initial */}
          <th className="min-w-[120px] border-r border-white sticky top-[52px] z-20 bg-blue-200">
            Probability
          </th>
          <th className="min-w-[120px] border-r border-white sticky top-[52px] z-20 bg-blue-200">
            Severity
          </th>
          <th className="min-w-[120px] border-r border-white sticky top-[52px] z-20 bg-blue-200">
            Duration
          </th>
          <th className="min-w-[120px] border-r border-white sticky top-[52px] z-20 bg-blue-200">
            Scale
          </th>
          <th className="min-w-[120px] border-r border-white sticky top-[52px] z-20 bg-blue-200">
            Risk Level
          </th>

          {/* Residual */}
          <th className="min-w-[120px] border-r border-white sticky top-[52px] z-20 bg-blue-200">
            Probability
          </th>
          <th className="min-w-[120px] border-r border-white sticky top-[52px] z-20 bg-blue-200">
            Severity
          </th>
          <th className="min-w-[120px] border-r border-white sticky top-[52px] z-20 bg-blue-200">
            Duration
          </th>
          <th className="min-w-[120px] border-r border-white sticky top-[52px] z-20 bg-blue-200">
            Scale
          </th>
          <th className="min-w-[120px] border-r border-white sticky top-[52px] z-20 bg-blue-200">
            Risk Level
          </th>
        </tr>
      </thead>
    );
  } else {
    return (
      <thead>
        {/* First header row */}
        <tr className="w-full h-12">
          <th
            className="min-w-35 border-r border-white sticky left-[-1px] top-0 z-21 bg-white -ml-px"
            rowSpan={2}
          >
            #
          </th>

          <th
            className="min-w-[150px] md:min-w-[300px] border-r border-white sticky top-0 z-20 bg-blue-100"
            colSpan={11}
          >
            Action Plan
          </th>

          <th
            className="min-w-15 border-r border-white sticky top-0 z-20 bg-blue-100"
            colSpan={12}
          >
            Monitoring
          </th>
        </tr>

        {/* Second header row */}
        <tr className="h-12">
          <th className="min-w-15 border-r border-white sticky top-12 z-20 bg-blue-200">
            Action
          </th>
          <th className="min-w-30 border-r border-white sticky top-12 z-20 bg-blue-200">
            Action Raise Date
          </th>
          <th className="min-w-30 border-r border-white sticky top-12 z-20 bg-blue-200">
            Resources
          </th>
          <th className="min-w-30 border-r border-white sticky top-12 z-20 bg-blue-200">
            Relactive Function
          </th>
          <th className="min-w-30 border-r border-white sticky top-12 z-20 bg-blue-200">
            Responsible
          </th>
          <th className="min-w-30 border-r border-white sticky top-12 z-20 bg-blue-200">
            Deadline
          </th>
          <th className="min-w-30 border-r border-white sticky top-12 z-20 bg-blue-200">
            Action Confirmation
          </th>
          <th className="min-w-30 border-r border-white sticky top-12 z-20 bg-blue-200">
            Action Status
          </th>
          <th className="min-w-30 border-r border-white sticky top-12 z-20 bg-blue-200">
            Completion Date
          </th>
          <th className="min-w-30 border-r border-white sticky top-12 z-20 bg-blue-200">
            Status Of Verification
          </th>
          <th className="min-w-30 border-r border-white sticky top-12 z-20 bg-blue-200">
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
              className="min-w-30 border-r border-white sticky top-12 z-20 bg-blue-200"
            >
              {month}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
};

export default EnvHeaders;
