// AssignDriverModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Input, Radio, Button, Typography, Avatar } from "antd";
import "./AssignDriverModal.css";
import { dataGet_, dataPut } from "../../utils/myAxios";

const { Title, Paragraph } = Typography;

const driverList = ["Candice Wu", "Demi Wilkinson", "Drew Cano", "Natali Crag"];

const driverImages = [
  "/avatars/driver1.jpg",
  "/avatars/driver2.jpg",
  "/avatars/driver3.jpg",
];

const AssignDriverModal = ({ visible, onCancel, onAssign,routeId }) => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [search, setSearch] = useState("");
  const [driversData, setDriverData] = useState([]);


  const getDrivers = async () => {
    try {
      let allData = [];
      let data1 = {}
      const endPoint = `users/admin/driver/all/1`;
      const res = await dataGet_(endPoint, data1);

      if (res?.data?.success) {
        setDriverData(res?.data?.data)
      } else {
        setDriverData([])
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  useEffect(() => {
    getDrivers();
  }, [])

  const assignDriver = async () => {
    let data1 = {}
      const endPoint = `routes/assign/update/${routeId}/${selectedDriver}`;
      const res = await dataPut(endPoint, data1);
      onAssign()
  }

  const filteredDrivers = driverList.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={400}
      className="assign-driver-modal"
    >
      {/* <div className="modal-header">
        {driverImages.map((src, i) => (
          <Avatar
            key={i}
            src={src}
            size={48}
            style={{ marginRight: -8, border: "2px solid #fff" }}
          />
        ))}
      </div> */}
      <Title level={4} style={{ textAlign: "center" }}>
        List of Drivers
      </Title>
      <Paragraph style={{ textAlign: "center", marginTop: -8 }}>
        Sorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Paragraph>

      <Input
        placeholder="Search by Name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <Radio.Group
        onChange={(e) => setSelectedDriver(e.target.value)}
        value={selectedDriver}
        className="driver-radio-group"
      >
        {driversData.map((driver, index) => (
          <Radio key={index} value={driver?._id} className="driver-radio">
            {driver.name}
          </Radio>
        ))}
      </Radio.Group>

      <div className="modal-footer">
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          type="primary"
          disabled={!selectedDriver}
          onClick={() => assignDriver()}
        >
          Assign Driver
        </Button>
      </div>
    </Modal>
  );
};

export default AssignDriverModal;
