// app/profile/page.tsx
// src/app/(dashboard)/(tenant)/profile/page.tsx
'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, FileText, Download, Building2, CreditCard, Clock, CheckCircle } from 'lucide-react';
import styles from './profilepage.module.css'; // ← แก้ตรงนี้ให้ตรงกับชื่อไฟล์

export default function ProfilePage() {
  // ... โค้ดเดิม
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'contract'>('profile');
  
  const [profileData, setProfileData] = useState({
    firstName: 'สมชาย',
    lastName: 'ใจดี',
    email: 'somchai@example.com',
    phone: '081-234-5678',
    idCard: '1-1234-56789-01-2',
    birthDate: '1995-05-15',
    address: '123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพฯ 10110',
    emergencyContact: '082-345-6789',
    emergencyName: 'นางสาวสมหญิง ใจดี (แม่)',
  });

  const contractData = {
    contractNumber: 'CTR-2024-001',
    roomNumber: 'A301',
    floor: '3',
    building: 'อาคาร A',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    monthlyRent: '5,000',
    deposit: '10,000',
    electricRate: '7',
    waterRate: '20',
    status: 'active',
    paymentStatus: 'paid',
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
    alert('บันทึกข้อมูลเรียบร้อยแล้ว');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset data logic here
  };

  const handleDownloadContract = () => {
  const link = document.createElement('a');
  link.href = '/contract.pdf';   // ชี้ไปที่ไฟล์ใน public
  link.download = 'contract.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
        </div>
      </div>

      <div className={styles.container}>
        {/* Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              <User className={styles.avatarIcon} />
            </div>
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className={styles.profileRoom}>ห้อง {contractData.roomNumber} - {contractData.building}</p>
              <span className={styles.statusBadge}>
                <CheckCircle className={styles.statusIcon} />
                สถานะ: ผู้เช่าปัจจุบัน
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'profile' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User className={styles.tabIcon} />
            ข้อมูลส่วนตัว
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'contract' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('contract')}
          >
            <FileText className={styles.tabIcon} />
            รายละเอียดสัญญา
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className={styles.tabContent}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>ข้อมูลส่วนตัว</h3>
                {!isEditing ? (
                  <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                    <Edit2 className={styles.buttonIcon} />
                    แก้ไขข้อมูล
                  </button>
                ) : (
                  <div className={styles.actionButtons}>
                    <button className={styles.saveButton} onClick={handleSave}>
                      <Save className={styles.buttonIcon} />
                      บันทึก
                    </button>
                    <button className={styles.cancelButton} onClick={handleCancel}>
                      <X className={styles.buttonIcon} />
                      ยกเลิก
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <User className={styles.labelIcon} />
                    ชื่อ
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    disabled={!isEditing}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <User className={styles.labelIcon} />
                    นามสกุล
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    disabled={!isEditing}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Mail className={styles.labelIcon} />
                    อีเมล
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={!isEditing}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Phone className={styles.labelIcon} />
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditing}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <CreditCard className={styles.labelIcon} />
                    เลขบัตรประชาชน
                  </label>
                  <input
                    type="text"
                    value={profileData.idCard}
                    onChange={(e) => setProfileData({...profileData, idCard: e.target.value})}
                    disabled={!isEditing}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Calendar className={styles.labelIcon} />
                    วันเกิด
                  </label>
                  <input
                    type="date"
                    value={profileData.birthDate}
                    onChange={(e) => setProfileData({...profileData, birthDate: e.target.value})}
                    disabled={!isEditing}
                    className={styles.input}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>
                    <MapPin className={styles.labelIcon} />
                    ที่อยู่
                  </label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    disabled={!isEditing}
                    className={styles.textarea}
                    rows={3}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Phone className={styles.labelIcon} />
                    เบอร์ติดต่อฉุกเฉิน
                  </label>
                  <input
                    type="tel"
                    value={profileData.emergencyContact}
                    onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                    disabled={!isEditing}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <User className={styles.labelIcon} />
                    ชื่อผู้ติดต่อฉุกเฉิน
                  </label>
                  <input
                    type="text"
                    value={profileData.emergencyName}
                    onChange={(e) => setProfileData({...profileData, emergencyName: e.target.value})}
                    disabled={!isEditing}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contract Tab */}
          {activeTab === 'contract' && (
            <div className={styles.tabContent}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>รายละเอียดสัญญาเช่า</h3>
                <button className={styles.downloadButton} onClick={handleDownloadContract}>
  <Download className={styles.buttonIcon} />
  ดาวน์โหลดสัญญา
</button>
              </div>

              <div className={styles.contractInfo}>
                <div className={styles.contractSection}>
                  <h4 className={styles.sectionTitle}>ข้อมูลสัญญา</h4>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>เลขที่สัญญา</span>
                      <span className={styles.infoValue}>{contractData.contractNumber}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>เลขห้อง</span>
                      <span className={styles.infoValue}>{contractData.roomNumber}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>ชั้น</span>
                      <span className={styles.infoValue}>{contractData.floor}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>อาคาร</span>
                      <span className={styles.infoValue}>{contractData.building}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.contractSection}>
                  <h4 className={styles.sectionTitle}>ระยะเวลาสัญญา</h4>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>
                        <Calendar className={styles.infoIcon} />
                        วันเริ่มสัญญา
                      </span>
                      <span className={styles.infoValue}>{contractData.startDate}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>
                        <Calendar className={styles.infoIcon} />
                        วันสิ้นสุดสัญญา
                      </span>
                      <span className={styles.infoValue}>{contractData.endDate}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.contractSection}>
                  <h4 className={styles.sectionTitle}>รายละเอียดค่าใช้จ่าย</h4>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>ค่าเช่ารายเดือน</span>
                      <span className={styles.infoValueHighlight}>{contractData.monthlyRent} บาท</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>ค่าประกัน</span>
                      <span className={styles.infoValue}>{contractData.deposit} บาท</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>ค่าไฟต่อหน่วย</span>
                      <span className={styles.infoValue}>{contractData.electricRate} บาท</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>ค่าน้ำต่อหน่วย</span>
                      <span className={styles.infoValue}>{contractData.waterRate} บาท</span>
                    </div>
                  </div>
                </div>

                <div className={styles.contractSection}>
                  <h4 className={styles.sectionTitle}>สถานะ</h4>
                  <div className={styles.statusGrid}>
                    <div className={styles.statusCard}>
                      <CheckCircle className={styles.statusCardIcon} />
                      <div>
                        <p className={styles.statusCardLabel}>สถานะสัญญา</p>
                        <p className={styles.statusCardValue}>ใช้งานอยู่</p>
                      </div>
                    </div>
                    <div className={styles.statusCard}>
                      <Clock className={styles.statusCardIcon} />
                      <div>
                        <p className={styles.statusCardLabel}>สถานะการชำระเงิน</p>
                        <p className={styles.statusCardValue}>ชำระครบแล้ว</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}