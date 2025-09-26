import React from "react";
import { Tag } from "antd";
import "./LiveDriverCard.css";

const statusColors = {
  "On Route": "green",
  Idle: "blue",
  Delayed: "red",
};

const DriverCard = ({ driver }) => {
  return (
    <div className="driver-card">
      <div className="card-header">
        <h4>{driver.name}</h4>
        <span className="updated-text">Last Updated: {driver.updated}</span>
      </div>
      <Tag color={statusColors[driver.status]} className="status-tag">
        {driver.status}
      </Tag>
      <p>Route: #12567 · 5/8 Stops · ETA: {driver.eta}</p>
      <p>📍 Next Stop: {driver.nextStop} (ETA 5 mins)</p>
      <a className="view-details">View Details ⌄</a>
    </div>
  );
};

export default DriverCard;
