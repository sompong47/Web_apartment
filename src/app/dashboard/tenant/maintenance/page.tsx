"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./maintenance.css";

// Interface ให้ตรงกับข้อมูล API
interface MaintenanceRequest {
  _id: string; // MongoDB ใช้ _id
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed" | "rejected";
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  tenantId?: { userId?: { _id: string } }; // เพิ่ม type เช็ค
}

export default function TenantMaintenancePage() {
  const router = useRouter();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [myTenantProfile, setMyTenantProfile] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "เครื่องประปา",
    priority: "medium",
  });

  // 1. โหลดข้อมูล User และ Tenant ของตัวเอง
  useEffect(() => {
    const initData = async () => {
        try {
            const userStr = localStorage.getItem("currentUser");
            if (!userStr) { router.push("/login"); return; }
            const currentUser = JSON.parse(userStr);

            // หา Tenant ID ของเรา
            const resTenants = await fetch("/api/tenants");
            const tenants = await resTenants.json();
            
            if (Array.isArray(tenants)) {
                // หา Tenant ที่เป็นของ User นี้
                const myProfile = tenants.find((t: any) => 
                    (t.userId?._id === currentUser.id || t.userId === currentUser.id) &&
                    t.status === 'active'
                );
                setMyTenantProfile(myProfile);
            }

            // โหลดรายการแจ้งซ่อม
            fetchRequests(currentUser.id);

        } catch (error) {
            console.error(error);
        }
    };

    initData();
  }, []);

  // 2. ฟังก์ชันโหลดรายการแจ้งซ่อม (รับ userId มากรอง)
  const fetchRequests = async (currentUserId: string) => {
    try {
      const res = await fetch("/api/maintenance");
      const data = await res.json();
      
      if (Array.isArray(data)) {
        // กรองเฉพาะของ User นี้
        const myRequests = data.filter((req: any) => 
            req.tenantId?.userId?._id === currentUserId || req.tenantId?.userId === currentUserId
        );
        setRequests(myRequests);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. ส่งข้อมูลแจ้งซ่อม (พร้อมระบุตัวตน)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!myTenantProfile) {
        alert("ไม่พบข้อมูลห้องพักของคุณ (กรุณาติดต่อแอดมิน)");
        return;
    }
    
    // ✅ ส่ง tenantId และ roomId ไปด้วย!
    const payload = {
       ...formData,
       tenantId: myTenantProfile._id,
       roomId: myTenantProfile.roomId?._id || myTenantProfile.roomId,
       status: "pending"
    };

    try {
        const res = await fetch("/api/maintenance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("แจ้งซ่อมสำเร็จ! เจ้าหน้าที่จะรีบดำเนินการ");
            setShowModal(false);
            setFormData({ title: "", description: "", category: "เครื่องประปา", priority: "medium" });
            
            // รีโหลดข้อมูลใหม่
            const userStr = localStorage.getItem("currentUser");
            if(userStr) fetchRequests(JSON.parse(userStr).id);
            
        } else {
            alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
        }
    } catch (error) {
        alert("เชื่อมต่อ Server ไม่ได้");
    }
  };

  // 3. ยกเลิกการแจ้งซ่อม (DELETE หรือ PUT cancel)
  const handleCancel = async (id: string) => {
    if (!confirm("ยืนยันการยกเลิกการแจ้งซ่อมนี้?")) return;

    try {
        const res = await fetch(`/api/maintenance/${id}`, {
            method: "DELETE" // หรือ PUT status: 'rejected'
        });

        if(res.ok) {
            alert("ยกเลิกรายการเรียบร้อย");
            const userStr = localStorage.getItem("currentUser");
            if(userStr) fetchRequests(JSON.parse(userStr).id);
        }
    } catch (error) {
        alert("เกิดข้อผิดพลาด");
    }
  };

  // Filter Logic
  const filteredRequests =
    filterStatus === "all"
      ? requests
      : requests.filter((req) => req.status === filterStatus);

  // Helper Functions
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "รอการอนุมัติ",
      "in-progress": "กำลังดำเนินการ",
      completed: "เสร็จสิ้น",
      rejected: "ปฏิเสธ/ยกเลิก",
    };
    return labels[status] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: "ต่ำ", medium: "ปานกลาง", high: "สูง",
    };
    return labels[priority] || priority;
  };

  if (loading) return <div style={{padding:'50px', textAlign:'center'}}>กำลังโหลดข้อมูล...</div>;

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
            <option value="rejected">ยกเลิก</option>
          </select>
        </div>
      </div>

      <div className="maintenance-list">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div
              key={request._id}
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
                  <strong>หมวดหมู่:</strong>
                  <span>{request.category}</span>
                </div>
                <div className="content-row">
                  <strong>ความเร่งด่วน:</strong>
                  <span>{getPriorityLabel(request.priority)}</span>
                </div>
                <div className="content-row">
                  <strong>วันที่แจ้ง:</strong>
                  <span>{new Date(request.createdAt).toLocaleDateString('th-TH')}</span>
                </div>
                {request.assignedTo && (
                  <div className="content-row">
                    <strong>ช่างผู้ดูแล:</strong>
                    <span style={{color: '#007bff'}}>{request.assignedTo}</span>
                  </div>
                )}
              </div>

              <div className="card-footer">
                {request.status === "pending" && (
                  <button
                    className="btn-small danger"
                    onClick={() => handleCancel(request._id)}
                  >
                    ❌ ยกเลิก
                  </button>
                )}
                {/* <button className="btn-small">📄 ดูรายละเอียด</button> */}
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

      {/* Modal Form */}
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
                <option>เฟอร์นิเจอร์</option>
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