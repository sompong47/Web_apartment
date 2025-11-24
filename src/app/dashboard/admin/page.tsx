'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './admin-dashboard.css';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalTenants: 0,
    maintenanceRequests: 0,
    occupancyRate: 0,
    availableRooms: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock Data สำหรับกราฟรายได้ (ในอนาคตดึงจาก API ได้)
  const revenueData = [
    { month: 'มิ.ย.', value: 125000, height: '60%' },
    { month: 'ก.ค.', value: 140000, height: '75%' },
    { month: 'ส.ค.', value: 135000, height: '70%' },
    { month: 'ก.ย.', value: 155000, height: '85%' },
    { month: 'ต.ค.', value: 160000, height: '90%' },
    { month: 'พ.ย.', value: 180000, height: '100%' },
  ];

  // Mock Activities
  const activities = [
    { id: 1, icon: '👤', title: 'ผู้เช่าใหม่ลงทะเบียน', description: 'คุณสมชาย ห้อง 401', time: '10 นาทีที่แล้ว' },
    { id: 2, icon: '💰', title: 'ได้รับชำระเงิน', description: 'ห้อง 205 ชำระผ่าน QR', time: '2 ชม. ที่แล้ว' },
    { id: 3, icon: '🔧', title: 'แจ้งซ่อมใหม่', description: 'ก๊อกน้ำรั่ว ห้อง 102', time: '5 ชม. ที่แล้ว' },
    { id: 4, icon: '⚡', title: 'จดมิเตอร์เสร็จสิ้น', description: 'แอดมินบันทึกมิเตอร์เดือนนี้', time: '1 วันที่แล้ว' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRooms, resTenants, resMaint] = await Promise.all([
          fetch('/api/rooms'),
          fetch('/api/tenants'),
          fetch('/api/maintenance')
        ]);

        const rooms = await resRooms.json();
        const tenants = await resTenants.json();
        const maintenance = await resMaint.json();

        const totalRooms = Array.isArray(rooms) ? rooms.length : 0;
        const occupied = Array.isArray(rooms) ? rooms.filter((r: any) => r.status === 'occupied').length : 0;
        
        const activeMaint = Array.isArray(maintenance) 
          ? maintenance.filter((m: any) => m.status !== 'completed').length 
          : 0;

        setStats({
          totalRooms,
          totalTenants: Array.isArray(tenants) ? tenants.length : 0,
          maintenanceRequests: activeMaint,
          occupancyRate: totalRooms > 0 ? Math.round((occupied / totalRooms) * 100) : 0,
          availableRooms: Array.isArray(rooms) ? rooms.filter((r: any) => r.status === 'available').length : 0
        });

      } catch (error) {
        console.error("Error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('th-TH', { 
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    });
  };

  if (loading) return <div className="loading-screen">กำลังประมวลผลข้อมูล...</div>;

  return (
    <div className="dashboard-container">
      
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>📊 ภาพรวมหอพัก</h1>
          <p>ข้อมูลล่าสุด: <span className="header-date">{getCurrentDate()}</span></p>
        </div>
      </div>

      {/* Stats Cards (แถวบนสุด) */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">🏢</div>
          <div className="stat-content">
            <div className="stat-label">ห้องทั้งหมด</div>
            <div className="stat-value">{stats.totalRooms}</div>
            <div className="stat-detail text-green">ว่าง {stats.availableRooms} ห้อง</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">👥</div>
          <div className="stat-content">
            <div className="stat-label">ผู้เช่า</div>
            <div className="stat-value">{stats.totalTenants}</div>
            <div className="stat-detail">คน</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper orange">🔧</div>
          <div className="stat-content">
            <div className="stat-label">แจ้งซ่อม (ค้าง)</div>
            <div className="stat-value" style={{color: stats.maintenanceRequests > 0 ? '#dc3545' : '#333'}}>
              {stats.maintenanceRequests}
            </div>
            <div className="stat-detail">รายการ</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">📈</div>
          <div className="stat-content">
            <div className="stat-label">อัตราเข้าพัก</div>
            <div className="stat-value">{stats.occupancyRate}%</div>
            <div className="stat-detail">สุขภาพดีเยี่ยม</div>
          </div>
        </div>
      </div>

      {/* --- Layout 2 คอลัมน์ (เติมเต็มพื้นที่) --- */}
      <div className="dashboard-layout">
        
        {/* ฝั่งซ้าย (Main Column) */}
        <div className="main-column">
          
          {/* 1. กราฟรายได้ (Financial Overview) - ใส่เพื่อเติมพื้นที่ */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>💰 แนวโน้มรายได้ (6 เดือนล่าสุด)</h2>
            </div>
            <div className="chart-container">
               {revenueData.map((item, index) => (
                 <div key={index} className="chart-bar-group">
                    <div 
                      className="chart-bar" 
                      style={{height: item.height}}
                      data-value={`฿${item.value.toLocaleString()}`}
                    ></div>
                    <span className="chart-label">{item.month}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* 2. กิจกรรมล่าสุด */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>📋 กิจกรรมล่าสุด</h2>
            </div>
            <div className="activity-list">
              {activities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-info">
                    <div className="activity-title">{activity.title}</div>
                    <div className="activity-desc">{activity.description}</div>
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ฝั่งขวา (Side Column) - เมนูด่วน + สถานะระบบ */}
        <div className="side-column">
          
          {/* 3. เมนูด่วน (Quick Actions) */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>⚡ เมนูด่วน</h2>
            </div>
            <div className="quick-actions-grid">
              <Link href="/dashboard/admin/tenants" className="action-card">
                <span className="action-icon">👤</span>
                <span className="action-text">เพิ่มผู้เช่า</span>
              </Link>
              <Link href="/dashboard/admin/payments" className="action-card">
                <span className="action-icon">💰</span>
                <span className="action-text">สร้างบิล</span>
              </Link>
              <Link href="/dashboard/admin/utilities" className="action-card">
                <span className="action-icon">💧</span>
                <span className="action-text">จดมิเตอร์</span>
              </Link>
              <Link href="/dashboard/admin/maintenance" className="action-card">
                <span className="action-icon">🔧</span>
                <span className="action-text">แจ้งซ่อม</span>
              </Link>
            </div>
          </div>

          {/* 4. สถานะระบบ (System Status) - เติมให้ดูโปร */}
          <div className="dashboard-section">
             <div className="section-header">
              <h2>🟢 สถานะระบบ</h2>
            </div>
            <div className="system-status">
               <div className="status-item">
                 <span>Database Connection</span>
                 <span className="status-indicator status-on"></span>
               </div>
               <div className="status-item">
                 <span>API Service</span>
                 <span className="status-indicator status-on"></span>
               </div>
               <div className="status-item">
                 <span>OCR Service</span>
                 <span className="status-indicator status-on"></span>
               </div>
               <div className="status-item" style={{marginTop:'10px', fontSize:'12px', color:'#999'}}>
                 Last checked: just now
               </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}