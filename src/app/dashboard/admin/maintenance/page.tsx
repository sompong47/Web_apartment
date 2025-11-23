"use client";

import { useState } from "react";
import "./admin-maintenance.css";

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed" | "rejected";
  createdDate: string;
  updatedDate: string;
  tenantName: string;
  roomNumber: string;
  assignedTo?: string;
}

const mockData: MaintenanceRequest[] = [
  {
    id: "MNT001",
    title: "ซ่อมท่อน้ำแตก",
    description: "ท่อน้ำหนึ่งแตกในห้องน้ำ ต้องซ่อมเร่งด่วน",
    category: "เครื่องประปา",
    priority: "high",
    status: "in-progress",
    createdDate: "2025-11-20",
    updatedDate: "2025-11-21",
    tenantName: "นายสมชาย",
    roomNumber: "401",
    assignedTo: "สมชาย ช่างประปา",
  },
  {
    id: "MNT002",
    title: "เปลี่ยนหลอดไฟ",
    description: "หลอดไฟในทางเดินหลักไม่สว่าง",
    category: "ไฟฟ้า",
    priority: "low",
    status: "pending",
    createdDate: "2025-11-21",
    updatedDate: "2025-11-21",
    tenantName: "นางสาวมลัย",
    roomNumber: "302",
  },
  {
    id: "MNT003",
    title: "ทำความสะอาดท่อระบายน้ำ",
    description: "ท่อระบายน้ำอุดตันท้อนน้ำเสื่อม",
    category: "ท่อระบายน้ำ",
    priority: "medium",
    status: "completed",
    createdDate: "2025-11-15",
    updatedDate: "2025-11-19",
    tenantName: "นายวิชัย",
    roomNumber: "501",
    assignedTo: "สมศรี ช่างท่อ",
  },
  {
    id: "MNT004",
    title: "ซ่อมกุญแจประตู",
    description: "กุญแจประตูหน้าหอพักใช้ไม่ได้",
    category: "ประตูหน้าต่าง",
    priority: "high",
    status: "pending",
    createdDate: "2025-11-22",
    updatedDate: "2025-11-22",
    tenantName: "นางสาวสินี",
    roomNumber: "201",
  },
  {
    id: "MNT005",
    title: "ซ่อมแอร์",
    description: "แอร์ในห้องไม่เย็น",
    category: "เครื่องปรับอากาศ",
    priority: "medium",
    status: "in-progress",
    createdDate: "2025-11-21",
    updatedDate: "2025-11-22",
    tenantName: "นายอนันต์",
    roomNumber: "305",
    assignedTo: "นิคม ช่างหลวม",
  },
];

