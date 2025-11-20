import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"], // ระบุ path ที่ต้องการให้ middleware ทำงาน
};