// app/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Home,
  LogIn,
  UserPlus,
  Users,
  DoorOpen,
  CreditCard,
  Wrench,
  FileText,
  Menu,
  X,
  Building2,
  MapPin,
  Phone,
  Mail,
  User
} from 'lucide-react';
import styles from './page.module.css';

export default function DormHomepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { icon: Home, label: 'หน้าแรก', href: '/' },
    { icon: LogIn, label: 'เข้าสู่ระบบ', href: '/login' },
    { icon: UserPlus, label: 'สมัครสมาชิก', href: '/register' },
    { icon: User, label: 'โปรไฟล์', href: '/dashboard/tenant/profile/' },
    { icon: CreditCard, label: 'การชำระเงิน', href: '/dashboard/tenant/payment' },
    { icon: FileText, label: 'ค่าน้ำค่าไฟ', href: '/dashboard/tenant/utilities' },
    { icon: Wrench, label: 'แจ้งซ่อม', href: '/dashboard/tenant/maintenance' }
  ];

  const stats = [
    { label: 'ห้องพักทั้งหมด', value: '120', sublabel: 'ห้อง' },
    { label: 'ห้องว่าง', value: '15', sublabel: 'ห้อง' },
    { label: 'ผู้เช่าปัจจุบัน', value: '105', sublabel: 'คน' },
    { label: 'อัตราการเข้าพัก', value: '87.5', sublabel: '%' },
  ];

  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.navContent}>
            <div className={styles.logo}>
              <Building2 className={styles.logoIcon} />
              <span className={styles.logoText}>DormHub</span>
            </div>

            {/* Desktop Navigation */}
            <div className={styles.desktopNav}>
              {navigationItems.map((item, i) => (
                <a key={i} href={item.href} className={styles.navLink}>
                  <item.icon className={styles.navIcon} />
                  <span>{item.label}</span>
                </a>
              ))}
              <a href="/login">
                <button className={styles.ctaButton}>เริ่มต้นใช้งาน</button>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={styles.mobileMenuButton}
            >
              {mobileMenuOpen ? <X className={styles.menuIcon} /> : <Menu className={styles.menuIcon} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileMenuContent}>
              {navigationItems.map((item, i) => (
                <a key={i} href={item.href} className={styles.mobileNavLink}>
                  <item.icon className={styles.mobileNavIcon} />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              ระบบจัดการ
              <span className={styles.heroTitleGradient}> หอพัก </span>
              ที่ทันสมัย
            </h1>
            <p className={styles.heroDescription}>
              จัดการหอพักของคุณได้อย่างมีประสิทธิภาพ ใช้งานง่าย
            </p>
            <div className={styles.heroCta}>
              <a href="/login">
                <button className={styles.primaryButton}>เริ่มต้นใช้งาน</button>
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className={styles.statsGrid}>
            {stats.map((stat, i) => (
              <div key={i} className={styles.statCard}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statSublabel}>{stat.sublabel}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* ❌ Features Section ถูกลบแล้ว ❌ */}

          {/* Contact Info */}
          <div className={styles.contactSection}>
            <h2 className={styles.contactTitle}>ข้อมูลติดต่อ</h2>
            <div className={styles.contactGrid}>
              <div className={styles.contactItem}>
                <div className={`${styles.contactIconWrapper} ${styles.purpleIcon}`}>
                  <MapPin className={styles.contactIcon} />
                </div>
                <div>
                  <div className={styles.contactLabel}>ที่อยู่</div>
                  <div className={styles.contactValue}>123 ถนนสุขุมวิท กรุงเทพฯ</div>
                </div>
              </div>

              <div className={styles.contactItem}>
                <div className={`${styles.contactIconWrapper} ${styles.pinkIcon}`}>
                  <Phone className={styles.contactIcon} />
                </div>
                <div>
                  <div className={styles.contactLabel}>โทรศัพท์</div>
                  <div className={styles.contactValue}>02-123-4567</div>
                </div>
              </div>

              <div className={styles.contactItem}>
                <div className={`${styles.contactIconWrapper} ${styles.purpleIcon}`}>
                  <Mail className={styles.contactIcon} />
                </div>
                <div>
                  <div className={styles.contactLabel}>อีเมล</div>
                  <div className={styles.contactValue}>contact@dormhub.com</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
    
          </div>
        </div>
      </footer>

    </div>
  );
}
