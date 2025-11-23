"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./utilities.css";

interface UtilityRecord {
  _id: string;
  month: string;
  year: number;
  waterUsage: number;
  electricUsage: number;
  waterCost: number;
  electricCost: number;
  totalCost: number;
  roomId: string;
}

export default function TenantUtilitiesPage() {
  const router = useRouter();
  const [records, setRecords] = useState<UtilityRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. ตรวจสอบ User
        const userStr = localStorage.getItem("currentUser");
        if (!userStr) {
            router.push("/login");
            return;
        }
        const currentUser = JSON.parse(userStr);

        // 2. ดึง Tenant เพื่อหา RoomID ของ User นี้
        const resTenant = await fetch("/api/tenants");
        const tenants = await resTenant.json();
        
        let myRoomId = "";
        if (Array.isArray(tenants)) {
            const myTenant = tenants.find((t: any) => 
                (t.userId?._id === currentUser.id || t.userId === currentUser.id) && 
                t.status === 'active'
            );
            
            if (myTenant) {
                myRoomId = myTenant.roomId?._id || myTenant.roomId;
            }
        }

        if (!myRoomId) {
            setLoading(false);
            return; 
        }

        // 3. ดึง Utilities ทั้งหมด
        const resUtil = await fetch("/api/utilities"); 
        const data = await resUtil.json();

        if (Array.isArray(data)) {
            const myUtilities = data.filter((u: any) => 
                (u.roomId?._id === myRoomId || u.roomId === myRoomId)
            );

            // แปลงข้อมูล
            const formatted = myUtilities.map((u: any) => ({
                _id: u._id,
                month: u.month,
                year: u.year,
                waterUsage: u.waterUsage,
                electricUsage: u.electricUsage,
                waterCost: u.waterUsage * u.waterRate,
                electricCost: u.electricUsage * u.electricRate,
                totalCost: (u.waterUsage * u.waterRate) + (u.electricUsage * u.electricRate),
                roomId: myRoomId // ✅ เพิ่มบรรทัดนี้ครับ (ใส่ roomId ให้มัน)
            }));
            
            // เรียงลำดับข้อมูล: ใหม่ -> เก่า
            formatted.sort((a: any, b: any) => {
                const yearDiff = b.year - a.year;
                if (yearDiff !== 0) return yearDiff;

                const getMonthNum = (m: string) => parseInt(m.split('-')[0]);
                return getMonthNum(b.month) - getMonthNum(a.month);
            });

            setRecords(formatted);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  if (loading) return <div style={{padding:'50px', textAlign:'center'}}>กำลังโหลดข้อมูล...</div>;

  const latest = records.length > 0 ? records[0] : null;

  return (
    <div className="utilities-container">
      <h1 className="page-title">💧⚡ ประวัติการใช้น้ำ-ไฟ</h1>
      <p style={{color:'#666', marginBottom:'25px'}}>ตรวจสอบปริมาณการใช้งานรายเดือน (ค่าใช้จ่ายนี้รวมในบิลค่าเช่าแล้ว)</p>

      {/* Stats Cards */}
      {latest ? (
          <div className="stats-grid">
            <div className="stat-card water">
                <div className="icon">💧</div>
                <div>
                    <div className="label">ใช้น้ำล่าสุด ({latest.month})</div>
                    <div className="value">{latest.waterUsage} หน่วย</div>
                    <div className="sub-value">คิดเป็นเงิน ฿{latest.waterCost.toLocaleString()}</div>
                </div>
            </div>
            <div className="stat-card electric">
                <div className="icon">⚡</div>
                <div>
                    <div className="label">ใช้ไฟล่าสุด ({latest.month})</div>
                    <div className="value">{latest.electricUsage} หน่วย</div>
                    <div className="sub-value">คิดเป็นเงิน ฿{latest.electricCost.toLocaleString()}</div>
                </div>
            </div>
          </div>
      ) : (
          <div className="stats-grid">
             <div className="stat-card" style={{gridColumn: '1 / -1', textAlign:'center', display:'block'}}>
                 <h3 style={{margin:0, color:'#999'}}>ยังไม่มีประวัติการใช้งาน</h3>
             </div>
          </div>
      )}

      {/* Table History */}
      <div className="table-wrapper">
        <table className="utility-table">
            <thead>
                <tr>
                    <th>เดือน/ปี</th>
                    <th>น้ำ (หน่วย)</th>
                    <th>ค่าน้ำ (บาท)</th>
                    <th>ไฟ (หน่วย)</th>
                    <th>ค่าไฟ (บาท)</th>
                    <th>รวม (บาท)</th>
                </tr>
            </thead>
            <tbody>
                {records.length === 0 ? (
                    <tr><td colSpan={6} style={{textAlign:'center', padding:'30px', color:'#999'}}>ยังไม่มีประวัติการใช้งาน</td></tr>
                ) : (
                    records.map((rec) => (
                        <tr key={rec._id}>
                            <td>{rec.month}/{rec.year}</td>
                            <td>{rec.waterUsage}</td>
                            <td>฿{rec.waterCost.toLocaleString()}</td>
                            <td>{rec.electricUsage}</td>
                            <td>฿{rec.electricCost.toLocaleString()}</td>
                            <td style={{fontWeight:'bold', color:'#333'}}>฿{rec.totalCost.toLocaleString()}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}