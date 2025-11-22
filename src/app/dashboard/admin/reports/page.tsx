"use client";

import { useState } from "react";
import "./reports.css";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    startDate: "2025-11-01",
    endDate: "2025-11-30",
  });

  const [reportType, setReportType] = useState("all");

  // Mock data reports
  const reports = [
    {
      id: 1,
      icon: "💰",
      title: "รายงานการเงิน",
      description: "สรุปรายได้และค่าใช้จ่ายประจำเดือน",
      date: "2025-11-30",
      stats: { income: "฿580,000", expense: "฿120,000" },
    },
    {
      id: 2,
      icon: "👥",
      title: "รายงานผู้เช่า",
      description: "สถิติผู้เช่าใหม่ และการออกจากห้อง",
      date: "2025-11-28",
      stats: { newTenants: 5, outgoing: 2 },
    },
    {
      id: 3,
      icon: "🏠",
      title: "รายงานการใช้งานห้อง",
      description: "อัตราการครอบครองและห้องที่ว่างเปล่า",
      date: "2025-11-27",
      stats: { occupied: "120 ห้อง", available: "30 ห้อง" },
    },
    {
      id: 4,
      icon: "🔧",
      title: "รายงานการซ่อมแซม",
      description: "รายการแจ้งซ่อมและสถานะการดำเนินการ",
      date: "2025-11-26",
      stats: { total: 24, completed: 18 },
    },
    {
      id: 5,
      icon: "💧",
      title: "รายงานค่าน้ำไฟ",
      description: "ข้อมูลการใช้ค่าน้ำ ค่าไฟ และค่าสูติรการ",
      date: "2025-11-25",
      stats: { water: "฿45,000", electricity: "฿75,000" },
    },
    {
      id: 6,
      icon: "📊",
      title: "รายงานประสิทธิภาพ",
      description: "ประสิทธิภาพการดำเนินงานและคะแนนความพึงพอใจ",
      date: "2025-11-24",
      stats: { efficiency: "92%", satisfaction: "4.5/5" },
    },
  ];

  // Mock financial data
  const financialData = [
    { month: "กันยายน", income: 520000, expense: 115000 },
    { month: "ตุลาคม", income: 550000, expense: 125000 },
    { month: "พฤศจิกายน", income: 580000, expense: 120000 },
  ];

  const handleExport = (format: string) => {
    alert(`ส่งออกรายงานเป็น ${format}`);
  };

  const handleFilterApply = () => {
    console.log("Applying filters:", { dateRange, reportType });
    alert("นำใช้ตัวกรองแล้ว");
  };

  const handleReportView = (reportId: number) => {
    alert(`ดูรายงานที่ ${reportId}`);
  };

  const handleReportDownload = (reportId: number) => {
    alert(`ดาวน์โหลดรายงานที่ ${reportId}`);
  };

  return (
    <div className="reports-container">
      {/* Header */}
      <div className="reports-header">
        <h1>📊 รายงาน</h1>
        <p>ดูและจัดการรายงานต่างๆ ของอพาร์ทเมนต์</p>
      </div>

      {/* Top Actions */}
      <div className="reports-actions">
        <button className="btn-primary" onClick={() => handleExport("PDF")}>
          📥 ส่งออก PDF
        </button>
        <button className="btn-primary" onClick={() => handleExport("Excel")}>
          📊 ส่งออก Excel
        </button>
        <button className="btn-secondary">
          🖨️ พิมพ์
        </button>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-title">🔍 ตัวกรองรายงาน</div>

        <div className="filter-grid">
          <div className="filter-group">
            <label className="filter-label">วันที่เริ่มต้น</label>
            <input
              type="date"
              className="filter-input"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">วันที่สิ้นสุด</label>
            <input
              type="date"
              className="filter-input"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">ประเภทรายงาน</label>
            <select
              className="filter-select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="all">ทั้งหมด</option>
              <option value="financial">รายงานการเงิน</option>
              <option value="tenants">รายงานผู้เช่า</option>
              <option value="rooms">รายงานห้องพัก</option>
              <option value="maintenance">รายงานการซ่อมแซม</option>
              <option value="utilities">รายงานค่าน้ำไฟ</option>
            </select>
          </div>

          <div className="filter-actions">
            <button className="btn-filter" onClick={handleFilterApply}>
              ✓ นำใช้ตัวกรอง
            </button>
            <button className="btn-reset">↺ รีเซ็ต</button>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="reports-grid">
        {reports.map((report) => (
          <div key={report.id} className="report-card">
            <div className="report-card-header">
              <span className="report-icon">{report.icon}</span>
              <span className="report-date">{report.date}</span>
            </div>

            <div className="report-card-body">
              <h3 className="report-title">{report.title}</h3>
              <p className="report-description">{report.description}</p>

              <div className="report-stats">
                {Object.entries(report.stats).map(([key, value]) => (
                  <div key={key} className="stat-item">
                    <div className="stat-label">{key}</div>
                    <div className="stat-value">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="report-footer">
              <button
                className="report-btn"
                onClick={() => handleReportView(report.id)}
              >
                👁️ ดู
              </button>
              <button
                className="report-btn"
                onClick={() => handleReportDownload(report.id)}
              >
                📥 ดาวน์โหลด
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Financial Summary */}
      <div className="table-section">
        <div className="section-header">
          <h2 className="section-title">💰 สรุปการเงิน</h2>
          <a href="#" className="section-action">ดูรายละเอียด</a>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>เดือน</th>
              <th>รายได้</th>
              <th>ค่าใช้จ่าย</th>
              <th>กำไรสุทธิ</th>
              <th>เปอร์เซ็นต์</th>
            </tr>
          </thead>
          <tbody>
            {financialData.map((data, index) => (
              <tr key={index}>
                <td><strong>{data.month}</strong></td>
                <td>฿{data.income.toLocaleString()}</td>
                <td>฿{data.expense.toLocaleString()}</td>
                <td>
                  <strong>
                    ฿{(data.income - data.expense).toLocaleString()}
                  </strong>
                </td>
                <td>
                  {(
                    ((data.income - data.expense) / data.income) *
                    100
                  ).toFixed(1)}
                  %
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart Placeholder */}
      <div className="chart-section">
        <h3 className="chart-title">📈 แนวโน้มรายได้และค่าใช้จ่าย</h3>
        <div className="chart-placeholder">
          📊 กราฟแนวโน้มรายได้ ค่าใช้จ่าย และกำไรสุทธิ
        </div>
      </div>

      {/* Tenants Summary */}
      <div className="table-section">
        <div className="section-header">
          <h2 className="section-title">👥 สรุปผู้เช่า</h2>
          <a href="#" className="section-action">ดูทั้งหมด</a>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ระยะเวลา</th>
              <th>ผู้เช่าใหม่</th>
              <th>การออกจากห้อง</th>
              <th>ยอดรวม</th>
              <th>อัตราการเปลี่ยนแปลง</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>เดือนที่แล้ว</strong></td>
              <td>12</td>
              <td>3</td>
              <td>120</td>
              <td style={{ color: '#28a745' }}>+7.5%</td>
            </tr>
            <tr>
              <td><strong>เดือนนี้</strong></td>
              <td>5</td>
              <td>2</td>
              <td>123</td>
              <td style={{ color: '#28a745' }}>+2.5%</td>
            </tr>
            <tr>
              <td><strong>ค่าเฉลี่ย</strong></td>
              <td>8.5</td>
              <td>2.5</td>
              <td>121.5</td>
              <td style={{ color: '#28a745' }}>+5%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button className="page-btn">← ก่อนหน้า</button>
        <button className="page-btn active">1</button>
        <button className="page-btn">2</button>
        <button className="page-btn">3</button>
        <button className="page-btn">ถัดไป →</button>
      </div>
    </div>
  );
}