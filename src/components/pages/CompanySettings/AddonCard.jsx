import React from "react";
import { Card, Switch, Typography, Button, Divider } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import "./AddonCard.css";
import { Divide } from "react-feather";

const { Title, Text } = Typography;

const AddonCard = ({ addon, onToggle, onChangeQty }) => {
  const { id, title, description, price, icon, enabled, quantity, unit } =
    addon;

  return (
    <Card className="addon-card" bordered={false}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: -20 }}>
        <div></div>
        <Switch
          checked={enabled}
          onChange={(checked) => onToggle(id, checked)}
        />
      </div>
      <div className="addon-header" style={{ marginTop: -6 }}>
        <div className="addon-icon">{icon}</div>
        <Title level={5} className="addon-title" style={{ marginTop: 10 }}>
          {addon?.addon_name}
        </Title>
      </div>
      <Text className="addon-description">{addon?.addon_desc}</Text>
      <Divider/>
      <div className="addon-footer">
        <div className="addon-quantity">
          <Button
            shape="circle"
            size="small"
            icon={<MinusOutlined />}
            onClick={() => onChangeQty('minus')}
          />
          <span className="addon-qty-value">{quantity}</span>
          <Button
            shape="circle"
            size="small"
            icon={<PlusOutlined className="big-icon" />}
            onClick={() => onChangeQty('plus')}
            style={{
              backgroundColor: "#4770E4", // button color
              borderRadius: 100,
              borderWidth:1,
              color: "white",             // icon color
            }}
          />
        </div>
        <Text className="addon-price">
          {addon?.price}/$
        </Text>
      </div>
    </Card>
  );
};

export default AddonCard;
