"use client";

import { useState, useEffect } from "react";
import "./reports.css";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    income: 0,
    pendingIncome: 0,
    totalTenants: 0,
    occupiedRooms: 0,
    totalMaintenance: 0,
    completedMaintenance: 0
  });

  const [financialList, setFinancialList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resPayments, resTenants, resRooms, resMaint] = await Promise.all([
          fetch("/api/payments"),
          fetch("/api/tenants"),
          fetch("/api/rooms"),
          fetch("/api/maintenance")
        ]);

        const payments = await resPayments.json();
        const tenants = await resTenants.json();
        const rooms = await resRooms.json();
        const maintenance = await resMaint.json();

        // คำนวณสถิติ
        const income = Array.isArray(payments) 
          ? payments.filter((p: any) => p.status === 'paid').reduce((sum: number, p: any) => sum + (p.totalAmount || 0), 0)
          : 0;
        
        const pending = Array.isArray(payments)
          ? payments.filter((p: any) => p.status !== 'paid').reduce((sum: number, p: any) => sum + (p.totalAmount || 0), 0)
          : 0;

        setStats({
          income,
          pendingIncome: pending,
          totalTenants: Array.isArray(tenants) ? tenants.length : 0,
          occupiedRooms: Array.isArray(rooms) ? rooms.filter((r: any) => r.status === 'occupied').length : 0,
          totalMaintenance: Array.isArray(maintenance) ? maintenance.length : 0,
          completedMaintenance: Array.isArray(maintenance) ? maintenance.filter((m: any) => m.status === 'completed').length : 0
        });

        // จัดเตรียมข้อมูลตารางการเงิน (เอา 5 รายการล่าสุด)
        if (Array.isArray(payments)) {
            setFinancialList(payments.slice(0, 5)); 
        }

      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">กำลังคำนวณสถิติ...</div>;

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>📊 รายงานสรุปผล</h1>
        <p>ภาพรวมประสิทธิภาพและการเงินของหอพัก</p>
      </div>

      {/* 1. รายงานการเงิน */}
      <div className="reports-grid">
        <div className="report-card">
          <div className="report-card-header">
            <span className="report-icon">💰</span>
            <span className="report-date">ยอดรวมทั้งหมด</span>
          </div>
          <div className="report-card-body">
            <h3 className="report-title">รายได้จริง</h3>
            <p className="report-description">ยอดเงินที่ได้รับชำระแล้วทั้งหมด</p>
            <div className="report-stats">
              <div className="stat-item">
                <div className="stat-label">ได้รับแล้ว</div>
                <div className="stat-value" style={{color: '#28a745'}}>฿{stats.income.toLocaleString()}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">รอเก็บ</div>
                <div className="stat-value" style={{color: '#ffc107'}}>฿{stats.pendingIncome.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. รายงานผู้เช่า */}
        <div className="report-card">
          <div className="report-card-header">
            <span className="report-icon">👥</span>
            <span className="report-date">สถานะปัจจุบัน</span>
          </div>
          <div className="report-card-body">
            <h3 className="report-title">ผู้เช่า & ห้องพัก</h3>
            <p className="report-description">อัตราการเข้าพักในปัจจุบัน</p>
            <div className="report-stats">
              <div className="stat-item">
                <div className="stat-label">ผู้เช่า</div>
                <div className="stat-value">{stats.totalTenants} คน</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">ห้องไม่ว่าง</div>
                <div className="stat-value">{stats.occupiedRooms} ห้อง</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. รายงานการซ่อม */}
        <div className="report-card">
          <div className="report-card-header">
            <span className="report-icon">🔧</span>
            <span className="report-date">ประสิทธิภาพ</span>
          </div>
          <div className="report-card-body">
            <h3 className="report-title">งานซ่อมบำรุง</h3>
            <p className="report-description">สถิติการแจ้งซ่อมและการปิดงาน</p>
            <div className="report-stats">
              <div className="stat-item">
                <div className="stat-label">แจ้งเข้ามา</div>
                <div className="stat-value">{stats.totalMaintenance}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">เสร็จแล้ว</div>
                <div className="stat-value" style={{color: '#28a745'}}>{stats.completedMaintenance}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Table */}
      <div className="table-section">
        <div className="section-header">
          <h2 className="section-title">🧾 รายการธุรกรรมล่าสุด</h2>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ห้อง</th>
              <th>เดือน</th>
              <th>ยอดเงิน</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {financialList.length === 0 ? (
                <tr><td colSpan={4} style={{textAlign:'center', padding:'20px', color:'#999'}}>ไม่มีข้อมูลธุรกรรม</td></tr>
            ) : (
                financialList.map((pay: any) => (
                <tr key={pay._id}>
                    <td>{pay.roomId?.roomNumber || 'Unknown'}</td>
                    <td>{pay.month}/{pay.year}</td>
                    <td style={{fontWeight:'bold'}}>฿{pay.totalAmount?.toLocaleString()}</td>
                    <td>
                        <span style={{
                            padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                            background: pay.status === 'paid' ? '#d4edda' : '#fff3cd',
                            color: pay.status === 'paid' ? '#155724' : '#856404'
                        }}>
                            {pay.status === 'paid' ? 'จ่ายแล้ว' : 'รอจ่าย'}
                        </span>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}