"use client";

import { useState } from "react";
import "./utilities.css";

interface Bill {
  id: string;
  type: "water" | "electricity";
  month: string;
  year: number;
  usage: number;
  unit: string;
  unitPrice: number;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  paidDate?: string;
}

const mockBills: Bill[] = [
  {
    id: "BILL001",
    type: "water",
    month: "พฤศจิกายน",
    year: 2025,
    usage: 25,
    unit: "ลบ.ม.",
    unitPrice: 12,
    amount: 300,
    status: "pending",
    dueDate: "2025-12-05",
  },
  {
    id: "BILL002",
    type: "electricity",
    month: "พฤศจิกายน",
    year: 2025,
    usage: 180,
    unit: "kWh",
    unitPrice: 5.5,
    amount: 990,
    status: "pending",
    dueDate: "2025-12-05",
  },
  {
    id: "BILL003",
    type: "water",
    month: "ตุลาคม",
    year: 2025,
    usage: 20,
    unit: "ลบ.ม.",
    unitPrice: 12,
    amount: 240,
    status: "paid",
    dueDate: "2025-11-05",
    paidDate: "2025-11-03",
  },
  {
    id: "BILL004",
    type: "electricity",
    month: "ตุลาคม",
    year: 2025,
    usage: 160,
    unit: "kWh",
    unitPrice: 5.5,
    amount: 880,
    status: "paid",
    dueDate: "2025-11-05",
    paidDate: "2025-11-02",
  },
  {
    id: "BILL005",
    type: "water",
    month: "กันยายน",
    year: 2025,
    usage: 22,
    unit: "ลบ.ม.",
    unitPrice: 12,
    amount: 264,
    status: "overdue",
    dueDate: "2025-10-05",
    paidDate: undefined,
  },
];

