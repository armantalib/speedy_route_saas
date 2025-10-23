import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import socket from "../../utils/socket";
import MovingMarker from "./MovingMarker";
import "leaflet/dist/leaflet.css";

const driverIcon = new L.Icon({
  iconUrl: "https://storage.googleapis.com/speedyroute-b8a9a.firebasestorage.app/uploads/1758893863596.png",
  iconSize: [45, 45],
  iconAnchor: [16, 32],
});

const LiveDriverMap = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    socket.on("driver_location_update", (data) => {
      
      setDrivers((prev) => {
        const exists = prev.find((d) => d.userId === data.userId);
        if (exists) {
          return prev.map((d) =>
            d.userId === data.userId ? { ...d, ...data.location } : d
          );
        } else {
          return [...prev, { ...data.location, userId: data.userId,routeDetail:data?.routeDetail }];
        }
      });
    });

    return () => socket.off("driver_location_update");
  }, []);
  
  return (
    <MapContainer
      center={[38.689582665351594, -101.67054287037817]}
      zoom={5}
      scrollWheelZoom
      style={{ height: "800px", width: "100%" }}
    >
      {/* <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      /> */}

  <TileLayer
  attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
/>
      

      {drivers.map((driver) => (
        <MovingMarker
          key={driver.userId}
          id={driver.userId}
          lat={driver.latitude}
          lng={driver.longitude}
          icon={driverIcon}
          popupContent={
            `<b>${driver?.routeDetail?.driver?.name || "Driver"}</b><br/>Lat: ${driver.latitude}, Lng: ${driver.longitude}`
          }
        />
      ))}
    </MapContainer>
  );
};

export default LiveDriverMap;
