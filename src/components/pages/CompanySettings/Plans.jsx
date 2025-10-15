import React, { useEffect, useState } from "react";
import { Switch, Button } from "antd";
import PlanCard from "./PlanCard";
// import BillingHistoryTable from "./BillingHistoryTable";
import "./Plans.css";
import { dataGet, dataGet_ } from "../../utils/myAxios";

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

const Plans = ({ onContinue }) => {
  const [yearly, setYearly] = useState(true);
  const [planDataM, setPlansDataM] = useState([]);
  const [planDataY, setPlansDataY] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [selectedPlanObj, setSelectedPlanObj] = useState(null);

  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    const plans = localStorage.getItem('plans')
    if (plans) {
      const planParse = JSON.parse(plans)
      setPlansDataM(planParse?.plansMonthly)
      setPlansDataY(planParse?.plansYearly)
    }
    const endPoint = 'settings/get/plan-addons'
    const response = await dataGet_(endPoint, {});
    if (response?.data?.success) {
      setPlansDataM(response?.data?.plansMonthly)
      setPlansDataY(response?.data?.plansYearly)
      setSelectedPlanObj(response?.data?.plansYearly[2])
      localStorage.setItem('plans', JSON.stringify(response?.data))
    }
  }

  const plans = yearly ? planDataY : planDataM;

  const onClickContinue = () => {
    localStorage.setItem('plan',JSON.stringify(selectedPlanObj))
    onContinue()
  }

  return (
    <div className="plans-container">
      <div className="plans-header">
        <h2>Plan</h2>
        <p>Manage your billing and payment details.</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div></div>
          <div className="pricing-toggle">
            <span>Annual pricing</span>
            <Switch checked={yearly} onChange={setYearly} />
            <span className="discount">save 20%</span>
          </div>
          <div></div>

        </div>
        <Button type="primary" className="continue-btn"
          onClick={() => onClickContinue()}
        >
          Continue
        </Button>
      </div>

      <div className="displaygrid_1 bg_white rounded-4 shadow-sm px-4 py-2 mb-3 h-auto w-full">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            selected={selectedPlan === plan.plan}
            onSelect={() => {
              setSelectedPlanObj(plan)
              setSelectedPlan(plan.plan)
            }}
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
