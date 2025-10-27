import React from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { MdOutlineRadioButtonChecked } from "react-icons/md";

const LiveDriversDetail = () => {
  return (
    <div className="flex flex-col w-[440px] bg-white border border-gray-200 rounded-lg shadow-sm p-5">
      {/* Header */}
      <FaArrowLeft className="text-gray-500 cursor-pointer" size={18} />

      <div className="flex items-center justify-between mb-4 mt-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-800">Johan Smith</h2>
        </div>
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-green-500" size={16} />
          <span className="text-sm text-green-600 font-medium">Active</span>
        </div>
      </div>

      {/* Location Section */}
      {/* <div className="text-sm text-gray-700 mb-5">
        <p className="font-medium">Current Location</p>
        <p className="text-gray-500">
          1937 - 1945 Scenic Hwy N Snellville, GA 30078
        </p>
      </div> */}

      {/* Driving Status */}
      {/* <div className="flex items-center gap-2 mb-5">
        <MdOutlineRadioButtonChecked className="text-red-500" size={16} />
        <span className="text-sm font-semibold text-gray-700">Driving</span>
        <span className="text-xs text-red-500 bg-red-100 px-2 py-[1px] rounded-md">
          Live
        </span>
      </div> */}

      {/* Route Info */}
      <div className="space-y-1 text-sm text-gray-700 mb-6">
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <span className="font-medium w-32 inline-block text-gray-400">Route ID:</span>
          <span className="text-gray-600">#123</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <span className="font-medium w-32 inline-block text-gray-400 mt-1">Stops Completed:</span>
          5 of 8
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <span className="font-medium w-32 inline-block text-gray-400 mt-1">Route Start Time:</span>
          08:15 AM
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <span className="font-medium w-32 inline-block text-gray-400 mt-1">Estimated ETA:</span>
          10:50 PM
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <span className="font-medium w-32 inline-block text-gray-400 mt-1">Total Distance:</span>
          2500 miles
        </div>
      </div>

      {/* Driver Shift */}
      {/* <div className="mb-6">
        <h3 className="font-semibold text-gray-800 text-sm mb-2">
          Driver Shift
        </h3>
        <div className="space-y-1 text-sm text-gray-700">
          <p>
            <span className="font-medium w-32 inline-block">Upcoming Shift:</span>
            8:00 AM - 4:00 PM
          </p>
          <p>
            <span className="font-medium w-32 inline-block">Next Break:</span>
            12:00 PM - 1:00 PM
          </p>
          <p>
            <span className="font-medium w-32 inline-block">Assigned Route:</span>
            Route A
          </p>
        </div>
      </div> */}

      {/* Driver Performance */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 text-sm mb-2">
          Driver Performance
        </h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm grid grid-cols-2 gap-y-2">
          <p>
            <span className="font-medium text-gray-500">Completed Trips</span>
            <br />
            52
          </p>
          <p>
            <span className="font-medium text-gray-500">Average Trip Duration</span>
            <br />
            45 min
          </p>
          <p>
            <span className="font-medium text-gray-500">Safety Record</span>
            <br />
            No Violation
          </p>
          <p>
            <span className="font-medium text-gray-500">On Time Percentage</span>
            <br />
            95 %
          </p>
        </div>
      </div>

      {/* Other Details */}
      <div>
        <h3 className="font-semibold text-gray-800 text-sm mb-2">
          Other Details
        </h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-medium w-24 inline-block">Phone:</span>
            (342) 235-4512
          </p>
          <p>
            <span className="font-medium w-24 inline-block">Email:</span>
            John@fleet.com
          </p>
          <p>
            <span className="font-medium w-24 inline-block">ID:</span>
            91243
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveDriversDetail;
