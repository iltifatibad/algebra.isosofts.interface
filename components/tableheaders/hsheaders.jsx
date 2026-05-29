import React from "react";

const HsHeaders = ({ activeHeader }) => {
  if (activeHeader) {
    return (
      <thead>
        {/* First header row - fixed height for sticky positioning */}
        <tr className="h-13">
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky left-[-1px] top-0 z-21 bg-white -ml-px"
            rowSpan={2}
          >
            #
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Process
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Hazard
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Risk
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Affected Positions
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Existing Control Measures
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            colSpan={3}
          >
            Initial Risk Assessment
          </th>

          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Additional Control Measures
          </th>


          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            colSpan={3}
          >
            Residual Risk Assessment
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Comment
          </th>
        </tr>
        <tr className="h-[48px]">



          <th className="min-w-[70px] border-r border-white text-xs whitespace-normal leading-tight sticky top-13 z-20 bg-blue-200">
            Severity
          </th>
          <th className="min-w-[70px] border-r border-white text-xs whitespace-normal leading-tight sticky top-13 z-20 bg-blue-200">
            Likelihood
          </th>
          <th className="min-w-[70px] border-r border-white text-xs whitespace-normal leading-tight sticky top-13 z-20 bg-blue-200">
            Level
          </th>

          <th className="min-w-[70px] border-r border-white text-xs whitespace-normal leading-tight sticky top-13 z-20 bg-blue-200">
            Severity
          </th>
          <th className="min-w-[70px] border-r border-white text-xs whitespace-normal leading-tight sticky top-13 z-20 bg-blue-200">
            Likelihood
          </th>
          <th className="min-w-[70px] border-r border-white text-xs whitespace-normal leading-tight sticky top-13 z-20 bg-blue-200">
            Level
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
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky left-[-1px] top-0 z-21 bg-white -ml-px"
            rowSpan={2}
          >
            #
          </th>

          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            colSpan={11}
          >
            Action Plan
          </th>

          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            colSpan={12}
          >
            Monitoring
          </th>
        </tr>

        {/* Second header row */}
        <tr className="h-12">
          <th className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-12 z-20 bg-blue-200">
            Action
          </th>
          <th className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-12 z-20 bg-blue-200">
            Action Raise Date
          </th>
          <th className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-12 z-20 bg-blue-200">
            Resources
          </th>
          <th className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-12 z-20 bg-blue-200">
            Relative Function
          </th>
          <th className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-12 z-20 bg-blue-200">
            Responsible
          </th>
          <th className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-12 z-20 bg-blue-200">
            Approver
          </th>
          <th className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-12 z-20 bg-blue-200">
            Deadline
          </th>
          <th className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-12 z-20 bg-blue-200">
            Action Confirmation
          </th>
          <th className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-12 z-20 bg-blue-200">
            Action Status
          </th>
          <th className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-12 z-20 bg-blue-200">
            Completion Date
          </th>
          <th className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-12 z-20 bg-blue-200">
            Status Of Verification
          </th>
          <th className="min-w-[200px] border-r border-white text-xs whitespace-normal leading-tight sticky top-12 z-20 bg-blue-200">
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
              className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-12 z-20 bg-blue-200"
            >
              {month}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
};

export default HsHeaders;
