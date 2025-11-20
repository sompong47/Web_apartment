"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./register.css"; // นำเข้าไฟล์ CSS ที่เราเขียนเอง

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "tenant",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "สมัครสมาชิกไม่สำเร็จ");
      }

      alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
      router.push("/login");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        
        <div className="register-header">
          <h1>สมัครสมาชิก</h1>
          <p>ระบบจัดการหอพักออนไลน์</p>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ชื่อ-นามสกุล</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="สมชาย ใจดี"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>อีเมล</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="name@example.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>รหัสผ่าน</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="******"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>ยืนยันรหัสผ่าน</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="******"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "กำลังบันทึก..." : "สมัครสมาชิก"}
          </button>
        </form>

        <div className="login-link">
          มีบัญชีอยู่แล้ว? <Link href="/login">เข้าสู่ระบบ</Link>
        </div>
      </div>
    </div>
  );
}