"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import CmsNav from "@/components/CmsNav";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CmsLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 z-30 w-64 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-200 ease-in-out bg-white border-r border-gray-200`}
        >
          <CmsNav />
        </div>

        {/* Main content */}
        <div className="md:pl-64">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

          <main className="p-6">
            <div className="bg-white rounded-xl shadow-sm p-6">{children}</div>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  );
}
