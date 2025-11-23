"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./rooms.css";

export default function AdminRoomsPage() {
  type Room = {
    _id: string;
    roomNumber: string;
    floor: number;
    type: "single" | "double" | "studio" | string;
    price: number;
    status: "available" | "occupied" | "maintenance" | string;
  };

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFloor, setFilterFloor] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // ฟังก์ชันดึงข้อมูลห้อง (Mock Data)
  const fetchRooms = async () => {
    try {
      // Mock data - ในจริงจะเรียก API
      const mockRooms: Room[] = [
        { _id: "1", roomNumber: "101", floor: 1, type: "single", price: 5000, status: "available" },
        { _id: "2", roomNumber: "102", floor: 1, type: "double", price: 8000, status: "occupied" },
        { _id: "3", roomNumber: "103", floor: 1, type: "studio", price: 6000, status: "available" },
        { _id: "4", roomNumber: "201", floor: 2, type: "single", price: 5000, status: "occupied" },
        { _id: "5", roomNumber: "202", floor: 2, type: "double", price: 8000, status: "available" },
        { _id: "6", roomNumber: "203", floor: 2, type: "studio", price: 6000, status: "maintenance" },
        { _id: "7", roomNumber: "301", floor: 3, type: "double", price: 9000, status: "occupied" },
        { _id: "8", roomNumber: "302", floor: 3, type: "studio", price: 7000, status: "available" },
        { _id: "9", roomNumber: "401", floor: 4, type: "single", price: 5500, status: "occupied" },
        { _id: "10", roomNumber: "501", floor: 5, type: "double", price: 10000, status: "available" },
      ];
      setRooms(mockRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // ฟังก์ชันลบห้อง
  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบห้องนี้?")) return;

    try {
      // Mock delete
      setRooms(rooms.filter((room: Room) => room._id !== id));
      alert("ลบห้องสำเร็จ");
    } catch (error) {
      console.error("Error deleting:", error);
      alert("เกิดข้อผิดพลาดในการลบ");
    }
  };

  // ฟังก์ชันกรองข้อมูล
  const filteredRooms = rooms.filter((room: Room) => {
    const matchSearch =
      room.roomNumber.includes(searchTerm) ||
      room.floor.toString().includes(searchTerm);
    const matchFloor = !filterFloor || room.floor.toString() === filterFloor;
    const matchStatus = !filterStatus || room.status === filterStatus;
    const matchType = !filterType || room.type === filterType;

    return matchSearch && matchFloor && matchStatus && matchType;
  });

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

  const floors = [1, 2, 3, 4, 5];

  if (loading) {
    return (
      <div className="rooms-container">
        <div className="loading">
          <div className="loading-spinner"></div>
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
          {floors.map((floor) => (
            <option key={floor} value={floor}>
              ชั้น {floor}
            </option>
          ))}
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
                filteredRooms.map((room: Room) => (
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
            filteredRooms.map((room: Room) => (
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