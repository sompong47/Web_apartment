"use client";

import { useEffect, useState } from "react";
import Tesseract from "tesseract.js";
import "./payment.css";

// --- ไอคอน SVG (เพื่อให้หน้าตาสวยงามโดยไม่ต้องลง lib เพิ่ม) ---
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="upload-icon">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#28a745'}}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

export default function TenantPaymentPage() {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // State สำหรับ OCR
  const [ocrState, setOcrState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [ocrAmount, setOcrAmount] = useState("");

  const fetchBills = async () => {
    const res = await fetch("/api/payments");
    const data = await res.json();
    // กรองเอาเฉพาะบิลที่ยังไม่จ่าย
    setBills(data.filter((b: any) => b.status !== 'paid'));
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // ฟังก์ชันเมื่อเลือกรูปภาพ
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSlipImage(imageUrl);
      
      // เริ่มต้น OCR
      setOcrState('loading');
      setOcrAmount("");

      try {
        const { data: { text } } = await Tesseract.recognize(imageUrl, 'eng+tha');
        
        // ใช้ Regex หาตัวเลขจำนวนเงิน (เช่น 100.00)
        const amountMatch = text.match(/[\d,]+\.\d{2}/);
        
        if (amountMatch) {
            setOcrAmount(amountMatch[0]);
            setOcrState('success');
        } else {
            setOcrAmount("ไม่พบยอดเงิน");
            setOcrState('error');
        }
      } catch (err) {
        setOcrState('error');
        setOcrAmount("อ่านภาพไม่สำเร็จ");
      }
    }
  };

  // ฟังก์ชันส่งข้อมูล
  const handleSubmitPayment = async () => {
    if (!selectedBill || !slipImage) return;
    setLoading(true);
    try {
        const res = await fetch(`/api/payments/${selectedBill._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status: "pending",
                paymentDate: new Date(),
            })
        });

        if (res.ok) {
            alert("แจ้งโอนเงินเรียบร้อย! รอแอดมินตรวจสอบ");
            resetModal();
            fetchBills();
        }
    } catch (error) {
        alert("เกิดข้อผิดพลาด");
    } finally {
        setLoading(false);
    }
  };

  const resetModal = () => {
      setSelectedBill(null);
      setSlipImage(null);
      setOcrState('idle');
      setOcrAmount("");
  }

  return (
    <div className="payment-container">
      <h1 className="page-title">ชำระค่าเช่า</h1>

      {bills.length === 0 ? (
        <div style={{textAlign: 'center', padding: '50px', color: '#666', fontSize: '18px'}}>
            🎉 ไม่มียอดค้างชำระ ขอบคุณครับ
        </div>
      ) : (
        bills.map((bill: any) => (
          <div key={bill._id} className="bill-card">
            <div className="bill-info">
              <h3>ค่าเช่าเดือน {bill.month}/{bill.year}</h3>
              <p>กำหนดจ่าย: ทุกวันที่ 5 ของเดือน</p>
              <span className={`status-badge ${bill.status}`}>
                 {bill.status === 'pending' ? 'รอตรวจสอบ' : 'ค้างชำระ'}
              </span>
            </div>
            <div className="bill-amount">
              <span className="amount-text">฿{bill.totalAmount.toLocaleString()}</span>
              
              {bill.status !== 'pending' ? (
                  <button 
                    className="btn-pay"
                    onClick={() => {
                        setSelectedBill(bill);
                        setSlipImage(null);
                        setOcrState('idle');
                    }}
                  >
                    แจ้งโอนเงิน
                  </button>
              ) : (
                  <div className="pending-text">
                      <ClockIcon /> ส่งสลิปแล้ว รออนุมัติ
                  </div>
              )}
            </div>
          </div>
        ))
      )}

      {/* --- Modal อัพโหลดสลิป (ดีไซน์ใหม่) --- */}
      {selectedBill && (
        <div className="upload-modal">
          <div className="modal-content">
            <h2 className="modal-title">แจ้งโอนเงิน</h2>
            <p style={{marginBottom: '20px', color: '#555'}}>
                ยอดที่ต้องชำระ: <strong style={{color: 'var(--primary-color)', fontSize: '18px'}}>฿{selectedBill.totalAmount.toLocaleString()}</strong>
            </p>
            
            {/* พื้นที่ Upload แบบ Drag & Drop */}
            {!slipImage && (
                <label className="upload-area">
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    <UploadIcon />
                    <div className="upload-text">คลิกเพื่ออัปโหลดสลิป</div>
                    <div className="upload-subtext">รองรับไฟล์ JPG, PNG</div>
                </label>
            )}
            
            {/* ส่วนแสดงผลลัพธ์ OCR */}
            {slipImage && (
                <div className="result-section">
                    <img src={slipImage} alt="Slip Preview" className="preview-img" />
                    
                    <div className="ocr-result-card">
                        <div className="ocr-title">
                            {ocrState === 'success' ? <CheckIcon /> : null}
                            ข้อมูลจากสลิป (OCR)
                        </div>
                        
                        {ocrState === 'loading' && (
                            <div className="ocr-loading">
                                ⏳ กำลังอ่านข้อมูลจากภาพ...
                            </div>
                        )}
                        
                        {ocrState === 'success' && (
                            <div>
                                <div style={{fontSize: '14px', color: '#666'}}>จำนวนเงิน</div>
                                <div className="ocr-amount">{ocrAmount} บาท</div>
                            </div>
                        )}

                        {ocrState === 'error' && (
                             <div style={{color: 'var(--danger-color)'}}>⚠️ {ocrAmount} (โปรดตรวจสอบด้วยตนเอง)</div>
                        )}
                    </div>

                    <button 
                        className="btn-pay" 
                        style={{background: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', padding: '8px 16px', fontSize: '14px'}}
                        onClick={() => { setSlipImage(null); setOcrState('idle'); }}
                    >
                        อัปโหลดสลิปใหม่
                    </button>
                </div>
            )}

            <div className="modal-actions">
                <button 
                    className="btn-pay btn-cancel" 
                    onClick={resetModal}
                >
                    ยกเลิก
                </button>
                <button 
                    className="btn-pay" 
                    onClick={handleSubmitPayment}
                    disabled={loading || !slipImage || ocrState === 'loading'}
                >
                    {loading ? "กำลังส่ง..." : "ยืนยันการโอน"}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}