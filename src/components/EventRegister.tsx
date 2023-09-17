import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";

type EventRegisterParams = {
  eventName: string;
};

export const EventRegister: FC<EventRegisterParams> = ({ eventName }) => {
  return (
    <section className="container h-full flex flex-col justify-center items-center">
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardHeader>
            <CardTitle>I am driving</CardTitle>
            <CardDescription>I am willing to pick up others!</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href={`/event/${eventName}/register/driver`}
              className={buttonVariants()}
            >
              Register as driver
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>I need a ride</CardTitle>
            <CardDescription>Pretty please!</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href={`/event/${eventName}/register/rider`}
              className={buttonVariants()}
            >
              Register as passenger
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
