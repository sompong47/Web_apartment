"use client";

import { useEffect, useState } from "react";
import "./payments.css";
import SlipVerifier from "@/components/admin/SlipVerifier";
import CreateBillModal from "@/components/admin/CreateBillModal";

export default function AdminPaymentsPage() {
  interface Payment {
    _id: string;
    roomId: { roomNumber: string };
    month: number;
    year: number;
    totalAmount: number;
    status: "pending" | "paid" | "overdue";
    paymentDate?: string;
  }

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/payments");

      if (!res.ok) {
        console.error("Failed to fetch payments");
        setPayments([]);
        return;
      }

      const data = await res.json();

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
    if (!confirm("ยืนยันว่าตรวจสอบสลิปถูกต้องแล้ว?")) return;
    alert(`ยืนยันการชำระเงิน ID: ${id} เรียบร้อย (Demo)`);
  };

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchSearch =
      payment.roomId?.roomNumber.includes(searchTerm) ||
      payment.month.toString().includes(searchTerm);
    const matchStatus = !filterStatus || payment.status === filterStatus;

    return matchSearch && matchStatus;
  });

  // Calculate stats
  const stats = {
    total: payments.length,
    pending: payments.filter((p) => p.status === "pending").length,
    paid: payments.filter((p) => p.status === "paid").length,
    totalAmount: payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.totalAmount, 0),
  };

  if (loading) {
    return (
      <div className="payments-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>กำลังโหลดรายการชำระเงิน...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payments-container">
      {/* Modals */}
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

      {/* Header */}
      <div className="header-flex">
        <div>
          <h1 className="page-title">💰 รายการชำระเงิน</h1>
          <p style={{ color: "#666", marginTop: "4px" }}>
            จัดการการชำระเงินค่าห้องและสาธารณูปโภค
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => setShowScanner(true)}
            className="btn-create-bill"
            style={{ backgroundColor: "#6f42c1" }}
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

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-box">
          <div className="stat-label">🏦 ทั้งหมด</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-subtitle">รายการ</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">⏳ รอตรวจสอบ</div>
          <div className="stat-value" style={{ color: "#ff9800" }}>
            {stats.pending}
          </div>
          <div className="stat-subtitle">รายการ</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">✓ ชำระแล้ว</div>
          <div className="stat-value" style={{ color: "#28a745" }}>
            {stats.paid}
          </div>
          <div className="stat-subtitle">รายการ</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">💵 รายได้</div>
          <div className="stat-value" style={{ fontSize: "24px" }}>
            ฿{stats.totalAmount.toLocaleString()}
          </div>
          <div className="stat-subtitle">ชำระแล้ว</div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <input
          type="text"
          className="filter-input"
          placeholder="ค้นหาเลขห้อง..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">ทุกสถานะ</option>
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
                    <span className="room-number">
                      #{pay.roomId?.roomNumber || "ไม่ระบุ"}
                    </span>
                  </td>
                  <td>
                    {pay.month}/{pay.year}
                  </td>
                  <td>
                    <span className="amount">
                      <span className="amount-currency">฿</span>
                      {pay.totalAmount?.toLocaleString() || 0}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${pay.status}`}>
                      {pay.status === "pending"
                        ? "รอตรวจสอบ"
                        : pay.status === "paid"
                        ? "ชำระแล้ว"
                        : "เกินกำหนด"}
                    </span>
                  </td>
                  <td>
                    {pay.paymentDate
                      ? new Date(pay.paymentDate).toLocaleDateString("th-TH")
                      : "-"}
                  </td>
                  <td>
                    {pay.status === "pending" ? (
                      <button
                        onClick={() => handleApprove(pay._id)}
                        className="btn-check"
                      >
                        ✓ ตรวจสอบ
                      </button>
                    ) : (
                      <span style={{ color: "#28a745", fontSize: "12px" }}>
                        ✓ เรียบร้อย
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