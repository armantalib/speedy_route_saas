import React, { useState } from "react";
import { Tabs } from "antd";

import "./Settings.css";
import SettingsProfileForm from "./SettingsProfileForm";
import SettingsPasswordForm from "./SettingsPasswordForm";
import Plans from "./Plans";
import Addons from "./Addons";
import Billing from "./Billing";



const Settings = () => {
  const [tab, setTab] = useState('1')
  const [plan, setPlan] = useState(null)

  const items = [
    { key: "1", label: "Profile", children: <SettingsProfileForm /> },
    { key: "2", label: "Password", children: <SettingsPasswordForm /> },
    // { key: "3", label: "Team", children: <SettingsTeamForm /> },
    // {
    //   key: "3", label: "Plans", children:
    //     <Plans
    //       onContinue={(plan) => { setTab('4') }}
          
    //     />
    // },
    // { key: "4", label: "Addons", children: <Addons 
    //          onContinue={(plan) => { setTab('5') }}
    // /> },
    { key: "5", label: "Billing", children: <Billing  onContinue={(plan) => { setTab('1') }} /> },
    //   { key: "6", label: "Billing" },
  ];
  return (
    <div className="settings-page">
      <Tabs defaultActiveKey="1" activeKey={tab} onTabClick={(val) => setTab(val)
      } items={items} />
    </div>
  );
};

export default Settings;
