import React, { useState } from "react";
import { Switch, Button } from "antd";
import PlanCard from "./PlanCard";
// import BillingHistoryTable from "./BillingHistoryTable";
import "./Plans.css";

const yearlyPlans = [
  {
    id: "go",
    title: "Go plan",
    price: 100,
    period: "Yearly",
    features: [
      "1 Admin/Dispatcher",
      "5 Optimizations per user/day",
      "7 Days Route History",
      "Proof of Delivery",
      "Email Support",
    ],
    badge: "Limited time only",
  },
  {
    id: "grow",
    title: "Grow plan",
    price: 200,
    period: "Yearly",
    features: [
      "Up to 3 Admins/Dispatchers",
      "5 Optimizations per user/day",
      "Live Driver Tracking",
      "Custom Route Tags",
      "30 Days Route History",
    ],
  },
  {
    id: "scale",
    title: "Scale plan",
    price: 400,
    period: "Yearly",
    features: [
      "Up to 5 Admins/Dispatchers",
      "10 Optimizations per user/day",
      "90 Days Route History",
      "Advanced Reports",
      "White-labeled POD",
    ],
  },
];

const monthlyPlans = yearlyPlans.map((plan) => ({
  ...plan,
  price: (plan.price / 12).toFixed(2),
  period: "Monthly",
}));

const Plans = () => {
  const [yearly, setYearly] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("go");

  const plans = yearly ? yearlyPlans : monthlyPlans;

  return (
    <div className="plans-container">
      <div className="plans-header">
        <h2>Plan</h2>
        <p>Manage your billing and payment details.</p>
        <div className="pricing-toggle">
          <span>Annual pricing</span>
          <Switch checked={yearly} onChange={setYearly} />
          <span className="discount">save 20%</span>
        </div>
        <Button type="primary" className="continue-btn">
          Continue
        </Button>
      </div>

      <div className="displaygrid_1 bg_white rounded-4 shadow-sm px-4 py-2 mb-3 h-auto w-full">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            selected={selectedPlan === plan.id}
            onSelect={() => setSelectedPlan(plan.id)}
          />
        ))}
      </div>

      <div className="billing-history-section">
        <h3>Billing history</h3>
        {/* <BillingHistoryTable /> */}
      </div>
    </div>
  );
};

export default Plans;
