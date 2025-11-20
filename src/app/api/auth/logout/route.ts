import { NextResponse } from "next/server";

export async function POST() {
  // ในอนาคตถ้ามีการใช้ Cookie เราจะสั่งลบ Cookie ตรงนี้
  return NextResponse.json({ message: "ออกจากระบบสำเร็จ" }, { status: 200 });
}