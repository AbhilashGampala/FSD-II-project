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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-40 md:z-20 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 overflow-y-auto">
          {/* Mobile close button */}
          <div className="flex items-center justify-between md:hidden pb-3 mb-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Navigation</span>
            <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {role.toUpperCase()} PORTAL
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              if (item.disabled) {
                return (
                  <div
                    key={item.label}
                    title="Available in future phase"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 dark:text-slate-600 cursor-not-allowed select-none"
                  >
                    <Icon className="w-4 h-4 opacity-70" />
                    <span>{item.label}</span>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/student' || item.path === '/officer' || item.path === '/admin'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-slate-800 dark:to-slate-800 text-brand-orange border-l-4 border-brand-orange'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Phase Indicator Footer in Sidebar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Project Status</span>
            <span className="font-semibold text-brand-green">Phase 5 Complete</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-brand-green h-full rounded-full w-full"></div>
          </div>
        </div>
      </aside>
    </>
  );
};
