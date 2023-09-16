"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

type EventPageProps = {
  params: {
    eventName: string;
  };
};

const EventPage: FC<EventPageProps> = ({ params }) => {
  const router = useRouter();
  const { user } = useUser();

  if (!user) router.replace("/api/auth/login");
  return <main>event page</main>;
};

export default EventPage;
