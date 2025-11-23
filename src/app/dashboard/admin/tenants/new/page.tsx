"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./tenant-form.css";

export default function NewTenantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // ✅ แก้ไข: ใส่ <any[]> เพื่อบอกว่าเก็บข้อมูลอะไรก็ได้
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  
  // State ข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    // ข้อมูลส่วนตัว (User)
    name: "",
    email: "",
    phone: "",
    idCard: "",
    
    // ข้อมูลสัญญา (Tenant)
    roomId: "",
    startDate: new Date().toISOString().split('T')[0], // วันนี้
    endDate: "",
    deposit: "",
    status: "active", // สถานะเริ่มต้น
    
    // ข้อมูลฉุกเฉิน
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: ""
  });

  // 1. ดึงห้องว่างมาแสดงใน Dropdown
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("/api/rooms");
        const data = await res.json();
        if (Array.isArray(data)) {
          // กรองเอาเฉพาะห้องว่าง (available)
          setAvailableRooms(data.filter((r: any) => r.status === 'available'));
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        deposit: Number(formData.deposit),
        emergencyContact: {
            name: formData.emergencyName,
            phone: formData.emergencyPhone,
            relation: formData.emergencyRelation
        }
      };

      const res = await fetch("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("เพิ่มผู้เช่าเรียบร้อย!");
        router.push("/dashboard/admin/tenants");
        router.refresh();
      } else {
        const err = await res.json();
        alert("เกิดข้อผิดพลาด: " + err.message);
      }
    } catch (error) {
      alert("เชื่อมต่อ Server ไม่ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight: '100vh', padding: '20px', backgroundColor: '#f8f9fa'}}>
      <div className="form-container">
        <h1 className="form-title">👤 เพิ่มผู้เช่าใหม่</h1>
        
        <form onSubmit={handleSubmit}>
          
          {/* 1. ข้อมูลส่วนตัว */}
          <div className="form-section">
            <h3 className="section-title">📝 ข้อมูลส่วนตัว</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">ชื่อ-นามสกุล *</label>
                    <input type="text" name="name" className="form-input" required value={formData.name} onChange={handleChange} placeholder="สมชาย ใจดี" />
                </div>
                <div className="form-group">
                    <label className="form-label">เลขบัตรประชาชน</label>
                    <input type="text" name="idCard" className="form-input" value={formData.idCard} onChange={handleChange} placeholder="x-xxxx-xxxxx-xx-x" />
                </div>
                <div className="form-group">
                    <label className="form-label">เบอร์โทรศัพท์ *</label>
                    <input type="tel" name="phone" className="form-input" required value={formData.phone} onChange={handleChange} placeholder="08x-xxx-xxxx" />
                </div>
                <div className="form-group">
                    <label className="form-label">อีเมล *</label>
                    <input type="email" name="email" className="form-input" required value={formData.email} onChange={handleChange} placeholder="example@mail.com" />
                </div>
            </div>
          </div>

          {/* 2. ข้อมูลสัญญา */}
          <div className="form-section">
            <h3 className="section-title">🏠 สัญญาเช่า & ห้องพัก</h3>
            <div className="form-grid">
                <div className="form-group full-width">
                    <label className="form-label">เลือกห้องพัก (เฉพาะห้องว่าง) *</label>
                    <select name="roomId" className="form-select" required value={formData.roomId} onChange={handleChange}>
                        <option value="">-- กรุณาเลือกห้อง --</option>
                        {availableRooms.map((room: any) => (
                            <option key={room._id} value={room._id}>
                                ห้อง {room.roomNumber} (ชั้น {room.floor}) - ฿{room.price}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">วันเริ่มสัญญา *</label>
                    <input type="date" name="startDate" className="form-input" required value={formData.startDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label className="form-label">วันสิ้นสุดสัญญา (ถ้ามี)</label>
                    <input type="date" name="endDate" className="form-input" value={formData.endDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label className="form-label">เงินประกัน (บาท)</label>
                    <input type="number" name="deposit" className="form-input" value={formData.deposit} onChange={handleChange} placeholder="เช่น 10000" />
                </div>
                <div className="form-group">
                    <label className="form-label">สถานะ</label>
                    <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                        <option value="active">✅ เข้าอยู่ (Active)</option>
                        <option value="terminated">❌ ย้ายออก (Terminated)</option>
                    </select>
                </div>
            </div>
          </div>

          {/* 3. ผู้ติดต่อฉุกเฉิน */}
          <div className="form-section">
            <h3 className="section-title">📞 ผู้ติดต่อฉุกเฉิน</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">ชื่อผู้ติดต่อ</label>
                    <input type="text" name="emergencyName" className="form-input" value={formData.emergencyName} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label className="form-label">ความสัมพันธ์</label>
                    <input type="text" name="emergencyRelation" className="form-input" value={formData.emergencyRelation} onChange={handleChange} placeholder="เช่น บิดา, มารดา" />
                </div>
                <div className="form-group full-width">
                    <label className="form-label">เบอร์โทรฉุกเฉิน</label>
                    <input type="tel" name="emergencyPhone" className="form-input" value={formData.emergencyPhone} onChange={handleChange} />
                </div>
            </div>
          </div>

          <div className="form-actions">
            <Link href="/dashboard/admin/tenants" className="btn-cancel">
              ยกเลิก
            </Link>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "กำลังบันทึก..." : "บันทึกข้อมูลผู้เช่า"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}