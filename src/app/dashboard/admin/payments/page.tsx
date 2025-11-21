"use client";

import { useEffect, useState } from "react";
import "./payments.css";
import SlipVerifier from "@/components/admin/SlipVerifier"; 
import CreateBillModal from "@/components/admin/CreateBillModal";

export default function AdminPaymentsPage() {
  // ✅ แก้ไข 1: กำหนด Type ให้ชัดเจนว่าเป็น Array
  const [payments, setPayments] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false); 
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/payments");
      
      // ✅ แก้ไข 2: เช็คสถานะ Response ก่อน
      if (!res.ok) {
        console.error("Failed to fetch payments");
        setPayments([]); // ถ้า Error ให้เป็น Array ว่าง
        return;
      }

      const data = await res.json();
      
      // ✅ แก้ไข 3: เช็คชัวร์ๆ ว่า data ที่ได้มาเป็น Array จริงไหม
      if (Array.isArray(data)) {
        setPayments(data);
      } else {
        console.error("Data is not an array:", data);
        setPayments([]);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleApprove = async (id: string) => {
    if(!confirm("ยืนยันว่าตรวจสอบสลิปถูกต้องแล้ว?")) return;
    alert(`ยืนยันการชำระเงิน ID: ${id} เรียบร้อย (Demo)`);
  };

  if (loading) return <div className="p-8 text-center">กำลังโหลดรายการชำระเงิน...</div>;

  return (
    <div className="payments-container">
      
      {showScanner && <SlipVerifier onClose={() => setShowScanner(false)} />}

      {showCreateModal && (
        <CreateBillModal 
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchPayments();
          }}
        />
      )}

      <div className="header-flex">
        <h1 className="page-title">รายการชำระเงิน (เดือนนี้)</h1>
        
        <div style={{ display: 'flex', gap: '10px' }}>
            <button 
                onClick={() => setShowScanner(true)}
                className="btn-create-bill" 
                style={{ backgroundColor: '#6f42c1' }} 
            >
                📷 ทดลองอ่านสลิป (OCR)
            </button>
            
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-create-bill"
            >
              + สร้างบิลรอบเดือนใหม่
            </button>
        </div>
      </div>

      <table className="payment-table">
        <thead>
          <tr>
            <th>ห้อง</th>
            <th>เดือน/ปี</th>
            <th>ยอดรวม</th>
            <th>สถานะ</th>
            <th>วันที่โอน</th>
            <th>ตรวจสอบ</th>
          </tr>
        </thead>
        <tbody>
          {/* ✅ แก้ไข 4: เช็ค Array.isArray อีกรอบใน JSX เพื่อความปลอดภัยสูงสุด */}
          {!Array.isArray(payments) || payments.length === 0 ? (
            <tr>
              <td colSpan={6} style={{textAlign: 'center', padding: '30px', color: '#999'}}>
                ยังไม่มีรายการเรียกเก็บเงินในระบบ
              </td>
            </tr>
          ) : (
            payments.map((pay: any) => (
              <tr key={pay._id}>
                <td style={{fontWeight: 'bold'}}>
                  {pay.roomId?.roomNumber || "ไม่ระบุ"}
                </td>
                <td>{pay.month}/{pay.year}</td>
                <td style={{fontWeight: 'bold', color: '#333'}}>
                  ฿{pay.totalAmount?.toLocaleString() || 0}
                </td>
                <td>
                  <span className={`status-badge ${pay.status}`}>
                    {pay.status === 'pending' ? 'รอตรวจสอบ' :
                     pay.status === 'paid' ? 'ชำระแล้ว' : 'เกินกำหนด'}
                  </span>
                </td>
                <td>
                  {pay.paymentDate ? new Date(pay.paymentDate).toLocaleDateString('th-TH') : "-"}
                </td>
                <td>
                  {pay.status === 'pending' ? (
                    <button 
                      onClick={() => handleApprove(pay._id)}
                      className="btn-check"
                    >
                      ตรวจสอบสลิป
                    </button>
                  ) : (
                    <span style={{color: 'green', fontSize: '12px'}}>✓ เรียบร้อย</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}