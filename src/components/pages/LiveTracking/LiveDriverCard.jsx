import React from "react";
import { Divider, Tag } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { formatSecondsToHMS } from "../../utils/DateTimeCustom";
import { useDispatch } from 'react-redux';
import { setRouteDetail } from "../../../storeTolkit/routeSlice";
import { useNavigate } from 'react-router-dom';
const statusColors = {
  "On Route": "green",
  Idle: "blue",
  Delayed: "red",
};

const DriverCard = ({ driver, driverDetail }) => {
const dispatch = useDispatch();
 const navigate = useNavigate()
  const moveNext = async () => {
    dispatch(setRouteDetail(driverDetail?.routeDetail))
    navigate('/route-detail');

  }
const completedStops = driverDetail.routeDetail.stopsData.filter(
  (stop) => stop.status === "completed"
).length;

const nextStop = driverDetail.routeDetail.stopsData.find((stop) => stop.status === "pending");
const nextStopAddress = nextStop ? nextStop.place_name : null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-3 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-1">
        <h4 className="text-[16px] font-semibold text-gray-900 leading-tight">
          {driver.name || "Johan Smith"}
        </h4>
        <div style={{display:'flex',backgroundColor:'#F3F4F4',padding:5,borderRadius:8}}>
        <span className="text-[12px] text-gray-500">
          Last Updated: {driver.updated || "1 min ago"}
        </span>
        </div>
      </div>

      {/* Status */}
      <div className="mb-3 mt-1">
        <Tag
          color={statusColors[driver.status] || "green"}
          className="text-xs font-medium rounded-full px-3 py-[2px] capitalize"
        >
          {driverDetail.routeDetail?.status=='assigned'?'On Route':'Completed' || "On Route"}
        </Tag>
      </div>

      {/* Route Info */}
      <p className="text-[13px] text-gray-700 mb-1">
        Route:{" "}
        <span className="font-medium text-gray-800">
          #{driverDetail?.routeDetail?.routeId || "12567"}
        </span>{" "}
        ·{" "}
        {/* {driverDetail?.routeDetail?.stops?.length
          ? `${completedStops+'/'+driverDetail?.routeDetail?.stops.length} / Stops`
          : "5/8 Stops"}{" "}
        · ETA:{" "} */}
        <span className="font-medium text-gray-800">
          {formatSecondsToHMS(driverDetail?.routeDetail?.duration) || "12:30 PM"}
        </span>
      </p>

      {/* Next Stop */}
      <p className="text-[13px] text-gray-700 mb-3 flex items-start mt-3">
        <EnvironmentOutlined className="text-red-500 text-[14px] mt-[2px] mr-1" />
        <span>
          Next Stop:{" "}
          <span className="font-medium text-gray-800">
            {nextStopAddress || "123 Main St."}
          </span>{" "}
        </span>
      </p>
        {/* <Divider/> */}
        <div className="border-1 mt-3"></div>
      {/* View Details */}
      <div style={{width:'100%',justifyContent:'center',alignItems:'center',display:'flex'}}>
      <button 
      onClick={()=>moveNext()}
      className="text-[14px] text-[#2563eb] font-medium flex items-center hover:underline mt-3">
        View Details
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 ml-1 mt-[1px]"
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
