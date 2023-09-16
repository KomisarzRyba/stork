import { db } from "@/lib/db";
import { FC } from "react";

type EventPageProps = {
  params: {
    eventName: string;
  };
};

const EventPage: FC<EventPageProps> = async ({ params }) => {
  const { eventName } = params;

  const event = await db.event.findUnique({
    where: {
      name: eventName,
    },
    include: {
      drivers: true,
      riders: true,
    },
  });

  return <main></main>;
};

export default EventPage;
