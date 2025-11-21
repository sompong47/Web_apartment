"use client";

import { useEffect, useState } from "react";
import "./payments.css";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. ดึงข้อมูลการชำระเงินทั้งหมด
  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/payments");
      const data = await res.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // 2. ฟังก์ชันกดยืนยันการจ่ายเงิน (จำลอง)
  const handleApprove = async (id: string) => {
    if(!confirm("ยืนยันว่าตรวจสอบสลิปถูกต้องแล้ว?")) return;
    
    // ตรงนี้ต้องยิง API PUT เพื่ออัพเดทสถานะ (เดี๋ยวเราไปทำ API เพิ่ม)
    alert(`ยืนยันการชำระเงิน ID: ${id} เรียบร้อย (Demo)`);
    // fetchPayments(); // โหลดใหม่
  };

  if (loading) return <div className="p-8 text-center">กำลังโหลดรายการชำระเงิน...</div>;

  return (
    <div className="payments-container">
      <div className="header-flex">
        <h1 className="page-title">รายการชำระเงิน (เดือนนี้)</h1>
        <button className="btn-create-bill">
          + สร้างบิลรอบเดือนใหม่
        </button>
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
          {payments.length === 0 ? (
            <tr>
              <td colSpan={6} style={{textAlign: 'center', padding: '30px', color: '#999'}}>
                ยังไม่มีรายการเรียกเก็บเงินในระบบ
              </td>
            </tr>
          ) : (
            payments.map((pay: any) => (
              <tr key={pay._id}>
                {/* ดึงเลขห้องจาก Relation */}
                <td style={{fontWeight: 'bold'}}>
                  {pay.roomId?.roomNumber || "ไม่ระบุ"}
                </td>
                <td>{pay.month}/{pay.year}</td>
                <td style={{fontWeight: 'bold', color: '#333'}}>
                  ฿{pay.totalAmount.toLocaleString()}
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