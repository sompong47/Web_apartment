import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Maintenance from "@/models/Maintenance";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json();
  
  await connectDB();
  const updated = await Maintenance.findByIdAndUpdate(
    id, 
    { status }, 
    { new: true }
  );
  
  return NextResponse.json(updated);
}