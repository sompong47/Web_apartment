import { redirect } from "next/navigation";

export default function DashboardRootPage() {
  // เมื่อใครเข้ามาที่ /dashboard ให้ดีดไปหน้า /dashboard/tenant ทันที
  redirect("/dashboard/tenant");
}