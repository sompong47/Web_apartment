// *สำหรับการทำ Custom Login เท่านั้น ถ้าใช้ NextAuth ให้ไปตั้งค่าที่ AuthOption แทน*
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    // ในที่นี้คืนค่า User object (ควรใช้ JWT ในการจัดการ Session จริง)
    const { password: _, ...userWithoutPass } = user._doc;
    return NextResponse.json(userWithoutPass, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error logging in" }, { status: 500 });
  }
}