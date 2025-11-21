"use client";

import { useState } from "react";
import "./maintenance.css";

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed" | "rejected";
  createdDate: string;
  updatedDate: string;
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
    assignedTo: "สมศรี ช่างท่อ",
  },
];

export default function TenantMaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockData);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "เครื่องประปา",
    priority: "medium",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRequest: MaintenanceRequest = {
      id: `MNT${String(requests.length + 1).padStart(3, "0")}`,
      ...formData,
      priority: formData.priority as "low" | "medium" | "high",
      status: "pending",
      createdDate: new Date().toISOString().split("T")[0],
      updatedDate: new Date().toISOString().split("T")[0],
    };

    setRequests([newRequest, ...requests]);
    setFormData({
      title: "",
      description: "",
      category: "เครื่องประปา",
      priority: "medium",
    });
    setShowModal(false);
  };

  const handleCancel = (id: string) => {
    if (confirm("ยืนยันการยกเลิกการแจ้งซ่อมนี้?")) {
      setRequests(
        requests.map((req) =>
          req.id === id ? { ...req, status: "rejected" as const } : req
        )
      );
    }
  };

  const filteredRequests =
    filterStatus === "all"
      ? requests
      : requests.filter((req) => req.status === filterStatus);

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
    <div className="maintenance-container">
      <div className="maintenance-header">
        <h1>📋 แจ้งซ่อมอุปกรณ์</h1>
        <p>ประวัติและสถานะการแจ้งซ่อมของคุณ</p>
      </div>

      <div className="maintenance-actions">
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          ➕ แจ้งซ่อมใหม่
        </button>
      </div>

      <div className="filter-section">
        <div className="filter-group">
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="pending">รอการอนุมัติ</option>
            <option value="in-progress">กำลังดำเนินการ</option>
            <option value="completed">เสร็จสิ้น</option>
            <option value="rejected">ปฏิเสธ</option>
          </select>
        </div>
      </div>

      <div className="maintenance-list">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className={`maintenance-card ${request.status}`}
            >
              <div className="card-header">
                <h3 className="card-title">{request.title}</h3>
                <span className={`card-status status-${request.status}`}>
                  {getStatusLabel(request.status)}
                </span>
              </div>

              <div className="card-description">{request.description}</div>

              <div className="card-content">
                <div className="content-row">
                  <strong>เลขที่:</strong>
                  <span>{request.id}</span>
                </div>
                <div className="content-row">
                  <strong>หมวดหมู่:</strong>
                  <span>{request.category}</span>
                </div>
                <div className="content-row">
                  <strong>ความเร่งด่วน:</strong>
                  <span>{getPriorityLabel(request.priority)}</span>
                </div>
                <div className="content-row">
                  <strong>วันที่แจ้ง:</strong>
                  <span>{request.createdDate}</span>
                </div>
                {request.assignedTo && (
                  <div className="content-row">
                    <strong>มอบหมายให้:</strong>
                    <span>{request.assignedTo}</span>
                  </div>
                )}
              </div>

              <div className="card-footer">
                {request.status === "pending" && (
                  <button
                    className="btn-small danger"
                    onClick={() => handleCancel(request.id)}
                  >
                    ❌ ยกเลิก
                  </button>
                )}
                <button className="btn-small">📄 ดูรายละเอียด</button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>ไม่มีการแจ้งซ่อม</h3>
            <p>คลิกปุ่ม "แจ้งซ่อมใหม่" เพื่อสร้างการแจ้งซ่อม</p>
          </div>
        )}
      </div>

      <div className={`modal ${showModal ? "active" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">➕ แจ้งซ่อมใหม่</div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>หัวข้อ *</label>
              <input
                type="text"
                required
                placeholder="เช่น ซ่อมท่อน้ำแตก"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>รายละเอียด *</label>
              <textarea
                required
                placeholder="อธิบายปัญหาที่พบ..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>หมวดหมู่</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option>เครื่องประปา</option>
                <option>ไฟฟ้า</option>
                <option>ท่อระบายน้ำ</option>
                <option>คอนโดมิเนียม</option>
                <option>ประตูหน้าต่าง</option>
                <option>อื่น ๆ</option>
              </select>
            </div>

            <div className="form-group">
              <label>ความเร่งด่วน</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as any })
                }
              >
                <option value="low">ต่ำ</option>
                <option value="medium">ปานกลาง</option>
                <option value="high">สูง</option>
              </select>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                ยกเลิก
              </button>
              <button type="submit" className="btn-submit">
                ส่งแจ้งซ่อม
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}