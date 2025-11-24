"use client"; // 👈 จำเป็นต้องมีเพื่อให้ใช้ useState และ onClick ได้

import React, { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  BedDouble, 
  Users, 
  Zap, 
  Receipt, 
  Wrench, 
  BarChart3, 
  LogOut, 
  Building2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State สำหรับเช็คว่า Sidebar หดอยู่หรือไม่
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { label: "ภาพรวม", href: "/dashboard/admin", icon: <LayoutDashboard size={22} /> },
    { label: "ห้องพัก", href: "/dashboard/admin/rooms", icon: <BedDouble size={22} /> },
    { label: "ผู้เช่า", href: "/dashboard/admin/tenants", icon: <Users size={22} /> },
    { label: "จดมิเตอร์", href: "/dashboard/admin/utilities", icon: <Zap size={22} /> },
    { label: "การเงิน", href: "/dashboard/admin/payments", icon: <Receipt size={22} /> },
    { label: "แจ้งซ่อม", href: "/dashboard/admin/maintenance", icon: <Wrench size={22} /> },
    { label: "รายงาน", href: "/dashboard/admin/reports", icon: <BarChart3 size={22} /> },
  ];

  // กำหนดความกว้างของ Sidebar
  const sidebarWidth = isCollapsed ? "80px" : "260px";

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Prompt', sans-serif" }}>
      
      {/* --- Sidebar --- */}
      <aside style={{ 
        width: sidebarWidth, 
        backgroundColor: '#1e293b', // สี Dark Blue (Slate-900)
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 50,
        transition: 'width 0.3s ease-in-out', // ✨ Animation การเลื่อน
        overflow: 'hidden', // ซ่อนเนื้อหาที่ล้นเวลาหด
        boxShadow: '4px 0 15px rgba(0,0,0,0.1)'
      }}>
        
        {/* Header & Logo */}
        <div style={{ 
            display: 'flex', alignItems: 'center', gap: '12px', 
            height: '80px', padding: '0 20px',
            whiteSpace: 'nowrap'
        }}>
            <div style={{
                minWidth: '40px', height: '40px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
                borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)'
            }}>
                <Building2 size={24} color="white" />
            </div>
            
            {/* ซ่อนชื่อเมื่อหด */}
            <div style={{ 
                opacity: isCollapsed ? 0 : 1, 
                transition: 'opacity 0.2s',
                display: isCollapsed ? 'none' : 'block' 
            }}>
                <div style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '0.5px' }}>SSS-Apartment</div>
                <div style={{ fontSize: '11px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Panel</div>
            </div>
        </div>

        {/* Toggle Button (ปุ่มลูกศรยืดหด) */}
        <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
                position: 'absolute',
                top: '25px',
                right: '-12px',
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                color: '#334155',
                zIndex: 60,
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
        >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
        
        {/* Menu List */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px' }}>
            {menuItems.map((item) => (
                <Link 
                    key={item.href} 
                    href={item.href} 
                    style={{ textDecoration: 'none' }}
                >
                    <div 
                        className="sidebar-item"
                        style={{
                            display: 'flex', alignItems: 'center', 
                            padding: '12px 14px', borderRadius: '12px',
                            color: '#cbd5e1',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            position: 'relative',
                            justifyContent: isCollapsed ? 'center' : 'flex-start'
                        }}
                        // Inline Hover Effect
                        onMouseEnter={(e) => { 
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; 
                            e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => { 
                            e.currentTarget.style.backgroundColor = 'transparent'; 
                            e.currentTarget.style.color = '#cbd5e1';
                        }}
                    >
                        <span style={{ minWidth: '24px', display:'flex', justifyContent:'center' }}>
                            {item.icon}
                        </span>
                        
                        {!isCollapsed && (
                            <span style={{ 
                                marginLeft: '12px', fontSize: '15px', fontWeight: '500', 
                                whiteSpace: 'nowrap', opacity: isCollapsed ? 0 : 1, transition: 'opacity 0.2s'
                            }}>
                                {item.label}
                            </span>
                        )}
                    </div>
                </Link>
            ))}
        </nav>

        {/* Footer (Logout) */}
        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
           <Link href="/login" style={{ textDecoration: 'none' }}>
             <div 
                style={{
                    display: 'flex', alignItems: 'center', 
                    padding: '12px', borderRadius: '12px',
                    color: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { 
                    e.currentTarget.style.backgroundColor = '#ef4444'; 
                    e.currentTarget.style.color = 'white'; 
                }}
                onMouseLeave={(e) => { 
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; 
                    e.currentTarget.style.color = '#ef4444'; 
                }}
             >
                 <LogOut size={22} />
                 {!isCollapsed && <span style={{ marginLeft: '12px', fontWeight: '600', fontSize:'14px' }}>ออกจากระบบ</span>}
             </div>
           </Link>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main style={{ 
          flex: 1, 
          padding: '30px', 
          background: 'linear-gradient(to bottom right, #0f172a, #0a3b57, #0f172a)',
          marginLeft: sidebarWidth,
          width: `calc(100% - ${sidebarWidth})`,
          minHeight: '100vh',
          transition: 'margin-left 0.3s ease-in-out, width 0.3s ease-in-out'
      }}>
        {children}
      </main>
    </div>
  );
}