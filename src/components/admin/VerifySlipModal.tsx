"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";

interface VerifySlipModalProps {
  payment: any; // รับข้อมูลบิลทั้งก้อนเข้ามา
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export default function VerifySlipModal({ payment, onClose, onApprove, onReject }: VerifySlipModalProps) {
  const [loading, setLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<string>("");

  // ฟังก์ชันอ่าน OCR จากรูปสลิปที่มีอยู่แล้ว
  const runOCR = async () => {
    if (!payment.receipt) return alert("ไม่พบรูปสลิป");
    
    setLoading(true);
    setOcrResult("⏳ กำลังอ่านยอดเงิน...");

    try {
      const { data: { text } } = await Tesseract.recognize(payment.receipt, 'eng+tha');
      const amountMatch = text.match(/[\d,]+\.\d{2}/);
      
      if (amountMatch) {
        setOcrResult(`✅ ยอดเงินในสลิป: ${amountMatch[0]} บาท`);
      } else {
        setOcrResult("⚠️ อ่านตัวเลขไม่ชัดเจน โปรดตรวจสอบด้วยตาเปล่า");
      }
    } catch (error) {
      setOcrResult("❌ เกิดข้อผิดพลาดในการอ่าน");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'white', padding: '25px', borderRadius: '12px',
        width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>
            <h2 style={{fontSize: '20px', fontWeight: 'bold'}}>ตรวจสอบการชำระเงิน</h2>
            <button onClick={onClose} style={{background:'none', border:'none', fontSize:'24px', cursor:'pointer'}}>×</button>
        </div>

        <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
            {/* ฝั่งซ้าย: รูปสลิป */}
            <div style={{flex: 1, minWidth: '250px', textAlign: 'center', background: '#f8f9fa', padding: '10px', borderRadius: '8px'}}>
                {payment.receipt ? (
                    <img 
                        src={payment.receipt} 
                        alt="Slip" 
                        style={{width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '4px'}} 
                    />
                ) : (
                    <div style={{padding: '50px 0', color: '#999'}}>
                        ❌ ผู้เช่าไม่ได้แนบรูปสลิปมา
                        <br/>(หรือระบบยังไม่ได้ต่อ Cloud Storage)
                    </div>
                )}
            </div>

            {/* ฝั่งขวา: ข้อมูลและการจัดการ */}
            <div style={{flex: 1, minWidth: '250px'}}>
                <div style={{marginBottom: '20px'}}>
                    <p style={{color: '#666', fontSize: '14px'}}>ห้อง / ผู้เช่า</p>
                    <p style={{fontWeight: 'bold', fontSize: '16px'}}>{payment.roomId?.roomNumber} - {payment.tenantId?.userId?.name}</p>
                </div>

                <div style={{marginBottom: '20px'}}>
                    <p style={{color: '#666', fontSize: '14px'}}>ยอดที่ต้องชำระ</p>
                    <p style={{fontWeight: 'bold', fontSize: '24px', color: '#007bff'}}>
                        ฿{payment.totalAmount?.toLocaleString()}
                    </p>
                </div>

                {/* ส่วน OCR */}
                <div style={{marginBottom: '20px', padding: '15px', background: '#eef2ff', borderRadius: '8px', border: '1px solid #c7d2fe'}}>
                    <p style={{fontSize: '14px', fontWeight: 'bold', color: '#3730a3', marginBottom: '10px'}}>🤖 AI ผู้ช่วยตรวจสอบ</p>
                    
                    {ocrResult ? (
                        <p style={{fontSize: '16px', fontWeight: 'bold', color: ocrResult.includes('✅') ? 'green' : 'red'}}>
                            {ocrResult}
                        </p>
                    ) : (
                        <button 
                            onClick={runOCR}
                            disabled={loading || !payment.receipt}
                            style={{width: '100%', padding: '8px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}
                        >
                            {loading ? 'กำลังสแกน...' : '🔍 สแกนยอดเงินในสลิป'}
                        </button>
                    )}
                </div>

                {/* ปุ่ม Action */}
                <div style={{display: 'flex', gap: '10px', marginTop: '30px'}}>
                    <button 
                        onClick={onReject}
                        style={{flex: 1, padding: '12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}
                    >
                        ❌ ปฏิเสธ
                    </button>
                    <button 
                        onClick={onApprove}
                        style={{flex: 1, padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}
                    >
                        ✅ อนุมัติ (ยอดตรง)
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}