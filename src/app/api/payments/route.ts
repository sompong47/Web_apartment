import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Room from "@/models/Room";     // ต้อง import เพื่อให้ populate ทำงาน
import Tenant from "@/models/Tenant"; // ต้อง import เพื่อให้ populate ทำงาน
import User from "@/models/User";     // ต้อง import เพื่อให้ populate('userId') ทำงาน
import Utility from "@/models/Utility";

// บังคับให้โหลดข้อมูลใหม่เสมอ ไม่ Cache
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    
    // Trick: เรียกใช้ Model เล่นๆ เพื่อให้ Mongoose รู้จัก (กัน Error: Schema hasn't been registered)
    // ถ้าไม่ใส่บรรทัดพวกนี้ บางที populate จะพัง
    const _dependencies = [User, Room, Tenant]; 

    const payments = await Payment.find()
      .populate({ 
        path: 'tenantId',
        populate: { path: 'userId', select: 'name email' } // ดึงชื่อผู้เช่าจาก User ผ่าน Tenant
      })
      .populate('roomId') // ดึงเลขห้อง
      .sort({ createdAt: -1 });
      
    return NextResponse.json(payments);

  } catch (error) {
    console.error("❌ Database Error (GET Payments):", error);
    // ส่ง Array ว่างกลับไป หน้าเว็บจะได้ไม่แดง
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { tenantId, roomId, month, year } = await req.json();
    await connectDB();

    // 1. ดึงค่าเช่าจาก Room
    const room = await Room.findById(roomId);
    if (!room) return NextResponse.json({ message: "Room not found" }, { status: 404 });

    // 2. ดึงค่าน้ำค่าไฟจาก Utility
    const utility = await Utility.findOne({ roomId, month, year });
    
    const waterBill = utility ? (utility.waterUsage * utility.waterRate) : 0;
    const electricBill = utility ? (utility.electricUsage * utility.electricRate) : 0;
    const totalAmount = room.price + waterBill + electricBill;

    const newPayment = await Payment.create({
      tenantId,
      roomId,
      month,
      year,
      rentAmount: room.price,
      waterBill,
      electricBill,
      totalAmount,
      status: 'pending',
      paymentDate: new Date()
    });

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    console.error("❌ Database Error (POST Payment):", error);
    return NextResponse.json({ message: "Error generating bill" }, { status: 500 });
  }
}