export default function AdminMaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockData);
  const [activeTab, setActiveTab] = useState("all");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [assignmentForm, setAssignmentForm] = useState({ assigned: "", note: "" });

  const filteredRequests = requests.filter((req) => {
    const matchesTab = activeTab === "all" || req.status === activeTab;
    const matchesSearch =
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.tenantName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    inProgress: requests.filter((r) => r.status === "in-progress").length,
    completed: requests.filter((r) => r.status === "completed").length,
  };

  const handleAssignClick = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setAssignmentForm({ assigned: "", note: "" });
    setShowAssignModal(true);
  };

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRequest && assignmentForm.assigned) {
      setRequests(
        requests.map((req) =>
          req.id === selectedRequest.id
            ? {
                ...req,
                status: "in-progress" as const,
                assignedTo: assignmentForm.assigned,
                updatedDate: new Date().toISOString().split("T")[0],
              }
            : req
        )
      );
      setShowAssignModal(false);
      setSelectedRequest(null);
      alert("มอบหมายการซ่อมสำเร็จ!");
    }
  };

  const handleComplete = (id: string) => {
    if (confirm("ยืนยันว่าการซ่อมนี้เสร็จสิ้นหรือไม่?")) {
      setRequests(
        requests.map((req) =>
          req.id === id 
            ? { 
                ...req, 
                status: "completed" as const,
                updatedDate: new Date().toISOString().split("T")[0],
              } 
            : req
        )
      );
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "รอการอนุมัติ",
      "in-progress": "กำลังดำเนินการ",
      completed: "เสร็จสิ้น",
      rejected: "ปฏิเสธ",
    };
    return labels[status] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: "ต่ำ",
      medium: "ปานกลาง",
      high: "สูง",
    };
    return labels[priority] || priority;
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🔧 จัดการแจ้งซ่อม</h1>
        <p>ติดตามและจัดการรายการแจ้งซ่อมของผู้เช่า</p>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-label">รายการทั้งหมด</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-change">ทั้งหมด</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-label">รอการอนุมัติ</div>
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-change">ต้องดำเนินการ</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-label">กำลังดำเนินการ</div>
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-change">อยู่ระหว่างการซ่อม</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">เสร็จสิ้น</div>
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-change">สำเร็จแล้ว</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="filter-input"
            placeholder="ค้นหาเลขที่, ชื่อเรื่อง, ชื่อผู้เช่า..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          ทั้งหมด
        </button>
        <button
          className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          รอการอนุมัติ
        </button>
        <button
          className={`tab-btn ${activeTab === "in-progress" ? "active" : ""}`}
          onClick={() => setActiveTab("in-progress")}
        >
          กำลังดำเนินการ
        </button>
        <button
          className={`tab-btn ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          เสร็จสิ้น
        </button>
      </div>

      {/* Maintenance List */}
      <div className="maintenance-section">
        <h2 className="section-title">📄 รายการแจ้งซ่อม</h2>

        <div className="maintenance-list">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <div key={request.id} className="maintenance-item">
                <div className="item-left">
                  <div className="item-id">{request.id}</div>
                  <div className="item-title">{request.title}</div>
                  <div className="item-description">{request.description}</div>
                  <div className="item-meta">
                    <span className="meta-badge">👤 {request.tenantName}</span>
                    <span className="meta-badge">🏠 ห้อง {request.roomNumber}</span>
                    <span className="meta-badge">📁 {request.category}</span>
                    <span className="meta-badge">📅 {request.createdDate}</span>
                    {request.assignedTo && (
                      <span className="meta-badge">🔧 {request.assignedTo}</span>
                    )}
                  </div>
                </div>

                <div className="item-right">
                  <span className={`status-badge status-${request.status}`}>
                    {getStatusLabel(request.status)}
                  </span>
                  <span className={`priority-badge priority-${request.priority}`}>
                    {getPriorityLabel(request.priority)}
                  </span>

                  <div className="action-buttons">
                    {request.status === "pending" && !request.assignedTo && (
                      <button
                        className="btn-assign"
                        onClick={() => handleAssignClick(request)}
                      >
                        มอบหมาย
                      </button>
                    )}
                    {request.status === "in-progress" && request.assignedTo && (
                      <button
                        className="btn-complete"
                        onClick={() => handleComplete(request.id)}
                      >
                        เสร็จสิ้น
                      </button>
                    )}
                    <button className="btn-action-small">ดูรายละเอียด</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>ไม่มีรายการ</h3>
              <p>ไม่พบรายการแจ้งซ่อมตามการค้นหา</p>
            </div>
          )}
        </div>
      </div>

      {/* Assign Modal */}
      <div className={`modal ${showAssignModal ? "active" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">🔧 มอบหมายการซ่อม</div>

          <form onSubmit={handleAssign}>
            <div className="form-group">
              <label>รายการแจ้ง</label>
              <input
                type="text"
                value={selectedRequest?.title || ""}
                disabled
              />
            </div>

            <div className="form-group">
              <label>ผู้เช่า</label>
              <input
                type="text"
                value={`${selectedRequest?.tenantName} (ห้อง ${selectedRequest?.roomNumber})`}
                disabled
              />
            </div>

            <div className="form-group">
              <label>หมวดหมู่</label>
              <input
                type="text"
                value={selectedRequest?.category || ""}
                disabled
              />
            </div>

            <div className="form-group">
              <label>มอบหมายให้ช่าง *</label>
              <select
                value={assignmentForm.assigned}
                onChange={(e) =>
                  setAssignmentForm({ ...assignmentForm, assigned: e.target.value })
                }
                required
              >
                <option value="">-- เลือกช่าง --</option>
                <option value="สมชาย ช่างประปา">สมชาย ช่างประปา</option>
                <option value="สมศรี ช่างท่อ">สมศรี ช่างท่อ</option>
                <option value="วิชัย ช่างไฟฟ้า">วิชัย ช่างไฟฟ้า</option>
                <option value="นิคม ช่างหลวม">นิคม ช่างหลวม</option>
              </select>
            </div>

            <div className="form-group">
              <label>หมายเหตุ</label>
              <textarea
                placeholder="เพิ่มหมายเหตุหรือคำแนะนำ..."
                value={assignmentForm.note}
                onChange={(e) =>
                  setAssignmentForm({ ...assignmentForm, note: e.target.value })
                }
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowAssignModal(false)}
              >
                ยกเลิก
              </button>
              <button type="submit" className="btn-submit">
                ยืนยันการมอบหมาย
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}