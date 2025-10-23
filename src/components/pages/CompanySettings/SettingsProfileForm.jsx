import React, { useEffect, useState } from "react";
import { Button, Input, Select, Row, Col, Typography, message } from "antd";
import {
  MailOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import "./SettingsProfileForm.css";
import { dataGet_, dataPut } from "../../utils/myAxios";

const { TextArea } = Input;
const { Option } = Select;

const SettingsProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [timezone, setTimezone] = useState("edt");

  useEffect(() => {
    getDataUser();
  }, []);

  const getDataUser = async () => {
    try {
      setLoading(true);
      const response = await dataGet_("users/me", {});
      if (response?.data?.success) {
        const user = response.data.user;
        setUserData(user);
        setName(user?.name || "");
        setEmail(user?.email || "");
        setBio(user?.about_me || "");
        setTimezone(user?.timezone || "edt");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfileData = async () => {
    try {
      setLoading(true);
      const payload = {
        name,
        email,
        about_me:bio,
        timezone,
      };
      const response = await dataPut("users/update-user", payload);
      if (response?.data?.success) {
        setUserData(response.data.user);
        message.success("Profile updated successfully!");
      } else {
        message.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
            <Input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
        </Row>
      </div>

      <div className="form-group">
        <label>Email address</label>
        <Input
          prefix={<MailOutlined />}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>
          Timezone <InfoCircleOutlined className="info-icon" />
        </label>
        <Select
          value={timezone}
          onChange={(value) => setTimezone(value)}
          style={{ width: "100%" }}
        >
          <Option value="edt">Eastern Daylight Time</Option>
          <Option value="cdt">Central Daylight Time</Option>
          <Option value="mdt">Mountain Daylight Time</Option>
          <Option value="mst">Mountain Standard Time</Option>
          <Option value="pdt">Pacific Daylight Time</Option>
          <Option value="adt">Alaska Daylight Time</Option>
          <Option value="has">Hawaii-Aleutian Standard Time</Option>
        </Select>
      </div>

      <div className="form-group">
        <label>Bio</label>
        <TextArea
          rows={4}
          placeholder="Tell us something about yourself..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={275}
        />
        <div className="char-count">{275 - bio.length} characters left</div>
      </div>

      <div className="form-actions">
        <Button onClick={() => getDataUser()} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="primary"
          loading={loading}
          onClick={updateProfileData}
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export default SettingsProfileForm;
