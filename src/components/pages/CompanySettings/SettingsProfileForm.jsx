import React from "react";
import { Button, Input, Select, Upload, Row, Col, Typography } from "antd";
import {
  InboxOutlined,
  MailOutlined,
  InfoCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "./SettingsProfileForm.css";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const SettingsProfileForm = () => {
  return (
    <div className="settings-profile-form">
       <Typography.Title level={4} className="form-title">
           Personal info
         </Typography.Title>
      <p className="form-subtitle">
        Update your photo and personal details here.
      </p>

      <div className="form-group">
        <label>Name</label>
        <Row gutter={16}>
          <Col span={12}>
            <Input placeholder="Oliva" />
          </Col>
          <Col span={12}>
            <Input placeholder="Rhye" />
          </Col>
        </Row>
      </div>

      <div className="form-group">
        <label>Email address</label>
        <Input prefix={<MailOutlined />} defaultValue="olivia@xyz.com" />
      </div>

  

      <div className="form-group">
        <label>Role</label>
        <Input defaultValue="Admin" />
      </div>

      <div className="form-group">
        <label>Country</label>
        <Select defaultValue="Australia" style={{ width: "100%" }}>
          <Option value="Australia">🇦🇺 Australia</Option>
          <Option value="USA">🇺🇸 USA</Option>
        </Select>
      </div>

      <div className="form-group">
        <label>
          Timezone <InfoCircleOutlined className="info-icon" />
        </label>
        <Select defaultValue="PST" style={{ width: "100%" }}>
          <Option value="PST">Pacific Standard Time (PST) UTC-08:00</Option>
        </Select>
      </div>

      <div className="form-group">
        <label>Bio</label>

        <TextArea rows={4} defaultValue="Lorem Ipsum Lorem Ipsum..." />
        <div className="char-count">275 characters left</div>
      </div>

      <div className="form-actions">
        <Button>Cancel</Button>
        <Button type="primary">Save</Button>
      </div>
    </div>
  );
};

export default SettingsProfileForm;
