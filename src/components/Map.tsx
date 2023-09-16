"use client";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
} from "react";

type Location = {
  lat: number;
  lng: number;
};
type MapProps = {
  location?: Location;
  setLocation: Dispatch<
    SetStateAction<
      | {
          lat: number;
          lng: number;
        }
      | undefined
    >
  >;
};

export const Map: FC<MapProps> = ({ location, setLocation }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });
  const center = useMemo(() => ({ lat: 25.9072534, lng: -80.1413436 }), []);
  const mapRef = useRef<GoogleMap | null>(null);

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <div className="w-screen h-screen">
      <GoogleMap
        ref={mapRef}
        center={location ?? center}
        zoom={10}
        mapContainerClassName="map-container"
        onClick={(event) =>
          setLocation({ lat: event.latLng?.lat()!, lng: event.latLng?.lng()! })
        }
      >
        <Marker position={location ?? center} />
      </GoogleMap>
    </div>
  );
};

// ("use client");

// import React, { useState, useCallback, useRef } from "react";
// import {
//   GoogleMap,
//   useLoadScript,
//   Marker,
//   StandaloneSearchBox,
// } from "@react-google-maps/api";

// const libraries: "places"[] = ["places"];

// interface IPosition {
//   lat: number;
//   lng: number;
// }

// export const Map: React.FC = () => {
//   const [position, setPosition] = useState<IPosition | null>(null);
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
//     libraries,
//   });

//   const mapRef = useRef<GoogleMap | null>(null);
//   const searchBoxRef = useRef<any>(null);

//   const onMapClick = useCallback((event: any) => {
//     setPosition({
//       lat: event.latLng.lat(),
//       lng: event.latLng.lng(),
//     });
//   }, []);

//   const onSearchBoxLoaded = useCallback(
//     (ref: any) => (searchBoxRef.current = ref),
//     []
//   );

//   const onPlacesChanged = useCallback(() => {
//     const location = searchBoxRef.current.getPlaces()[0].geometry.location;
//     setPosition({
//       lat: location.lat(),
//       lng: location.lng(),
//     });
//     mapRef.current?.panTo(location);
//   }, []);

//   if (loadError) return <p>Error loading maps</p>;
//   if (!isLoaded) return <p>Loading Maps</p>;

//   return (
//     <div>
//       <StandaloneSearchBox
//         onLoad={onSearchBoxLoaded}
//         onPlacesChanged={onPlacesChanged}
//       >
//         <input type="text" placeholder="Search your address" />
//       </StandaloneSearchBox>

//       <GoogleMap
//         id="map"
//         mapContainerStyle={{ width: "100%", height: "400px" }}
//         zoom={8}
//         center={position || { lat: 40.73061, lng: -73.935242 }} // Default to New York
//         onClick={onMapClick}
//         ref={mapRef}
//       >
//         {position && <Marker position={position} />}
//       </GoogleMap>

//       {position && (
//         <p>
//           Latitude: {position.lat}, Longitude: {position.lng}
//         </p>
//       )}
//     </div>
//   );
// };
