import { db } from "@/lib/db";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    let eventName = req.nextUrl.searchParams.get("event");
    if (eventName?.includes(" ")) {
      eventName = eventName.replace(/ /g,"_");
    }
    if (!eventName)
      return new NextResponse("No event name provided", { status: 500 });
    const payload = await db.event.findUnique({
      where: {
        name: eventName,
      },
      include: {
        drivers: true,
        riders: true,
      },
    });
    console.log(payload);
    const data = await axios.post("/api/directions", payload);
    return new NextResponse(JSON.stringify(payload));
  } catch (error) {
    console.log(error);
    return new NextResponse(error as any);
  }
};
