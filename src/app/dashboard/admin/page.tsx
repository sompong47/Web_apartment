import React from 'react';

export default function AdminDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="font-semibold">ห้องทั้งหมด</h2>
          <p className="text-3xl font-bold mt-2">--</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="font-semibold">ผู้เช่า</h2>
          <p className="text-3xl font-bold mt-2">--</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="font-semibold">แจ้งซ่อม</h2>
          <p className="text-3xl font-bold mt-2">--</p>
        </div>
      </div>
    </div>
  );
}