import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

// PUT: อัปเดตสถานะบิล (ใช้ทั้งตอนแจ้งโอน และตอนแอดมินกดอนุมัติ)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json(); // รับค่าที่ส่งมา (เช่น status: 'pending', paymentDate: ...)
    
    await connectDB();

    // อัปเดตข้อมูลลง Database
    const updatedPayment = await Payment.findByIdAndUpdate(
      id, 
      { ...body }, 
      { new: true } // ให้ส่งข้อมูลใหม่กลับไป
    );

    if (!updatedPayment) {
      return NextResponse.json({ message: "ไม่พบรายการชำระเงินนี้" }, { status: 404 });
    }

    return NextResponse.json(updatedPayment, { status: 200 });

  } catch (error) {
    console.error("Update Payment Error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดที่ Server" }, { status: 500 });
  }
}

// DELETE: ลบบิล (เผื่อแอดมินอยากลบ)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    await Payment.findByIdAndDelete(id);
    return NextResponse.json({ message: "ลบบิลสำเร็จ" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "ลบไม่สำเร็จ" }, { status: 500 });
  }
}