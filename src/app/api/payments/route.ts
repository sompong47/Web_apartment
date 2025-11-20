import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Room from "@/models/Room";
import Utility from "@/models/Utility";

export async function POST(req: Request) {
  try {
    const { tenantId, roomId, month, year } = await req.json();
    await connectDB();

    // 1. ดึงค่าเช่าจาก Room
    const room = await Room.findById(roomId);
    if (!room) return NextResponse.json({ message: "Room not found" }, { status: 404 });

    // 2. ดึงค่าน้ำค่าไฟจาก Utility (ต้องมีการบันทึก Utility ก่อนสร้างบิล)
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
      status: 'pending'
    });

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error generating bill" }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  const payments = await Payment.find()
    .populate({ 
      path: 'tenantId',
      populate: { path: 'userId', select: 'name email' } // ซ้อน populate
    })
    .populate('roomId');
  return NextResponse.json(payments);
}