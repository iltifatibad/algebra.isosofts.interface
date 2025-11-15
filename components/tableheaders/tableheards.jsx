import React from "react";

const BgHeaders = ({activeHeader}) => {
  if(activeHeader){
    
return (
    <thead>
      {/* First header row - fixed height for sticky positioning */}
      <tr className="h-12">
        <th
          className="min-w-15 border border-blue-500 sticky left-[-1px] top-0 z-21 bg-white -ml-px"
          rowSpan={2}
        >
          #
        </th>
        <th
          className="min-w-15 border border-blue-500 sticky top-0 z-20 bg-blue-100"
          rowSpan={2}
        >
          SWOT
        </th>
        <th
          className="min-w-15 border border-blue-500 sticky top-0 z-20 bg-blue-100"
          rowSpan={2}
        >
          PESTLE
        </th>
        <th
          className="min-w-15 border border-blue-500 sticky top-0 z-20 bg-blue-100"
          rowSpan={2}
        >
          Interested Party
        </th>
        <th
          className="min-w-15 border border-blue-500 sticky top-0 z-20 bg-blue-100"
          rowSpan={2}
        >
          Risk/Oppurtunity
        </th>
        <th
          className="min-w-15 border border-blue-500 sticky top-0 z-20 bg-blue-100"
          rowSpan={2}
        >
          Objective
        </th>
        <th
          className="min-w-15 border border-blue-500 sticky top-0 z-20 bg-blue-100"
          rowSpan={2}
        >
          KPI
        </th>
        <th
          className="min-w-15 border border-blue-500 sticky top-0 z-20 bg-blue-100"
          rowSpan={2}
        >
          Process
        </th>
        <th
          className="min-w-50 border border-blue-500 sticky top-0 z-20 bg-blue-100"
          rowSpan={2}
        >
          Existing Risk Mitigation/Exploting Opportunity's Actions
        </th>
        <th
          className="min-w-15 border border-blue-500 sticky top-0 z-20 bg-blue-100"
          colSpan={3}
        >
          Initial Risk
        </th>
        <th
          className="min-w-15 border border-blue-500 sticky top-0 z-20 bg-blue-100"
          colSpan={11}
        >
          Action Plan
        </th>
        <th
          className="min-w-15 border border-blue-500 sticky top-0 z-20 bg-blue-100"
          colSpan={3}
        >
          Residual Risk/Opportunity Level
        </th>
      </tr>

      {/* Second header row - fixed height, sticky at top-12 (48px) */}
      <tr className="h-12">
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Severity
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Likelyhood
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Risk
        </th>

        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Action
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Action Raise Date
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Resources
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Relactive Function
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Responsible
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Deadline
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Action Confirmation
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Action Status
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Compilation Date
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Status Of Verification
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Comment
        </th>

        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Severity
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Likelyhood
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Risk Opportunity Level
        </th>
      </tr>
    </thead>
  );
  }else {
    
return (
    <thead>
      {/* First header row - fixed height for sticky positioning */}
      <tr className="h-12">
        <th
          className="min-w-15 border border-blue-500 sticky left-[-1px] top-0 z-21 bg-white -ml-px"
          rowSpan={2}
        >
          #
        </th>
              <th
          className="min-w-15 border border-blue-500 sticky top-0 z-20 bg-blue-100"
          colSpan={11}
        >
          Action Plan
        </th>
              </tr>

      {/* Second header row - fixed height, sticky at top-12 (48px) */}
      <tr className="h-12">
                <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Action
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Action Raise Date
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Resources
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Relactive Function
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Responsible
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Deadline
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Action Confirmation
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Action Status
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Compilation Date
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Status Of Verification
        </th>
        <th className="min-w-15 border border-blue-500 sticky top-12 z-20 bg-blue-200">
          Comment
        </th>

             </tr>
    </thead>
  );
  }
  };

export default BgHeaders;
