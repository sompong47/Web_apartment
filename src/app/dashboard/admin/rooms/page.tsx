"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./rooms.css";

export default function AdminRoomsPage() {
  // Define Type ให้ตรงกับ Database จริง
  type Room = {
    _id: string;
    roomNumber: string;
    floor: number;
    type: "single" | "double" | "studio"; // หรือ string ถ้ามีแบบอื่น
    price: number;
    status: "available" | "occupied" | "maintenance";
  };

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFloor, setFilterFloor] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // 1. ดึงข้อมูลห้องจาก API จริง
  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setRooms(data);
      } else {
        setRooms([]);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // 2. ฟังก์ชันลบห้อง (ยิง API DELETE จริง)
  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบห้องนี้?")) return;

    try {
      const res = await fetch(`/api/rooms/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("ลบห้องสำเร็จ");
        // อัปเดต State โดยไม่ต้องโหลดใหม่
        setRooms(rooms.filter((room) => room._id !== id));
      } else {
        alert("เกิดข้อผิดพลาดในการลบ");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };

  // 3. ระบบค้นหาและกรอง
  const filteredRooms = rooms.filter((room) => {
    const matchSearch =
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.floor.toString().includes(searchTerm);
      
    const matchFloor = !filterFloor || room.floor.toString() === filterFloor;
    const matchStatus = !filterStatus || room.status === filterStatus;
    const matchType = !filterType || room.type === filterType;

    return matchSearch && matchFloor && matchStatus && matchType;
  });

  // Helper Functions
  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      single: "เตียงเดี่ยว",
      double: "เตียงคู่",
      studio: "สตูดิโอ",
    };
    return types[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const statuses: Record<string, string> = {
      available: "ว่าง",
      occupied: "ไม่ว่าง",
      maintenance: "ซ่อมบำรุง",
    };
    return statuses[status] || status;
  };

  // สร้างตัวเลือกชั้นจากข้อมูลที่มีจริง (หรือจะ Fix 1-5 ก็ได้)
  const floors = Array.from(new Set(rooms.map(r => r.floor))).sort((a, b) => a - b);

  if (loading) {
    return (
      <div className="rooms-container">
        <div className="loading" style={{textAlign: 'center', padding: '50px', color: '#666'}}>
          <div className="loading-spinner">🏠</div>
          <p>กำลังโหลดข้อมูลห้องพัก...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rooms-container">
      {/* Header */}
      <div className="header-flex">
        <h1 className="page-title">🏠 จัดการห้องพัก</h1>
        <Link href="/dashboard/admin/rooms/new" className="btn-add">
          ➕ เพิ่มห้องใหม่
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <input
          type="text"
          className="filter-input"
          placeholder="ค้นหาเลขห้อง..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          value={filterFloor}
          onChange={(e) => setFilterFloor(e.target.value)}
        >
          <option value="">ทั้งหมดชั้น</option>
          {floors.length > 0 ? floors.map((floor) => (
            <option key={floor} value={floor}>ชั้น {floor}</option>
          )) : <option value="1">ชั้น 1</option>}
        </select>

        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">ทุกประเภท</option>
          <option value="single">เตียงเดี่ยว</option>
          <option value="double">เตียงคู่</option>
          <option value="studio">สตูดิโอ</option>
        </select>

        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">ทุกสถานะ</option>
          <option value="available">ว่าง</option>
          <option value="occupied">ไม่ว่าง</option>
          <option value="maintenance">ซ่อมบำรุง</option>
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
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>เลขห้อง</th>
                <th>ชั้น</th>
                <th>ประเภท</th>
                <th>ราคา (บาท)</th>
                <th>สถานะ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px 20px" }}>
                    <div className="empty-state">
                      <div className="empty-icon">📭</div>
                      <h3>ไม่มีห้องพัก</h3>
                      <p>ไม่พบห้องที่ตรงกับการค้นหา</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => (
                  <tr key={room._id}>
                    <td>
                      <span className="room-number">#{room.roomNumber}</span>
                    </td>
                    <td>
                      <span className="room-floor">ชั้น {room.floor}</span>
                    </td>
                    <td>
                      <span className={`room-type type-${room.type}`}>
                        {getTypeLabel(room.type)}
                      </span>
                    </td>
                    <td>
                      <span className="price">
                        <span className="price-currency">฿</span>
                        {room.price.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${room.status}`}>
                        {getStatusLabel(room.status)}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <Link
                          href={`/dashboard/admin/rooms/${room._id}`}
                          className="action-btn btn-edit"
                        >
                          ✏️ แก้ไข
                        </Link>
                        <button
                          onClick={() => handleDelete(room._id)}
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
        <div className="rooms-grid">
          {filteredRooms.length === 0 ? (
            <div style={{ gridColumn: "1 / -1" }}>
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>ไม่มีห้องพัก</h3>
                <p>ไม่พบห้องที่ตรงกับการค้นหา</p>
              </div>
            </div>
          ) : (
            filteredRooms.map((room) => (
              <div key={room._id} className="room-card">
                <div className="room-card-header">
                  <div className="room-card-number">#{room.roomNumber}</div>
                  <div className="room-card-floor">ชั้น {room.floor}</div>
                </div>

                <div className="room-card-body">
                  <div className="card-info">
                    <div className="info-item">
                      <span className="info-label">ประเภท</span>
                      <span className={`room-type type-${room.type}`}>
                        {getTypeLabel(room.type)}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">ราคา</span>
                      <span className="info-value">
                        ฿{room.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">สถานะ</span>
                      <span className={`badge ${room.status}`}>
                        {getStatusLabel(room.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="room-card-footer">
                  <Link
                    href={`/dashboard/admin/rooms/${room._id}`}
                    className="action-btn btn-edit"
                  >
                    ✏️ แก้ไข
                  </Link>
                  <button
                    onClick={() => handleDelete(room._id)}
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