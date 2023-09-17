"use client";

import { Map } from "@/components/Map";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import { useToast } from "@/components/ui/use-toast";
import { EventSchema } from "@/lib/schemas/schemas";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

const CreateEventPage: FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 25.9072534,
    lng: -80.1413436,
  });
  const { register, handleSubmit, getValues } = useForm<EventSchema>({
    defaultValues: {
      name: "",
      location: { lat: "0", lng: "0" },
    },
  });
  const submit = async (payload: EventSchema) => {
    const { data } = await axios.post("/api/event", payload);
    return data;
  };
  const { mutate: createEvent, isLoading } = useMutation({
    mutationFn: submit,
    onSuccess: () => {
      toast({
        title: "Awesome!",
        description: "Event created successfully!",
      });
      router.push("/event/" + getValues().name.replace(/ /g, "_"));
    },
    onError: (error) => {
      toast({
        title: "Something went wrong...",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });
  return (
    <main className="container">
      <form
        onSubmit={handleSubmit((data) => {
          data.location = {
            lat: location?.lat.toString()!,
            lng: location?.lng.toString()!,
          };
          if (data.name.includes(" ")) {
            data.name = data.name.replace(/ /g,"_");
          }
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
        <LoadingButton isLoading={isLoading} type="submit">
          Submit
        </LoadingButton>
      </form>
    </main>
  );
};

export default CreateEventPage;
