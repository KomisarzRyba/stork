"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EventSchema } from "@/lib/schemas/event";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";

const CreateEventPage: FC = () => {
  const { register, handleSubmit } = useForm<EventSchema>({
    defaultValues: {
      name: "",
      location: { lat: 0, lng: 0 },
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
    <main>
      <form
        onSubmit={handleSubmit((data) => createEvent(data))}
        className="container space-y-4"
      >
        <div>
          <Label htmlFor="name">Event name</Label>
          <Input id="name" type="text" {...register("name")} />
        </div>
        <div>
          <Label htmlFor="latitude">Lat</Label>
          <Input id="latitude" type="number" {...register("location.lat")} />
        </div>
        <div>
          <Label htmlFor="longitude">Lng</Label>
          <Input id="longitude" type="number" {...register("location.lng")} />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </main>
  );
};

export default CreateEventPage;
