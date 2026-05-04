import React from "react";

const FHeaders = ({ activeHeader }) => {
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
            Issuer
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Finding Date
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Job Number
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
            Category Of Finding
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Type Of Finding
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Source Of Finding
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Customer
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Vendor
          </th>

          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Finding Description
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Containtment Action
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Root Causes
          </th>
           <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Finding Status
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Comment
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

export default FHeaders;
