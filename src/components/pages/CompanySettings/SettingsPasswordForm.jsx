import React from "react";
import { Input, Button, Typography, Divider } from "antd";
import { DesktopOutlined, EllipsisOutlined } from "@ant-design/icons";
import "./SettingsPasswordForm.css";

const SettingsPasswordForm = () => {
  return (
    <div className="settings-password-form">
          <Typography.Title level={4} className="form-title">
        Personal info
      </Typography.Title>
      <p className="form-subtitle">
        Please enter your current password to change your password.
      </p>

      <div className="form-group">
        <label>Current password</label>
        <Input.Password />
      </div>

      <div className="form-group">
        <label>New password</label>
        <Input.Password />
        <div className="helper-text">
          Your new password must be more than 8 characters.
        </div>
      </div>

      <div className="form-group">
        <label>Confirm new password</label>
        <Input.Password />
      </div>

      <div className="form-actions">
        <Button>Cancel</Button>
        <Button type="primary">Update password</Button>
      </div>

      <Divider />

      {/* <div className="login-devices-section">
        <Typography.Title level={5}>Where you’re logged in</Typography.Title>
        <p className="device-subtitle">
          We’ll alert you via <span className="email">olivia@xyz.com</span> if
          there is any unusual activity on your account.
        </p>

        <div className="device-entry">
          <DesktopOutlined className="device-icon" />
          <div className="device-info">
            <div className="device-name">
              2018 Macbook Pro 15-inch{" "}
              <span className="active-badge">• Active now</span>
            </div>
            <div className="device-meta">
              Melbourne, Australia • 22 Jan at 10:40am
            </div>
          </div>
          <EllipsisOutlined className="device-menu" />
        </div>

        <div className="device-entry">
          <DesktopOutlined className="device-icon" />
          <div className="device-info">
            <div className="device-name">2018 Macbook Pro 15-inch</div>
            <div className="device-meta">
              Melbourne, Australia • 22 Jan at 4:20pm
            </div>
          </div>
          <EllipsisOutlined className="device-menu" />
        </div>
      </div> */}
    </div>
  );
};

export default SettingsPasswordForm;
