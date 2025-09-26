import React, { useEffect, useRef } from "react";
import { Modal, Tag, Typography, Divider } from "antd";
import "./DriverDetailsModal.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatSecondsToHMS } from "../../utils/DateTimeCustom";

const { Title, Paragraph, Text, Link } = Typography;

const DriverDetailsModal = ({ visible, onClose, driver }) => {
  const mapRef = useRef(null);
  const routeDetail = driver?.latestRoute.length==0?null:driver?.latestRoute[0]

  useEffect(() => {
    if (visible && mapRef.current && !mapRef.current._leaflet_id) {
      const map = L.map(mapRef.current, {
        center: [34.2396, -118.5301],
        zoom: 13,
        zoomControl: false,
      });

      L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        maxZoom: 19,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }).addTo(map);
    }
  }, [visible,]);

  return (
    <Modal
      title="Driver details"
      open={visible}
      onCancel={onClose}
      footer={null}
      className="driver-modal"
      centered
      width={420}
    >
      <div className="driver-header">
        {/* <img src={driver.avatar} alt={driver.name} className="driver-avatar" /> */}
        <div className="driver-name">{driver?.name}</div>
        <Tag className={`driver-status ${driver?.status.toLowerCase()}`}>
          {driver?.status}
        </Tag>
      </div>

      <div className="driver-section">
        <Title level={5}>Current Route</Title>
        <div className="route-info">
          <div>
            <Text type="secondary">Current Route</Text>
            <div>#{routeDetail?.routeId}</div>
          </div>
          <div>
            <Text type="secondary">Stops</Text>
            <div>{routeDetail?.stops?.length}</div>
          </div>
          <div>
            <Text type="secondary">ETA</Text>
            <div>{formatSecondsToHMS(routeDetail?.duration)}</div>
          </div>
       
        </div>
        <div ref={mapRef} className="driver-map" />
        <Link className="view-map">View in Full Screen</Link>
      </div>

      <Divider />

      {/* <div className="driver-section">
        <Title level={5}>Description</Title>
        <Paragraph>
          This forum is a place to discuss the “Indomie website redesign”
          project. If anyone discusses outside the context of the project will
          be fined $500!
        </Paragraph>
      </div> */}

      <div className="driver-section">
        <Title level={5}>Details</Title>
        <div className="details-list">
          <div>
            <Text type="secondary">ID</Text>
            <div>{driver?._id}</div>
          </div>
          <div>
            <Text type="secondary">License No</Text>
            <div>{driver?.licenseNumber}</div>
          </div>
          <div>
            <Text type="secondary">Email</Text>
            <div>{driver?.email}</div>
          </div>
          <div>
            {/* <Text type="secondary">Assigned Vehicle</Text> */}
            {/* <div>{driver?.vehicle}</div> */}
          </div>
          <div>
            <Text type="secondary">Last Known Location</Text>
            <div>Lorem Ipsum</div>
          </div>
          <div>
            <Text type="secondary">License info</Text>
            <Tag className="verified-tag">Verified</Tag>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DriverDetailsModal;
