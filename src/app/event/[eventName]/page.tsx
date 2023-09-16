import { db } from "@/lib/db";
import { FC } from "react";

type EventPageProps = {
  props: {
    eventName: string;
  };
};

const EventPage: FC<EventPageProps> = async ({ props }) => {
  const { eventName } = props;

  const event = await db.event.findUnique({
    where: {
      name: eventName,
    },
    include: {
      drivers: true,
      riders: true,
    },
  });

  return (
    <main>
      {event?.drivers.map((driver, i) => (
        <div key={i}>{driver.id}</div>
      ))}
    </main>
  );
};

export default EventPage;
