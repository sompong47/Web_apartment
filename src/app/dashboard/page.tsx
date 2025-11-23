'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  Home,
  LogOut,
  User,
  CreditCard,
  Wrench,
  Bell,
  Menu,
  X,
  Building2,
  AlertCircle,
  MessageSquare,
  Phone,
  Zap,
  Droplet,
  FileText,
  DoorOpen,
  Users
} from 'lucide-react';
import styles from './dashboardpage.module.css';

export default function TenantDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('overview');

  const router = useRouter();

  // ข้อมูลจำลองของผู้เช่า
  const tenantData = {
    name: 'สมชาย ใจดี',
    room: '205',
    roomType: 'ห้องเดี่ยว พัดลม',
    rentPrice: 3500,
    checkinDate: '15 มี.ค. 2567',
    contractEnd: '14 มี.ค. 2568',
    daysLeft: 120
  };

  const currentBill = {
    rent: 3500,
    electric: 450,
    water: 120,
    internet: 200,
    total: 4270,
    dueDate: '5 พ.ย. 2567',
    status: 'pending'
  };

  const paymentHistory = [
    { month: 'ต.ค. 67', amount: 4180, date: '3 ต.ค. 67', status: 'paid' },
    { month: 'ก.ย. 67', amount: 4320, date: '2 ก.ย. 67', status: 'paid' },
    { month: 'ส.ค. 67', amount: 4150, date: '4 ส.ค. 67', status: 'paid' },
  ];

  const maintenanceRequests = [
    { id: 1, issue: 'ก๊อกน้ำห้องน้ำรั่ว', status: 'in-progress', date: '1 พ.ย. 67' },
    { id: 2, issue: 'แอร์ไม่เย็น', status: 'completed', date: '25 ต.ค. 67' },
  ];

  const announcements = [
    { id: 1, title: 'ปิดน้ำชั่วคราว', date: '10 พ.ย. 67', time: '09:00-12:00' },
    { id: 2, title: 'แจ้งเตือนค่าเช่า', date: '5 พ.ย. 67', time: '' },
  ];

  const navigationItems = [
  { icon: Home, label: 'หน้าแรก', id: 'overview', href: '', isInternal: true },
  { icon: DoorOpen, label: 'จองห้อง', href: '/dashboard/tenant/booking' },
  { icon: CreditCard, label: 'การชำระเงิน', href: '/dashboard/tenant/payment', isInternal: false },
  { icon: Zap, label: 'ค่าน้ำค่าไฟ', href: '/dashboard/tenant/utilities', isInternal: false },
  { icon: Wrench, label: 'แจ้งซ่อม', href: '/dashboard/tenant/maintenance', isInternal: false },
  { icon: Users, label: 'โปรไฟล์', href: '/dashboard/tenant/profile', isInternal: false },
];

  const handleLogout = () => {
    window.location.href = '/';
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { className: string; text: string }> = {
      pending: { className: styles.badgeYellow, text: 'รอชำระ' },
      paid: { className: styles.badgeGreen, text: 'ชำระแล้ว' },
      overdue: { className: styles.badgeRed, text: 'เกินกำหนด' },
      'in-progress': { className: styles.badgeBlue, text: 'กำลังดำเนินการ' },
      completed: { className: styles.badgeGreen, text: 'เสร็จแล้ว' },
    };

    const badge = badges[status] ?? badges.pending;
    return <span className={`${styles.badge} ${badge.className}`}>{badge.text}</span>;
  };

  const goToCreateMaintenance = (event: React.MouseEvent<HTMLButtonElement>) => {
    router.push('/dashboard/tenant/maintenance');
    setMobileMenuOpen(false);
  };

  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.navContent}>
            <div className={styles.logo}>
              <Building2 className={styles.logoIcon} />
              <span className={styles.logoText}>SorHub</span>
            </div>

            {/* Desktop Navigation */}
            <div className={styles.desktopNav}>
              {navigationItems.map((item, i) => (
                item.isInternal ? (
                  <button
                    key={i}
                    onClick={() => setActiveTab(item.id as string)}
                    className={`${styles.navButton} ${activeTab === item.id ? styles.active : ''}`}
                  >
                    <item.icon className={styles.navIcon} />
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <a
                    key={i}
                    href={item.href}
                    className={styles.navButton}
                  >
                    <item.icon className={styles.navIcon} />
                    <span>{item.label}</span>
                  </a>
                )
              ))}
              <button className={styles.logoutButton} onClick={handleLogout}>
                <LogOut className={styles.navIcon} />
                <span>ออกจากระบบ</span>
              </button>
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
                item.isInternal ? (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveTab(item.id as string);
                      setMobileMenuOpen(false);
                    }}
                    className={`${styles.mobileNavButton} ${activeTab === item.id ? styles.active : ''}`}
                  >
                    <item.icon className={styles.mobileNavIcon} />
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <a
                    key={i}
                    href={item.href}
                    className={styles.mobileNavButton}
                  >
                    <item.icon className={styles.mobileNavIcon} />
                    <span>{item.label}</span>
                  </a>
                )
              ))}
              <button className={styles.logoutButton} onClick={handleLogout}>
                <LogOut className={styles.navIcon} />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Welcome Section */}
        <div className={styles.welcome}>
          <h1 className={styles.welcomeTitle}>
            สวัสดี, {tenantData.name}
          </h1>
          <p className={styles.welcomeSubtitle}>ยินดีต้อนรับสู่ระบบจัดการหอพัก</p>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className={styles.contentSection}>
            {/* Room Info Card */}
            <div className={styles.roomCard}>
              <div className={styles.roomCardHeader}>
                <h2 className={styles.roomCardTitle}>ห้องของคุณ</h2>
                <Home className={styles.roomCardIcon} />
              </div>
              <div className={styles.roomGrid}>
                <div className={styles.roomInfo}>
                  <p className={styles.roomInfoLabel}>เลขห้อง</p>
                  <p className={styles.roomInfoValue}>{tenantData.room}</p>
                </div>
                <div className={styles.roomInfo}>
                  <p className={styles.roomInfoLabel}>ประเภท</p>
                  <p className={styles.roomInfoValueLarge}>{tenantData.roomType}</p>
                </div>
                <div className={styles.roomInfo}>
                  <p className={styles.roomInfoLabel}>ค่าเช่า/เดือน</p>
                  <p className={styles.roomInfoValue}>{tenantData.rentPrice.toLocaleString()} ฿</p>
                </div>
                <div className={styles.roomInfo}>
                  <p className={styles.roomInfoLabel}>สัญญาเหลือ</p>
                  <p className={styles.roomInfoValue}>{tenantData.daysLeft} วัน</p>
                </div>
              </div>
            </div>

            {/* Current Bill Alert */}
            {currentBill.status === 'pending' && (
              <div className={styles.alertCard}>
                <div className={styles.alertContent}>
                  <AlertCircle className={styles.alertIcon} />
                  <div className={styles.alertInner}>
                    <h3 className={styles.alertTitle}>
                      ค่าเช่าครบกำหนดในอีก 3 วัน!
                    </h3>
                    <p className={styles.alertText}>
                      ยอดชำระทั้งหมด {currentBill.total.toLocaleString()} บาท ครบกำหนด {currentBill.dueDate}
                    </p>
                    <button
                      className={styles.alertButton}
                      onClick={() => {
                        router.push('/dashboard/tenant/payment');
                        setActiveTab('payment');
                      }}
                    >
                      ชำระเงินทันที
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              {/* Bill Card */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={`${styles.cardIconWrapper} ${styles.cardIconPurple}`}>
                    <CreditCard className={`${styles.cardIcon} ${styles.iconPurple}`} />
                  </div>
                  <h3 className={styles.cardTitle}>ค่าใช้จ่ายเดือนนี้</h3>
                </div>
                <div className={styles.billItems}>
                  <div className={styles.billItem}>
                    <span className={styles.billLabel}>ค่าเช่า</span>
                    <span className={styles.billValue}>{currentBill.rent.toLocaleString()} ฿</span>
                  </div>
                  <div className={styles.billItem}>
                    <span className={styles.billLabel}>
                      <Zap className={styles.billIcon} /> ค่าไฟ
                    </span>
                    <span className={styles.billValue}>{currentBill.electric.toLocaleString()} ฿</span>
                  </div>
                  <div className={styles.billItem}>
                    <span className={styles.billLabel}>
                      <Droplet className={styles.billIcon} /> ค่าน้ำ
                    </span>
                    <span className={styles.billValue}>{currentBill.water.toLocaleString()} ฿</span>
                  </div>
                  <div className={styles.billItem}>
                    <span className={styles.billLabel}>อินเทอร์เน็ต</span>
                    <span className={styles.billValue}>{currentBill.internet.toLocaleString()} ฿</span>
                  </div>
                  <div className={styles.billTotal}>
                    <span className={styles.billTotalLabel}>รวมทั้งหมด</span>
                    <span className={styles.billTotalValue}>{currentBill.total.toLocaleString()} ฿</span>
                  </div>
                </div>
                {getStatusBadge(currentBill.status)}
              </div>

              {/* Maintenance Card */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={`${styles.cardIconWrapper} ${styles.cardIconOrange}`}>
                    <Wrench className={`${styles.cardIcon} ${styles.iconOrange}`} />
                  </div>
                  <h3 className={styles.cardTitle}>แจ้งซ่อม</h3>
                </div>
                <div className={styles.maintenanceItems}>
                  {maintenanceRequests.map((req) => (
                    <div key={req.id} className={styles.maintenanceItem}>
                      <div className={styles.maintenanceInfo}>
                        <p className={styles.maintenanceIssue}>{req.issue}</p>
                        <p className={styles.maintenanceDate}>{req.date}</p>
                      </div>
                      {getStatusBadge(req.status)}
                    </div>
                  ))}
                </div>
                <button 
                  className={`${styles.button} ${styles.buttonOrange}`}
                  onClick={goToCreateMaintenance}
                >
                  + แจ้งปัญหาใหม่
                </button>
              </div>

              {/* Announcements Card */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={`${styles.cardIconWrapper} ${styles.cardIconPink}`}>
                    <Bell className={`${styles.cardIcon} ${styles.iconPink}`} />
                  </div>
                  <h3 className={styles.cardTitle}>ประกาศ</h3>
                </div>
                <div className={styles.announcementItems}>
                  {announcements.map((ann) => (
                    <div key={ann.id} className={styles.announcementItem}>
                      <p className={styles.announcementTitle}>{ann.title}</p>
                      <p className={styles.announcementDate}>
                        {ann.date} {ann.time && `• ${ann.time}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActionsGrid}>

            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>ประวัติการชำระเงิน</h2>
            
            {/* Current Bill */}
            <div className={styles.billCard}>
              <h3 className={styles.billCardTitle}>บิลปัจจุบัน</h3>
              <div className={styles.billCardItems}>
                <div className={styles.billCardItem}>
                  <span className={styles.billCardLabel}>ค่าเช่า</span>
                  <span className={styles.billCardValue}>{currentBill.rent.toLocaleString()} ฿</span>
                </div>
                <div className={styles.billCardItem}>
                  <span className={styles.billCardLabel}>ค่าไฟ</span>
                  <span className={styles.billCardValue}>{currentBill.electric.toLocaleString()} ฿</span>
                </div>
                <div className={styles.billCardItem}>
                  <span className={styles.billCardLabel}>ค่าน้ำ</span>
                  <span className={styles.billCardValue}>{currentBill.water.toLocaleString()} ฿</span>
                </div>
                <div className={styles.billCardItem}>
                  <span className={styles.billCardLabel}>อินเทอร์เน็ต</span>
                  <span className={styles.billCardValue}>{currentBill.internet.toLocaleString()} ฿</span>
                </div>
                <div className={styles.billCardTotal}>
                  <span className={styles.billCardTotalLabel}>รวม</span>
                  <span className={styles.billCardTotalValue}>{currentBill.total.toLocaleString()} ฿</span>
                </div>
              </div>
              <button
                className={styles.billCardButton}
                onClick={() => {
                  router.push('/dashboard/tenant/payment');
                  setActiveTab('payment');
                }}
              >
                ชำระเงินเลย
              </button>
            </div>

            {/* Payment History */}
            <div className={styles.card}>
              <h3 className={styles.billCardTitle}>ประวัติการชำระ</h3>
              <div className={styles.paymentHistory}>
                {paymentHistory.map((payment, i) => (
                  <div key={i} className={styles.paymentHistoryItem}>
                    <div className={styles.paymentInfo}>
                      <p className={styles.paymentMonth}>{payment.month}</p>
                      <p className={styles.paymentDate}>{payment.date}</p>
                    </div>
                    <div className={styles.paymentAmount}>
                      <p className={styles.paymentAmountValue}>{payment.amount.toLocaleString()} ฿</p>
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>

            </div>

            <div className={styles.cardList}>
              {maintenanceRequests.map((req) => (
                <div key={req.id} className={styles.maintenanceCard}>
                  <div className={styles.maintenanceCardHeader}>
                    <div className={styles.maintenanceCardInfo}>
                      <h3 className={styles.maintenanceCardTitle}>{req.issue}</h3>
                      <p className={styles.maintenanceCardDate}>แจ้งเมื่อ: {req.date}</p>
                    </div>
                    {getStatusBadge(req.status)}
                  </div>
                  <div className={styles.maintenanceActions}>
                    <button className={styles.linkButton}>ดูรายละเอียด</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>ประกาศจากหอพัก</h2>
            <div className={styles.cardList}>
              {announcements.map((ann) => (
                <div key={ann.id} className={styles.announcementCard}>
                  <div className={styles.announcementCardContent}>
                    <div className={styles.announcementIconWrapper}>
                      <Bell className={`${styles.cardIcon} ${styles.iconPink}`} />
                    </div>
                    <div className={styles.announcementCardInfo}>
                      <h3 className={styles.announcementCardTitle}>{ann.title}</h3>
                      <p className={styles.announcementCardDate}>
                        {ann.date} {ann.time && `• ${ann.time}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>โปรไฟล์ของฉัน</h2>
            <div className={styles.profileCard}>
              <div className={styles.profileItems}>
                <div className={styles.profileItem}>
                  <label className={styles.profileLabel}>ชื่อ-นามสกุล</label>
                  <p className={styles.profileValue}>{tenantData.name}</p>
                </div>
                <div className={styles.profileItem}>
                  <label className={styles.profileLabel}>เลขห้อง</label>
                  <p className={styles.profileValue}>{tenantData.room}</p>
                </div>
                <div className={styles.profileItem}>
                  <label className={styles.profileLabel}>วันที่เข้าพัก</label>
                  <p className={styles.profileValue}>{tenantData.checkinDate}</p>
                </div>
                <div className={styles.profileItem}>
                  <label className={styles.profileLabel}>สัญญาหมดอายุ</label>
                  <p className={styles.profileValue}>{tenantData.contractEnd}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}