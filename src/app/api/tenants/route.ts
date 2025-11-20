import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Tenant from "@/models/Tenant";
import Room from "@/models/Room";

export async function GET() {
  await connectDB();
  // Populate User and Room details
  const tenants = await Tenant.find().populate('userId').populate('roomId');
  return NextResponse.json(tenants);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();
    
    const newTenant = await Tenant.create(body);
    
    // อัพเดทสถานะห้องเป็น 'occupied'
    await Room.findByIdAndUpdate(body.roomId, { status: 'occupied' });
    
    return NextResponse.json(newTenant, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating tenant" }, { status: 500 });
  }
}