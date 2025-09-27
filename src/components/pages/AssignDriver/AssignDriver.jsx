import React, { useEffect, useRef, useState } from "react";
import { Card, Button, Descriptions, Timeline, Typography, Tooltip } from "antd";
import { EnvironmentOutlined, ClockCircleOutlined, ExportOutlined, PrinterOutlined } from "@ant-design/icons";
import L from "leaflet";
import AssignDriverModal from "./AssignDriverModal";
import "leaflet/dist/leaflet.css";
import "./AssignDriver.css";

// Import custom marker icons
import startIconUrl from "../../assets/svg/start-pin.svg";
import destinationIconUrl from "../../assets/svg/start-pin.svg";
import { CircularProgress } from "@mui/material";

const { Title, Text } = Typography;

const AssignDriver = ({ routeGeometry, start, stops = [], destination,routeName,routeId,startPoint,endPoint,dateSchedule,timeSchedule,stopData=[],onClickSave,loading,exportToCSV,printToPDF }) => {
  const mapRef = useRef(null);
  const routeLayerRef = useRef(null);
  const markersRef = useRef([]);
  const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);

  // Function to create a stop marker with dynamic index
  const createStopMarker = (index) => {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="40" viewBox="0 0 24 40">
        <!-- Pin body -->
        <path d="M12 0C5.373 0 0 5.373 0 12c0 4.418 7.636 15.347 11.25 20.502.637.892 1.75.892 2.387 0C16.364 27.347 24 16.418 24 12 24 5.373 18.627 0 12 0z" fill="#1890ff"/>
        <!-- Circular badge for number -->
        <circle cx="12" cy="12" r="8" fill="white"/>
        <text x="12" y="16" font-size="10" text-anchor="middle" fill="#1890ff" font-weight="bold">${index}</text>
      </svg>
    `;
  };

  // Initialize map
  useEffect(() => {
    
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [34.2402, -118.5535],
        zoom: 13,
        zoomControl: false,
      });

      // Add Google Maps tile layer
      L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        maxZoom: 19,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map with route, start, stops, destination
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove previous route
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    // Remove previous markers
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

    // Add marker helper
    const addMarker = (coordinates, label, iconUrl) => {
      const icon = L.icon({
        iconUrl: iconUrl,
        iconSize: [24, 40],
        iconAnchor: [12, 40],
        popupAnchor: [0, -40],
      });

      const marker = L.marker([coordinates[1], coordinates[0]], { icon })
        .addTo(map)
        .bindPopup(label);

      markersRef.current.push(marker);
    };

    if (start) addMarker(start, "Start", startIconUrl);

    stops.forEach((stop, index) => {
      const stopIconUrl = `data:image/svg+xml;utf8,${encodeURIComponent(
        createStopMarker(index + 1)
      )}`;
      addMarker(stop, `Stop ${index + 1}`, stopIconUrl);
    });

    if (destination) addMarker(destination, "Destination", destinationIconUrl);

    // Draw route polyline if available
    if (routeGeometry?.geometry?.coordinates) {
      const routeCoordinates = routeGeometry.geometry.coordinates.map(
        ([lng, lat]) => [lat, lng]
      );

      routeLayerRef.current = L.polyline(routeCoordinates, {
        color: "#006d75",
        weight: 5,
      }).addTo(map);

      const bounds = L.latLngBounds([
        ...routeCoordinates,
        start ? [start[1], start[0]] : [],
        destination ? [destination[1], destination[0]] : [],
        ...stops.map((stop) => [stop[1], stop[0]]),
      ].filter((coord) => coord.length === 2));

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [routeGeometry, start, stops, destination]);

  return (
    <div className="assign-driver-container">
      <Card className="driver-card" bordered={false}>
        <Title level={4}>Assign Driver</Title>
        <Text type="secondary">
          Sorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>

        {/* Route Info */}
        <Descriptions column={1} bordered className="route-info">
          <Descriptions.Item label="Auto Route ID">#{routeId}</Descriptions.Item>
          <Descriptions.Item label="Route Name">{routeName}</Descriptions.Item>
          <Descriptions.Item label="Start Point">{startPoint}</Descriptions.Item>
          <Descriptions.Item label="End Point (optional)">{endPoint}</Descriptions.Item>
          <Descriptions.Item label="Scheduled Date">{dateSchedule}</Descriptions.Item>
          <Descriptions.Item label="Time Window">{timeSchedule}</Descriptions.Item>
          <Descriptions.Item label="Stops">{stops?.length || 0}</Descriptions.Item>
        </Descriptions>

        {/* Stops Timeline */}
        <div className="stops-section">
          <Timeline mode="left">
            <Timeline.Item dot={<EnvironmentOutlined />} className="stop-item">
              <strong>Start</strong> <br />{startPoint}
            </Timeline.Item>
            {stopData.map((stop, idx) => (
              <Timeline.Item
                key={idx}
                dot={<ClockCircleOutlined style={{ fontSize: "16px" }} />}
                className="stop-item"
              >
                <strong>Stop {idx + 1}</strong> <br />
                {stop?.place_name} <br />
                <Text type="secondary">Delivery | Pending</Text>
              </Timeline.Item>
            ))}
            {destination && (
              <Timeline.Item dot={<EnvironmentOutlined />} className="stop-item">
                <strong>Destination</strong> <br />{endPoint}
              </Timeline.Item>
            )}
          </Timeline>
        </div>

        {/* Actions */}
        <div className="driver-actions">
          <Button style={{ marginRight: 8 }} onClick={onClickSave}>
            {loading?
            <CircularProgress size={18} className='text_black' />:
            "Save as Draft"
            }
            </Button>
          <Button type="primary" onClick={() => setShowAssignDriverModal(true)}>
            Assign Driver
          </Button>

             <Tooltip title="Export to CSV">
                                <Button icon={<ExportOutlined />} onClick={exportToCSV} />
                              </Tooltip>
                              <Tooltip title="Print to PDF">
                                <Button icon={<PrinterOutlined />} onClick={printToPDF} />
                              </Tooltip>
        </div>
      </Card>

      {/* Map */}
      <div className="map-section">
        <div id="map" className="leaflet-map"></div>
      </div>

      {/* Assign Driver Modal */}
      <AssignDriverModal
        visible={showAssignDriverModal}
        onCancel={() => setShowAssignDriverModal(false)}
        // routeId = {}
        onAssign={(driverName) => {
          console.log("Driver assigned:", driverName);
          setShowAssignDriverModal(false);
        }}
      />
    </div>
  );
};

export default AssignDriver;
