"use client";

import { Driver, Event, Rider } from "@prisma/client";
import axios from "axios";
import { FC, Suspense } from "react";
import { useQuery } from "react-query";
import { EventCard } from "./EventCard";
import { EventRegister } from "./EventRegister";

type EventViewProps = {
  eventName: string;
};

export type EventFatData = Event & { drivers: Driver[] } & { riders: Rider[] };

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
      <Suspense fallback="loading...">
        <EventCard data={data} role={role} />
      </Suspense>
    );
};
