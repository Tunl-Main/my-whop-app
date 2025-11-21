import { NextResponse } from "next/server";
import { getUser } from "@/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const whopId = searchParams.get("whopId");

    if (!whopId) {
        return NextResponse.json({ error: "Missing whopId" }, { status: 400 });
    }

    const user = await getUser(whopId);

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
}
