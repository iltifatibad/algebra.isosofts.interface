import React from "react";

const CusHeaders = ({ activeHeader }) => {
  if (activeHeader) {
    return (
      <thead>
        {/* First header row - fixed height for sticky positioning */}
        <tr className="h-13">
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky left-[-1px] top-0 z-21 bg-white -ml-px"
            rowSpan={2}
          >
            VOEN / Reg Number
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Customer Name
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            VOEN/Reg Number
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Scope 1
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Scope 2
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Scope 3
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Registration Date
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Next Review Date
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Days Left To Next Review
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Evaluation Status
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            colSpan={4}
          >
            Quality
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Health & Safety
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Environment
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Total Score
          </th>
          <th
            className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-0 z-20 bg-blue-100"
            rowSpan={2}
          >
            Comment
          </th>
        </tr>

        <tr className="h-[48px]">
          <th className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-[52px] z-20 bg-blue-200">
            Quality of Goods/Service
          </th>
          <th className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-[52px] z-20 bg-blue-200">
            Communication
          </th>
          <th className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-[52px] z-20 bg-blue-200">
            On -time delivery
          </th>
          <th className="min-w-[80px] border-r border-white text-xs whitespace-normal leading-tight sticky top-[52px] z-20 bg-blue-200">
            Documentation
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
            VOEN / Reg Number
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

export default CusHeaders;
