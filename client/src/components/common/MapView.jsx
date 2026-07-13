import { useEffect, useState } from 'react';
import { FaTaxi, FaInfoCircle } from 'react-icons/fa';
import socketService from '../../services/socketService.js';

export default function MapView({
  pickup = 'Pickup Location',
  destination = 'Destination Dropoff',
  rideId = null,
  isDriver = false,
  pickupCoords = { lat: 50, lng: 50 },
  dropCoords = { lat: 150, lng: 250 }
}) {
  const [driverPos, setDriverPos] = useState({ lat: pickupCoords.lat, lng: pickupCoords.lng });
  const [heading, setHeading] = useState(45);

  useEffect(() => {
    if (!rideId) return;

    // Connect real-time socket updates
    socketService.joinRideRoom(rideId);

    // Listen to driver location updates
    const unsubscribe = socketService.onDriverLocationChanged((coords) => {
      // Map coordinate coordinates scale (0-300 grid)
      // Simulates location mapping coordinates
      if (!isDriver) {
        setDriverPos({ lat: coords.latitude, lng: coords.longitude });
        if (coords.heading) setHeading(coords.heading);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [rideId, isDriver, pickupCoords]);

  // Simulating driver side coordinates broadcast updates
  useEffect(() => {
    if (!isDriver || !rideId) return;

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      const ratio = Math.min(step / 30, 1);
      
      // Interpolate along the path
      const currentLat = pickupCoords.lat + (dropCoords.lat - pickupCoords.lat) * ratio;
      const currentLng = pickupCoords.lng + (dropCoords.lng - pickupCoords.lng) * ratio;
      const currentHeading = Math.atan2(dropCoords.lat - pickupCoords.lat, dropCoords.lng - pickupCoords.lng) * (180 / Math.PI);

      setDriverPos({ lat: currentLat, lng: currentLng });
      setHeading(currentHeading);

      // Emit over sockets
      socketService.emitLocationUpdate(rideId, currentLat, currentLng, currentHeading);

      if (ratio === 1) clearInterval(interval);
    }, 1500);

    return () => clearInterval(interval);
  }, [isDriver, rideId, pickupCoords, dropCoords]);

  return (
    <div className="card border rounded-4 overflow-hidden shadow-sm w-100 mb-4 bg-light position-relative" style={{ height: '350px' }}>
      {/* SVG Canvas Map Drawer */}
      <svg className="w-100 h-100" style={{ backgroundColor: '#F0F3F4' }} aria-label="Interactive Ride Tracking Map">
        {/* Streets Grids */}
        <line x1="0" y1="100" x2="400" y2="100" stroke="#E5E8E8" strokeWidth="6" />
        <line x1="100" y1="0" x2="100" y2="400" stroke="#E5E8E8" strokeWidth="6" />
        <line x1="0" y1="250" x2="400" y2="250" stroke="#E5E8E8" strokeWidth="6" />
        <line x1="280" y1="0" x2="280" y2="400" stroke="#E5E8E8" strokeWidth="6" />

        {/* Route Line Path */}
        <path
          d={`M ${pickupCoords.lng} ${pickupCoords.lat} Q 150 80, ${dropCoords.lng} ${dropCoords.lat}`}
          fill="none"
          stroke="#FFC107"
          strokeWidth="4"
          strokeDasharray="5"
          className="route-path-animation"
        />

        {/* Pickup Marker */}
        <circle cx={pickupCoords.lng} cy={pickupCoords.lat} r="10" fill="#27AE60" opacity="0.3" />
        <circle cx={pickupCoords.lng} cy={pickupCoords.lat} r="4" fill="#27AE60" />

        {/* Destination Marker */}
        <circle cx={dropCoords.lng} cy={dropCoords.lat} r="10" fill="#EB5757" opacity="0.3" />
        <circle cx={dropCoords.lng} cy={dropCoords.lat} r="4" fill="#EB5757" />

        {/* Driver Taxi Marker */}
        <g transform={`translate(${driverPos.lng}, ${driverPos.lat}) rotate(${heading})`}>
          <rect x="-8" y="-12" width="16" height="24" rx="4" fill="#121212" />
          <rect x="-4" y="-8" width="8" height="6" fill="#FFC107" />
          <circle cx="-6" cy="-8" r="2" fill="#E5E8E8" />
          <circle cx="6" cy="-8" r="2" fill="#E5E8E8" />
        </g>
      </svg>

      {/* Floating Map Indicators */}
      <div className="position-absolute top-0 start-0 m-3 p-3 bg-white bg-opacity-95 rounded-3 shadow-sm border small max-width-300" style={{ zIndex: 10 }}>
        <div className="d-flex align-items-center gap-2 mb-1">
          <FaTaxi className="text-warning" />
          <span className="fw-bold text-black">Active Ride Route</span>
        </div>
        <div className="text-truncate mb-1"><strong>Pickup:</strong> {pickup}</div>
        <div className="text-truncate"><strong>Drop:</strong> {destination}</div>
      </div>

      <div className="position-absolute bottom-0 end-0 m-3 p-2 bg-black bg-opacity-80 rounded-pill text-white px-3 small d-flex align-items-center gap-2">
        <FaInfoCircle className="text-yellow" />
        <span>Real-time GPS Tracking Online</span>
      </div>
    </div>
  );
}
