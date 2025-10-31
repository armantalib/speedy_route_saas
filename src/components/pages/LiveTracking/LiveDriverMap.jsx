import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import socket from "../../utils/socket";
import MovingMarker from "./MovingMarker";
import "leaflet/dist/leaflet.css";
import { live_tracking_marker } from "../../icons/icon";

// Custom driver icon
const driverIcon = new L.Icon({
  iconUrl: live_tracking_marker,
  iconSize: [45, 45],
  iconAnchor: [22, 45],
});

const FitBounds = ({ drivers }) => {
  const map = useMap();

  useEffect(() => {
    if (drivers.length > 0) {
      const bounds = L.latLngBounds(
        drivers.map((d) => [d.latitude, d.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [drivers, map]);

  return null;
};

const LiveDriverMap = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    socket.on("driver_location_update", (data) => {
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
            {
              ...data.location,
              userId: data.userId,
              routeDetail: data?.routeDetail,
            },
          ];
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
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
      />

      <FitBounds drivers={drivers} />

      {drivers.map((driver) => (
        <>
        <MovingMarker
  key={driver.userId}
  id={driver.userId}
  lat={driver.latitude}
  lng={driver.longitude}
  icon={driverIcon}
  popupContent={`<b>${driver?.routeDetail?.driver?.name || "Driver"}</b><br/>Lat: ${driver.latitude}, Lng: ${driver.longitude}`}
  permanentLabel={driver?.routeDetail?.driver?.name || "Driver"} // 👈 name below marker
/>
       
        </>
      ))}
    </MapContainer>
  );
};

export default LiveDriverMap;
