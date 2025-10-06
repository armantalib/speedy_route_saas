// components/DriverStats.jsx
import React from "react";
import { Card, Typography } from "antd";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import styles from "./DriverStats.module.css";

const { Title, Text } = Typography;

const statData = [
  {
    title: "Routes Assigned Today",
    value: "3",
    trend: "+40%",
    subtext: "vs Yesterday",
    chartColor: "#3CB371",
    chartData: [1, 2, 1.5, 3, 2.8, 3.5, 3],
  },
  {
    title: "Stops Completed",
    value: "3/8",
    trend: "-10%",
    subtext: "vs last month",
    chartColor: "#FF4D4F",
    chartData: [4, 4.5, 4.2, 4.1, 3.8, 3.2, 3],
  },
  {
    title: "Estimated Route Time",
    value: "4h 15m",
    trend: "+20%",
    subtext: "vs last month",
    chartColor: "#3CB371",
    chartData: [5, 5.1, 5.5, 5.2, 4.8, 4.5, 4.15],
  },
];

const DriverStats = () => {
  return (
    <div className={styles.statsContainer}>
      {statData.map((item, idx) => (
        <Card key={idx} className={styles.statCard}>
          <Title level={5}>{item.title}</Title>
          <Text className={styles.value}>{item.value}</Text>
          <Text
            type={item.trend.includes("+") ? "success" : "danger"}
            className={styles.trend}
          >
            {item.trend}
          </Text>
          <Text className={styles.subtext}>{item.subtext}</Text>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart
              data={item.chartData.map((v, i) => ({ value: v, index: i }))}
            >
              <Line
                type="monotone"
                dataKey="value"
                stroke={item.chartColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      ))}
    </div>
  );
};

export default DriverStats;
