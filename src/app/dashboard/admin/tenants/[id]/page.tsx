"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
// ใช้ CSS ตัวเดียวกับหน้าเพิ่ม (Re-use)
import "../new/tenant-form.css"; 

export default function EditTenantPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id; // รับ ID จาก URL

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);

  // State ข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    idCard: "",
    roomId: "",
    startDate: "",
    endDate: "",
    deposit: "",
    status: "active",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: ""
  });

  // 1. ดึงข้อมูลผู้เช่า + ห้องทั้งหมด
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ดึงห้องทั้งหมด (รวมห้องที่คนนี้อยู่ด้วย)
        const resRooms = await fetch("/api/rooms");
        const roomsData = await resRooms.json();
        if (Array.isArray(roomsData)) setAvailableRooms(roomsData);

        // ดึงข้อมูลผู้เช่าคนนี้
        const resTenant = await fetch(`/api/tenants/${id}`);
        if (!resTenant.ok) throw new Error("Tenant not found");
        const tenant = await resTenant.json();

        // เอาข้อมูลเดิมมาใส่ในฟอร์ม
        setFormData({
            name: tenant.userId?.name || "",
            email: tenant.userId?.email || "",
            phone: tenant.userId?.phone || "",
            idCard: tenant.identityCard || "",
            
            roomId: tenant.roomId?._id || "",
            startDate: tenant.startDate ? new Date(tenant.startDate).toISOString().split('T')[0] : "",
            endDate: tenant.endDate ? new Date(tenant.endDate).toISOString().split('T')[0] : "",
            deposit: tenant.deposit?.toString() || "",
            status: tenant.status || "active",
            
            emergencyName: tenant.emergencyContact?.name || "",
            emergencyPhone: tenant.emergencyContact?.phone || "",
            emergencyRelation: tenant.emergencyContact?.relation || ""
        });

      } catch (error) {
        console.error(error);
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        router.push("/dashboard/admin/tenants");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 2. บันทึกการแก้ไข (PUT API)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // เราต้องสร้าง API PUT /api/tenants/[id] เพิ่มด้วยนะ (ถ้ายังไม่มี)
      const payload = {
        ...formData,
        deposit: Number(formData.deposit),
        emergencyContact: {
            name: formData.emergencyName,
            phone: formData.emergencyPhone,
            relation: formData.emergencyRelation
        }
      };

      // หมายเหตุ: ตอนนี้เรายังไม่มี API PUT /api/tenants/[id] แบบสมบูรณ์
      // แต่ถ้ามีแล้ว ใช้โค้ดนี้ได้เลย
      const res = await fetch(`/api/tenants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("แก้ไขข้อมูลเรียบร้อย!");
        router.push("/dashboard/admin/tenants");
        router.refresh();
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (error) {
      alert("เชื่อมต่อ Server ไม่ได้");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{textAlign:'center', padding:'50px'}}>กำลังโหลดข้อมูล...</div>;

  return (
    <div style={{minHeight: '100vh', padding: '20px', backgroundColor: '#f8f9fa'}}>
      <div className="form-container">
        <h1 className="form-title">✏️ แก้ไขข้อมูลผู้เช่า</h1>
        
        <form onSubmit={handleSubmit}>
          
          {/* 1. ข้อมูลส่วนตัว */}
          <div className="form-section">
            <h3 className="section-title">📝 ข้อมูลส่วนตัว</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">ชื่อ-นามสกุล</label>
                    <input type="text" name="name" className="form-input" required value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label className="form-label">เลขบัตรประชาชน</label>
                    <input type="text" name="idCard" className="form-input" value={formData.idCard} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label className="form-label">เบอร์โทรศัพท์</label>
                    <input type="tel" name="phone" className="form-input" required value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label className="form-label">อีเมล (ใช้ล็อกอิน)</label>
                    <input type="email" name="email" className="form-input" required value={formData.email} disabled style={{background:'#eee'}} />
                </div>
            </div>
          </div>

          {/* 2. ข้อมูลสัญญา */}
          <div className="form-section">
            <h3 className="section-title">🏠 สัญญาเช่า & ห้องพัก</h3>
            <div className="form-grid">
                <div className="form-group full-width">
                    <label className="form-label">ห้องพัก</label>
                    <select name="roomId" className="form-select" required value={formData.roomId} onChange={handleChange} disabled>
                        {availableRooms.map((room: any) => (
                            <option key={room._id} value={room._id}>
                                ห้อง {room.roomNumber}
                            </option>
                        ))}
                    </select>
                    <small style={{color:'#666'}}>* หากต้องการย้ายห้อง กรุณายกเลิกสัญญาเดิมแล้วสร้างใหม่</small>
                </div>
                <div className="form-group">
                    <label className="form-label">วันเริ่มสัญญา</label>
                    <input type="date" name="startDate" className="form-input" required value={formData.startDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label className="form-label">วันสิ้นสุดสัญญา</label>
                    <input type="date" name="endDate" className="form-input" value={formData.endDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label className="form-label">เงินประกัน</label>
                    <input type="number" name="deposit" className="form-input" value={formData.deposit} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label className="form-label">สถานะ</label>
                    <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                        <option value="active">✅ เช่าอยู่ (Active)</option>
                        <option value="terminated">❌ ย้ายออกแล้ว (Terminated)</option>
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
                    <input type="text" name="emergencyRelation" className="form-input" value={formData.emergencyRelation} onChange={handleChange} />
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
            <button type="submit" className="btn-submit" disabled={saving}>
              {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}