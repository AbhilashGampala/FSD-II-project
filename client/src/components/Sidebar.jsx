import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  FileCheck2,
  Calendar,
  Award,
  Users,
  ShieldCheck,
  BarChart3,
  UserCheck,
  X
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!user) return null;

  const role = user.role;

  // Role-specific nav items
  const studentNav = [
    { label: 'Student Dashboard', path: '/student', icon: LayoutDashboard },
    { label: 'Explore Drives', path: '/student/drives', icon: Briefcase },
    { label: 'My Applications', path: '/student/applications', icon: FileCheck2 },
    { label: 'Interviews', path: '/student/interviews', icon: Calendar },
    { label: 'My Offers', path: '/student/offers', icon: Award },
    { label: 'Academic Profile', path: '/student/profile', icon: UserCheck },
  ];

  const officerNav = [
    { label: 'Officer Dashboard', path: '/officer', icon: LayoutDashboard },
    { label: 'Companies', path: '/officer/companies', icon: Building2 },
    { label: 'Placement Drives', path: '/officer/drives', icon: Briefcase },
    { label: 'Interview Schedules', path: '/officer/interviews', icon: Calendar },
    { label: 'Placement Offers', path: '/officer/offers', icon: Award },
    { label: 'Placement Stats', path: '/officer/stats', icon: BarChart3 },
  ];

  const adminNav = [
    { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Audit Logs', path: '/admin/audit', icon: ShieldCheck },
  ];

  const navItems = role === 'admin' ? adminNav : role === 'officer' ? officerNav : studentNav;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-40 md:z-20 w-64 h-[calc(100vh-4rem)] bg-white border-r border-[#E5E7EB] flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 overflow-y-auto">
          {/* Mobile close button */}
          <div className="flex items-center justify-between md:hidden pb-3 mb-2 border-b border-[#E5E7EB]">
            <span className="text-xs font-bold text-[#666666] uppercase tracking-wider">Navigation</span>
            <button onClick={onClose} className="p-1 text-[#666666] hover:text-[#252525]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold text-[#666666] uppercase tracking-wider">
              {role.toUpperCase()} PORTAL
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/student' || item.path === '/officer' || item.path === '/admin'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#E58A1F]/10 text-[#E58A1F] border-l-4 border-[#E58A1F] font-bold shadow-2xs'
                        : 'text-[#666666] hover:text-[#252525] hover:bg-[#F7F8FA]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Institutional Badge in Sidebar */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#F7F8FA]/60">
          <div className="flex items-center justify-between text-[11px] text-[#666666]">
            <span>System Status</span>
            <span className="font-semibold text-[#94BC36] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#94BC36] animate-pulse"></span>
              Operational
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Vishnu Universal Learning
          </div>
        </div>
      </aside>
    </>
  );
};
