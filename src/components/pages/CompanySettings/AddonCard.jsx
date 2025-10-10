import React from "react";
import { Card, Switch, Typography, Button } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import "./AddonCard.css";

const { Title, Text } = Typography;

const AddonCard = ({ addon, onToggle, onChangeQty }) => {
  const { id, title, description, price, icon, enabled, quantity, unit } =
    addon;

  return (
    <Card className="addon-card" bordered={false}>
      <div className="addon-header">
        <div className="addon-icon">{icon}</div>
        <Switch
          checked={enabled}
          onChange={(checked) => onToggle(id, checked)}
        />
      </div>

      <Title level={5} className="addon-title">
        {title}
      </Title>
      <Text className="addon-description">{description}</Text>

      <div className="addon-footer">
        <div className="addon-quantity">
          <Button
            shape="circle"
            size="small"
            icon={<MinusOutlined />}
            onClick={() => onChangeQty(id, Math.max(quantity - 1, 0))}
          />
          <span className="addon-qty-value">{quantity}</span>
          <Button
            shape="circle"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => onChangeQty(id, quantity + 1)}
          />
        </div>
        <Text className="addon-price">
          {price}/{unit}
        </Text>
      </div>
    </Card>
  );
};

export default AddonCard;
