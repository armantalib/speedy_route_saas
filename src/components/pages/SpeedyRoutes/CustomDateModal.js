import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { DatePicker } from "antd";
import "antd/dist/reset.css";

const { RangePicker } = DatePicker;

const CustomDateModal = ({
  enlargedImage,
  setEnlargedImage,
  selectedDate,
  customDateRange,
  setCustomDateRange,
  fetchData,
}) => {
  // Prevent modal from closing when calendar clicked
  useEffect(() => {
    const modal = document.querySelector(".modal.show");
    if (modal) {
      const stopClose = (e) => {
        if (e.target.closest(".ant-picker-dropdown")) e.stopPropagation();
      };
      modal.addEventListener("mousedown", stopClose);
      return () => modal.removeEventListener("mousedown", stopClose);
    }
  }, []);

  return (
    <Modal
      show={!!enlargedImage}
      onHide={() => setEnlargedImage(null)}
      centered
      size="sm"
      backdrop="static"
    >
      <Modal.Body
        style={{
          padding: "20px",
          borderRadius: "16px",
          background: "#f9f9fb",
          position: "relative",
        }}
      >
        {selectedDate === "Custom Days" && (
          <div style={{ width: "100%" }}>
            <h5
              style={{
                textAlign: "center",
                marginBottom: 20,
                fontWeight: "600",
                color: "#333",
              }}
            >
              Select Custom Date Range
            </h5>

            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                padding: "10px",
              }}
            >
              <RangePicker
                open={true} // keep open until both selected
                value={customDateRange}
                onChange={(dates) => {
                  if (dates && dates.length === 2) {
                    setCustomDateRange(dates);
                    // ✅ Close modal automatically when both dates selected
                    setTimeout(() => {
                      setEnlargedImage(null);
                      fetchData();
                    }, 300);
                  } else {
                    setCustomDateRange(dates);
                  }
                }}
                format="YYYY-MM-DD"
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                style={{
                  width: "100%",
                  border: "none",
                  boxShadow: "none",
                  background: "transparent",
                  textAlign: "center",
                }}
                allowClear={false}
              />
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CustomDateModal;
