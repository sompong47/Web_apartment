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

  // --- ฟังก์ชัน Login ปกติ ---
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
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        
        if (rememberMe) {
           localStorage.setItem("rememberedEmail", formData.email);
        }

        if (data.user.role === 'admin') {
          router.push("/dashboard/admin");
        } else {
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

  // --- 🔥 ฟังก์ชันทางลัดสำหรับทีม Dev (Bypass Login) ---
  const handleDevLogin = (role: 'admin' | 'tenant') => {
    // สร้างข้อมูลปลอมๆ ขึ้นมาเพื่อให้ผ่านการตรวจสอบหน้าเว็บ
    const mockUser = {
        id: "dev-id-" + role, // ไอดีปลอม
        name: role === 'admin' ? "Admin Developer" : "Tenant Developer",
        email: `${role}@dev.com`,
        role: role,
        phone: "000-000-0000"
    };

    // ยัดลงเครื่องเลย ไม่ต้องถาม API
    localStorage.setItem("currentUser", JSON.stringify(mockUser));

    // ดีดไปหน้า Dashboard ตามบทบาท
    if (role === 'admin') {
        router.push("/dashboard/admin");
    } else {
        router.push("/dashboard/tenant");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        <div className="login-header">
          <h1>เข้าสู่ระบบ</h1>
          <p>ระบบจัดการหอพักออนไลน์ SorHub</p>
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

        <div className="divider">
          <span>หรือ</span>
        </div>

        <div className="social-buttons">
          <button type="button" className="social-btn" title="Google">G</button>
          <button type="button" className="social-btn" title="Facebook">f</button>
          <button type="button" className="social-btn" title="Line">L</button>
        </div>

        <div className="signup-link">
          ยังไม่มีบัญชี? <Link href="/register">สมัครสมาชิก</Link>
        </div>

        {/* --- 🔥 DEV ZONE: ปุ่มทางลัดสำหรับเพื่อนร่วมทีม --- */}
        <div style={{marginTop: '30px', paddingTop: '20px', borderTop: '2px dashed #eee', textAlign: 'center'}}>
            <p style={{fontSize: '12px', color: '#999', marginBottom: '10px'}}>🛠️ สำหรับ Developer (ไม่ต้องกรอกรหัส)</p>
            <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                <button 
                    onClick={() => handleDevLogin('admin')}
                    style={{padding: '8px 15px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px'}}
                >
                    เข้าเป็น Admin
                </button>
                <button 
                    onClick={() => handleDevLogin('tenant')}
                    style={{padding: '8px 15px', background: '#666', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px'}}
                >
                    เข้าเป็น ผู้เช่า
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}