'use client';

import React, { useState } from 'react';
import { DoorOpen, Check, Calendar, X } from 'lucide-react';
import './bookingpage.css';

interface Room {
  id: number;
  number: string;
  type: string;
  price: number;
  floor: number;
  size: string;
  facilities: string[];
  available: boolean;
  image: string;
}

const BookingPage = () => {
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

  const availableRooms = [
    {
      id: 1,
      number: '301',
      type: 'ห้องเดี่ยว พัดลม',
      price: 3500,
      floor: 3,
      size: '20 ตร.ม.',
      facilities: ['พัดลม', 'เตียง', 'ตู้เสื้อผ้า', 'โต๊ะทำงาน'],
      available: true,
      image: '🏠'
    },
    {
      id: 2,
      number: '302',
      type: 'ห้องเดี่ยว แอร์',
      price: 4500,
      floor: 3,
      size: '22 ตร.ม.',
      facilities: ['แอร์', 'เตียง', 'ตู้เสื้อผ้า', 'โต๊ะทำงาน', 'ทีวี'],
      available: true,
      image: '❄️'
    },
    {
      id: 3,
      number: '401',
      type: 'ห้องคู่ พัดลม',
      price: 5000,
      floor: 4,
      size: '30 ตร.ม.',
      facilities: ['พัดลม', 'เตียง 2 ชุด', 'ตู้เสื้อผ้า', 'โต๊ะทำงาน'],
      available: true,
      image: '🏠🏠'
    },
    {
      id: 4,
      number: '402',
      type: 'ห้องคู่ แอร์',
      price: 6000,
      floor: 4,
      size: '32 ตร.ม.',
      facilities: ['แอร์', 'เตียง 2 ชุด', 'ตู้เสื้อผ้า', 'โต๊ะทำงาน', 'ทีวี', 'ตู้เย็น'],
      available: true,
      image: '❄️❄️'
    },
    {
      id: 5,
      number: '501',
      type: 'ห้อง VIP',
      price: 8000,
      floor: 5,
      size: '40 ตร.ม.',
      facilities: ['แอร์', 'เตียงใหญ่', 'ตู้เสื้อผ้า', 'โต๊ะทำงาน', 'ทีวี', 'ตู้เย็น', 'ครัวเล็ก', 'ระเบียง'],
      available: true,
      image: '⭐'
    },
  ];

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const handleSubmitBooking = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    alert('ส่งคำขอจองเรียบร้อย! เจ้าหน้าที่จะติดต่อกลับภายใน 24 ชั่วโมง');
    setShowBookingModal(false);
    setBookingForm({
      name: '',
      phone: '',
      email: '',
      idCard: '',
      moveInDate: '',
      duration: '6'
    });
  };

  return (
    <div className="booking-page">
      {/* Header */}
      <div className="booking-header">
        <div className="booking-header-content">
          <DoorOpen className="booking-header-icon" />
          <div>
            <h1 className="booking-title">จองห้องพัก</h1>
            <p className="booking-subtitle">
              เลือกห้องที่คุณต้องการและกรอกข้อมูลเพื่อจองห้องพัก
            </p>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="rooms-grid">
        {availableRooms.map((room) => (
          <div key={room.id} className="room-card">
            <div className="room-image-section">
              <div className="room-image-placeholder">
                <span className="room-emoji">{room.image}</span>
              </div>
              <div className="room-badge">ห้อง {room.number}</div>
            </div>

            <div className="room-content">
              <h3 className="room-type">{room.type}</h3>
              <div className="room-price">
                <span className="room-price-amount">{room.price.toLocaleString()}</span>
                <span className="room-price-unit"> ฿/เดือน</span>
              </div>

              <div className="room-details">
                <div className="room-detail">
                  <span className="room-detail-label">ชั้น:</span>
                  <span className="room-detail-value">{room.floor}</span>
                </div>
                <div className="room-detail">
                  <span className="room-detail-label">ขนาด:</span>
                  <span className="room-detail-value">{room.size}</span>
                </div>
              </div>

              <div className="room-facilities">
                <p className="facilities-title">สิ่งอำนวยความสะดวก:</p>
                <div className="facilities-list">
                  {room.facilities.map((facility, i) => (
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
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedRoom && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">จองห้อง {selectedRoom.number}</h2>
              <button 
                className="modal-close"
                onClick={() => setShowBookingModal(false)}
              >
                <X className="close-icon" />
              </button>
            </div>

            <div className="modal-body">
              <div className="selected-room-summary">
                <div className="summary-icon">{selectedRoom.image}</div>
                <div>
                  <h3 className="summary-title">{selectedRoom.type}</h3>
                  <p className="summary-price">{selectedRoom.price.toLocaleString()} ฿/เดือน</p>
                </div>
              </div>

              <div className="booking-form">
                <div className="form-group">
                  <label className="form-label">ชื่อ-นามสกุล *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="กรอกชื่อ-นามสกุล"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">เบอร์โทรศัพท์ *</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="08X-XXX-XXXX"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">อีเมล *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="your@email.com"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">เลขบัตรประชาชน *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="X-XXXX-XXXXX-XX-X"
                    value={bookingForm.idCard}
                    onChange={(e) => setBookingForm({...bookingForm, idCard: e.target.value})}
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

                <div className="form-group">
                  <label className="form-label">ระยะเวลาเช่า (เดือน) *</label>
                  <select
                    className="form-input"
                    value={bookingForm.duration}
                    onChange={(e) => setBookingForm({...bookingForm, duration: e.target.value})}
                  >
                    <option value="3">3 เดือน</option>
                    <option value="6">6 เดือน</option>
                    <option value="12">12 เดือน</option>
                  </select>
                </div>

                <div className="booking-summary">
                  <div className="summary-row">
                    <span>ค่าเช่า/เดือน:</span>
                    <span>{selectedRoom.price.toLocaleString()} ฿</span>
                  </div>
                  <div className="summary-row">
                    <span>ค่ามัดจำ (2 เดือน):</span>
                    <span>{(selectedRoom.price * 2).toLocaleString()} ฿</span>
                  </div>
                  <div className="summary-row">
                    <span>ค่าเช่าล่วงหน้า (1 เดือน):</span>
                    <span>{selectedRoom.price.toLocaleString()} ฿</span>
                  </div>
                  <div className="summary-total">
                    <span>รวมชำระครั้งแรก:</span>
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