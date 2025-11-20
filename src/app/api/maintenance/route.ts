import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Maintenance from "@/models/Maintenance";

export async function GET() {
  await connectDB();
  const list = await Maintenance.find().populate('roomId').sort({ createdAt: -1 });
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();
    const newMaintenance = await Maintenance.create(body);
    return NextResponse.json(newMaintenance, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}