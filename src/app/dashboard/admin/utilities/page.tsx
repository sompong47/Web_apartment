"use client";

import { useState, useEffect } from "react";
import "./utilities.css";

export default function AdminUtilitiesPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // กำหนดเดือนปัจจุบัน (เช่น 11-2025)
  const [currentMonth, setCurrentMonth] = useState(
    `${new Date().getMonth() + 1}-${new Date().getFullYear()}`
  );

  // เรทค่าน้ำค่าไฟ (ตั้งค่าเริ่มต้นไว้ หรือจะดึงจาก DB ก็ได้)
  const [rates, setRates] = useState({ water: 18, electric: 7 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ดึงข้อมูลห้องทั้งหมด
        const res = await fetch("/api/rooms");
        const data = await res.json();

        if (Array.isArray(data)) {
          // กรองเฉพาะห้องที่มีคนอยู่ (Occupied) เพราะห้องว่างไม่ต้องจดมิเตอร์
          const occupiedRooms = data.filter((r: any) => r.status === 'occupied');

          // แปลงข้อมูลเพื่อเตรียมกรอก (เพิ่ม field สำหรับ input)
          const preparedRooms = occupiedRooms.map((room: any) => ({
            ...room,
            prevWater: 0, // (เวอร์ชันหน้า ถ้าทำระบบเต็มรูปแบบ ต้องดึงเลขเดือนก่อนหน้ามาใส่ช่องนี้อัตโนมัติ)
            prevElectric: 0,
            currWater: "", // ค่าว่างรอให้กรอก
            currElectric: "" // ค่าว่างรอให้กรอก
          }));
          
          setRooms(preparedRooms);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ฟังก์ชันจัดการการกรอกข้อมูลในตาราง
  const handleInputChange = (id: string, field: string, value: string) => {
    setRooms(prevRooms => 
      prevRooms.map(r => r._id === id ? { ...r, [field]: value } : r)
    );
  };

  // ฟังก์ชันบันทึกข้อมูล (ยิง API ทีละห้องที่มีการกรอกครบ)
  const handleSave = async () => {
    const roomsToSave = rooms.filter(r => r.currWater && r.currElectric);
    
    if (roomsToSave.length === 0) {
      return alert("กรุณากรอกข้อมูลมิเตอร์อย่างน้อย 1 ห้อง");
    }

    if (!confirm(`ยืนยันการบันทึกข้อมูลจำนวน ${roomsToSave.length} ห้อง?`)) return;

    try {
      let successCount = 0;

      // วนลูปส่งข้อมูลทีละห้อง
      for (const room of roomsToSave) {
        const payload = {
          roomId: room._id,
          month: currentMonth,
          year: new Date().getFullYear(),
          prevWaterReading: Number(room.prevWater),
          currWaterReading: Number(room.currWater),
          prevElectricReading: Number(room.prevElectric),
          currElectricReading: Number(room.currElectric),
          waterRate: rates.water,
          electricRate: rates.electric
        };

        const res = await fetch("/api/utilities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (res.ok) successCount++;
      }

      alert(`บันทึกสำเร็จ ${successCount} ห้อง! (ข้อมูลพร้อมสำหรับสร้างบิลแล้ว)`);
      
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };

  if (loading) return <div className="p-8 text-center">กำลังโหลดรายชื่อห้อง...</div>;

  return (
    <div className="utilities-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">💧⚡ จดมิเตอร์น้ำ-ไฟ</h1>
          <div style={{display:'flex', gap:'10px', alignItems:'center', marginTop:'5px'}}>
             <span style={{color: '#666'}}>ประจำเดือน: </span>
             <input 
               type="text" 
               value={currentMonth} 
               onChange={(e) => setCurrentMonth(e.target.value)}
               style={{padding:'4px', border:'1px solid #ccc', borderRadius:'4px', width:'100px'}}
             />
          </div>
        </div>
        <div style={{textAlign: 'right'}}>
            <div style={{fontSize: '12px', color:'#666', marginBottom:'5px'}}>
                ค่าน้ำ: {rates.water} บ./หน่วย | ค่าไฟ: {rates.electric} บ./หน่วย
            </div>
            <button className="btn-save" onClick={handleSave}>💾 บันทึกเข้าระบบ</button>
        </div>
      </div>

      <table className="utility-table">
        <thead>
          <tr>
            <th style={{width: '10%'}}>ห้อง</th>
            <th style={{width: '15%'}}>น้ำ (เก่า)</th>
            <th style={{width: '15%'}}>น้ำ (ใหม่)</th>
            <th style={{width: '15%'}}>ไฟ (เก่า)</th>
            <th style={{width: '15%'}}>ไฟ (ใหม่)</th>
            <th>สรุปยอด (ประมาณ)</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length === 0 ? (
            <tr><td colSpan={6} style={{textAlign:'center', padding:'40px', color:'#999'}}>ไม่มีห้องที่มีผู้เช่าในขณะนี้</td></tr>
          ) : (
            rooms.map((room) => {
              const waterUsage = (Number(room.currWater) || 0) - Number(room.prevWater);
              const elecUsage = (Number(room.currElectric) || 0) - Number(room.prevElectric);
              const totalCost = (waterUsage * rates.water) + (elecUsage * rates.electric);
              const isValid = room.currWater && room.currElectric && waterUsage >= 0 && elecUsage >= 0;

              return (
                <tr key={room._id} style={{backgroundColor: isValid ? '#f8fff9' : 'white'}}>
                  <td style={{fontWeight: 'bold', fontSize: '16px', color: '#007bff'}}>{room.roomNumber}</td>
                  
                  {/* มิเตอร์น้ำ */}
                  <td>
                    <input 
                      type="number" className="meter-input" placeholder="0"
                      value={room.prevWater || ""}
                      onChange={(e) => handleInputChange(room._id, 'prevWater', e.target.value)}
                      style={{background: '#eee'}}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" className="meter-input" placeholder="กรอกเลข"
                      value={room.currWater}
                      onChange={(e) => handleInputChange(room._id, 'currWater', e.target.value)}
                      style={{borderColor: waterUsage < 0 ? 'red' : '#ddd'}}
                    />
                    {waterUsage > 0 && <div className="unit-diff">+{waterUsage} หน่วย</div>}
                  </td>

                  {/* มิเตอร์ไฟ */}
                  <td>
                    <input 
                      type="number" className="meter-input" placeholder="0"
                      value={room.prevElectric || ""}
                      onChange={(e) => handleInputChange(room._id, 'prevElectric', e.target.value)}
                      style={{background: '#eee'}}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" className="meter-input" placeholder="กรอกเลข"
                      value={room.currElectric}
                      onChange={(e) => handleInputChange(room._id, 'currElectric', e.target.value)}
                      style={{borderColor: elecUsage < 0 ? 'red' : '#ddd'}}
                    />
                    {elecUsage > 0 && <div className="unit-diff">+{elecUsage} หน่วย</div>}
                  </td>

                  {/* สรุปยอด */}
                  <td style={{fontWeight: 'bold', color: totalCost > 0 ? '#28a745' : '#ccc'}}>
                    ฿{totalCost > 0 ? totalCost.toLocaleString() : '0'}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}