"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRootPage() {
  const router = useRouter();

  useEffect(() => {
    // 1. เช็คว่ามีใครล็อกอินอยู่ไหม
    const userStr = localStorage.getItem("currentUser");
    
    if (!userStr) {
      // ถ้าไม่มี -> ดีดกลับไปหน้า Login
      router.push("/login");
      return;
    }

    // 2. เช็ค Role
    const user = JSON.parse(userStr);
    
    if (user.role === 'admin') {
        // แอดมิน -> ไปห้องแอดมิน
        router.push("/dashboard/admin");
    } else {
        // ผู้เช่า -> ไปห้องผู้เช่า
        router.push("/dashboard/tenant");
    }
  }, [router]);

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
        <p>กำลังตรวจสอบสิทธิ์และนำทาง...</p>
    </div>
  );
}