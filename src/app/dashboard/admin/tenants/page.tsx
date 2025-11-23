"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./tenants.css";

export default function TenantsPage() {
  interface Tenant {
    _id: string;
    name: string;
    phone: string;
    email: string;
    roomNumber: string;
    floor: number;
    status: "active" | "inactive";
    paymentStatus: "paid" | "unpaid" | "partial";
    checkInDate: string;
    leaseEndDate: string;
  }

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Mock Data
  const mockTenants: Tenant[] = [
    {
      _id: "1",
      name: "นายสมชาย มงคลสิทธิ",
      phone: "089-xxx-xxxx",
      email: "somchai@email.com",
      roomNumber: "401",
      floor: 4,
      status: "active",
      paymentStatus: "paid",
      checkInDate: "2024-06-15",
      leaseEndDate: "2025-12-15",
    },
    {
      _id: "2",
      name: "นางสาวมลัย สุขสวัสดิ์",
      phone: "087-xxx-xxxx",
      email: "malay@email.com",
      roomNumber: "302",
      floor: 3,
      status: "active",
      paymentStatus: "partial",
      checkInDate: "2024-08-20",
      leaseEndDate: "2025-11-20",
    },
    {
      _id: "3",
      name: "นายวิชัย ศรีประเสริฐ",
      phone: "086-xxx-xxxx",
      email: "wichai@email.com",
      roomNumber: "501",
      floor: 5,
      status: "active",
      paymentStatus: "paid",
      checkInDate: "2024-01-10",
      leaseEndDate: "2026-01-10",
    },
    {
      _id: "4",
      name: "นางสาวสินี ศรีสวัสดิ์",
      phone: "085-xxx-xxxx",
      email: "sinee@email.com",
      roomNumber: "201",
      floor: 2,
      status: "active",
      paymentStatus: "unpaid",
      checkInDate: "2024-10-05",
      leaseEndDate: "2025-10-05",
    },
    {
      _id: "5",
      name: "นายอนันต์ วงศ์วัฒนา",
      phone: "088-xxx-xxxx",
      email: "anant@email.com",
      roomNumber: "305",
      floor: 3,
      status: "inactive",
      paymentStatus: "unpaid",
      checkInDate: "2023-05-20",
      leaseEndDate: "2025-05-20",
    },
    {
      _id: "6",
      name: "นางนิลาวัน สุขเกษม",
      phone: "089-xxx-xxxx",
      email: "nilawan@email.com",
      roomNumber: "102",
      floor: 1,
      status: "active",
      paymentStatus: "paid",
      checkInDate: "2024-09-10",
      leaseEndDate: "2025-12-10",
    },
  ];

  // Fetch Data
  const fetchTenants = async () => {
    try {
      // Mock data
      setTenants(mockTenants);
    } catch (error) {
      console.error("Error fetching tenants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  // Delete Tenant
  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบผู้เช่านี้?")) return;

    try {
      setTenants(tenants.filter((tenant) => tenant._id !== id));
      alert("ลบผู้เช่าสำเร็จ");
    } catch (error) {
      console.error("Error deleting:", error);
      alert("เกิดข้อผิดพลาดในการลบ");
    }
  };

  // Filter Tenants
  const filteredTenants = tenants.filter((tenant) => {
    const matchSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.phone.includes(searchTerm) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.roomNumber.includes(searchTerm);

    const matchStatus = !filterStatus || tenant.status === filterStatus;
    const matchPayment = !filterPayment || tenant.paymentStatus === filterPayment;

    return matchSearch && matchStatus && matchPayment;
  });

  // Get Label
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: "ใช้งาน",
      inactive: "ไม่ใช้งาน",
    };
    return labels[status] || status;
  };

  const getPaymentLabel = (status: string) => {
    const labels: Record<string, string> = {
      paid: "ชำระแล้ว",
      unpaid: "ยังไม่ชำระ",
      partial: "ชำระบางส่วน",
    };
    return labels[status] || status;
  };

  // Stats
  const stats = {
    total: tenants.length,
    active: tenants.filter((t) => t.status === "active").length,
    paid: tenants.filter((t) => t.paymentStatus === "paid").length,
  };

  if (loading) {
    return (
      <div className="tenants-container">
        <div className="loading">
          <div className="loading-spinner"></div>
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
        <Link href="/dashboard/admin/tenants/new" className="btn-add-tenant">
          ➕ เพิ่มผู้เช่า
        </Link>
      </div>

      {/* Stats */}
      <div className="tenants-stats">
        <div className="stat-card">
          <div className="stat-label">ผู้เช่าทั้งหมด</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-change">คน</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">ผู้เช่าใช้งาน</div>
          <div className="stat-value">{stats.active}</div>
          <div className="stat-change">✓ ใช้งาน</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">ชำระแล้ว</div>
          <div className="stat-value">{stats.paid}</div>
          <div className="stat-change">✓ ครบถ้วน</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <input
          type="text"
          className="filter-input"
          placeholder="ค้นหาชื่อ โทรศัพท์ อีเมล..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">ทุกสถานะ</option>
          <option value="active">ใช้งาน</option>
          <option value="inactive">ไม่ใช้งาน</option>
        </select>

        <select
          className="filter-select"
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value)}
        >
          <option value="">ทุกสถานะชำระเงิน</option>
          <option value="paid">ชำระแล้ว</option>
          <option value="unpaid">ยังไม่ชำระ</option>
          <option value="partial">ชำระบางส่วน</option>
        </select>
      </div>

      {/* View Toggle */}
      <div className="view-toggle">
        <button
          className={`toggle-btn ${viewMode === "table" ? "active" : ""}`}
          onClick={() => setViewMode("table")}
        >
          📊 ตารางข้อมูล
        </button>
        <button
          className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
          onClick={() => setViewMode("grid")}
        >
          📋 แบบการ์ด
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
                <th>เลิกสัญญา</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px 20px" }}>
                    <div className="empty-state">
                      <div className="empty-icon">👥</div>
                      <h3>ไม่มีผู้เช่า</h3>
                      <p>ไม่พบผู้เช่าที่ตรงกับการค้นหา</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => (
                  <tr key={tenant._id}>
                    <td>
                      <div className="tenant-info">
                        <div className="tenant-avatar">
                          {tenant.name.charAt(0)}
                        </div>
                        <div className="tenant-details">
                          <h4>{tenant.name}</h4>
                          <p>{tenant.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="room-badge">
                        #{tenant.roomNumber}
                      </span>
                    </td>
                    <td>{tenant.phone}</td>
                    <td>
                      <span className={`status-badge status-${tenant.status}`}>
                        {getStatusLabel(tenant.status)}
                      </span>
                    </td>
                    <td>
                      <span className={`payment-status payment-${tenant.paymentStatus}`}>
                        {getPaymentLabel(tenant.paymentStatus)}
                      </span>
                    </td>
                    <td>{new Date(tenant.leaseEndDate).toLocaleDateString('th-TH')}</td>
                    <td>
                      <div className="actions-cell">
                        <Link
                          href={`/dashboard/admin/tenants/${tenant._id}`}
                          className="action-btn btn-view"
                        >
                          👁️ ดู
                        </Link>
                        <Link
                          href={`/dashboard/admin/tenants/${tenant._id}/edit`}
                          className="action-btn btn-edit"
                        >
                          ✏️ แก้ไข
                        </Link>
                        <button
                          onClick={() => handleDelete(tenant._id)}
                          className="action-btn btn-delete"
                        >
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
          {filteredTenants.length === 0 ? (
            <div style={{ gridColumn: "1 / -1" }}>
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <h3>ไม่มีผู้เช่า</h3>
                <p>ไม่พบผู้เช่าที่ตรงกับการค้นหา</p>
              </div>
            </div>
          ) : (
            filteredTenants.map((tenant) => (
              <div key={tenant._id} className="tenant-card">
                <div className="tenant-card-header">
                  <div className="card-avatar">{tenant.name.charAt(0)}</div>
                  <div className="card-name">{tenant.name}</div>
                  <div className="card-phone">{tenant.phone}</div>
                </div>

                <div className="tenant-card-body">
                  <div className="card-info-item">
                    <span className="info-label">ห้องพัก</span>
                    <span className="info-value">#{tenant.roomNumber}</span>
                  </div>

                  <div className="card-info-item">
                    <span className="info-label">อีเมล</span>
                    <span className="info-value" style={{ fontSize: "11px" }}>
                      {tenant.email}
                    </span>
                  </div>

                  <div className="card-info-item">
                    <span className="info-label">สถานะ</span>
                    <span className={`status-badge status-${tenant.status}`}>
                      {getStatusLabel(tenant.status)}
                    </span>
                  </div>

                  <div className="card-info-item">
                    <span className="info-label">ชำระเงิน</span>
                    <span className={`payment-status payment-${tenant.paymentStatus}`}>
                      {getPaymentLabel(tenant.paymentStatus)}
                    </span>
                  </div>

                  <div className="card-info-item">
                    <span className="info-label">เลิกสัญญา</span>
                    <span className="info-value">
                      {new Date(tenant.leaseEndDate).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                </div>

                <div className="tenant-card-footer">
                  <Link
                    href={`/dashboard/admin/tenants/${tenant._id}`}
                    className="action-btn btn-view"
                  >
                    👁️ ดู
                  </Link>
                  <Link
                    href={`/dashboard/admin/tenants/${tenant._id}/edit`}
                    className="action-btn btn-edit"
                  >
                    ✏️ แก้ไข
                  </Link>
                  <button
                    onClick={() => handleDelete(tenant._id)}
                    className="action-btn btn-delete"
                  >
                    🗑️ ลบ
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}