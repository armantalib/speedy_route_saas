/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { StyleSheetManager } from "styled-components";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { Button, Row, Col } from "antd";
import PODDetailsModal from "./PODDetailsModal";
import "./LiveTracking.css";
import LiveDriverList from "./LiveDriverList";
import LiveDriverMap from "./LiveDriverMap";
import { useDispatch } from "react-redux";
import { setHeaderName } from "../../../storeTolkit/userSlice";
import LiveDriverDetail from "./LiveDriversDetail";

const LiveTrackingList = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedStatus, setSelectedStatus] = useState("Completed");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDriverDetail, setShowDriverDetail] = useState(false);
  const dispatch = useDispatch();
  dispatch(setHeaderName("Live Tracking"));

  const dateOptions = ["Today", "Yesterday", "Last 7 Days", "Last Month"];
  const statusOptions = ["Completed", "In Progress", "Failed", "Cancelled"];

  const handleClear = () => {
    setSelectedDate(null);
    setSelectedStatus(null);
  };

  return (
    <StyleSheetManager shouldForwardProp={(prop) => !["sortActive"].includes(prop)}>
      <main className="min-h-screen lg:container py-4 px-4 mx-auto live-tracking-container">
        <Row className="main-row" gutter={[16, 16]}>
          {/* Left Panel */}
          <Col
            xs={24}
            sm={24}
            md={10}
            lg={8}
            className="left-panel"
          >
            <LiveDriverList />
            {/* <LiveDriverDetail /> */}
          </Col>

          {/* Right Panel */}
          <Col
            xs={24}
            sm={24}
            md={14}
            lg={16}
            className="right-panel"
          >
            <LiveDriverMap />
          </Col>
        </Row>
      </main>

      {/* Filter Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: "bold" }}>Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h6 className="mb-2" style={{ fontWeight: "600" }}>Date</h6>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {dateOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedDate(option)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "7px",
                      border: selectedDate === option ? "1.5px solid #4770E4" : "1px solid #ccc",
                      background: selectedDate === option ? "#F3F6FF" : "#fff",
                      color: selectedDate === option ? "#4770E4" : "#555",
                      fontWeight: "400",
                      cursor: "pointer",
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h6 className="mb-2" style={{ fontWeight: "600" }}>Status</h6>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {statusOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedStatus(option)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "7px",
                      border: selectedStatus === option ? "1.5px solid #4770E4" : "1px solid #ccc",
                      background: selectedStatus === option ? "#F3F6FF" : "#fff",
                      color: selectedStatus === option ? "#4770E4" : "#555",
                      fontWeight: "400",
                      cursor: "pointer",
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "space-between" }}>
          <button
            onClick={handleClear}
            style={{
              border: "1px solid #555",
              background: "#fff",
              borderRadius: "12px",
              padding: "6px 16px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Clear all
          </button>
          <Button
            onClick={() => setShowModal(false)}
            style={{
              background: "#4770E4",
              border: "none",
              borderRadius: "12px",
              padding: "6px 16px",
              fontWeight: "500",
            }}
          >
            Apply
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Driver Details Modal */}
      <PODDetailsModal
        visible={showDriverDetail}
        data={selectedDriver}
        onClose={() => {
          setSelectedDriver(null);
          setShowDriverDetail(false);
        }}
      />
    </StyleSheetManager>
  );
};

export default LiveTrackingList;
