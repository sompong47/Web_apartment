"use client";

import { useEffect, useState } from "react";
import "./payments.css";
import SlipVerifier from "@/components/admin/SlipVerifier";
import CreateBillModal from "@/components/admin/CreateBillModal";
import VerifySlipModal from "@/components/admin/VerifySlipModal"; // ✅ 1. นำเข้า Modal ตรวจสอบ

// Interface ข้อมูลจริง
interface Payment {
  _id: string;
  roomId: { roomNumber: string };
  tenantId?: { userId: { name: string } };
  month: string;
  year: number;
  totalAmount: number;
  status: "pending" | "paid" | "overdue" | "unpaid";
  paymentDate?: string;
  receipt?: string; // ✅ เพิ่ม field receipt เพื่อส่งรูปสลิปไปให้ Modal
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showScanner, setShowScanner] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // ✅ 2. เพิ่ม State สำหรับ Modal ตรวจสอบ
  const [verifyPayment, setVerifyPayment] = useState<Payment | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // 1. ดึงข้อมูลจริง
  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/payments");
      if (!res.ok) throw new Error("Failed");
      
      const data = await res.json();
      if (Array.isArray(data)) {
        setPayments(data);
      } else {
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

  // ✅ 3. ฟังก์ชันเปิด Modal ตรวจสอบ (แทน handleApprove เดิม)
  const handleVerifyClick = (payment: Payment) => {
    setVerifyPayment(payment);
  };

  // ✅ 4. ฟังก์ชันอนุมัติ (ทำงานเมื่อกดปุ่มใน Modal)
  const handleApproveConfirm = async () => {
    if (!verifyPayment) return;
    try {
      const res = await fetch(`/api/payments/${verifyPayment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" })
      });

      if(res.ok) {
        alert("บันทึกสถานะการชำระเงินเรียบร้อย");
        setVerifyPayment(null); // ปิด Modal
        fetchPayments(); // โหลดข้อมูลใหม่
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (error) {
      alert("เชื่อมต่อ Server ไม่ได้");
    }
  };

  // ✅ 5. ฟังก์ชันปฏิเสธ (ทำงานเมื่อกดปุ่มใน Modal)
  const handleRejectConfirm = async () => {
    if (!verifyPayment) return;
    if (!confirm("ต้องการตีกลับรายการนี้เป็น 'ยังไม่จ่าย' ใช่หรือไม่?")) return;
    try {
      const res = await fetch(`/api/payments/${verifyPayment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "unpaid" }) // ตีกลับไปเป็น unpaid
      });
      if(res.ok) {
        setVerifyPayment(null);
        fetchPayments();
      }
    } catch (error) { alert("Error"); }
  };

  // Filter Logic
  const filteredPayments = payments.filter((payment) => {
    const roomNum = payment.roomId?.roomNumber || "";
    const monthStr = payment.month?.toString() || "";
    const tenantName = payment.tenantId?.userId?.name || "";

    const matchSearch =
      roomNum.includes(searchTerm) ||
      monthStr.includes(searchTerm) || 
      tenantName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchStatus = !filterStatus || payment.status === filterStatus;

    return matchSearch && matchStatus;
  });

  // Stats Calculation
  const stats = {
    total: payments.length,
    pending: payments.filter((p) => p.status === "pending").length,
    paid: payments.filter((p) => p.status === "paid").length,
    totalAmount: payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.totalAmount, 0),
  };

  if (loading) return <div className="p-8 text-center">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="payments-container">
      {/* Modals เดิม */}
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

      {/* ✅ Modal ตรวจสอบสลิป (ใหม่) */}
      {verifyPayment && (
        <VerifySlipModal 
            payment={verifyPayment}
            onClose={() => setVerifyPayment(null)}
            onApprove={handleApproveConfirm}
            onReject={handleRejectConfirm}
        />
      )}

      {/* Header */}
      <div className="header-flex">
        <div>
          <h1 className="page-title">💰 รายการชำระเงิน</h1>
          <p style={{ color: "#666", marginTop: "4px" }}>จัดการการชำระเงินค่าห้องและสาธารณูปโภค</p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={() => setShowScanner(true)} className="btn-create-bill" style={{ backgroundColor: "#6f42c1" }}>
            📷 ทดลองอ่านสลิป (OCR)
          </button>
          <button onClick={() => setShowCreateModal(true)} className="btn-create-bill">
            + สร้างบิลรอบเดือนใหม่
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'15px', marginBottom:'20px'}}>
        <div className="stat-box" style={{background:'white', padding:'15px', borderRadius:'8px', boxShadow:'0 2px 5px rgba(0,0,0,0.05)'}}>
          <div className="stat-label" style={{color:'#666', fontSize:'14px'}}>🏦 ทั้งหมด</div>
          <div className="stat-value" style={{fontSize:'24px', fontWeight:'bold'}}>{stats.total}</div>
        </div>
        <div className="stat-box" style={{background:'white', padding:'15px', borderRadius:'8px', boxShadow:'0 2px 5px rgba(0,0,0,0.05)'}}>
          <div className="stat-label" style={{color:'#666', fontSize:'14px'}}>⏳ รอตรวจสอบ</div>
          <div className="stat-value" style={{fontSize:'24px', fontWeight:'bold', color: "#ff9800"}}>{stats.pending}</div>
        </div>
        <div className="stat-box" style={{background:'white', padding:'15px', borderRadius:'8px', boxShadow:'0 2px 5px rgba(0,0,0,0.05)'}}>
          <div className="stat-label" style={{color:'#666', fontSize:'14px'}}>✓ ชำระแล้ว</div>
          <div className="stat-value" style={{fontSize:'24px', fontWeight:'bold', color: "#28a745"}}>{stats.paid}</div>
        </div>
        <div className="stat-box" style={{background:'white', padding:'15px', borderRadius:'8px', boxShadow:'0 2px 5px rgba(0,0,0,0.05)'}}>
          <div className="stat-label" style={{color:'#666', fontSize:'14px'}}>💵 รายได้จริง</div>
          <div className="stat-value" style={{fontSize:'24px', fontWeight:'bold', color: "#007bff"}}>฿{stats.totalAmount.toLocaleString()}</div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <input
          type="text"
          className="filter-input"
          placeholder="ค้นหาเลขห้อง หรือ เดือน..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">ทุกสถานะ</option>
          <option value="unpaid">ยังไม่จ่าย</option>
          <option value="pending">รอตรวจสอบ</option>
          <option value="paid">ชำระแล้ว</option>
          <option value="overdue">เกินกำหนด</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-wrapper">
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
            {!Array.isArray(filteredPayments) || filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>ไม่มีรายการชำระเงิน</h3>
                    <p>ยังไม่มีรายการเรียกเก็บเงินในระบบ</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPayments.map((pay: Payment) => (
                <tr key={pay._id}>
                  <td>
                    <span className="room-number">#{pay.roomId?.roomNumber || "ไม่ระบุ"}</span>
                    <div style={{fontSize:'12px', color:'#888'}}>{pay.tenantId?.userId?.name}</div>
                  </td>
                  <td>{pay.month}/{pay.year}</td>
                  <td>
                    <span className="amount" style={{fontWeight:'bold', color:'#333'}}>฿{pay.totalAmount?.toLocaleString() || 0}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${pay.status}`}>
                      {pay.status === "pending" ? "รอตรวจสอบ" : 
                       pay.status === "paid" ? "ชำระแล้ว" : 
                       pay.status === "unpaid" ? "ยังไม่จ่าย" : "เกินกำหนด"}
                    </span>
                  </td>
                  <td>
                    {pay.paymentDate ? new Date(pay.paymentDate).toLocaleDateString("th-TH") : "-"}
                  </td>
                  <td>
                    {pay.status === "pending" ? (
                      // ✅ เรียกใช้ฟังก์ชัน handleVerifyClick เพื่อเปิด Modal
                      <button onClick={() => handleVerifyClick(pay)} className="btn-check">
                        ✓ ตรวจสอบ
                      </button>
                    ) : (
                      <span style={{ color: "#28a745", fontSize: "12px", fontWeight:'bold' }}>
                        {pay.status === "paid" ? "✓ เรียบร้อย" : "-"}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}