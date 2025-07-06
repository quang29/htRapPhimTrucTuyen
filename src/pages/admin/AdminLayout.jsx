import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';

const adminLinks = [
  { to: '/admin', label: 'Statistics' },
  { to: '/admin/payments', label: 'Payments Management' },
  { to: '/admin/users', label: 'Users Management' },
  { to: '/admin/plans', label: 'Plans Management' },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-800 flex flex-col md:flex-row mt-10">
      {/* Mobile menu button */}
      <button
        className="md:hidden p-4 text-2xl text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Open sidebar"
      >
        <HiMenu />
      </button>
      {/* Sidebar */}
      <aside className={`fixed md:static z-20 top-0 left-0 h-full w-64 bg-zinc-900 p-6 flex flex-col gap-4 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <h2 className="text-2xl font-extrabold mb-8 tracking-tight text-yellow-400">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          {adminLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition font-medium ${
                  isActive
                    ? 'bg-yellow-400 text-black shadow font-bold'
                    : 'hover:bg-zinc-700 hover:text-yellow-300'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 mt-0 md:mt-10">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;