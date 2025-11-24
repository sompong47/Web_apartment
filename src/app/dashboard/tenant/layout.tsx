'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Building2, Home, DoorOpen, CreditCard, Wrench, FileText, Users, LogOut, Menu, X } from 'lucide-react';
import './layout.css';

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    { icon: Home, label: 'หน้าแรก', href: '/dashboard' },
    { icon: DoorOpen, label: 'จองห้อง', href: '/dashboard/tenant/booking' },
    { icon: CreditCard, label: 'การชำระเงิน', href: '/dashboard/tenant/payment' },
    { icon: FileText, label: 'ค่าน้ำค่าไฟ', href: '/dashboard/tenant/utilities' },
    { icon: Wrench, label: 'แจ้งซ่อม', href: '/dashboard/tenant/maintenance' },
    { icon: Users, label: 'โปรไฟล์', href: '/dashboard/tenant/profile' },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Logout clicked!'); // เพื่อ debug
    
    try {
      // ลบข้อมูล
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      // Redirect ไปหน้า login
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  return (
    <div className="tenant-layout">
      {/* Navigation */}
      <nav className="tenant-navbar">
        <div className="tenant-nav-container">
          <div className="tenant-nav-content">
            <div className="tenant-logo">
              <Building2 className="tenant-logo-icon" />
              <span className="tenant-logo-text">SSS-Apartment</span>
            </div>

            {/* Desktop Navigation */}
            <div className="tenant-desktop-nav">
              {navigationItems.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className={`tenant-nav-link ${isActive(item.href) ? 'active' : ''}`}
                >
                  <item.icon className="tenant-nav-icon" />
                  <span>{item.label}</span>
                </a>
              ))}
              <button 
                className="tenant-logout-button" 
                onClick={handleLogout}
                type="button"
              >
                <LogOut className="tenant-nav-icon" />
                ออกจากระบบ
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="tenant-mobile-menu-button"
            >
              {mobileMenuOpen ? <X className="tenant-menu-icon" /> : <Menu className="tenant-menu-icon" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="tenant-mobile-menu">
            <div className="tenant-mobile-menu-content">
              {navigationItems.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className={`tenant-mobile-nav-link ${isActive(item.href) ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="tenant-mobile-nav-icon" />
                  <span>{item.label}</span>
                </a>
              ))}
              <button className="tenant-mobile-logout-button" onClick={handleLogout}>
                <LogOut className="tenant-mobile-nav-icon" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="tenant-main-content">
        {children}
      </main>
    </div>
  );
}