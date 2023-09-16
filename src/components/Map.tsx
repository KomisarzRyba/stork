"use client";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
export const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });
  const center = useMemo(() => ({ lat: 25.9072534, lng: -80.1413436 }), []);

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <div className="w-screen h-screen">
      <GoogleMap
        center={center}
        zoom={10}
        mapContainerClassName="map-container"
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};
