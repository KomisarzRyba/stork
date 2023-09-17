"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserSchema } from "@/lib/schemas/schemas";
import axios from "axios";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Map } from "@/components/Map";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type EventRegisterPageProps = {
  params: {
    eventName: string;
    role: "driver" | "rider";
  };
};

const EventRegisterPage: FC<EventRegisterPageProps> = ({ params }) => {
  const router = useRouter();
  const { role, eventName } = params;
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 25.9072534,
    lng: -80.1413436,
  });
  const { toast } = useToast();
  const { register, handleSubmit } = useForm<UserSchema>({
    defaultValues: {
      name: "",
      location: { lat: "0", lng: "0" },
    },
  });
  const submit = async (payload: UserSchema & { eventName: string }) => {
    const { data } = await axios.post("/api/user", { ...payload, eventName });
    return data;
  };
  const { mutate: registerUser, isLoading } = useMutation({
    mutationFn: submit,
    onSuccess: () => {
      toast({
        title: "Awesome!",
        description: "Registered successfully!",
      });
      router.push("/event/" + eventName);
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
          console.log(data);
          registerUser({ ...data, eventName });
        })}
        className="container space-y-4 py-6"
      >
        <div>
          <Label htmlFor="name">
            {role.slice(0, 1)[0].toUpperCase() + role.slice(1)}&apos;s name
          </Label>
          <Input id="name" type="text" {...register("name")} />
        </div>
        {role === "driver" && (
          <div>
            <Label htmlFor="capacity">Your car&apos;s capacity</Label>
            <Input id="capacity" type="number" {...register("capacity")} />
          </div>
        )}
        <div className="w-full">
          <Label htmlFor="map">
            {role === "driver"
              ? "Where are you driving from?"
              : "Where are you being picked up from?"}
          </Label>
          <Map id="map" location={location} setLocation={setLocation} />
        </div>
        <LoadingButton isLoading={isLoading} type="submit">
          Submit
        </LoadingButton>
      </form>
    </main>
  );
};

export default EventRegisterPage;
