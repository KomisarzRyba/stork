import { db } from "@/lib/db";
import { userSchema } from "@/lib/schemas/schemas";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { getSession } from "@auth0/nextjs-auth0";

const requestSchema = userSchema.extend({
  eventName: z.string(),
});
export const POST = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) throw new Error("User is not authenticated.");
    const { user } = session;
    const { name, location, capacity, eventName } = requestSchema.parse(
      await req.json()
    );
    const locationNumeric = {
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lng),
    };
    if (!capacity) {
      await db.rider.create({
        data: {
          id: user.email,
          name: name,
          latitude: locationNumeric.lat,
          longitude: locationNumeric.lng,
          Event: {
            connect: {
              name: eventName,
            },
          },
        },
      });
    } else {
      const capacityNumeric = parseInt(capacity);
      await db.driver.create({
        data: {
          id: user.email,
          name: name,
          latitude: locationNumeric.lat,
          longitude: locationNumeric.lng,
          capacity: capacityNumeric,
          Event: {
            connect: {
              name: eventName,
            },
          },
        },
      });
    }
    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      return new NextResponse(err.message);
    } else return new NextResponse(err as any);
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const userId = req.nextUrl.searchParams.get("user");
    const role = req.nextUrl.searchParams.get("role");
    if (!userId || !role) throw new Error("Invalid query params");
    if (role === "driver") {
      const result = await db.driver.findUnique({
        where: {
          id: userId,
        },
      });
      return new NextResponse(JSON.stringify(result));
    } else {
      const result = await db.rider.findUnique({
        where: {
          id: userId,
        },
      });
      return new NextResponse(JSON.stringify(result));
    }
  } catch (err) {
    console.log(err);
    return new NextResponse(err as any, { status: 500 });
  }
};
