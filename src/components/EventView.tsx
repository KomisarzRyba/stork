"use client";

import { Driver, Event, Rider } from "@prisma/client";
import axios from "axios";
import { FC } from "react";
import { useQuery } from "react-query";
import { EventRegister } from "./EventRegister";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

type EventViewProps = {
  eventName: string;
};

type EventFatData = Event & { drivers: Driver[] } & { riders: Rider[] };

let role: "driver" | "rider" | null = null;
export const EventView: FC<EventViewProps> = ({ eventName }) => {
  const getEventData = async () => {
    const { data } = await axios.get(`/api/role?event=${eventName}`);
    return data as EventFatData;
  };
  const { data } = useQuery({
    queryFn: getEventData,
    onSuccess: (data) => {
      if (data.drivers[0]) role = "driver";
      else if (data.riders[0]) role = "rider";
      else role = null;
    },
  });

  if (!role) {
    return <EventRegister eventName={eventName} />;
  } else
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
