"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ใช้สำหรับเด้งกลับหน้าเดิม
import Link from "next/link";
import "./room-form.css";

export default function NewRoomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // State เก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    roomNumber: "",
    floor: "",
    type: "single", // default value
    price: "",
    status: "available" // default value
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // แปลงข้อมูลให้ตรง type (เช่น floor, price ต้องเป็นตัวเลข)
    const payload = {
      ...formData,
      floor: Number(formData.floor),
      price: Number(formData.price)
    };

    try {
      // ยิง API ไปสร้างห้อง
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("เพิ่มห้องพักสำเร็จ!");
        router.push("/dashboard/admin/rooms"); // เด้งกลับไปหน้ารายชื่อห้อง
        router.refresh(); // รีเฟรชข้อมูลใหม่
      } else {
        const errorData = await res.json();
        alert("เกิดข้อผิดพลาด: " + (errorData.message || "Unknown Error"));
      }
    } catch (error) {
      console.error(error);
      alert("เชื่อมต่อ Server ไม่ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight: '100vh', padding: '20px', backgroundColor: '#f8f9fa'}}>
      <div className="form-container">
        <h1 className="form-title">🏠 เพิ่มห้องพักใหม่</h1>
        
        <form onSubmit={handleSubmit}>
          {/* เลขห้อง */}
          <div className="form-group">
            <label className="form-label">เลขห้อง *</label>
            <input 
              type="text" 
              name="roomNumber"
              className="form-input"
              placeholder="เช่น 101, A205"
              required
              value={formData.roomNumber}
              onChange={handleChange}
            />
          </div>

          {/* ชั้น */}
          <div className="form-group">
            <label className="form-label">ชั้น *</label>
            <input 
              type="number" 
              name="floor"
              className="form-input"
              placeholder="เช่น 1, 2, 3"
              required
              min="1"
              value={formData.floor}
              onChange={handleChange}
            />
          </div>

          {/* ประเภทห้อง */}
          <div className="form-group">
            <label className="form-label">ประเภทห้อง</label>
            <select 
              name="type" 
              className="form-select"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="single">เตียงเดี่ยว (Single)</option>
              <option value="double">เตียงคู่ (Double)</option>
              <option value="studio">สตูดิโอ (Studio)</option>
            </select>
          </div>

          {/* ราคา */}
          <div className="form-group">
            <label className="form-label">ราคาค่าเช่า (บาท/เดือน) *</label>
            <input 
              type="number" 
              name="price"
              className="form-input"
              placeholder="เช่น 3500"
              required
              min="0"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          {/* สถานะเริ่มต้น */}
          <div className="form-group">
            <label className="form-label">สถานะเริ่มต้น</label>
            <select 
              name="status" 
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="available">ว่าง (Available)</option>
              <option value="occupied">มีคนอยู่ (Occupied)</option>
              <option value="maintenance">ปิดซ่อม (Maintenance)</option>
            </select>
          </div>

          <div className="form-actions">
            <Link href="/dashboard/admin/rooms" className="btn-cancel">
              ยกเลิก
            </Link>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}