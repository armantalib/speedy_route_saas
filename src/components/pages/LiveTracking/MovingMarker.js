import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const MovingMarker = ({ id, lat, lng, icon, popupContent }) => {
  const map = useMap();

  useEffect(() => {
    const marker = L.marker([lat, lng], { icon }).addTo(map);

    if (popupContent) {
      marker.bindPopup(popupContent);
    }

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

    return () => {
      cancelAnimationFrame(animFrame);
      map.removeLayer(marker);
    };
  }, [lat, lng, map, icon, popupContent]);

  return null;
};

export default MovingMarker;
