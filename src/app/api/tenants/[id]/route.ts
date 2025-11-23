import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Tenant from "@/models/Tenant";
import User from "@/models/User";
import Room from "@/models/Room"; // เผื่อ populate

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const tenant = await Tenant.findById(id).populate('userId').populate('roomId');
  return NextResponse.json(tenant);
}

// PUT: แก้ไขข้อมูล
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await connectDB();

    const { name, phone, status, endDate, emergencyContact, deposit } = body;

    // 1. อัปเดตข้อมูลใน Tenant
    const updatedTenant = await Tenant.findByIdAndUpdate(id, {
        status,
        endDate: endDate ? new Date(endDate) : null,
        deposit,
        emergencyContact
    }, { new: true });

    // 2. อัปเดตชื่อ/เบอร์ ใน User (ถ้ามีการแก้)
    if (updatedTenant && name && phone) {
        await User.findByIdAndUpdate(updatedTenant.userId, { name, phone });
    }
    
    // 3. ถ้าสถานะเป็น terminated ให้ปลดล็อคห้อง
    if (status === 'terminated' && updatedTenant) {
         await Room.findByIdAndUpdate(updatedTenant.roomId, { status: 'available' });
    }

    return NextResponse.json(updatedTenant);
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await connectDB();
    const tenant = await Tenant.findByIdAndDelete(id);
    // คืนห้องว่าง
    if (tenant) {
        await Room.findByIdAndUpdate(tenant.roomId, { status: 'available' });
    }
    return NextResponse.json({ message: "Deleted" });
}