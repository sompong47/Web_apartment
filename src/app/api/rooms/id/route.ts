import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Room from "@/models/Room";

// Helper to get ID from params
// Next.js 15 params are async
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const room = await Room.findById(id);
  if (!room) return NextResponse.json({ message: "Room not found" }, { status: 404 });
  return NextResponse.json(room);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  await connectDB();
  const updatedRoom = await Room.findByIdAndUpdate(id, body, { new: true });
  if (!updatedRoom) return NextResponse.json({ message: "Room not found" }, { status: 404 });
  return NextResponse.json(updatedRoom);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const deletedRoom = await Room.findByIdAndDelete(id);
  if (!deletedRoom) return NextResponse.json({ message: "Room not found" }, { status: 404 });
  return NextResponse.json({ message: "Room deleted" });
}