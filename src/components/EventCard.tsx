"use client";

import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { EventFatData } from "./EventView";
import { useQuery } from "react-query";
import axios from "axios";
import { ReloadIcon } from "@radix-ui/react-icons";

type EventCardProps = {
  data?: EventFatData;
  role: "driver" | "rider";
};
export const EventCard: FC<EventCardProps> = ({ data, role }) => {
  // Your API Key
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const getDirections = async () => {
    console.log(data?.name);
    const { data: directionsData } = await axios.get(
      "https://stork-pathfinder.vercel.app/api/directions?event=" + data?.name
    );
    return directionsData;
  };
  const { data: queryResult, isLoading } = useQuery({
    queryKey: "directions",
    queryFn: getDirections,
    onSuccess: () => {
      console.log(queryResult);
    },
    onError: (e) => {
      console.log(e);
    },
  });

  // Points for the trip
  const startPoint = [34.058, -118.2435];
  const waypoints = [
    [34.0777, -118.2482],
    [34.0671, -118.2485],
  ];
  const destination = [34.0522, -118.2437];

  // Convert points to URL format
  const origin = `${startPoint[0]},${startPoint[1]}`;
  const destinationString = `${destination[0]},${destination[1]}`;
  const waypointsString = waypoints
    .map((point) => `${point[0]},${point[1]}`)
    .join("|");

  // Construct the embed URL
  const embedUrl = `https://www.google.com/maps/embed/v1/directions?key=${API_KEY}&origin=${origin}&destination=${destinationString}&waypoints=${waypointsString}&avoid=tolls|highways`;

  return isLoading ? (
    <ReloadIcon className="animate-spin" />
  ) : (
    <section className="w-full h-full p-12">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>{data?.name}</CardTitle>
          <CardDescription>You are a {role} for this event.</CardDescription>
        </CardHeader>
        <CardContent className="h-[90%]">
          <iframe
            width="100%"
            height="100%" // Adjust height as needed
            frameBorder="0"
            src={embedUrl}
            allowFullScreen
            className="border-2"
          ></iframe>
        </CardContent>
      </Card>
    </section>
  );
};
