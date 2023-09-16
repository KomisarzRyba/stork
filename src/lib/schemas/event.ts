import { z } from "zod";

const location = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const eventSchema = z.object({
  name: z.string().min(1).max(127),
  location: location,
});

export type EventSchema = z.infer<typeof eventSchema>;
