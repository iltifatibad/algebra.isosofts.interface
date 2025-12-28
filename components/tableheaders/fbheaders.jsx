import React from "react";

const FbHeaders = ({ activeHeader }) => {
  if (activeHeader) {
    return (
      <thead>
        {/* ================= 1. SATIR ================= */}
        <tr className="h-[52px]">
          <th
            className="min-w-[60px] border-r border-blue-500 sticky left-0 top-0 z-30 bg-white"
            rowSpan={3}
          >
            #
          </th>

          <th
            className="min-w-[120px] border-r border-blue-500 sticky top-0 z-20 bg-blue-100"
            rowSpan={3}
          >
            Job Number
          </th>

          <th
            className="min-w-[150px] border-r border-blue-500 sticky top-0 z-20 bg-blue-100"
            rowSpan={3}
          >
            Job Start Date
          </th>

          <th
            className="min-w-[170px] border-r border-blue-500 sticky top-0 z-20 bg-blue-100"
            rowSpan={3}
          >
            Job Completion Date
          </th>

          <th
            className="border-r border-blue-500 sticky top-0 z-20 bg-blue-100 text-center"
            colSpan={10}
          >
            Feedback Of Customer
          </th>
        </tr>

        {/* ================= 2. SATIR ================= */}
        <tr className="h-[48px]">
          <th
            className="min-w-[120px] border-r border-blue-500 sticky top-[52px] z-20 bg-blue-200"
            rowSpan={2}
          >
            Scope
          </th>

          <th
            className="min-w-[150px] border-r border-blue-500 sticky top-[52px] z-20 bg-blue-200"
            rowSpan={2}
          >
            Name Of Customer
          </th>

          <th
            className="min-w-[150px] border-r border-blue-500 sticky top-[52px] z-20 bg-blue-200"
            rowSpan={2}
          >
            Type Of Finding
          </th>

          {/* QUALITY ANA BAŞLIK */}
          <th
            className="min-w-[120px] border-r border-blue-500 sticky top-[52px] z-20 bg-blue-200 text-center"
            colSpan={4}
          >
            Quality
          </th>

          <th
            className="min-w-[160px] border-r border-blue-500 sticky top-[52px] z-20 bg-blue-200"
            rowSpan={2}
          >
            Health And Safety
          </th>

          <th
            className="min-w-[140px] border-r border-blue-500 sticky top-[52px] z-20 bg-blue-200"
            rowSpan={2}
          >
            Environment
          </th>

          <th
            className="min-w-[120px] border-r border-blue-500 sticky top-[52px] z-20 bg-blue-200"
            rowSpan={2}
          >
            Final Score
          </th>
        </tr>

        {/* ================= 3. SATIR (QUALITY ALT BAŞLIKLAR) ================= */}
        <tr className="h-[48px]">
          <th className="min-w-[120px] border-r border-blue-500 sticky top-[100px] z-20 bg-blue-300">
            Quality Of Good Service
          </th>

          <th className="min-w-[120px] border-r border-blue-500 sticky top-[100px] z-20 bg-blue-300">
            Communication
          </th>

          <th className="min-w-[140px] border-r border-blue-500 sticky top-[100px] z-20 bg-blue-300">
            On-Time Delivery
          </th>

          <th className="min-w-[130px] border-r border-blue-500 sticky top-[100px] z-20 bg-blue-300">
            Documentation
          </th>
        </tr>
      </thead>

    );
  } else {
    return (
            <thead>
        {/* ================= 1. SATIR ================= */}
        <tr className="h-[52px]">
          <th
            className="min-w-[60px] border-r border-blue-500 sticky left-0 top-0 z-30 bg-white"
            rowSpan={3}
          >
            #
          </th>

          <th
            className="border-r border-blue-500 sticky top-0 z-20 bg-blue-100 text-center"
            colSpan={10}
          >
            Feedback For Vendor
          </th>
        </tr>

        {/* ================= 2. SATIR ================= */}
        <tr className="h-[48px]">
          <th
            className="min-w-[120px] border-r border-blue-500 sticky top-[52px] z-20 bg-blue-200"
            rowSpan={2}
          >
            Scope
          </th>

          <th
            className="min-w-[150px] border-r border-blue-500 sticky top-[52px] z-20 bg-blue-200"
            rowSpan={2}
          >
            Name Of Vendor
          </th>

          <th
            className="min-w-[150px] border-r border-blue-500 sticky top-[52px] z-20 bg-blue-200"
            rowSpan={2}
          >
            Type Of Finding
          </th>

          {/* QUALITY ANA BAŞLIK */}
          <th
            className="min-w-[120px] border-r border-blue-500 sticky top-[52px] z-20 bg-blue-200 text-center"
            colSpan={4}
          >
            Quality
          </th>

          <th
            className="min-w-[160px] border-r border-blue-500 sticky top-[52px] z-20 bg-blue-200"
            rowSpan={2}
          >
            Health And Safety
          </th>

          <th
            className="min-w-[140px] border-r border-blue-500 sticky top-[52px] z-20 bg-blue-200"
            rowSpan={2}
          >
            Environment
          </th>

          <th
            className="min-w-[120px] border-r border-blue-500 sticky top-[52px] z-20 bg-blue-200"
            rowSpan={2}
          >
            Final Score
          </th>
        </tr>

        {/* ================= 3. SATIR (QUALITY ALT BAŞLIKLAR) ================= */}
        <tr className="h-[48px]">
          <th className="min-w-[120px] border-r border-blue-500 sticky top-[100px] z-20 bg-blue-300">
            Quality Of Good Service
          </th>

          <th className="min-w-[120px] border-r border-blue-500 sticky top-[100px] z-20 bg-blue-300">
            Communication
          </th>

          <th className="min-w-[140px] border-r border-blue-500 sticky top-[100px] z-20 bg-blue-300">
            On-Time Delivery
          </th>

          <th className="min-w-[130px] border-r border-blue-500 sticky top-[100px] z-20 bg-blue-300">
            Documentation
          </th>
        </tr>
      </thead>
    );
  }
};

export default FbHeaders;
