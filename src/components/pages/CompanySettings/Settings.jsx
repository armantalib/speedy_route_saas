import React from "react";
import { Tabs } from "antd";

import "./Settings.css";
import SettingsProfileForm from "./SettingsProfileForm";
import SettingsPasswordForm from "./SettingsPasswordForm";
import Plans from "./Plans";
import Addons from "./Addons";

const items = [
  { key: "1", label: "Profile", children: <SettingsProfileForm /> },
  { key: "2", label: "Password", children: <SettingsPasswordForm /> },
  // { key: "3", label: "Team", children: <SettingsTeamForm /> },
  { key: "3", label: "Plans", children: <Plans /> },
  { key: "4", label: "Addons", children: <Addons /> },
  { key: "5", label: "Billing", children: <SettingsProfileForm /> },
  //   { key: "6", label: "Billing" },
];

const Settings = () => {
  return (
    <div className="settings-page">
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default Settings;
