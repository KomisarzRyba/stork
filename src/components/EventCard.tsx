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
  return (
    <section className="w-full h-full p-12">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>{data?.name}</CardTitle>
          <CardDescription>You are a {role} for this event.</CardDescription>
        </CardHeader>
        <CardContent>map</CardContent>
      </Card>
    </section>
  );
};
