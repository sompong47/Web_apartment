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
    
    // Trick: เรียกใช้ Model เล่นๆ เพื่อให้ Mongoose รู้จัก
    const _dependencies = [User, Room, Tenant]; 

    const payments = await Payment.find()
      .populate({ 
        path: 'tenantId',
        populate: { path: 'userId', select: 'name email' } 
      })
      .populate('roomId') 
      .sort({ createdAt: -1 });
      
    return NextResponse.json(payments);

  } catch (error) {
    console.error("❌ Database Error (GET Payments):", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // ✅ รับค่า isSplit เพิ่มเข้ามา
    const { tenantId, roomId, month, year, isSplit } = await req.json();
    await connectDB();

    // 1. ดึงค่าเช่าจาก Room
    const room = await Room.findById(roomId);
    if (!room) return NextResponse.json({ message: "Room not found" }, { status: 404 });

    // 2. ดึงค่าน้ำค่าไฟจาก Utility
    const utility = await Utility.findOne({ roomId, month, year });
    
    const waterBill = utility ? (utility.waterUsage * utility.waterRate) : 0;
    const electricBill = utility ? (utility.electricUsage * utility.electricRate) : 0;

    // --- กรณีที่ 1: แยกบิล (สร้าง 2 ใบ) ---
    if (isSplit) {
      // ใบที่ 1: ค่าเช่าล้วนๆ
      await Payment.create({
        tenantId, roomId, month, year,
        title: `ค่าเช่าห้อง (${month})`, // (ถ้าใน Model มี field title)
        rentAmount: room.price,
        waterBill: 0,
        electricBill: 0,
        totalAmount: room.price,
        status: 'unpaid',
        paymentDate: null
      });

      // ใบที่ 2: ค่าน้ำไฟล้วนๆ
      await Payment.create({
        tenantId, roomId, month, year,
        title: `ค่าน้ำ-ค่าไฟ (${month})`, // (ถ้าใน Model มี field title)
        rentAmount: 0,
        waterBill: waterBill,
        electricBill: electricBill,
        totalAmount: waterBill + electricBill,
        status: 'unpaid',
        paymentDate: null
      });

      return NextResponse.json({ message: "Split bills created" }, { status: 201 });
    } 
    
    // --- กรณีที่ 2: รวมบิลใบเดียว (แบบเดิม) ---
    else {
      const newPayment = await Payment.create({
        tenantId, roomId, month, year,
        title: `ค่าเช่าและสาธารณูปโภค (${month})`,
        rentAmount: room.price,
        waterBill: waterBill,
        electricBill: electricBill,
        totalAmount: room.price + waterBill + electricBill,
        status: 'unpaid', // ✅ เริ่มต้นเป็น 'unpaid' เพื่อให้ปุ่มจ่ายเงินขึ้น
        paymentDate: null
      });

      return NextResponse.json(newPayment, { status: 201 });
    }

  } catch (error) {
    console.error("❌ Database Error (POST Payment):", error);
    return NextResponse.json({ message: "Error generating bill" }, { status: 500 });
  }
}