export default function UtilitiesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [searchMonth, setSearchMonth] = useState("");
  const [bills, setBills] = useState<Bill[]>(mockBills);

  const filteredBills = bills.filter((bill) => {
    if (activeTab === "all") return true;
    if (activeTab === "water") return bill.type === "water";
    if (activeTab === "electricity") return bill.type === "electricity";
    if (activeTab === "pending") return bill.status === "pending";
    if (activeTab === "paid") return bill.status === "paid";
    return true;
  });

  const waterBills = bills.filter((b) => b.type === "water");
  const electricityBills = bills.filter((b) => b.type === "electricity");
  const pendingBills = bills.filter((b) => b.status === "pending");
  const totalPending = pendingBills.reduce((sum, b) => sum + b.amount, 0);

  const handlePaymentClick = (bill: Bill) => {
    if (bill.status !== "paid") {
      setSelectedBill(bill);
      setShowPaymentModal(true);
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBill) {
      setBills(
        bills.map((bill) =>
          bill.id === selectedBill.id
            ? {
                ...bill,
                status: "paid" as const,
                paidDate: new Date().toISOString().split("T")[0],
              }
            : bill
        )
      );
      setShowPaymentModal(false);
      setSelectedBill(null);
      alert("ชำระเงินสำเร็จ!");
    }
  };

  const getLatestWaterBill = () =>
    waterBills.sort(
      (a, b) =>
        new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    )[0];
  const getLatestElectricityBill = () =>
    electricityBills.sort(
      (a, b) =>
        new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    )[0];

  return (
    <div className="utilities-container">
      <div className="utilities-header">
        <h1>💰 จ่ายค่าน้ำ ค่าไฟฟ้า</h1>
        <p>จัดการและชำระค่าสาธารณูปโภค</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        {getLatestWaterBill() && (
          <div className="summary-card water">
            <div className="card-icon">💧</div>
            <div className="card-title">ค่าน้ำ</div>
            <div className="card-amount">
              ฿{getLatestWaterBill()?.amount.toLocaleString()}
            </div>
            <div className="card-unit">
              {getLatestWaterBill()?.usage} {getLatestWaterBill()?.unit}
            </div>
            <span
              className={`card-status status-${getLatestWaterBill()?.status}`}
            >
              {getLatestWaterBill()?.status === "paid"
                ? "ชำระแล้ว"
                : getLatestWaterBill()?.status === "pending"
                ? "ยังไม่ชำระ"
                : "เกินกำหนด"}
            </span>
          </div>
        )}

        {getLatestElectricityBill() && (
          <div className="summary-card electricity">
            <div className="card-icon">⚡</div>
            <div className="card-title">ค่าไฟฟ้า</div>
            <div className="card-amount">
              ฿{getLatestElectricityBill()?.amount.toLocaleString()}
            </div>
            <div className="card-unit">
              {getLatestElectricityBill()?.usage} {getLatestElectricityBill()?.unit}
            </div>
            <span
              className={`card-status status-${getLatestElectricityBill()?.status}`}
            >
              {getLatestElectricityBill()?.status === "paid"
                ? "ชำระแล้ว"
                : getLatestElectricityBill()?.status === "pending"
                ? "ยังไม่ชำระ"
                : "เกินกำหนด"}
            </span>
          </div>
        )}

        <div className="summary-card">
          <div className="card-icon">📋</div>
          <div className="card-title">ยอดค้างชำระ</div>
          <div className="card-amount">
            ฿{totalPending.toLocaleString()}
          </div>
          <div className="card-unit">{pendingBills.length} รายการ</div>
          <span className="card-status status-pending">รอการชำระ</span>
        </div>
      </div>

      <div className="utilities-content">
        {/* Tabs */}
        <div className="utilities-tabs">
          <button
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            📋 ทั้งหมด
          </button>
          <button
            className={`tab-btn ${activeTab === "water" ? "active" : ""}`}
            onClick={() => setActiveTab("water")}
          >
            💧 ค่าน้ำ
          </button>
          <button
            className={`tab-btn ${activeTab === "electricity" ? "active" : ""}`}
            onClick={() => setActiveTab("electricity")}
          >
            ⚡ ค่าไฟ
          </button>
          <button
            className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            ⏳ ยังไม่ชำระ
          </button>
          <button
            className={`tab-btn ${activeTab === "paid" ? "active" : ""}`}
            onClick={() => setActiveTab("paid")}
          >
            ✅ ชำระแล้ว
          </button>
        </div>

        {/* Bills Section */}
        <div className="bills-section">
          <h2 className="section-title">📄 ประวัติค่าสาธารณูปโภค</h2>

          {filteredBills.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table className="bills-table">
                <thead>
                  <tr>
                    <th>ประเภท</th>
                    <th>เดือน/ปี</th>
                    <th>การใช้งาน</th>
                    <th>หน่วยละ (บาท)</th>
                    <th>จำนวนเงิน</th>
                    <th>สถานะ</th>
                    <th>วันที่ครบกำหนด</th>
                    <th>การกระทำ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((bill) => (
                    <tr key={bill.id}>
                      <td>
                        <span className="bill-type" style={{
                          paddingLeft: "0"
                        }}>
                          {bill.type === "water" ? "ค่าน้ำ" : "ค่าไฟฟ้า"}
                        </span>
                      </td>
                      <td>
                        {bill.month} {bill.year}
                      </td>
                      <td>
                        {bill.usage} {bill.unit}
                      </td>
                      <td>฿{bill.unitPrice}</td>
                      <td className="amount-due">
                        ฿{bill.amount.toLocaleString()}
                      </td>
                      <td>
                        <span className={`status-badge ${bill.status}`}>
                          {bill.status === "paid"
                            ? "ชำระแล้ว"
                            : bill.status === "pending"
                            ? "ยังไม่ชำระ"
                            : "เกินกำหนด"}
                        </span>
                      </td>
                      <td>{bill.dueDate}</td>
                      <td>
                        <button
                          className="action-btn"
                          onClick={() => handlePaymentClick(bill)}
                          disabled={bill.status === "paid"}
                        >
                          {bill.status === "paid" ? "ชำระแล้ว" : "ชำระเงิน"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>ไม่มีข้อมูล</h3>
              <p>ไม่พบรายการตามการค้นหา</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <div className={`modal ${showPaymentModal ? "active" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">
            {selectedBill?.type === "water" ? "💧" : "⚡"} ชำระค่า
            {selectedBill?.type === "water" ? "น้ำ" : "ไฟฟ้า"}
          </div>

          <div className="payment-details">
            <div className="detail-row">
              <span>เดือน:</span>
              <strong>
                {selectedBill?.month} {selectedBill?.year}
              </strong>
            </div>
            <div className="detail-row">
              <span>การใช้งาน:</span>
              <strong>
                {selectedBill?.usage} {selectedBill?.unit}
              </strong>
            </div>
            <div className="detail-row">
              <span>หน่วยละ:</span>
              <strong>฿{selectedBill?.unitPrice}</strong>
            </div>
            <div className="detail-row">
              <span>จำนวนเงินทั้งสิ้น:</span>
              <strong style={{ color: "#667eea", fontSize: "18px" }}>
                ฿{selectedBill?.amount.toLocaleString()}
              </strong>
            </div>
          </div>

          <form onSubmit={handlePayment}>
            <div className="form-group">
              <label>วิธีการชำระเงิน</label>
              <select required defaultValue="">
                <option value="">-- เลือกวิธีการชำระเงิน --</option>
                <option value="bank-transfer">โอนธนาคาร</option>
                <option value="credit-card">บัตรเครดิต</option>
                <option value="debit-card">บัตรเดบิต</option>
                <option value="qr-code">QR Code</option>
                <option value="cash">เงินสด</option>
              </select>
            </div>

            <div className="form-group">
              <label>เลขที่การอ้างอิง (ถ้ามี)</label>
              <input
                type="text"
                placeholder="กรอกเลขที่การอ้างอิง..."
              />
            </div>

            <div className="form-group">
              <label>หมายเหตุ</label>
              <input
                type="text"
                placeholder="เพิ่มหมายเหตุ (ไม่บังคับ)..."
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowPaymentModal(false)}
              >
                ยกเลิก
              </button>
              <button type="submit" className="btn-submit">
                ยืนยันการชำระเงิน
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}