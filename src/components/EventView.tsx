import { FC, useState, useEffect } from "react";
import { db } from "@/lib/db";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import axios from "axios";

type EventViewProps = {
  eventName: string;
};

export const EventView: FC<EventViewProps> = ({ eventName }) => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/role?event=${eventName}`);
        console.log(data);

        if (data.riders && data.riders[0]) {
          setRole('rider');
        } else {
          setRole('driver');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error appropriately
      }
    };

    fetchData();
  }, [eventName]);

  if (role === null) {
    return <main>Loading...</main>; // or any loading state
  }

  return (
    <main>
      {role}
    </main>
  );
};