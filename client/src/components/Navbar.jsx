import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Menu } from 'lucide-react';
import { Badge } from './common/Badge';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  const roleColors = {
    admin: 'danger',
    officer: 'purple',
    student: 'orange'
  };

  const roleLabels = {
    admin: 'Admin',
    officer: 'Placement Officer',
    student: 'Student'
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Mobile Toggle + Vishnu Universal Learning Logo + College Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-[#666666] hover:text-[#252525] hover:bg-[#F7F8FA] transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <img
              src="/vishnu-logo.png"
              alt="Vishnu Universal Learning"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                // Graceful fallback if image path has an issue
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback emblem if image fails */}
            <div className="hidden w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E58A1F] via-[#95058A] to-[#94BC36] items-center justify-center text-white shadow-sm font-bold text-lg">
              🎓
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-[#252525] leading-tight">
                VIT Campus Placement Tracker
              </h1>
              <p className="text-[11px] text-[#666666] font-medium hidden sm:block">
                Vishnu Institute of Technology (VIT), Bhimavaram
              </p>
            </div>
          </div>
        </div>

        {/* Right: User Profile + Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          {user && (
            <div className="flex items-center gap-2.5 pr-3 border-r border-[#E5E7EB]">
              <div className="w-8 h-8 rounded-full bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center text-[#E58A1F] font-bold text-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4 text-slate-500" />}
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-[#252525]">
                  {user.name}
                </div>
                <Badge variant={roleColors[user.role] || 'default'} size="sm">
                  {roleLabels[user.role] || user.role}
                </Badge>
              </div>
            </div>
          )}

          {/* Logout Button */}
          {user && (
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer border border-rose-200"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
