import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const MovingMarker = ({ id, lat, lng, icon, popupContent, permanentLabel }) => {
  const map = useMap();

  useEffect(() => {
    // Create marker
    const marker = L.marker([lat, lng], { icon }).addTo(map);

    // Add popup if needed
    if (popupContent) {
      marker.bindPopup(popupContent);
    }

    // Add a permanent tooltip (label) styled like your div
    if (permanentLabel) {
      marker.bindTooltip(
        `<div style="
          background-color: rgba(33,36,41,0.7);
          color: #fff;
          padding: 5px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
        ">${permanentLabel}</div>`,
        {
          permanent: true,
          direction: "bottom",
          offset: [0, 0], // adjust vertical spacing below the icon
          opacity: 0.9,
          interactive: false,
           className: "transparent-tooltip",
        }
      );
    }

    // Animate movement
    let animFrame;
    let current = marker.getLatLng();

    const animateMove = (from, to, duration = 1000) => {
      const start = performance.now();

      const step = (ts) => {
        const progress = Math.min((ts - start) / duration, 1);
        const lat = from.lat + (to.lat - from.lat) * progress;
        const lng = from.lng + (to.lng - from.lng) * progress;
        marker.setLatLng([lat, lng]);

        if (progress < 1) {
          animFrame = requestAnimationFrame(step);
        }
      };

      animFrame = requestAnimationFrame(step);
    };

    animateMove(current, L.latLng(lat, lng));

    // Cleanup
    return () => {
      cancelAnimationFrame(animFrame);
      map.removeLayer(marker);
    };
  }, [lat, lng, map, icon, popupContent, permanentLabel]);

  return null;
};

export default MovingMarker;
