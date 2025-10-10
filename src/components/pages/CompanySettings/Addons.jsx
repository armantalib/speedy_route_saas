import React, { useState } from "react";
import AddonCard from "./AddonCard";
import "./Addons.css";

const initialAddons = [
  {
    id: 1,
    name: "Driver App License",
    description:
      "Send routes directly to your drivers, with live tracking & Proof of Delivery.",
    price: "$10/driver/mo",
    quantity: 2,
    enabled: true,
    icon: "👤",
  },
  {
    id: 2,
    name: "Extra Route Packs",
    description:
      "Add 30 extra optimized routes per month to handle peak demand.",
    price: "$10/pack/mo",
    quantity: 2,
    enabled: true,
    icon: "✈️",
  },
  {
    id: 3,
    name: "Advanced Reports",
    description:
      "Get deeper insights into delivery performance, costs, and driver efficiency.",
    price: "$10/mo",
    quantity: 2,
    enabled: true,
    icon: "📊",
  },
];

const Addons = () => {
  const [addons, setAddons] = useState(
    Array(3)
      .fill()
      .flatMap((_, i) => initialAddons.map((a) => ({ ...a, id: a.id + i * 3 })))
  );

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

  return (
    <div className="addons-container">
      <h2>Addons</h2>
      <p className="addons-subtext">
        These add-ons will be added to your monthly plan and renew
        automatically.
      </p>
      <div className="addons-grid">
        {addons.map((addon) => (
          <AddonCard
            key={addon.id}
            addon={addon}
            onToggle={() => toggleAddon(addon.id)}
            onQuantityChange={updateQuantity}
          />
        ))}
      </div>
      <div className="addons-footer">
        <button className="addons-continue-btn">Continue</button>
      </div>
    </div>
  );
};

export default Addons;
