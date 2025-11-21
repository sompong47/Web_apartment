import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Tenant from "@/models/Tenant";
import User from "@/models/User"; // จำเป็นต้อง import เพื่อให้ populate('userId') ทำงาน
import Room from "@/models/Room"; // จำเป็นต้อง import เพื่อให้ populate('roomId') ทำงาน

// บังคับให้ทำงานแบบ Dynamic (ไม่ cache) เพื่อให้ได้ข้อมูลล่าสุดเสมอ
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. เชื่อมต่อฐานข้อมูล
    await connectDB();
    
    // 2. ดึงข้อมูล
    const tenants = await Tenant.find()
      .populate('userId') // ดึงข้อมูล User มาแปะ
      .populate('roomId') // ดึงข้อมูล Room มาแปะ
      .sort({ createdAt: -1 });
      
    // 3. ส่งข้อมูลกลับ
    return NextResponse.json(tenants, { status: 200 });

  } catch (error) {
    console.error("Error fetching tenants:", error); // ดู Error ใน Terminal ได้
    // ส่ง Array ว่างกลับไปแทน Error 500 หน้าเว็บจะได้ไม่พัง
    return NextResponse.json([], { status: 500 }); 
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();
    
    const newTenant = await Tenant.create(body);
    
    // อัพเดทสถานะห้องเป็น 'occupied'
    if (body.roomId) {
      await Room.findByIdAndUpdate(body.roomId, { status: 'occupied' });
    }
    
    return NextResponse.json(newTenant, { status: 201 });
  } catch (error) {
    console.error("Error creating tenant:", error);
    return NextResponse.json({ message: "Error creating tenant" }, { status: 500 });
  }
}