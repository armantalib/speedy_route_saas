import React from "react";
import { Tag } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const statusColors = {
  "On Route": "success",
  Idle: "processing",
  Delayed: "error",
};

const DriverCard = ({ driver, driverDetail }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">
            {driver?.name || "Johan Smith"}
          </h3>
        </div>
        <div className="text-[12px] text-gray-500">
          Last Updated: {driver?.updated || "1 min ago"}
        </div>
      </div>

      {/* Status */}
      <div className="mb-3">
        <Tag
          color={statusColors[driver?.status] || "success"}
          className="!rounded-full !text-xs !px-3 !py-[2px] font-medium"
        >
          {driver?.status || "On Route"}
        </Tag>
      </div>

      {/* Route Details */}
      <div className="text-[13px] text-gray-700 mb-1 leading-snug">
        Route:{" "}
        <span className="font-medium text-gray-800">
          #{driverDetail?.routeDetail?.routeId || "12567"}
        </span>{" "}
        ·{" "}
        {driverDetail?.routeDetail?.stops?.length
          ? `${driverDetail?.routeDetail?.stops.length}/8 Stops`
          : "5/8 Stops"}{" "}
        · ETA:{" "}
        <span className="font-medium text-gray-800">
          {driverDetail?.routeDetail?.eta || "12:30 PM"}
        </span>
      </div>

      {/* Next Stop */}
      <div className="flex items-start text-[13px] text-gray-700 mb-3 leading-snug">
        <EnvironmentOutlined className="text-red-500 text-[14px] mt-[2px] mr-1" />
        <span>
          Next Stop:{" "}
          <span className="font-medium text-gray-800">
            {driver?.nextStop || "123 Main St."}
          </span>{" "}
          (ETA 5 mins)
        </span>
      </div>

      {/* View Details */}
      <div className="border-t border-gray-100 pt-2">
        <button className="text-[13px] text-[#2563eb] font-medium hover:underline flex items-center transition">
          View Details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 ml-1 mt-[1px]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DriverCard;
