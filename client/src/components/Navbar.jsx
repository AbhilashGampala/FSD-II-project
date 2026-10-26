import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, User as UserIcon, Menu } from 'lucide-react';
import { Badge } from './common/Badge';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const roleColors = {
    admin: 'danger',
    officer: 'purple',
    student: 'info'
  };

  const roleLabels = {
    admin: 'Admin',
    officer: 'Placement Officer',
    student: 'Student'
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Mobile Toggle + Logo + College Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-orange via-brand-purple to-brand-green flex items-center justify-center text-white shadow-sm font-bold text-lg">
              🎓
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                VIT Campus Placement Tracker
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Vishnu Institute of Technology, Bhimavaram
              </p>
            </div>
          </div>
        </div>

        {/* Right: User Profile + Theme Toggle + Logout */}
        <div className="flex items-center gap-2 sm:gap-4">
          {user && (
            <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-slate-200 dark:border-slate-700">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {user.name}
                </div>
                <Badge variant={roleColors[user.role] || 'default'} size="sm">
                  {roleLabels[user.role] || user.role}
                </Badge>
              </div>
            </div>
          )}

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Logout Button */}
          {user && (
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
