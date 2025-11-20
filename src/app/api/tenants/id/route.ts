import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Tenant from "@/models/Tenant";
import Room from "@/models/Room";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const tenant = await Tenant.findById(id).populate('userId').populate('roomId');
  if (!tenant) return NextResponse.json({ message: "Tenant not found" }, { status: 404 });
  return NextResponse.json(tenant);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  
  const tenant = await Tenant.findById(id);
  if (!tenant) return NextResponse.json({ message: "Tenant not found" }, { status: 404 });

  // คืนสถานะห้องเป็น 'available' เมื่อลบผู้เช่า
  await Room.findByIdAndUpdate(tenant.roomId, { status: 'available' });
  await Tenant.findByIdAndDelete(id);

  return NextResponse.json({ message: "Tenant removed" });
}