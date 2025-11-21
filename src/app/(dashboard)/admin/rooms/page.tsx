"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./rooms.css"; // นำเข้า CSS

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. ฟังก์ชันดึงข้อมูลห้อง
  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // 2. ฟังก์ชันลบห้อง
  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบห้องนี้?")) return;

    try {
      const res = await fetch(`/api/rooms/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("ลบห้องสำเร็จ");
        fetchRooms(); // โหลดข้อมูลใหม่
      } else {
        alert("เกิดข้อผิดพลาดในการลบ");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  if (loading) return <div className="p-8">กำลังโหลดข้อมูลห้องพัก...</div>;

  return (
    <div className="rooms-container">
      <div className="header-flex">
        <h1 className="page-title">จัดการข้อมูลห้องพัก</h1>
        <Link href="/dashboard/admin/rooms/new" className="btn-add">
          + เพิ่มห้องใหม่
        </Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>เลขห้อง</th>
            <th>ชั้น</th>
            <th>ประเภท</th>
            <th>ราคา (บาท)</th>
            <th>สถานะ</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length === 0 ? (
            <tr>
              <td colSpan={6} style={{textAlign: 'center', padding: '20px'}}>
                ยังไม่มีข้อมูลห้องพัก
              </td>
            </tr>
          ) : (
            rooms.map((room: any) => (
              <tr key={room._id}>
                <td>{room.roomNumber}</td>
                <td>{room.floor}</td>
                <td>{room.type === 'single' ? 'เตียงเดี่ยว' : room.type === 'double' ? 'เตียงคู่' : 'สตูดิโอ'}</td>
                <td>{room.price.toLocaleString()}</td>
                <td>
                  <span className={`badge ${room.status}`}>
                    {room.status === 'available' ? 'ว่าง' : 
                     room.status === 'occupied' ? 'ไม่ว่าง' : 'ซ่อมบำรุง'}
                  </span>
                </td>
                <td>
                  <Link href={`/dashboard/admin/rooms/${room._id}`} className="action-btn btn-edit">
                    แก้ไข
                  </Link>
                  <button 
                    onClick={() => handleDelete(room._id)} 
                    className="action-btn btn-delete"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}