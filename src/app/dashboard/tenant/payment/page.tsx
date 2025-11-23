"use client";

import { useEffect, useState } from "react";
import Tesseract from "tesseract.js";
import "./tenant-payment.css";

// --- Icons SVG ---
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

const QRIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

// Interface
interface Payment {
  _id: string;
  month: string;
  year: number;
  totalAmount: number;
  status: "pending" | "paid" | "overdue" | "unpaid";
  roomId: { roomNumber: string };
  tenantId: { userId: { _id: string } }; // เพิ่ม type
}

export default function TenantPaymentPage() {
  const [bills, setBills] = useState<Payment[]>([]);
  const [selectedBill, setSelectedBill] = useState<Payment | null>(null);
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [slipFile, setSlipFile] = useState<File | null>(null); // เพิ่ม state สำหรับเก็บไฟล์จริง
  const [loading, setLoading] = useState(true);
  
  const [ocrState, setOcrState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [ocrAmount, setOcrAmount] = useState("");

  // 1. Fetch Bills
  const fetchBills = async () => {
    try {
      const userStr = localStorage.getItem("currentUser");
      if (!userStr) { setLoading(false); return; }
      const currentUser = JSON.parse(userStr);

      const res = await fetch("/api/payments");
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      
      if (Array.isArray(data)) {
        const myBills = data.filter((b: any) => 
            // เช็คว่า tenantId ของบิล ตรงกับ User ID ของคนล็อกอินไหม
            (b.tenantId?.userId?._id === currentUser.id || b.tenantId?.userId === currentUser.id) &&
            b.status !== 'paid' // ไม่เอาที่จ่ายแล้ว
        );
        setBills(myBills);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // 2. Handle File & OCR
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSlipFile(file); // เก็บไฟล์จริงไว้ส่ง API
      const imageUrl = URL.createObjectURL(file);
      setSlipImage(imageUrl);
      
      // เริ่ม OCR
      setOcrState('loading');
      setOcrAmount("");

      try {
        const { data: { text } } = await Tesseract.recognize(imageUrl, 'eng+tha');
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

  // 3. Submit Payment
  const handleSubmitPayment = async () => {
    if (!selectedBill || !slipFile) return; // ต้องมี slipFile
    setLoading(true);

    try {
        // A. อัปโหลดรูปก่อน
        const formData = new FormData();
        formData.append("file", slipFile);

        const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!uploadRes.ok) throw new Error("Upload failed");
        const uploadData = await uploadRes.json();
        const slipUrl = uploadData.url;

        // B. ส่งข้อมูลแจ้งโอนพร้อมลิงก์รูป
        const res = await fetch(`/api/payments/${selectedBill._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status: "pending",
                paymentDate: new Date(),
                receipt: slipUrl // ส่ง URL ที่ได้จากการอัปโหลด
            })
        });

        if (res.ok) {
            alert("แจ้งโอนเงินเรียบร้อย! รอแอดมินตรวจสอบ");
            resetModal();
            fetchBills();
        }
    } catch (error) {
        alert("เกิดข้อผิดพลาด");
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const resetModal = () => {
      setSelectedBill(null);
      setSlipImage(null);
      setSlipFile(null);
      setOcrState('idle');
      setOcrAmount("");
  }

  if (loading) return <div style={{padding:'50px', textAlign:'center'}}>กำลังโหลดข้อมูล...</div>;

  return (
    <div className="payment-container">
      <h1 className="page-title">ชำระค่าเช่า</h1>

      {bills.length === 0 ? (
        <div style={{textAlign: 'center', padding: '50px', color: '#666', fontSize: '18px'}}>
            🎉 ไม่มียอดค้างชำระ ขอบคุณครับ
        </div>
      ) : (
        bills.map((bill) => (
          <div key={bill._id} className="bill-card">
            <div className="bill-info">
              <h3>ประจำเดือน {bill.month}/{bill.year}</h3>
              <p>กำหนดจ่าย: ทุกวันที่ 5 ของเดือน</p>
              <span className={`status-badge ${bill.status}`}>
                 {bill.status === 'pending' ? 'รอตรวจสอบ' : 
                  bill.status === 'unpaid' ? 'ยังไม่ชำระ' : 'เกินกำหนด'}
              </span>
            </div>
            <div className="bill-amount">
              <span className="amount-text">฿{bill.totalAmount.toLocaleString()}</span>
              
              {(bill.status === 'unpaid' || bill.status === 'overdue') ? (
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

      {/* --- Modal --- */}
      {selectedBill && (
        <div className="upload-modal">
          <div className="modal-content">
            <h2 className="modal-title">แจ้งโอนเงิน</h2>
            
            {/* QR Code */}
            <div style={{
                background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', 
                padding: '20px', 
                borderRadius: '12px', 
                marginBottom: '25px',
                textAlign: 'center',
                border: '1px solid #eee'
            }}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginBottom:'10px', color:'#007bff'}}>
                    <QRIcon />
                    <span style={{fontWeight:600}}>สแกนเพื่อชำระเงิน</span>
                </div>
                
                <div style={{
                    width: '160px', height: '160px', 
                    background: 'white', 
                    margin: '0 auto 10px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid #ddd', borderRadius: '8px'
                }}>
                    <img src="/qr.jpg" alt="QR Code" style={{width:'100%', height:'100%', objectFit:'contain'}} 
                         onError={(e) => e.currentTarget.src = "https://via.placeholder.com/150?text=QR+Code"}/>
                </div>
                
                <div style={{fontSize:'18px', fontWeight:'bold', color:'#333'}}>
                    ยอดโอน: <span style={{color:'#007bff'}}>฿{selectedBill.totalAmount.toLocaleString()}</span>
                </div>
            </div>

            {/* Upload */}
            {!slipImage && (
                <label className="upload-area">
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    <UploadIcon />
                    <div className="upload-text">คลิกเพื่ออัปโหลดสลิป</div>
                    <div className="upload-subtext">รองรับไฟล์ JPG, PNG</div>
                </label>
            )}
            
            {/* Result */}
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
                                ⏳ กำลังตรวจสอบยอดเงิน...
                            </div>
                        )}
                        
                        {ocrState === 'success' && (
                            <div>
                                <div style={{fontSize: '14px', color: '#666'}}>จำนวนเงินที่พบ</div>
                                <div className="ocr-amount">{ocrAmount} บาท</div>
                            </div>
                        )}

                        {ocrState === 'error' && (
                             <div style={{color: '#dc3545', fontSize: '14px'}}>⚠️ {ocrAmount}</div>
                        )}
                    </div>

                    <button 
                        className="btn-pay" 
                        style={{background: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', padding: '8px 16px', fontSize: '14px', width: '100%', marginTop: '10px'}}
                        onClick={() => { setSlipImage(null); setSlipFile(null); setOcrState('idle'); }}
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