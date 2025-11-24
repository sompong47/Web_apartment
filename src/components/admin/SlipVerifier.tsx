"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";

interface SlipVerifierProps {
  onClose: () => void;
}

export default function SlipVerifier({ onClose }: SlipVerifierProps) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    text: "",
    amount: "",
    date: ""
  });

  // ฟังก์ชันจัดการรูปภาพเมื่อเลือกไฟล์
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setResult({ text: "", amount: "", date: "" }); // รีเซ็ตค่าเดิม
    }
  };

  // ฟังก์ชันเริ่มอ่านสลิป (OCR Process)
  const processSlip = async () => {
    if (!image) return;

    setLoading(true);
    try {
      // ใช้ Tesseract อ่านภาษาไทย (tha) และอังกฤษ (eng)
      const { data: { text } } = await Tesseract.recognize(image, 'eng+tha', {
        logger: m => console.log(m) // ดู Progress ใน Console ได้
      });

      // --- Logic การแกะข้อมูล (Regex) ---
      // พยายามหาตัวเลขที่มีทศนิยม (เช่น 5,000.00)
      const amountMatch = text.match(/[\d,]+\.\d{2}/);
      // พยายามหาวันที่ (เช่น 21/11/68 หรือ 21 Nov)
      const dateMatch = text.match(/\d{2}\/\d{2}\/\d{2,4}/);

      setResult({
        text: text, // ข้อความดิบทั้งหมด
        amount: amountMatch ? amountMatch[0] : "หาไม่เจอ",
        date: dateMatch ? dateMatch[0] : "หาไม่เจอ"
      });

    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการอ่านรูปภาพ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white', padding: '20px', borderRadius: '8px',
        maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <h2 style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          🧾 ตรวจสอบสลิปอัตโนมัติ (OCR)
        </h2>

        <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: '10px' }} />

        {image && (
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <img src={image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }} />
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', color: '#007bff', margin: '20px' }}>
            ⏳ กำลังแกะตัวหนังสือจากภาพ... (อาจใช้เวลาสักครู่)
          </div>
        ) : (
          result.text && (
            <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>
              <p><strong>💰 ยอดเงินที่พบ:</strong> <span style={{color: 'green', fontSize: '18px'}}>{result.amount}</span></p>
              <p><strong>📅 วันที่ที่พบ:</strong> {result.date}</p>
              <hr style={{ margin: '10px 0' }} />
              <details>
                <summary style={{cursor: 'pointer', color: '#666'}}>ดูข้อความดิบทั้งหมด</summary>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px', color: '#333', marginTop: '5px' }}>
                  {result.text}
                </pre>
              </details>
            </div>
          )
        )}

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button 
            onClick={onClose}
            style={{ padding: '8px 16px', border: '1px solid #ccc', background: 'white', borderRadius: '4px', cursor: 'pointer' }}
          >
            ปิด
          </button>
          <button 
            onClick={processSlip}
            disabled={!image || loading}
            style={{ 
              padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer',
              background: !image || loading ? '#ccc' : '#007bff', color: 'white'
            }}
          >
            {loading ? "กำลังอ่าน..." : "ตรวจสอบสลิป"}
          </button>
        </div>
      </div>
    </div>
  );
}