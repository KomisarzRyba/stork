"use client";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
export const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (!isLoaded) return <div>Loading...</div>;
  else return <GoogleMap center={{ lat: 36.0987934, lng: -80.2462905 }} />;
};
