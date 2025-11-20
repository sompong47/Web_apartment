import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Room from "@/models/Room";

export async function GET() {
  await connectDB();
  const rooms = await Room.find();
  return NextResponse.json(rooms);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();
    const newRoom = await Room.create(body);
    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating room" }, { status: 500 });
  }
}