'use client';

import React, { useState } from 'react';
import './paymentpage.css';
import qr from "./qr.jpg";

const PaymentPage = () => {
  const [activeTab, setActiveTab] = useState('bill');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [showQR, setShowQR] = useState(false);

  // ข้อมูลบิลค่าเช่า
  const currentBill = {
    month: 'พฤศจิกายน 2025',
    roomNumber: '301',
    rentAmount: 5000,
    waterAmount: 250,
    electricAmount: 450,
    totalAmount: 5700,
    dueDate: '30 พฤศจิกายน 2025',
    status: 'unpaid'
  };

  // ประวัติการชำระเงิน
  const paymentHistory = [
    {
      id: 1,
      month: 'ตุลาคม 2025',
      date: '28 ตุลาคม 2025',
      amount: 5650,
      status: 'paid',
      receiptNo: 'RCP-2025-10-001'
    },
    {
      id: 2,
      month: 'กันยายน 2025',
      date: '29 กันยายน 2025',
      amount: 5500,
      status: 'paid',
      receiptNo: 'RCP-2025-09-001'
    },
    {
      id: 3,
      month: 'สิงหาคม 2025',
      date: '30 สิงหาคม 2025',
      amount: 5800,
      status: 'paid',
      receiptNo: 'RCP-2025-08-001'
    }
  ];

  const downloadReceipt = (receipt: { id?: number; month?: string; date?: string; amount?: number; status?: string; receiptNo: any; }) => {
    alert(`กำลังดาวน์โหลดใบเสร็จเลขที่: ${receipt.receiptNo}`);
  };

  const handlePayment = () => {
    setShowPaymentModal(true);
  };

  const selectPaymentMethod = (method: string) => {
    setSelectedMethod(method);
    setShowQR(true);
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    setShowQR(false);
    setSelectedMethod('');
  };

  const confirmPayment = () => {
    alert('ได้รับการแจ้งชำระเงินแล้ว\nกรุณารอการตรวจสอบจากเจ้าหน้าที่');
    closeModal();
  };

  return (
    <div className="payment-page">
      <div className="page-header">
        <h1>การชำระเงิน</h1>
      </div>

      <div className="tabs-nav">
        <button 
          className={activeTab === 'bill' ? 'active' : ''}
          onClick={() => setActiveTab('bill')}
        >
          บิลค่าเช่า
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          ประวัติการชำระ
        </button>
      </div>

      {activeTab === 'bill' && (
        <div className="content">
          <div className="bill-card">
            <div className="card-header">
              <div>
                <h2>{currentBill.month}</h2>
                <span className="room-no">ห้อง {currentBill.roomNumber}</span>
              </div>
              <span className="badge unpaid">ยังไม่ชำระ</span>
            </div>

            <div className="bill-items">
              <div className="bill-item">
                <span>ค่าเช่า</span>
                <span>{currentBill.rentAmount.toLocaleString()} ฿</span>
              </div>
              <div className="bill-item">
                <span>ค่าน้ำ</span>
                <span>{currentBill.waterAmount.toLocaleString()} ฿</span>
              </div>
              <div className="bill-item">
                <span>ค่าไฟ</span>
                <span>{currentBill.electricAmount.toLocaleString()} ฿</span>
              </div>
              <div className="bill-item total">
                <span>ยอดรวม</span>
                <span>{currentBill.totalAmount.toLocaleString()} ฿</span>
              </div>
            </div>

            <div className="bill-footer">
              <p className="due-date">ครบกำหนด {currentBill.dueDate}</p>
              <button className="btn-pay" onClick={handlePayment}>
                ชำระเงิน
              </button>
            </div>
          </div>

          <div className="payment-info">
            <h3>ช่องทางชำระเงิน</h3>
            <ul>
              <li>โอนผ่านธนาคาร</li>
              <li>Mobile Banking</li>
              <li>ชำระที่หอพัก</li>
              <li>เงินสด</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="content">
          <div className="history-list">
            {paymentHistory.map(item => (
              <div key={item.id} className="history-item">
                <div className="history-left">
                  <h3>{item.month}</h3>
                  <p className="date">{item.date}</p>
                  <p className="receipt">เลขที่: {item.receiptNo}</p>
                </div>
                <div className="history-right">
                  <p className="amount">{item.amount.toLocaleString()} ฿</p>
                  <button 
                    className="btn-download"
                    onClick={() => downloadReceipt(item)}
                  >
                    ดาวน์โหลด
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {!showQR ? (
              <>
                <div className="modal-header">
                  <h2>เลือกช่องทางชำระเงิน</h2>
                  <button className="btn-close" onClick={closeModal}>×</button>
                </div>
                <div className="payment-methods">
                  <button 
                    className="payment-method-btn"
                    onClick={() => selectPaymentMethod('promptpay')}
                  >
                    <span className="icon">💳</span>
                    <span>PromptPay</span>
                  </button>
                  <button 
                    className="payment-method-btn"
                    onClick={() => selectPaymentMethod('bank')}
                  >
                    <span className="icon">🏦</span>
                    <span>โอนผ่านธนาคาร</span>
                  </button>
                  <button 
                    className="payment-method-btn"
                    onClick={() => selectPaymentMethod('counter')}
                  >
                    <span className="icon">🏢</span>
                    <span>ชำระที่หอพัก</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-header">
                  <h2>สแกน QR Code</h2>
                  <button className="btn-close" onClick={closeModal}>×</button>
                </div>
                <div className="qr-section">
                  <div className="qr-code">
                    <img 
                      src="/qr.jpg" 
                      alt="q" 
                      height="200" 
                    />
                  </div>
                  <div className="payment-details">
                    <p className="detail-label">จำนวนเงิน</p>
                    <p className="detail-amount">{currentBill.totalAmount.toLocaleString()} ฿</p>
                    <p className="detail-label">PromptPay: 0xx-xxx-xxxx</p>
                    <p className="detail-note">* หลังโอนแล้วกรุณากดยืนยันด้านล่าง</p>
                  </div>
                  <button className="btn-confirm" onClick={confirmPayment}>
                    ยืนยันการชำระเงิน
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;