'use client';

import React, { useState, useEffect } from 'react';
import { DoorOpen, Check, X, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './bookingpage.css'; // ตรวจสอบว่าชื่อไฟล์ตรงกันนะครับ

interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  price: number;
  floor: number;
  status: string;
  size?: string;
  facilities?: string[];
  image?: string;
}

const BookingPage = () => {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    idCard: '',
    moveInDate: '',
    duration: '6'
  });

  // 1. Fetch Rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('/api/rooms');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const availableRooms = data
            .filter((r: any) => r.status === 'available')
            .map((r: any) => ({
              ...r,
              size: r.type === 'studio' ? '30 ตร.ม.' : r.type === 'double' ? '32 ตร.ม.' : '22 ตร.ม.',
              facilities: getFacilitiesByType(r.type),
              image: getRoomIcon(r.type)
            }));
          setRooms(availableRooms);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const getFacilitiesByType = (type: string) => {
    const base = ['เตียง', 'ตู้เสื้อผ้า', 'โต๊ะทำงาน'];
    if (type === 'double') return [...base, 'เตียงคู่', 'แอร์', 'ระเบียง'];
    if (type === 'studio') return [...base, 'แอร์', 'ทีวี', 'ตู้เย็น', 'ไมโครเวฟ'];
    return [...base, 'พัดลม'];
  };

  const getRoomIcon = (type: string) => {
    if (type === 'studio') return '⭐';
    if (type === 'double') return '🏠🏠';
    return '🏠';
  };

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const handleSubmitBooking = async () => {
    if (!selectedRoom) return;
    
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.moveInDate) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
    }

    if (!confirm(`ยืนยันการจองห้อง ${selectedRoom.roomNumber}?`)) return;

    try {
      const res = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: selectedRoom._id,
          startDate: bookingForm.moveInDate,
          deposit: selectedRoom.price * 2,
          status: 'active',
          // ส่งข้อมูลส่วนตัวไปให้ API สร้าง User อัตโนมัติ
          name: bookingForm.name,
          phone: bookingForm.phone,
          idCard: bookingForm.idCard,
          email: bookingForm.email
        })
      });

      if (res.ok) {
        alert('🎉 จองห้องพักสำเร็จ! ยินดีต้อนรับสู่หอพักของเรา');
        setShowBookingModal(false);
        router.push('/dashboard/tenant');
      } else {
        const err = await res.json();
        alert('เกิดข้อผิดพลาด: ' + (err.message || 'Failed'));
      }

    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  if (loading) {
    return (
        <div className="booking-page" style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', color:'white'}}>
            <p>กำลังค้นหาห้องว่าง...</p>
        </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-header">
        <div className="booking-header-content">
          <DoorOpen className="booking-header-icon" />
          <div>
            <h1 className="booking-title">จองห้องพัก</h1>
            <p className="booking-subtitle">
              เลือกห้องที่คุณต้องการและเริ่มต้นชีวิตใหม่กับเรา
            </p>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="rooms-grid">
        {rooms.length === 0 ? (
            <div style={{textAlign: 'center', width: '100%', padding: '50px', color: '#94a3b8'}}>
                <h3>ขออภัย ขณะนี้ไม่มีห้องว่าง</h3>
            </div>
        ) : (
            rooms.map((room) => (
            <div key={room._id} className="room-booking-card">
                <div className="room-card-image-section">
                <div className="room-image-placeholder">
                    <span className="room-emoji" style={{fontSize:'40px'}}>{room.image}</span>
                </div>
                <div className="room-badge">ห้อง {room.roomNumber}</div>
                </div>

                <div className="room-card-content">
                <h3 className="room-card-title-text" style={{textTransform: 'capitalize'}}>{room.type}</h3>
                <div className="room-price">
                    <span className="room-price-amount">{room.price.toLocaleString()}</span>
                    <span className="room-price-unit"> ฿/เดือน</span>
                </div>

                <div className="room-details">
                    <div className="room-detail">
                    <span className="room-detail-label">ชั้น</span>
                    <span className="room-detail-value">{room.floor}</span>
                    </div>
                    <div className="room-detail">
                    <span className="room-detail-label">ขนาด</span>
                    <span className="room-detail-value">{room.size}</span>
                    </div>
                </div>

                <div className="room-facilities">
                    <p className="facilities-title">สิ่งอำนวยความสะดวก</p>
                    <div className="facilities-list">
                    {room.facilities?.map((facility, i) => (
                        <span key={i} className="facility-tag">
                        <Check className="facility-icon" />
                        {facility}
                        </span>
                    ))}
                    </div>
                </div>

                <button 
                    className="book-button"
                    onClick={() => handleBookRoom(room)}
                >
                    <DoorOpen className="button-icon" />
                    จองห้องนี้
                </button>
                </div>
            </div>
            ))
        )}
      </div>

      {/* Modal */}
      {showBookingModal && selectedRoom && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">จองห้อง {selectedRoom.roomNumber}</h2>
              <button 
                className="modal-close"
                onClick={() => setShowBookingModal(false)}
              >
                <X className="close-icon" />
              </button>
            </div>

            <div className="modal-body">
              <div className="selected-room-summary">
                <div className="summary-icon" style={{fontSize:'40px'}}>{selectedRoom.image}</div>
                <div>
                  <h3 className="summary-title" style={{textTransform: 'capitalize'}}>{selectedRoom.type}</h3>
                  <p className="summary-price">{selectedRoom.price.toLocaleString()} ฿/เดือน</p>
                </div>
              </div>

              <div className="booking-form">
                <div className="form-group">
                  <label className="form-label">ชื่อ-นามสกุล *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">เบอร์โทรศัพท์ *</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">อีเมล *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">วันที่ต้องการเข้าพัก *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={bookingForm.moveInDate}
                    onChange={(e) => setBookingForm({...bookingForm, moveInDate: e.target.value})}
                  />
                </div>

                <div className="booking-summary">
                  <div className="summary-row">
                    <span>ค่าเช่าล่วงหน้า (1 เดือน)</span>
                    <span>{selectedRoom.price.toLocaleString()} ฿</span>
                  </div>
                  <div className="summary-row">
                    <span>ค่ามัดจำ (2 เดือน)</span>
                    <span>{(selectedRoom.price * 2).toLocaleString()} ฿</span>
                  </div>
                  <div className="summary-total">
                    <span>รวมชำระแรกเข้า</span>
                    <span className="total-amount">
                      {(selectedRoom.price * 3).toLocaleString()} ฿
                    </span>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowBookingModal(false)}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="button"
                    className="confirm-button"
                    onClick={handleSubmitBooking}
                  >
                    <Calendar className="button-icon" />
                    ยืนยันการจอง
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;