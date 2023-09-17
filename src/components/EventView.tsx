import axios from "axios";
import { FC, useEffect, useState } from "react";
import { EventRegister } from "./EventRegister";

type EventViewProps = {
  eventName: string;
};

export const EventView: FC<EventViewProps> = ({ eventName }) => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/role?event=${eventName}`);

        if (data.riders && data.riders[0]) {
          setRole("rider");
        } else if (data.drivers && data.drivers[0]) {
          setRole("driver");
        } else setRole(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error appropriately
      }
    };

    fetchData();
  }, [eventName]);

  if (!role) {
    return (
      <main>
        <EventRegister eventName={eventName} />
      </main>
    ); // or any loading state
  } else return <main>{role}</main>;
};
