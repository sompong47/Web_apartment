"use client";

import { useState, useEffect } from "react";
import "./admin-maintenance.css";

// Interface ให้ตรงกับข้อมูลจริงจาก DB (Populated)
interface MaintenanceRequest {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed" | "rejected";
  createdAt: string;
  updatedAt: string;
  // ข้อมูลที่ Populate มา
  roomId?: { roomNumber: string };
  tenantId?: { userId: { name: string } };
  assignedTo?: string;
}

export default function AdminMaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  
  // Modal & Form State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [assignmentForm, setAssignmentForm] = useState({ assigned: "", note: "" });
  
  const [searchTerm, setSearchTerm] = useState("");

  // 1. ดึงข้อมูลจริงจาก API
  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/maintenance");
      const data = await res.json();
      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching maintenance:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 2. ฟังก์ชันมอบหมายงาน (ยิง API PUT)
  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !assignmentForm.assigned) return;

    try {
      const res = await fetch(`/api/maintenance/${selectedRequest._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "in-progress", // เปลี่ยนสถานะเป็นกำลังดำเนินการ
          assignedTo: assignmentForm.assigned,
          // note: assignmentForm.note (ถ้าใน DB มี field นี้ให้ส่งไปด้วย)
        })
      });

      if (res.ok) {
        alert("มอบหมายงานสำเร็จ!");
        setShowAssignModal(false);
        setSelectedRequest(null);
        fetchRequests(); // โหลดข้อมูลใหม่
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error(error);
      alert("เชื่อมต่อ Server ไม่ได้");
    }
  };

  // 3. ฟังก์ชันปิดงาน (ยิง API PUT)
  const handleComplete = async (id: string) => {
    if (!confirm("ยืนยันว่าการซ่อมนี้เสร็จสิ้นหรือไม่?")) return;

    try {
      const res = await fetch(`/api/maintenance/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" })
      });

      if (res.ok) {
        alert("ปิดงานซ่อมเรียบร้อย");
        fetchRequests();
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาด");
    }
  };

  // Helper: เปิด Modal
  const handleAssignClick = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setAssignmentForm({ assigned: "", note: "" });
    setShowAssignModal(true);
  };

  // Helper: กรองข้อมูล
  const filteredRequests = requests.filter((req) => {
    const tenantName = req.tenantId?.userId?.name || "ไม่ระบุ";
    const roomNum = req.roomId?.roomNumber || "";
    
    const matchesTab = activeTab === "all" || req.status === activeTab;
    const matchesSearch =
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roomNum.includes(searchTerm);
      
    return matchesTab && matchesSearch;
  });

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
      low: "ต่ำ", medium: "ปานกลาง", high: "สูง",
    };
    return labels[priority] || priority;
  };

  // Stats Calculation
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    inProgress: requests.filter((r) => r.status === "in-progress").length,
    completed: requests.filter((r) => r.status === "completed").length,
  };

  if (loading) return <div className="p-8 text-center">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🔧 จัดการแจ้งซ่อม</h1>
        <p>ติดตามและจัดการรายการแจ้งซ่อมของผู้เช่า</p>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-label">ทั้งหมด</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-label">รออนุมัติ</div>
          <div className="stat-value" style={{color: '#ffc107'}}>{stats.pending}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-label">กำลังซ่อม</div>
          <div className="stat-value" style={{color: '#007bff'}}>{stats.inProgress}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">เสร็จสิ้น</div>
          <div className="stat-value" style={{color: '#28a745'}}>{stats.completed}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group" style={{width: '100%'}}>
          <input
            type="text"
            className="filter-input"
            placeholder="ค้นหาชื่อเรื่อง, ชื่อผู้เช่า, เลขห้อง..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {['all', 'pending', 'in-progress', 'completed'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'all' ? 'ทั้งหมด' : getStatusLabel(tab)}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="maintenance-section">
        <div className="maintenance-list">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <div key={request._id} className="maintenance-item">
                <div className="item-left">
                  <div className="item-title">{request.title}</div>
                  <div className="item-description">{request.description}</div>
                  <div className="item-meta">
                    <span className="meta-badge">👤 {request.tenantId?.userId?.name || "ไม่ระบุ"}</span>
                    <span className="meta-badge">🏠 ห้อง {request.roomId?.roomNumber || "-"}</span>
                    <span className="meta-badge">📁 {request.category || "ทั่วไป"}</span>
                    <span className="meta-badge">📅 {new Date(request.createdAt).toLocaleDateString('th-TH')}</span>
                    {request.assignedTo && (
                      <span className="meta-badge" style={{background: '#e3f2fd', color: '#007bff'}}>
                        🔧 {request.assignedTo}
                      </span>
                    )}
                  </div>
                </div>

                <div className="item-right">
                  <span className={`status-badge status-${request.status}`}>
                    {getStatusLabel(request.status)}
                  </span>
                  {request.priority && (
                    <span className={`priority-badge priority-${request.priority}`}>
                      ความเร่งด่วน: {getPriorityLabel(request.priority)}
                    </span>
                  )}

                  <div className="action-buttons">
                    {request.status === "pending" && (
                      <button
                        className="btn-assign"
                        onClick={() => handleAssignClick(request)}
                      >
                        มอบหมายงาน
                      </button>
                    )}
                    {request.status === "in-progress" && (
                      <button
                        className="btn-complete"
                        onClick={() => handleComplete(request._id)}
                      >
                        ✅ ปิดงาน
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>ไม่มีรายการ</h3>
              <p>ไม่พบรายการแจ้งซ่อมในหมวดหมู่นี้</p>
            </div>
          )}
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="modal active" style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000}}>
          <div className="modal-content" style={{background: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '500px'}}>
            <div className="modal-header" style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '20px'}}>🔧 มอบหมายการซ่อม</div>

            <form onSubmit={handleAssign}>
              <div className="form-group" style={{marginBottom: '15px'}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>รายการแจ้ง</label>
                <input type="text" value={selectedRequest?.title || ""} disabled className="filter-input" style={{background: '#f9f9f9'}} />
              </div>

              <div className="form-group" style={{marginBottom: '15px'}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>มอบหมายให้ช่าง *</label>
                <select
                  className="filter-input"
                  value={assignmentForm.assigned}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, assigned: e.target.value })}
                  required
                >
                  <option value="">-- เลือกช่าง --</option>
                  <option value="สมชาย ช่างประปา">สมชาย ช่างประปา</option>
                  <option value="สมศรี ช่างไฟฟ้า">สมศรี ช่างไฟฟ้า</option>
                  <option value="วิชัย ช่างทั่วไป">วิชัย ช่างทั่วไป</option>
                </select>
              </div>

              <div className="form-group" style={{marginBottom: '25px'}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>หมายเหตุ</label>
                <textarea
                  className="filter-input"
                  placeholder="บันทึกเพิ่มเติม..."
                  value={assignmentForm.note}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, note: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="modal-footer" style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                <button type="button" className="btn-assign" style={{background: '#ccc'}} onClick={() => setShowAssignModal(false)}>ยกเลิก</button>
                <button type="submit" className="btn-assign">ยืนยัน</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}