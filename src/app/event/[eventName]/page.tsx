"use client";

import { EventView } from "@/components/EventView";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";

type EventPageProps = {
  params: {
    eventName: string;
  };
};

const EventPage: FC<EventPageProps> = ({ params }) => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  useEffect(() => {
    if (!user && !isLoading) router.replace("/api/auth/login");
  }, [isLoading, router, user]);
  const { eventName } = params;
  if (isLoading) return <div>Loading...</div>;
  return (
    <main className="w-full h-screen">
      <EventView eventName={eventName} />
    </main>
  );
};

export default EventPage;
