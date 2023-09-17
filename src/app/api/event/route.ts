import { db } from "@/lib/db";
import { eventSchema } from "@/lib/schemas/schemas";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export const POST = async (req: NextRequest) => {
  try {
    const { name, location } = eventSchema.parse(await req.json());
    const locationNumeric = {
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lng),
    };
    console.log(name, locationNumeric);
    await db.event.create({
      data: {
        name: name,
        latitude: locationNumeric.lat,
        longitude: locationNumeric.lng,
      },
    });
    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      return new NextResponse(err.message);
    } else return new NextResponse(err as any);
  }
};
