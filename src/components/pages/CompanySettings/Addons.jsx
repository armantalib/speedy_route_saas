import React, { useEffect, useState } from "react";
import AddonCard from "./AddonCard";
import "./Addons.css";
import { call, navigation_direction, people_users } from "../../icons/icon";
import { dataGet_ } from "../../utils/myAxios";

const initialAddons = [
  {
    id: 1,
    title: "Driver App License",
    description:
      "Send routes directly to your drivers, with live tracking & Proof of Delivery.",
    price: "$10/driver/mo",
    quantity: 2,
    enabled: true,
    icon: <img src={people_users} style={{ height: 48, width: 48 }} className='' alt="" />,
  },
  {
    id: 2,
    title: "Extra Route Packs",
    description:
      "Add 30 extra optimized routes per month to handle peak demand.",
    price: "$10/pack/mo",
    quantity: 2,
    enabled: true,
    icon: <img src={navigation_direction} style={{ height: 48, width: 48 }} className='' alt="" />,
  },

];

const Addons = ({ onContinue }) => {
  const [addons, setAddons] = useState(initialAddons)
  const [addonsData, setAddonsData] = useState([])

  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    const plans = localStorage.getItem('plans')
    if (plans) {
      const planParse = JSON.parse(plans)
      let data1 = [...planParse?.addons]
      data1.forEach(element => {
        let valuePush = {};
        valuePush = element;
        valuePush['quantity'] = 2;
        valuePush['enabled'] = true;
        valuePush['icon'] = <img src={element?.feature == 'app_license' ? people_users : navigation_direction} style={{ height: 48, width: 48 }} className='' alt="" />;
        valuePush['quantity'] = 2;
      });
      setAddonsData(data1)
      // setAddonsData(planParse?.addons)
    }
    const endPoint = 'settings/get/plan-addons'
    const response = await dataGet_(endPoint, {});
    if (response?.data?.success) {
      let data1 = [...response?.data?.addons]
      data1.forEach(element => {
        let valuePush = {};
        valuePush = element;
        valuePush['quantity'] = 2;
        valuePush['enabled'] = true;
        valuePush['icon'] = <img src={element?.feature == 'app_license' ? people_users :element?.feature == 'dispatcher' ? call: navigation_direction} style={{ height: 48, width: 48 }} className='' alt="" />;
        valuePush['quantity'] = 2;
      });
      setAddonsData(data1)
      localStorage.setItem('plans', JSON.stringify(response?.data))
    }
  }

  const toggleAddon = (id) => {
    setAddons((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const updateQuantity = (id, delta) => {
    setAddons((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, quantity: Math.max(1, a.quantity + delta) } : a
      )
    );
  };

  const moveNext = async () => {
    let data1 = [...addonsData];
    let addonsPrice = 0
    let addonsArr = [];
    data1.forEach((element, index) => {
      let addonsVal = {};
      if (element?.enabled) {
        addonsPrice = addonsPrice + (element.price * element.quantity)
        addonsVal['addonId'] = element?._id;
        addonsVal['quantity'] = element?.quantity;
        addonsArr.push(addonsVal);
      }

    });

    let data2 = {
      addons: addonsArr,
      addonsPrice,
    }
    localStorage.setItem('addon_final', JSON.stringify(data2))
    onContinue()
  }

  return (
    <div className="addons-container">
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Addons</h2>
          <p className="addons-subtext" style={{ marginTop: -15 }}>
            These add-ons will be added to your monthly plan and renew
            automatically.
          </p>
        </div>
        <div className="addons-footer">
          <button className="addons-continue-btn" onClick={() => { moveNext() }}>Continue</button>
        </div>
      </div>
      <div className="addons-grid">
        {addonsData.map((addon, index) => (
          <AddonCard
            key={addon._id}
            addon={addon}
            onToggle={() => toggleAddon(addon.id)}
            onQuantityChange={updateQuantity}
            onChangeSwitch={() => {
              let data1 = [...addonsData];
              data1[index].enabled = !data1[index].enabled
              setAddonsData(data1)
            }}
            onChangeQty={(val) => {
              let data1 = [...addonsData];
              data1[index].quantity = val == 'plus' ? data1[index].quantity + 1 : Math.max(data1[index].quantity - 1, 0)
              setAddonsData(data1)
            }
            }
          />
        ))}
      </div>

    </div>
  );
};

export default Addons;
