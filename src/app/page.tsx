import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { FC, Suspense } from "react";

export default async function Home() {
  const events = await db.event.findMany();
  return (
    <main>
      <Suspense fallback="Loading...">
        <EventList />
      </Suspense>
    </main>
  );
}

const EventList: FC = async () => {
  const events = await db.event.findMany();

  return (
    <section className="container py-4 flex flex-col gap-4">
      {events.map((event, i) => {
        return (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{event.name}</CardTitle>
            </CardHeader>
          </Card>
        );
      })}
    </section>
  );
};
