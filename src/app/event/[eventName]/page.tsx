"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { EventRegister } from "@/components/EventRegister";

type EventPageProps = {
  params: {
    eventName: string;
  };
};

const EventPage: FC<EventPageProps> = ({ params }) => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  if (!user) router.replace("/api/auth/login");
  const { eventName } = params;
  if (isLoading) return <div>Loading...</div>;
  return (
    <main className="w-full h-screen">
      <EventRegister eventName={eventName} />
    </main>
  );
};

export default EventPage;
