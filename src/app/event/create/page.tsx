"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EventSchema } from "@/lib/schemas/event";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Map } from "@/components/Map";

const CreateEventPage: FC = () => {
  const [location, setLocation] = useState<
    { lat: number; lng: number } | undefined
  >(undefined);
  const { register, handleSubmit } = useForm<EventSchema>({
    defaultValues: {
      name: "",
      location: { lat: "0", lng: "0" },
    },
  });
  const submit = async (payload: EventSchema) => {
    const { data } = await axios.post("/api/event", payload);
    return data;
  };
  const { mutate: createEvent } = useMutation({
    mutationFn: submit,
    onSuccess: () => console.log("success"),
    onError: (error) => console.log(error),
  });
  return (
    <main className="container">
      <form
        onSubmit={handleSubmit((data) => {
          data.location = {
            lat: location?.lat.toString()!,
            lng: location?.lng.toString()!,
          };
          createEvent(data);
        })}
        className="container space-y-4"
      >
        <div>
          <Label htmlFor="name">Event name</Label>
          <Input id="name" type="text" {...register("name")} />
        </div>
        <div className="w-full">
          <Map location={location} setLocation={setLocation} />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </main>
  );
};

export default CreateEventPage;
