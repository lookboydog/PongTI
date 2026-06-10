/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sun, Moon, Sparkles, BookOpen, User, Flame, Compass, HelpCircle, LogOut } from 'lucide-react';
import { AuthUser, ThemeMode, ViewType } from '../types';

interface HeaderProps {
  theme: ThemeMode;
  toggleTheme: () => void;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  resetTest: () => void;
  authUser: AuthUser | null;
  onLogout: () => void;
}

export default function Header({
  theme,
  toggleTheme,
  activeView,
  setActiveView,
  resetTest,
  authUser,
  onLogout,
}: HeaderProps) {
  const isDark = theme === 'dark';

  const navItems = [
    { id: 'home' as ViewType, label: '探索首页', icon: Compass },
    { id: 'types' as ViewType, label: '角色目录', icon: BookOpen },
    { id: 'test' as ViewType, label: '立即测评', icon: Sparkles, highlight: true },
    { id: 'comments' as ViewType, label: '留白留言', icon: Flame },
    { id: 'about' as ViewType, label: '关于谱系', icon: HelpCircle },
  ];

  const handleNavClick = (viewId: ViewType) => {
    if (viewId === 'test') {
      resetTest();
    }
    setActiveView(viewId);
  };

  return (
    <header
      id="app-header"
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md border-b ${
        isDark
          ? 'bg-[#0d0e26]/80 text-[#fcfcfd] border-cyan-500/20 shadow-[0_4px_20px_rgba(0,242,255,0.05)]'
          : 'bg-[#faf8f5]/80 text-[#1a1715] border-[#e2d8c9] shadow-[0_4px_20px_rgba(104,94,49,0.03)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div 
            id="logo-container"
            onClick={() => handleNavClick('home')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className={`p-2 rounded-xl transition-all duration-300 ${
              isDark 
                ? 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:shadow-[0_0_15px_rgba(0,242,255,0.3)]' 
                : 'bg-[#f4ebe1] text-[#b3a076] group-hover:bg-[#ebdfcc] group-hover:shadow-[0_0_15px_rgba(179,160,118,0.2)]'
            }`}>
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className={`text-xl font-bold tracking-wider font-sans block ${
                isDark 
                  ? 'bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent' 
                  : 'text-stone-800'
              }`}>
                PonyTI
              </span>
              <span className={`text-xs block tracking-widest font-mono uppercase ${
                isDark ? 'text-cyan-400/75' : 'text-[#b3a076]'
              }`}>
                Celestial Echoes
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id || (item.id === 'test' && activeView === 'result');
              
              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative px-4 py-2.5 rounded-xl font-medium tracking-wide flex items-center space-x-2 transition-all duration-300 ${
                      isActive
                        ? isDark
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                          : 'bg-stone-800 text-stone-50 shadow-[0_4px_12px_rgba(28,25,23,0.15)]'
                        : isDark
                          ? 'border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(0,242,255,0.15)]'
                          : 'border border-[#cbbea9] text-[#9a8d76] hover:bg-stone-100 hover:text-stone-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium tracking-wide flex items-center space-x-2 transition-all duration-300 ${
                    isActive
                      ? isDark
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25'
                        : 'bg-stone-100 text-stone-900 border border-stone-200'
                      : isDark
                        ? 'text-stone-300 hover:bg-stone-800/40 hover:text-cyan-400'
                        : 'text-stone-600 hover:bg-[#ebd9c1]/30 hover:text-stone-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Theme Switcher & Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {authUser ? (
              <div className="hidden sm:flex items-center gap-2">
                <span
                  className={`text-xs font-medium max-w-[120px] truncate ${
                    isDark ? 'text-cyan-300' : 'text-[#685e31]'
                  }`}
                  title={authUser.email}
                >
                  {authUser.name}
                </span>
                <button
                  type="button"
                  onClick={onLogout}
                  title="退出登录"
                  className={`p-2.5 rounded-xl transition-all duration-300 border ${
                    isDark
                      ? 'bg-[#111225] border-cyan-500/20 text-cyan-400 hover:bg-red-500/10 hover:border-red-400/40 hover:text-red-300'
                      : 'bg-white border-[#e2d8c9] text-stone-600 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="login-button"
                type="button"
                onClick={() => setActiveView('auth')}
                title="用户登录"
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border flex items-center gap-2 ${
                  activeView === 'auth'
                    ? isDark
                      ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300'
                      : 'bg-stone-100 border-stone-300 text-stone-800'
                    : isDark
                      ? 'bg-[#111225] border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400'
                      : 'bg-white border-[#e2d8c9] text-stone-700 hover:bg-stone-50 hover:text-[#685e31]'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">登录</span>
              </button>
            )}

            <button
              id="theme-toggle-button"
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all duration-300 border ${
                isDark
                  ? 'bg-[#111225] border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_12px_rgba(0,242,255,0.2)] hover:border-cyan-400'
                  : 'bg-white border-[#e2d8c9] text-stone-700 hover:bg-stone-50 hover:text-[#b3a076] hover:shadow-[0_4px_10px_rgba(104,94,49,0.05)]'
              }`}
              title={isDark ? '切换至：和谐谱系 (Light)' : '切换至：深夜星轨 (Dark)'}
            >
              {isDark ? <Sun className="w-5 h-5 animate-spin-slow" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation row (visible on small screens) */}
      <div 
        id="mobile-nav"
        className={`md:hidden flex overflow-x-auto py-2.5 px-4 items-center justify-between border-t transition-colors duration-300 scrollbar-none ${
          isDark ? 'border-cyan-500/10 bg-[#0d0e26]' : 'border-[#e2d8c9] bg-[#fdfcfa]'
        }`}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id || (item.id === 'test' && activeView === 'result');
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center flex-shrink-0 px-2.5 py-1 rounded-lg text-[10px] x-medium tracking-tight space-y-1 transition-all duration-300 ${
                isActive
                  ? isDark
                    ? 'text-cyan-400'
                    : 'text-stone-800 font-semibold'
                  : isDark
                    ? 'text-stone-400'
                    : 'text-stone-500'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
