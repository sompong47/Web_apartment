import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// ตั้งค่า Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    // 1. รับไฟล์จากหน้าบ้าน
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 2. แปลงไฟล์เป็น Buffer เพื่อส่งไป Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. ส่งขึ้น Cloudinary (ใช้ Promise)
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "apartment-slips" }, // ตั้งชื่อโฟลเดอร์ใน Cloudinary
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // 4. ส่ง URL รูปภาพกลับไปให้หน้าบ้าน
    return NextResponse.json({ url: result.secure_url }, { status: 200 });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}