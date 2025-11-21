import Link from "next/link"; // 1. อย่าลืมบรรทัดนี้ (นำเข้า Link)

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // สไตล์สำหรับลิงก์ (เพื่อให้ดูสะอาดตา)
  const linkStyle = {
    textDecoration: 'none',
    color: '#333',
    display: 'block',
    padding: '8px 0',
    fontSize: '14px'
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '250px', 
        backgroundColor: '#fff', // เปลี่ยนเป็นสีขาวให้ดูสะอาดขึ้น
        padding: '20px',
        borderRight: '1px solid #e4e4e7',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{ marginBottom: '30px', fontWeight: 'bold', fontSize: '20px', color: '#007bff' }}>
          🏢 ระบบหอพัก
        </h2>
        
        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            
            <li style={{ marginBottom: '5px' }}>
              <Link href="/dashboard/admin" style={linkStyle}>
                📊 ภาพรวม (Dashboard)
              </Link>
            </li>

            <li style={{ marginBottom: '5px' }}>
              <Link href="/dashboard/admin/rooms" style={linkStyle}>
                🛏️ จัดการห้องพัก
              </Link>
            </li>

            <li style={{ marginBottom: '5px' }}>
              <Link href="/dashboard/admin/tenants" style={linkStyle}>
                👥 ผู้เช่า
              </Link>
            </li>

            <li style={{ marginBottom: '5px' }}>
              <Link href="/dashboard/admin/payments" style={linkStyle}>
                💰 การเงิน / บิลค่าเช่า
              </Link>
            </li>

            <li style={{ marginBottom: '5px' }}>
              <Link href="/dashboard/admin/maintenance" style={linkStyle}>
                🛠️ แจ้งซ่อม / ปัญหา
              </Link>
            </li>

          </ul>
        </nav>

        {/* ปุ่มออกจากระบบ (แถมให้) */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
           <Link href="/login" style={{ ...linkStyle, color: 'red' }}>
             🚪 ออกจากระบบ
           </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '30px', backgroundColor: '#f8f9fa' }}>
        {children}
      </main>
    </div>
  );
}