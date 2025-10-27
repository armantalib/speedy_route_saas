/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Input, Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import DriverCard from "./LiveDriverCard";
import "./LiveDriverList.css";
import socket from "../../utils/socket";

const LiveDriverList = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    // ✅ Listen for driver updates from socket
    socket.on("driver_location_update", (data) => {
      console.log("Data===>",data);
      
      setDrivers((prev) => {
        const exists = prev.find((d) => d.userId === data.userId);
        if (exists) {
          return prev.map((d) =>
            d.userId === data.userId
              ? { ...d, ...data.location, routeDetail: data.routeDetail }
              : d
          );
        } else {
          return [
            ...prev,
            { ...data.location, userId: data.userId, routeDetail: data.routeDetail },
          ];
        }
      });
    });

    return () => {
      socket.off("driver_location_update");
    };
  }, []);

  return (
    <div className="driver-list">
      <div className="driver-list-header">
        <Input.Search placeholder="Search Driver" className="search-input" />
        <Button icon={<FilterOutlined />} className="filter-btn">
          Filter
        </Button>
      </div>

      {drivers.map((driver) => (
        <DriverCard
          key={driver.userId}
          driverDetail={driver}
          driver={{
            id: driver.userId,
            name: driver.routeDetail?.driver?.name || "Unknown Driver",
            status: driver.routeDetail?.status || "Idle",
            eta: driver.routeDetail?.scheduleTime
              ? new Date(driver.routeDetail.scheduleTime).toLocaleTimeString()
              : "N/A",
            nextStop: driver.routeDetail?.endPoint?.address || "N/A",
            updated: driver.lastUpdate
              ? new Date(driver.lastUpdate).toLocaleTimeString()
              : "Now",
          }}
        />
      ))}
    </div>
  );
};

export default LiveDriverList;
