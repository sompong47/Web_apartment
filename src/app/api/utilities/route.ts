import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Utility from "@/models/Utility";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      roomId, month, year, 
      currWaterReading, prevWaterReading, 
      currElectricReading, prevElectricReading,
      waterRate, electricRate 
    } = body;

    await connectDB();

    // คำนวณหน่วยที่ใช้
    const waterUsage = currWaterReading - prevWaterReading;
    const electricUsage = currElectricReading - prevElectricReading;

    const newUtility = await Utility.create({
      roomId, month, year,
      currWaterReading, prevWaterReading,
      currElectricReading, prevElectricReading,
      waterUsage, electricUsage,
      waterRate, electricRate
    });

    return NextResponse.json(newUtility, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error recording utility" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  // เพิ่ม Filter ตาม roomId ได้จาก searchParams
  await connectDB();
  const utilities = await Utility.find().populate('roomId');
  return NextResponse.json(utilities);
}