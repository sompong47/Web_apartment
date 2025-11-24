"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./tenants.css";

export default function AdminTenantsPage() {
  // 1. สร้าง Interface ให้ตรงกับข้อมูลจริง
  interface Tenant {
    _id: string;
    userId: {
      name: string;
      email: string;
      phone: string;
    };
    roomId: {
      roomNumber: string;
      floor: number;
    };
    status: "active" | "terminated"; // ใน DB เก็บเป็น terminated แทน inactive
    paymentStatus?: "paid" | "unpaid" | "partial"; // (อันนี้ต้องจอยกับ Payment จริงๆ แต่ตอนนี้ Mock ไปก่อน)
    startDate: string;
    endDate?: string;
  }

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // 2. ดึงข้อมูลจาก API จริง
  const fetchTenants = async () => {
    try {
      const res = await fetch("/api/tenants");
      const data = await res.json();
      
      if (Array.isArray(data)) {
        // แปลงข้อมูลให้ใช้ง่ายขึ้น (เพราะ DB ซ้อน Object)
        // เพิ่ม Mock Payment Status ไปก่อน เพราะใน Tenant Schema ไม่มี field นี้
        const mappedData = data.map((t: any) => ({
          ...t,
          paymentStatus: Math.random() > 0.3 ? 'paid' : 'unpaid' // จำลองสถานะจ่ายเงิน
        }));
        setTenants(mappedData);
      }
    } catch (error) {
      console.error("Error fetching tenants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  // 3. ฟังก์ชันลบผู้เช่า
  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบผู้เช่านี้?")) return;

    try {
      const res = await fetch(`/api/tenants/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("ลบผู้เช่าสำเร็จ");
        // อัปเดตหน้าจอโดยไม่ต้องโหลดใหม่
        setTenants(tenants.filter((tenant) => tenant._id !== id));
      } else {
        alert("เกิดข้อผิดพลาดในการลบ");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };

  // 4. ระบบค้นหาและกรอง
  const filteredTenants = tenants.filter((tenant) => {
    const name = tenant.userId?.name || "";
    const email = tenant.userId?.email || "";
    const phone = tenant.userId?.phone || "";
    const room = tenant.roomId?.roomNumber || "";

    const matchSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm) ||
      room.includes(searchTerm);

    // แปลง status จาก DB (active/terminated) ให้เข้ากับ Filter (active/inactive)
    const currentStatus = tenant.status === 'active' ? 'active' : 'inactive';
    const matchStatus = !filterStatus || currentStatus === filterStatus;
    
    const matchPayment = !filterPayment || tenant.paymentStatus === filterPayment;

    return matchSearch && matchStatus && matchPayment;
  });

  // Helper Functions
  const getStatusLabel = (status: string) => {
    if (status === 'active') return 'เช่าอยู่';
    if (status === 'terminated') return 'ย้ายออก';
    return status;
  };

  const getPaymentLabel = (status: string) => {
    if (status === 'paid') return 'ชำระแล้ว';
    if (status === 'unpaid') return 'ค้างชำระ';
    return status;
  };

  // Stats (คำนวณจากข้อมูลจริง)
  const stats = {
    total: tenants.length,
    active: tenants.filter((t) => t.status === "active").length,
    paid: tenants.filter((t) => t.paymentStatus === "paid").length,
  };

  if (loading) {
    return (
      <div className="tenants-container">
        <div className="loading" style={{textAlign: 'center', padding: '50px', color: '#666'}}>
          <div className="loading-spinner">⏳</div>
          <p>กำลังโหลดข้อมูลผู้เช่า...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tenants-container">
      {/* Header */}
      <div className="tenants-header">
        <h1 className="page-title">👥 จัดการผู้เช่า</h1>
        {/* ปุ่มนี้จะลิงก์ไปหน้าสร้างผู้เช่า (ถ้ายังไม่มีหน้า new ให้สร้างเพิ่มทีหลัง) */}
        <Link href="/dashboard/admin/tenants/new" className="btn-add-tenant">
          ➕ เพิ่มผู้เช่า
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="tenants-stats">
        <div className="stat-card">
          <div className="stat-label">ผู้เช่าทั้งหมด</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-change">คน</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">ผู้เช่าปัจจุบัน</div>
          <div className="stat-value" style={{color: '#007bff'}}>{stats.active}</div>
          <div className="stat-change">✓ Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">ชำระแล้ว (เดือนนี้)</div>
          <div className="stat-value" style={{color: '#28a745'}}>{stats.paid}</div>
          <div className="stat-change">บิลล่าสุด</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <input
          type="text"
          className="filter-input"
          placeholder="ค้นหาชื่อ, ห้อง, เบอร์โทร..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">ทุกสถานะสัญญา</option>
          <option value="active">เช่าอยู่</option>
          <option value="inactive">ย้ายออกแล้ว</option>
        </select>
        <select
          className="filter-select"
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value)}
        >
          <option value="">สถานะการเงิน</option>
          <option value="paid">ชำระแล้ว</option>
          <option value="unpaid">ค้างชำระ</option>
        </select>
      </div>

      {/* View Toggle */}
      <div className="view-toggle">
        <button
          className={`toggle-btn ${viewMode === "table" ? "active" : ""}`}
          onClick={() => setViewMode("table")}
        >
          📊 ตาราง
        </button>
        <button
          className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
          onClick={() => setViewMode("grid")}
        >
          📋 การ์ด
        </button>
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <div className="tenants-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ผู้เช่า</th>
                <th>ห้อง</th>
                <th>โทรศัพท์</th>
                <th>สถานะ</th>
                <th>ชำระเงิน</th>
                <th>เริ่มสัญญา</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>
                    <div className="empty-state">
                      <div className="empty-icon">👥</div>
                      <p>ไม่พบข้อมูลผู้เช่า</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => (
                  <tr key={tenant._id}>
                    <td>
                      <div className="tenant-info">
                        <div className="tenant-avatar">
                          {tenant.userId?.name?.charAt(0) || "?"}
                        </div>
                        <div className="tenant-details">
                          <h4>{tenant.userId?.name || "ไม่ระบุชื่อ"}</h4>
                          <p>{tenant.userId?.email || "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="room-badge">#{tenant.roomId?.roomNumber || "-"}</span>
                    </td>
                    <td>{tenant.userId?.phone || "-"}</td>
                    <td>
                      <span className={`status-badge ${tenant.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                        {getStatusLabel(tenant.status)}
                      </span>
                    </td>
                    <td>
                      <span className={`payment-status payment-${tenant.paymentStatus}`}>
                        {getPaymentLabel(tenant.paymentStatus || "")}
                      </span>
                    </td>
                    <td>{new Date(tenant.startDate).toLocaleDateString('th-TH')}</td>
                    <td>
                      <div className="actions-cell">
                        <button onClick={() => handleDelete(tenant._id)} className="action-btn btn-delete">
                          🗑️ ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="tenants-grid">
          {filteredTenants.map((tenant) => (
            <div key={tenant._id} className="tenant-card">
              <div className="tenant-card-header">
                <div className="card-avatar">{tenant.userId?.name?.charAt(0)}</div>
                <div className="card-name">{tenant.userId?.name}</div>
                <div className="card-phone">{tenant.userId?.phone}</div>
              </div>
              <div className="tenant-card-body">
                <div className="card-info-item">
                  <span className="info-label">ห้องพัก</span>
                  <span className="info-value">#{tenant.roomId?.roomNumber}</span>
                </div>
                <div className="card-info-item">
                  <span className="info-label">สถานะ</span>
                  <span className={`status-badge ${tenant.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                    {getStatusLabel(tenant.status)}
                  </span>
                </div>
                <div className="card-info-item">
                  <span className="info-label">เริ่มสัญญา</span>
                  <span className="info-value">{new Date(tenant.startDate).toLocaleDateString('th-TH')}</span>
                </div>
              </div>
              <div className="tenant-card-footer">
                 <button onClick={() => handleDelete(tenant._id)} className="action-btn btn-delete" style={{width: '100%'}}>
                    ลบข้อมูล
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}