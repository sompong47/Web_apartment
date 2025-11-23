"use client";

import { useState, useEffect } from "react";

interface CreateBillModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateBillModal({ onClose, onSuccess }: CreateBillModalProps) {
  const [tenants, setTenants] = useState<any[]>([]); // แก้ไข: ใส่ type any[] เพื่อแก้ Error
  const [loading, setLoading] = useState(false);
  
  // Form Data
  const [formData, setFormData] = useState({
    tenantId: "", 
    month: new Date().getMonth() + 1 + "-" + new Date().getFullYear(),
    year: new Date().getFullYear(),
    isSplit: false 
  });

  // 1. ดึงรายชื่อผู้เช่าทั้งหมด (ที่มีสถานะ active)
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await fetch("/api/tenants");
        if(res.ok) {
            const data = await res.json();
            if(Array.isArray(data)) setTenants(data.filter((t: any) => t.status === 'active'));
        }
      } catch (error) { console.error(error); }
    };
    fetchTenants();
  }, []);

  // 2. เวลากดบันทึก
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tenantId) return alert("กรุณาเลือกห้อง/ผู้เช่า");

    setLoading(true);
    
    const selectedTenant: any = tenants.find((t: any) => t._id === formData.tenantId);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: formData.tenantId,
          roomId: selectedTenant.roomId._id,
          month: formData.month,
          year: Number(formData.year),
          isSplit: formData.isSplit 
        })
      });

      if (res.ok) {
        alert("สร้างบิลสำเร็จ!");
        onSuccess(); 
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

          <div style={{ marginBottom: '20px', padding: '10px', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #eee' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#333' }}>
                <input 
                    type="checkbox" 
                    checked={formData.isSplit} 
                    onChange={(e) => setFormData({...formData, isSplit: e.target.checked})} 
                    style={{width: '16px', height: '16px'}}
                />
                <span>แยกบิลค่าเช่า กับ ค่าน้ำไฟ (สร้าง 2 ใบ)</span>
            </label>
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