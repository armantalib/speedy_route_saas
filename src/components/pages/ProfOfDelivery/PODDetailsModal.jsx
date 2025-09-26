import React from "react";
import { Modal, Tag } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./PODDetailsModal.css";
import moment from "moment";

const PODDetailsModal = ({ visible, onClose, data }) => {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      closable={false}
      centered
      width={420}
      className="pod-details-modal"
    >
      <div className="pod-details-header">
        <div className="title">POD details</div>
        <button className="close-button" onClick={onClose}>
          <CloseOutlined />
        </button>
      </div>

      <div className="pod-details-body">
        <div className="pod-number">
          POD #{data?.routeId}
          <Tag className="status-badge">{data?.status}</Tag>
        </div>

        <div className="section">
          <div className="section-title">Time Stamps : {moment(data?.updatedAt).format('DD-MM-YYYY hh:mm a')}</div>
          <div className="info-row">
            <span>Stops</span>
            <span>{data?.stops?.length}</span>
          </div>
          <div className="info-row">
            <span>Assigned Route</span>
            <span>{data?.driver?.name}</span>
          </div>
          <div className="info-row">
            <span>Date & Time</span>
            <span>{moment(data?.createdAt).format('DD-MM-YYYY hh:mm a')}</span>
          </div>
          {/* <div className="info-row">
            <span>Assigned Vehicle</span>
            <span>{data?.vehicle}</span>
          </div> */}
        </div>

        <div className="section">
          <div className="section-title">Comments & Notes</div>
          <p className="comments">
            {data?.endPoint?.notes ||
              data?.endPoint?.notes}
          </p>
        </div>

        <div className="section">
          <div className="section-title">Picture of Delivery</div>
          <img src={data?.endPoint?.profDelivery} alt="POD" className="delivery-image" />
        </div>

        {/* <div className="section">
          <div className="section-title">Signature</div>
          <div className="signature-box">
            <img src={data?.signature} alt="Signature" />
          </div>
        </div> */}
      </div>
    </Modal>
  );
};

export default PODDetailsModal;
