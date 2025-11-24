import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// ป้องกันไม่ให้ Next.js จำ Cache (เผื่อ login แล้วค้าง)
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    // 1. หา User (แปลง email เป็นตัวเล็กเสมอ เพื่อความชัวร์)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        return NextResponse.json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    // 2. เช็ค Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return NextResponse.json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    // 3. จัดเตรียมข้อมูลที่จะส่งกลับ
    const userData = {
        id: user._id.toString(), // ✅ แปลง _id เป็น id
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "" // กันเหนียวถ้าไม่มีเบอร์
    };

    // 4. ส่งกลับรูปแบบ { message, user }
    return NextResponse.json({
        message: "เข้าสู่ระบบสำเร็จ",
        user: userData 
    }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดที่ Server" }, { status: 500 });
  }
}