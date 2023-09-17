import { db } from "@/lib/db";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const eventName = req.nextUrl.searchParams.get("event");
    if (!eventName) throw new Error("No event provided!!!!!!!!!!");
    const session = await getSession();
    if (!session) {
      redirect("/api/auth/login");
    }
    const { user } = session;
    const userEmail = user?.email;
    const userRoleInformation = await db.event.findFirst({
      where: {
        name: eventName,
      },
      include: {
        drivers: {
          where: {
            id: userEmail,
          },
          take: 1
        },
        riders: {
          where: {
            id: userEmail,
          },
          take: 1
        },
      },
    });
    return new NextResponse(JSON.stringify(userRoleInformation, null, 2));
  } catch (err) {
    console.log(err);
    return new NextResponse(err as any);
  }
};
