"use client";

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, FileText, Download, CheckCircle, CreditCard } from 'lucide-react';
import "./profile.css"; 

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'contract'>('profile');
  const [loading, setLoading] = useState(true);

  const [tenant, setTenant] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    idCard: '',
    address: '',
    emergencyContact: '',
    emergencyName: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 1. หาว่า "ใคร" ล็อกอินอยู่ (จาก LocalStorage)
        const userStr = localStorage.getItem("currentUser");
        if (!userStr) {
            setLoading(false);
            return;
        }
        const currentUser = JSON.parse(userStr);

        // 2. ดึงข้อมูลผู้เช่าทั้งหมด
        const res = await fetch("/api/tenants");
        const data = await res.json();

        if (Array.isArray(data)) {
          // 3. กรองหา "ผู้เช่า" ที่มี User ID ตรงกับคนล็อกอิน
          // (เช็คทั้ง userId._id และ userId ที่เป็น string เผื่อกรณี populate ไม่ติด)
          const myTenant = data.find((t: any) => 
            (t.userId?._id === currentUser.id || t.userId === currentUser.id) &&
            t.status === 'active'
          );
          
          if (myTenant) {
            setTenant(myTenant);
            
            // เอาข้อมูลจริงมาใส่ฟอร์ม
            setFormData({
              name: myTenant.userId?.name || '',
              email: myTenant.userId?.email || '',
              phone: myTenant.userId?.phone || '',
              idCard: myTenant.identityCard || '', 
              address: myTenant.address || 'กรุงเทพฯ', // ถ้าใน DB ไม่มีก็ใส่ค่า default
              emergencyContact: myTenant.emergencyContact?.phone || '',
              emergencyName: myTenant.emergencyContact?.name || ''
            });
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = () => {
    setIsEditing(false);
    alert('บันทึกข้อมูลเรียบร้อยแล้ว (Demo)');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset กลับเป็นค่าเดิม
    if (tenant) {
        setFormData({
            name: tenant.userId?.name || '',
            email: tenant.userId?.email || '',
            phone: tenant.userId?.phone || '',
            idCard: tenant.identityCard || '',
            address: tenant.address || 'กรุงเทพฯ',
            emergencyContact: tenant.emergencyContact?.phone || '',
            emergencyName: tenant.emergencyContact?.name || ''
        });
    }
  };

  const handleDownloadContract = () => {
    alert("กำลังดาวน์โหลดสัญญา...");
  };

  if (loading) return <div style={{padding:'50px', textAlign:'center'}}>กำลังโหลดข้อมูลโปรไฟล์...</div>;
  
  // ถ้าไม่เจอ Tenant (แปลว่าเป็น User ใหม่ที่ยังไม่มีห้อง)
  if (!tenant) return (
    <div style={{padding:'50px', textAlign:'center', color:'#666'}}>
        <User size={48} style={{margin:'0 auto 10px'}}/>
        <h3>ไม่พบข้อมูลผู้เช่า</h3>
        <p>คุณอาจจะยังไม่ได้ถูกเพิ่มเข้าห้องพัก <br/>กรุณาติดต่อผู้ดูแลหอพัก</p>
    </div>
  );

  return (
    <div className="profile-page">
      
      <div className="container">
        {/* Profile Card */}
        <div className="profile-card">
            <div className="avatar">
                <User className="avatar-icon" />
            </div>
            <div className="profile-info">
                <h2 className="profile-name">{tenant.userId?.name}</h2>
                <p className="profile-room">
                    ห้อง {tenant.roomId?.roomNumber} • ชั้น {tenant.roomId?.floor}
                </p>
                <span className="status-badge">
                    <CheckCircle size={16} />
                    สถานะ: ผู้เช่าปัจจุบัน
                </span>
            </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> ข้อมูลส่วนตัว
          </button>
          <button
            className={`tab ${activeTab === 'contract' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('contract')}
          >
            <FileText size={18} /> รายละเอียดสัญญา
          </button>
        </div>

        {/* Content */}
        <div className="content">
          {/* --- Profile Tab --- */}
          {activeTab === 'profile' && (
            <div className="tab-content">
              <div className="card-header">
                <h3 className="card-title">ข้อมูลส่วนตัว</h3>
                {!isEditing ? (
                  <button className="edit-button" onClick={() => setIsEditing(true)}>
                    <Edit2 size={16} /> แก้ไขข้อมูล
                  </button>
                ) : (
                  <div className="action-buttons">
                    <button className="save-button" onClick={handleSave}>
                      <Save size={16} /> บันทึก
                    </button>
                    <button className="cancel-button" onClick={handleCancel}>
                      <X size={16} /> ยกเลิก
                    </button>
                  </div>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="label"><User className="label-icon" /> ชื่อ-นามสกุล</label>
                  <input type="text" className="input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} disabled={!isEditing} />
                </div>

                <div className="form-group">
                  <label className="label"><Mail className="label-icon" /> อีเมล</label>
                  <input type="email" className="input" value={formData.email} disabled style={{backgroundColor: '#eee'}} />
                </div>

                <div className="form-group">
                  <label className="label"><Phone className="label-icon" /> เบอร์โทรศัพท์</label>
                  <input type="tel" className="input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} disabled={!isEditing} />
                </div>

                <div className="form-group">
                  <label className="label"><CreditCard className="label-icon" /> เลขบัตรประชาชน</label>
                  <input type="text" className="input" value={formData.idCard} onChange={(e) => setFormData({...formData, idCard: e.target.value})} disabled={!isEditing} />
                </div>

                <div className="form-group full-width">
                  <label className="label"><MapPin className="label-icon" /> ที่อยู่ตามทะเบียนบ้าน</label>
                  <textarea className="textarea" rows={3} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} disabled={!isEditing} />
                </div>

                <div className="form-group">
                  <label className="label"><User className="label-icon" /> ผู้ติดต่อฉุกเฉิน</label>
                  <input type="text" className="input" value={formData.emergencyName} onChange={(e) => setFormData({...formData, emergencyName: e.target.value})} disabled={!isEditing} />
                </div>

                <div className="form-group">
                  <label className="label"><Phone className="label-icon" /> เบอร์ฉุกเฉิน</label>
                  <input type="tel" className="input" value={formData.emergencyContact} onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})} disabled={!isEditing} />
                </div>
              </div>
            </div>
          )}

          {/* --- Contract Tab --- */}
          {activeTab === 'contract' && (
            <div className="tab-content">
              <div className="card-header">
                <h3 className="card-title">สัญญาเช่า</h3>
                <button className="download-button" onClick={handleDownloadContract}>
                  <Download size={16} /> ดาวน์โหลดสัญญา
                </button>
              </div>

              <div className="contract-info">
                <div className="contract-section">
                  <h4 className="section-title">ข้อมูลห้องพัก</h4>
                  <div className="info-grid">
                    <div className="info-item">
                        <span className="info-label">เลขห้อง</span>
                        <span className="info-value">{tenant.roomId?.roomNumber}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">ชั้น</span>
                        <span className="info-value">{tenant.roomId?.floor}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">ประเภท</span>
                        <span className="info-value" style={{textTransform:'capitalize'}}>{tenant.roomId?.type}</span>
                    </div>
                  </div>
                </div>

                <div className="contract-section">
                  <h4 className="section-title">ระยะเวลา & ค่าใช้จ่าย</h4>
                  <div className="info-grid">
                    <div className="info-item">
                        <span className="info-label"><Calendar size={14}/> วันเริ่มสัญญา</span>
                        <span className="info-value">{new Date(tenant.startDate).toLocaleDateString('th-TH')}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">ค่าเช่ารายเดือน</span>
                        <span className="info-value-highlight">฿{tenant.roomId?.price?.toLocaleString()}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">เงินประกัน</span>
                        <span className="info-value">฿{tenant.deposit?.toLocaleString()}</span>
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