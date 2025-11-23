'use client';

import React, { useState, useEffect } from 'react';
import './admin-dashboard.css';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalRooms: 150,
    totalTenants: 120,
    maintenanceRequests: 8,
    occupancyRate: 80,
  });

  const [activities, setActivities] = useState([
    {
      id: 1,
      icon: '👤',
      title: 'ผู้เช่าใหม่',
      description: 'นายสมชาย เข้าอยู่ห้อง 401',
      time: '2 ชั่วโมงที่แล้ว',
    },
    {
      id: 2,
      icon: '🔧',
      title: 'แจ้งซ่อม',
      description: 'ซ่อมท่อน้ำแตกในห้อง 401',
      time: '4 ชั่วโมงที่แล้ว',
    },
    {
      id: 3,
      icon: '💰',
      title: 'ชำระเงิน',
      description: 'นางสาวมลัย ชำระค่าน้ำ ค่าไฟ',
      time: '6 ชั่วโมงที่แล้ว',
    },
    {
      id: 4,
      icon: '🚪',
      title: 'ห้องว่าง',
      description: 'ห้อง 302 พร้อมให้เช่า',
      time: '1 วันที่แล้ว',
    },
  ]);

  const [occupancyStatus, setOccupancyStatus] = useState([
    { name: 'ชั้น 1', value: 85, status: 'high' },
    { name: 'ชั้น 2', value: 80, status: 'high' },
    { name: 'ชั้น 3', value: 75, status: 'medium' },
    { name: 'ชั้น 4', value: 70, status: 'medium' },
    { name: 'ชั้น 5', value: 60, status: 'low' },
  ]);

  const maintenanceStats = [
    { name: 'ยังไม่ชำระ', value: 8, total: 20 },
    { name: 'กำลังดำเนินการ', value: 5, total: 20 },
    { name: 'เสร็จสิ้น', value: 7, total: 20 },
  ];

  const getCurrentDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('th-TH', options);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <p>ยินดีต้อนรับสู่แผงควบคุมการจัดการอพาร์ทเมนต์</p>
        <div className="header-date">{getCurrentDate()}</div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-header">
            <div>
              <div className="stat-label">ห้องทั้งหมด</div>
              <div className="stat-value">{stats.totalRooms}</div>
              <div className="stat-change positive">
                <span className="change-arrow">↗</span>
                <span>ห้องว่าง 30 ห้อง</span>
              </div>
            </div>
            <div className="stat-icon-badge">🏠</div>
          </div>
          <div className="stat-description">รวมทั้งหมดห้องพักทั้งอพาร์ทเมนต์</div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-header">
            <div>
              <div className="stat-label">ผู้เช่า</div>
              <div className="stat-value">{stats.totalTenants}</div>
              <div className="stat-change positive">
                <span className="change-arrow">↗</span>
                <span>เพิ่มขึ้น 5 คน</span>
              </div>
            </div>
            <div className="stat-icon-badge">👥</div>
          </div>
          <div className="stat-description">ผู้เช่าที่กำลังอยู่ในอพาร์ทเมนต์</div>
        </div>

        <div className="stat-card tertiary">
          <div className="stat-header">
            <div>
              <div className="stat-label">แจ้งซ่อม</div>
              <div className="stat-value">{stats.maintenanceRequests}</div>
              <div className="stat-change negative">
                <span className="change-arrow">↗</span>
                <span>รอดำเนินการ</span>
              </div>
            </div>
            <div className="stat-icon-badge">🔧</div>
          </div>
          <div className="stat-description">รายการแจ้งซ่อมที่ต้องดำเนินการ</div>
        </div>

        <div className="stat-card primary">
          <div className="stat-header">
            <div>
              <div className="stat-label">อัตราการครอบครอง</div>
              <div className="stat-value">{stats.occupancyRate}%</div>
              <div className="stat-change positive">
                <span className="change-arrow">↗</span>
                <span>เพิ่มขึ้น 5%</span>
              </div>
            </div>
            <div className="stat-icon-badge">📈</div>
          </div>
          <div className="stat-description">ห้องที่มีผู้เช่าจากทั้งหมด</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Activity Log */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">📋 กิจกรรมล่าสุด</h2>
            <a href="#" className="section-action">ดูทั้งหมด</a>
          </div>
          <div className="activity-list">
            {activities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-description">{activity.description}</div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">⚡ การจัดการ</h2>
          </div>
          <div className="quick-actions">
            <button className="action-btn">
              <span className="action-icon">👤</span>
              <span>เพิ่มผู้เช่า</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">🔧</span>
              <span>จัดการแจ้งซ่อม</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">💰</span>
              <span>ดูการชำระเงิน</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">📊</span>
              <span>รายงาน</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">⚙️</span>
              <span>ตั้งค่า</span>
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Occupancy Chart */}
        <div className="chart-card">
          <h3 className="chart-title">📊 การครอบครองของแต่ละชั้น</h3>
          <div className="status-list">
            {occupancyStatus.map((status, index) => (
              <div key={index} className="status-item">
                <div>
                  <div className="status-name">{status.name}</div>
                  <div className="status-bar">
                    <div
                      className={`status-fill ${status.status}`}
                      style={{ width: `${status.value}%` }}
                    ></div>
                  </div>
                </div>
                <div className="status-value">{status.value}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Chart */}
        <div className="chart-card">
          <h3 className="chart-title">🔧 สถานะการซ่อมแซม</h3>
          <div className="status-list">
            {maintenanceStats.map((stat, index) => (
              <div key={index} className="status-item">
                <div>
                  <div className="status-name">{stat.name}</div>
                  <div className="status-bar">
                    <div
                      className="status-fill"
                      style={{ width: `${(stat.value / stat.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="status-value">{stat.value}/{stat.total}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Chart */}
        <div className="chart-card">
          <h3 className="chart-title">💹 สถิติอพาร์ทเมนต์</h3>
          <div className="chart-placeholder">
            📈 กราฟรายได้ และค่าใช้จ่ายประจำเดือน
          </div>
        </div>
      </div>
    </div>
  );
}