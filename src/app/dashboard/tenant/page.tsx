"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, AlertCircle, FileText, Wrench, Bell, User, LogOut } from "lucide-react";
import "./tenant-dashboard.css"; 

export default function TenantDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>(null);
  const [tenantData, setTenantData] = useState<any>(null);
  const [unpaidBill, setUnpaidBill] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. ดึงข้อมูล User
        const userStr = localStorage.getItem("currentUser");
        if (!userStr) {
            router.push("/login");
            return;
        }
        const currentUser = JSON.parse(userStr);
        setUser(currentUser);

        // 2. ดึงข้อมูล API
        const [resTenants, resPayments] = await Promise.all([
          fetch("/api/tenants"),
          fetch("/api/payments")
        ]);

        const tenants = await resTenants.json();
        const payments = await resPayments.json();

        if (Array.isArray(tenants)) {
           // ✅ แก้ไขการกรอง 1: เช็ค ID ทั้งแบบ Object และ String
           const myTenant = tenants.find((t: any) => 
               (t.userId?._id === currentUser.id || t.userId === currentUser.id) && 
               t.status === 'active'
           );
           setTenantData(myTenant);

           if (myTenant && Array.isArray(payments)) {
             // ✅ แก้ไขการกรอง 2: เช็ค tenantId ทั้งแบบ Object และ String
             const myBill = payments.find((b: any) => 
                (b.tenantId?._id === myTenant._id || b.tenantId === myTenant._id) && 
                (b.status === 'unpaid' || b.status === 'overdue')
             );
             setUnpaidBill(myBill);
           }
        }

      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  const getDaysRemaining = () => {
    if (!tenantData?.endDate) return "-";
    const end = new Date(tenantData.endDate);
    const today = new Date();
    const diff = end.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? `${days} วัน` : "หมดสัญญา";
  };

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>กำลังโหลดข้อมูล...</div>;

  return (
    <div className="dashboard-container">
      
      {/* Header */}
      <div className="welcome-header">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
                <h1>สวัสดี, {user?.name || "ผู้เช่า"} 👋</h1>
                <p>ยินดีต้อนรับสู่ระบบจัดการหอพัก SorHub</p>
            </div>
            
        </div>
      </div>

      {/* 1. Room Card */}
      {tenantData ? (
        <div className="room-card">
          <h2><Home size={24} /> ห้องของคุณ</h2>
          <div className="room-details-grid">
            <div className="room-detail-item">
              <h3>เลขห้อง</h3>
              <p>{tenantData.roomId?.roomNumber}</p>
            </div>
            <div className="room-detail-item">
              <h3>ประเภท</h3>
              <p style={{textTransform: 'capitalize'}}>{tenantData.roomId?.type || "Standard"}</p>
            </div>
            <div className="room-detail-item">
              <h3>ค่าเช่า/เดือน</h3>
              <p>฿{tenantData.roomId?.price?.toLocaleString()}</p>
            </div>
            <div className="room-detail-item">
              <h3>สัญญาเหลือ</h3>
              <p>{getDaysRemaining()}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="room-card" style={{background: '#6c757d'}}>
            <h2>คุณยังไม่มีข้อมูลห้องพัก</h2>
            <p>กรุณาติดต่อผู้ดูแลหอพักเพื่อเพิ่มชื่อเข้าห้อง หรือจองห้องพักใหม่</p>
            <Link href="/dashboard/tenant/booking" style={{marginTop: '15px', display: 'inline-block', background: 'white', color: '#6c757d', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold'}}>
                จองห้องพักทันที
            </Link>
        </div>
      )}

      {/* 2. Alert Section */}
      {unpaidBill ? (
        <div className="alert-card">
          <div className="alert-content">
            <AlertCircle className="alert-icon" />
            <div>
              <strong>มีบิลค้างชำระ!</strong>
              <div style={{fontSize: '14px', marginTop: '4px'}}>
                ประจำเดือน {unpaidBill.month} ยอดรวม <strong>฿{unpaidBill.totalAmount?.toLocaleString()}</strong>
              </div>
            </div>
          </div>
          <Link href="/dashboard/tenant/payment" className="alert-btn">
            ชำระเงินทันที
          </Link>
        </div>
      ) : (
         tenantData && (
            <div className="alert-card" style={{backgroundColor: '#d4edda', borderColor: '#c3e6cb', color: '#155724'}}>
                 <div className="alert-content">
                    <FileText size={24} />
                    <strong>ไม่มียอดค้างชำระ ขอบคุณที่ใช้บริการครับ</strong>
                 </div>
            </div>
         )
      )}

      {/* 3. Quick Stats Grid */}
      <div className="info-grid">
        
        <div className="info-card">
          <div className="card-title"><FileText size={20} color="#007bff"/> รายละเอียดบิลล่าสุด</div>
          {unpaidBill ? (
              <>
                <div className="info-row"><span>ค่าเช่า</span> <span className="info-value">฿{unpaidBill.rentAmount?.toLocaleString()}</span></div>
                <div className="info-row"><span>ค่าน้ำ</span> <span className="info-value">฿{unpaidBill.waterBill?.toLocaleString()}</span></div>
                <div className="info-row"><span>ค่าไฟ</span> <span className="info-value">฿{unpaidBill.electricBill?.toLocaleString()}</span></div>
                <hr style={{margin: '10px 0', borderTop: '1px solid #eee'}}/>
                <div className="info-row" style={{color: '#dc3545', fontSize: '16px'}}><span>รวมทั้งสิ้น</span> <span className="info-value">฿{unpaidBill.totalAmount?.toLocaleString()}</span></div>
              </>
          ) : (
              <div style={{textAlign: 'center', padding: '20px', color: '#999'}}>
                  รอรอบบิลถัดไป...
              </div>
          )}
          <Link href="/dashboard/tenant/payment" className="link-btn">ดูประวัติการชำระเงิน →</Link>
        </div>

        <div className="info-card">
          <div className="card-title"><Wrench size={20} color="#ffc107"/> แจ้งซ่อม / ปัญหา</div>
          <p style={{fontSize: '14px', color: '#666', marginBottom: '15px'}}>
             พบปัญหาในห้องพัก? ก๊อกรั่ว? ไฟดับ? <br/>แจ้งเจ้าหน้าที่ได้ตลอด 24 ชม.
          </p>
          <Link href="/dashboard/tenant/maintenance" className="link-btn">
            แจ้งซ่อมทันที →
          </Link>
        </div>

        <div className="info-card">
          <div className="card-title"><Bell size={20} color="#dc3545"/> ประกาศจากหอพัก</div>
          <div className="announcement-item">
            <strong>📢 กำหนดการจ่ายค่าเช่า</strong>
            <p>กรุณาชำระค่าเช่าภายในวันที่ 5 ของทุกเดือน เพื่อหลีกเลี่ยงค่าปรับ</p>
          </div>
          <div className="announcement-item">
            <strong>💧 ประหยัดน้ำ/ไฟ</strong>
            <p>ช่วยกันปิดไฟและน้ำเมื่อไม่ใช้งาน เพื่อลดโลกร้อน</p>
          </div>
        </div>

      </div>
    </div>
  );
}