import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Tenant from "@/models/Tenant";
import User from "@/models/User"; // ✅ ต้อง import เพื่อกัน Error: MissingSchema
import Room from "@/models/Room"; // ✅ ต้อง import เพื่อกัน Error: MissingSchema
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic'; // บังคับโหลดใหม่เสมอ

export async function GET() {
  try {
    await connectDB();

    // 🔥 เทคนิค: เรียกใช้ตัวแปร Model เพื่อบังคับให้ Mongoose โหลด Schema
    const _dependencies = [User, Room];

    const tenants = await Tenant.find()
      .populate('userId') // ดึงข้อมูลจาก User
      .populate('roomId') // ดึงข้อมูลจาก Room
      .sort({ createdAt: -1 });

    return NextResponse.json(tenants);

  } catch (error) {
    console.error("❌ Error fetching tenants:", error);
    // ส่ง Array ว่างกลับไป เพื่อกันหน้าเว็บขาว
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    const { 
      name, email, phone, idCard, 
      roomId, startDate, endDate, deposit, status, 
      emergencyContact 
    } = body;

    // 1. สร้างหรือหา User
    let user = await User.findOne({ email });
    if (!user) {
      const hashedPassword = await bcrypt.hash(phone || "123456", 10);
      user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'tenant'
      });
    }

    // 2. สร้าง Tenant
    const newTenant = await Tenant.create({
      userId: user._id,
      roomId,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      deposit: Number(deposit),
      status: status || 'active',
      identityCard: idCard,
      emergencyContact
    });

    // 3. อัปเดตห้องเป็น ไม่ว่าง
    if (status === 'active') {
        await Room.findByIdAndUpdate(roomId, { status: 'occupied' });
    }
    
    return NextResponse.json(newTenant, { status: 201 });

  } catch (error: any) {
    console.error("❌ Error creating tenant:", error);
    return NextResponse.json({ message: error.message || "Error" }, { status: 500 });
  }
}