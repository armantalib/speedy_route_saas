import React from "react";
import { CheckCircleFilled } from "@ant-design/icons";
import "./PlanCard.css";
import { layer_icon } from "../../icons/icon";

const PlanCard = ({ plan, selected, onSelect }) => {
  return (
    <div
      className={`plan-card ${selected ? "selected" : ""}`}
      onClick={onSelect}
    >
      <div style={{ width: '100%', height: 60, borderWidth: 2, borderColor: '#6688E8', backgroundColor: '#DAE2FA' }}>
        <div className="plan-header">
          {/* <input type="radio" checked={selected} readOnly /> */}
          <div style={{width:28,height:28,borderRadius:50,backgroundColor:'#DAE2FA',justifyContent:'center',alignItems:'center'}}>
          <img src={layer_icon} style={{ height: 16, width: 16 }} className='' alt="" />
          </div>
          <span className="plan-title">{plan.title}</span>
          {selected && <CheckCircleFilled className="check-icon" />}
        </div>
      </div>
      <div className="plan-price">
        <span className="price">${plan.price}</span>
        <span className="period">{plan.period}</span>
        {plan.badge && <span className="badge">{plan.badge}</span>}
      </div>

      <div className="features">
        <p>FEATURES</p>
        <ul>
          {plan.features.map((f, i) => (
            <li key={i}>
              <CheckCircleFilled className="feature-icon" /> {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlanCard;
