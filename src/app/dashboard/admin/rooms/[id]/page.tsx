"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
// เราจะใช้ CSS ตัวเดียวกับหน้าเพิ่มห้องเลย (Re-use)
import "../new/room-form.css"; 

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams(); // ดึง ID จาก URL
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State เก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    roomNumber: "",
    floor: "",
    type: "single",
    price: "",
    status: "available"
  });

  // 1. ดึงข้อมูลห้องเดิมมาใส่ในฟอร์ม
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`/api/rooms/${id}`);
        if (!res.ok) {
            alert("หาห้องไม่เจอ");
            router.push("/dashboard/admin/rooms");
            return;
        }
        const data = await res.json();
        
        // เซ็ตค่าลงฟอร์ม
        setFormData({
            roomNumber: data.roomNumber,
            floor: data.floor,
            type: data.type,
            price: data.price,
            status: data.status
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRoom();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 2. บันทึกการแก้ไข (PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      floor: Number(formData.floor),
      price: Number(formData.price)
    };

    try {
      const res = await fetch(`/api/rooms/${id}`, {
        method: "PUT", // ใช้ PUT สำหรับการแก้ไข
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("แก้ไขข้อมูลสำเร็จ!");
        router.push("/dashboard/admin/rooms"); 
        router.refresh();
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (error) {
      alert("เชื่อมต่อ Server ไม่ได้");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{textAlign:'center', padding:'50px'}}>กำลังโหลดข้อมูลห้อง...</div>;

  return (
    <div style={{minHeight: '100vh', padding: '20px', backgroundColor: '#f8f9fa'}}>
      <div className="form-container">
        <h1 className="form-title">✏️ แก้ไขข้อมูลห้องพัก</h1>
        
        <form onSubmit={handleSubmit}>
          {/* เลขห้อง */}
          <div className="form-group">
            <label className="form-label">เลขห้อง</label>
            <input 
              type="text" 
              name="roomNumber"
              className="form-input"
              required
              value={formData.roomNumber}
              onChange={handleChange}
            />
          </div>

          {/* ชั้น */}
          <div className="form-group">
            <label className="form-label">ชั้น</label>
            <input 
              type="number" 
              name="floor"
              className="form-input"
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
            <label className="form-label">ราคาค่าเช่า (บาท/เดือน)</label>
            <input 
              type="number" 
              name="price"
              className="form-input"
              required
              min="0"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          {/* สถานะ */}
          <div className="form-group">
            <label className="form-label">สถานะปัจจุบัน</label>
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
            <button type="submit" className="btn-submit" disabled={saving}>
              {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}