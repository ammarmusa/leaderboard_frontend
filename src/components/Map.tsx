"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Job } from "@/app/types";
import { useEffect } from "react";

// Fix for default marker icon issue with webpack
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Define custom icons for different job statuses
const getStatusIcon = (status: Job["status"]) => {
  let iconUrl;
  switch (status) {
    case "new":
      iconUrl =
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png";
      break;
    case "assigned":
    case "in_progress":
      iconUrl =
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png";
      break;
    case "completed":
      iconUrl =
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png";
      break;
    default:
      iconUrl =
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png";
  }
  return new L.Icon({
    iconUrl,
    shadowUrl: markerShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

interface MapProps {
  jobs: Job[];
}

const MapComponent = ({ jobs }: MapProps) => {
  useEffect(() => {
    // This useEffect is to ensure Leaflet's CSS is loaded correctly.
    // It can sometimes be tricky with SSR frameworks like Next.js.
    const L = require("leaflet");
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x.src,
      iconUrl: markerIcon.src,
      shadowUrl: markerShadow.src,
    });
  }, []);

  const defaultPosition: [number, number] = [4.2105, 101.9758]; // Center of Malaysia

  return (
    <MapContainer
      center={defaultPosition}
      zoom={6} // Zoom out to show more of Malaysia
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {jobs.map((job) => {
        // Ensure coordinates are numbers
        const lat = typeof job.latitude === 'string' ? parseFloat(job.latitude) : job.latitude;
        const lng = typeof job.longitude === 'string' ? parseFloat(job.longitude) : job.longitude;
        
        // Skip invalid coordinates
        if (isNaN(lat) || isNaN(lng)) {
          console.warn(`Invalid coordinates for job ${job.id}:`, job.latitude, job.longitude);
          return null;
        }
        
        return (
          <Marker
            key={job.id}
            position={[lat, lng]}
            icon={getStatusIcon(job.status)}
          >
            <Popup>
              <div className="font-sans">
                <h3 className="font-bold text-lg">{job.title}</h3>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="capitalize">{job.status}</span>
                </p>
                <p>
                  <strong>Contractor:</strong> {job.contractor || "Unassigned"}
                </p>
                <p>
                  <strong>Address:</strong> {job.address}
                </p>
                {job.type && (
                  <p>
                    <strong>Type:</strong> {job.type}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;
