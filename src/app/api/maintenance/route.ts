import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Maintenance from "@/models/Maintenance";
// ✅ 1. เพิ่ม Import Model ที่เกี่ยวข้องให้ครบ
import Room from "@/models/Room";
import Tenant from "@/models/Tenant";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    // ✅ 2. เทคนิคแก้อาการ MissingSchemaError
    // ประกาศตัวแปรโง่ๆ ไว้ เพื่อบังคับให้ System โหลดไฟล์ Model เหล่านี้ก่อนเริ่มทำงาน
    const _models = [Room, Tenant, User];

    const list = await Maintenance.find()
      .populate('roomId') // ตอนนี้มันจะรู้จัก "Room" แล้ว
      .populate({
        path: 'tenantId',
        populate: { path: 'userId', select: 'name' }
      })
      .sort({ createdAt: -1 });
      
    return NextResponse.json(list);
  } catch (error) {
    console.error("GET Maintenance Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    let { roomId, tenantId } = body;

    // Auto-fill สำหรับ Demo (ถ้าไม่ส่ง ID มา ให้ไปหาคนแรกในระบบ)
    if (!roomId || !tenantId) {
        // ต้องใช้ Tenant Model ที่ import มา
        const activeTenant = await Tenant.findOne({ status: 'active' });
        
        if (activeTenant) {
            roomId = activeTenant.roomId;
            tenantId = activeTenant._id;
        } else {
            return NextResponse.json({ message: "ไม่พบข้อมูลผู้เช่าในระบบ" }, { status: 400 });
        }
    }

    const newMaintenance = await Maintenance.create({
      ...body,
      roomId,
      tenantId,
      status: 'pending'
    });

    return NextResponse.json(newMaintenance, { status: 201 });
  } catch (error) {
    console.error("POST Maintenance Error:", error);
    return NextResponse.json({ message: "Error creating request" }, { status: 500 });
  }
}