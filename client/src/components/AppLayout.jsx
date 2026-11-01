import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Sparkles, ArrowRight } from 'lucide-react';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleExitDemo = async () => {
    await logout();
    navigate('/login');
  };

  const roleLabels = {
    admin: 'Administrator',
    officer: 'Placement Officer',
    student: 'Student'
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#252525]">
      <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      {/* Prominent Demo Mode Banner */}
      {user?.isDemo && (
        <div className="bg-amber-500/10 border-b border-amber-300 text-amber-900 px-4 py-2 text-xs flex items-center justify-between shadow-2xs">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-500 text-white font-bold flex items-center justify-center">
                <Sparkles className="w-3 h-3" />
              </span>
              <span>
                <strong>Demo Mode Active:</strong> Exploring the{' '}
                <strong>{roleLabels[user.role] || user.role}</strong> portal with simulated Vishnu Institute data. No real backend required.
              </span>
            </div>
            <button
              type="button"
              onClick={handleExitDemo}
              className="text-amber-800 hover:text-amber-950 font-bold underline flex items-center gap-1 shrink-0"
            >
              <span>Exit Demo / Back to Login</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
      
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};
