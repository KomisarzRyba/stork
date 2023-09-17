import { z } from "zod";

const location = z.object({
  lat: z.string(),
  lng: z.string(),
});
export type Location = z.infer<typeof location>;

export const eventSchema = z.object({
  name: z.string().min(1).max(127),
  location: location,
});
export type EventSchema = z.infer<typeof eventSchema>;

export const userSchema = z.object({
  name: z.string(),
  location: location,
  capacity: z.string().optional(),
});
export type UserSchema = z.infer<typeof userSchema>;
