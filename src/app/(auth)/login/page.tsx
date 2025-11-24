"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "เข้าสู่ระบบไม่สำเร็จ");
      }

      if (data.user) {
        // 1. บันทึกข้อมูลคนล็อกอิน
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        
        if (rememberMe) {
           localStorage.setItem("rememberedEmail", formData.email);
        }

        // 2. 🔥 แยกทางตาม Role (สำคัญตรงนี้) 🔥
        if (data.user.role === 'admin') {
          // ถ้าเป็น Admin -> ไปหน้าแอดมิน
          router.push("/dashboard/admin");
        } else {
          // ถ้าเป็นคนธรรมดา -> ไปหน้าผู้เช่า
          router.push("/dashboard/tenant");
        }
        
      } else {
        throw new Error("ไม่พบข้อมูลผู้ใช้");
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>เข้าสู่ระบบ</h1>
          <p>ระบบจัดการหอพักออนไลน์ SSS-Apartment</p>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>อีเมล</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>รหัสผ่าน</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-input"
                placeholder="******"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "🔒"}
              </button>
            </div>
          </div>

          <div className="remember-forgot">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              จำฉันไว้ในระบบ
            </label>
            <a href="#" onClick={(e) => e.preventDefault()} style={{color:'#666', fontSize:'14px'}}>ลืมรหัสผ่าน?</a>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div className="divider"><span>หรือ</span></div>

        <div className="social-buttons">
          <button type="button" className="social-btn" title="Google">G</button>
          <button type="button" className="social-btn" title="Facebook">f</button>
          <button type="button" className="social-btn" title="Line">L</button>
        </div>

        <div className="signup-link">
          ยังไม่มีบัญชี? <Link href="/register">สมัครสมาชิก</Link>
        </div>
      </div>
    </div>
  );
}