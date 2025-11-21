"use client";

import { useState, useEffect } from "react";

interface CreateBillModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateBillModal({ onClose, onSuccess }: CreateBillModalProps) {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form Data
  const [formData, setFormData] = useState({
    tenantId: "", // เราจะเก็บทั้ง tenantId และ roomId
    month: new Date().getMonth() + 1 + "-" + new Date().getFullYear(), // Default: เดือน-ปี ปัจจุบัน
    year: new Date().getFullYear()
  });

  // 1. ดึงรายชื่อผู้เช่าทั้งหมด (ที่มีสถานะ active)
  useEffect(() => {
    const fetchTenants = async () => {
      const res = await fetch("/api/tenants");
      const data = await res.json();
      // กรองเอาเฉพาะคนที่มีห้องอยู่ (Active)
      setTenants(data.filter((t: any) => t.status === 'active'));
    };
    fetchTenants();
  }, []);

  // 2. เวลากดบันทึก
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tenantId) return alert("กรุณาเลือกห้อง/ผู้เช่า");

    setLoading(true);
    
    // หา roomId จาก tenantId ที่เลือก
    const selectedTenant: any = tenants.find((t: any) => t._id === formData.tenantId);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: formData.tenantId,
          roomId: selectedTenant.roomId._id, // ดึง ID ห้องจาก Tenant
          month: formData.month,
          year: Number(formData.year)
        })
      });

      if (res.ok) {
        alert("สร้างบิลสำเร็จ!");
        onSuccess(); // ปิด Modal และโหลดข้อมูลใหม่
      } else {
        alert("เกิดข้อผิดพลาด (อาจยังไม่ได้จดมิเตอร์น้ำไฟ)");
      }
    } catch (error) {
      console.error(error);
      alert("เชื่อมต่อ Server ไม่ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '400px' }}>
        <h2 style={{ marginBottom: '20px', fontWeight: 'bold' }}>สร้างบิลค่าเช่า</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>เลือกห้อง / ผู้เช่า</label>
            <select 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              value={formData.tenantId}
              onChange={(e) => setFormData({...formData, tenantId: e.target.value})}
              required
            >
              <option value="">-- กรุณาเลือก --</option>
              {tenants.map((t: any) => (
                <option key={t._id} value={t._id}>
                  ห้อง {t.roomId?.roomNumber} - {t.userId?.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>ประจำเดือน (MM-YYYY)</label>
            <input 
              type="text"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              value={formData.month}
              onChange={(e) => setFormData({...formData, month: e.target.value})}
              placeholder="เช่น 11-2025"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button 
              type="button"
              onClick={onClose}
              style={{ padding: '8px 16px', border: '1px solid #ccc', background: 'white', borderRadius: '4px', cursor: 'pointer' }}
            >
              ยกเลิก
            </button>
            <button 
              type="submit"
              disabled={loading}
              style={{ 
                padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer',
                background: loading ? '#ccc' : '#28a745', color: 'white'
              }}
            >
              {loading ? "กำลังสร้าง..." : "ยืนยันสร้างบิล"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}