import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { EventFatData } from "./EventView";

type EventCardProps = {
  data?: EventFatData;
  role: "driver" | "rider";
};
export const EventCard: FC<EventCardProps> = ({ data, role }) => {
  // Your API Key
  const API_KEY = "AIzaSyA31ijlwSO0CLTpURo_3_lbphnuryXm7zw";

  // Points for the trip
  const startPoint = [34.0580, -118.2435];
  const waypoints = [
    [34.0777, -118.2482],
    [34.0671, -118.2485]
  ];
  const destination = [34.0522, -118.2437];

  // Convert points to URL format
  const origin = `${startPoint[0]},${startPoint[1]}`;
  const destinationString = `${destination[0]},${destination[1]}`;
  const waypointsString = waypoints.map(point => `${point[0]},${point[1]}`).join('|');

  // Construct the embed URL
  const embedUrl = `https://www.google.com/maps/embed/v1/directions?key=${API_KEY}&origin=${origin}&destination=${destinationString}&waypoints=${waypointsString}&avoid=tolls|highways`;

  return (
    <section className="w-full h-full p-12">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>{data?.name}</CardTitle>
          <CardDescription>You are a {role} for this event.</CardDescription>
        </CardHeader>
        <CardContent>
          <iframe
            width="100%"
            height="570px"  // Adjust height as needed
            frameBorder="0"
            src={embedUrl}
            allowFullScreen
          ></iframe>
        </CardContent>
      </Card>
    </section>
  );
};
