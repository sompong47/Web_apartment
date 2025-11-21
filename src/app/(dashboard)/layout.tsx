export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ส่วนนี้คือ Sidebar จำลอง */}
      <aside style={{ 
        width: '250px', 
        backgroundColor: '#f4f4f5', 
        padding: '20px',
        borderRight: '1px solid #e4e4e7'
      }}>
        <h2 style={{ marginBottom: '20px', fontWeight: 'bold' }}>ระบบหอพัก</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>หน้าหลัก</li>
            <li style={{ marginBottom: '10px' }}>ห้องพัก</li>
            <li style={{ marginBottom: '10px' }}>ผู้เช่า</li>
          </ul>
        </nav>
      </aside>

      {/* ส่วนนี้คือเนื้อหาหลัก (Main Content) */}
      <main style={{ flex: 1, padding: '20px' }}>
        {children}
      </main>
    </div>
  );
}