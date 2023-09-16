import { eventSchema } from "@/lib/schemas/event";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export const POST = async (req: NextRequest) => {
  try {
    const { name, location } = eventSchema.parse(await req.json());
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      return new NextResponse(err.message);
    } else return new NextResponse(err as any);
  }
};
