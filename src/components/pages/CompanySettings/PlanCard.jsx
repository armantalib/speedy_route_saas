import React from "react";
import { CheckCircleFilled } from "@ant-design/icons";
import "./PlanCard.css";
import { circle_check, layer_icon } from "../../icons/icon";

const PlanCard = ({ plan, selected, onSelect }) => {
  return (
    <div
      className={`plan-card ${selected ? "selected" : ""}`}
      onClick={onSelect}
    >
      <div style={{ width: '100%', height: 60, borderWidth: selected ? 2 : 1, borderColor: selected ? '#6688E8' : '#E8E8E9', backgroundColor: selected ? '#DAE2FA' : '#FFF' }}>
        <div className="plan-header" style={{ padding: 12 }}>
          {/* <input type="radio" checked={selected} readOnly /> */}
          <div style={{ width: 35, height: 35, borderRadius: 50, backgroundColor: '#cad7fd', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
            <img src={layer_icon} style={{ height: 16, width: 16 }} className='' alt="" />
          </div>
          <span className="plan-title">{plan.plan_name}</span>
          {selected && <CheckCircleFilled className="check-icon" />}
        </div>
      </div>
      <div className="plan-price" style={{ padding: 12, paddingTop: 0 }}>
        <span className="price">${plan.price}</span>
        <span className="period">/{plan.plan_type}</span>
        {/* {plan.badge && <span className="badge">{plan.badge}</span>} */}
      </div>

      <div className="features" style={{ padding: 12, paddingTop: 0, marginTop: -15 }}>
        <p>FEATURES</p>
        <ul>
          {plan.features.map((f, i) => (
            <li key={i}>
              {/* <CheckCircleFilled className="feature-icon" /> {f} */}
              <div style={{display:'flex',flexDirection:'row',marginTop:15}}>
              <img src={circle_check} style={{ height: 20, width: 20 }} className='feature-icon' />{f}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlanCard;
