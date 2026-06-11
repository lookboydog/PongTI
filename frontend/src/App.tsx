/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomeView from './components/HomeView';
import TypesView from './components/TypesView';
import TestView from './components/TestView';
import ResultView from './components/ResultView';
import CommentsView from './components/CommentsView';
import AboutView from './components/AboutView';
import AuthView from './components/AuthView';
import { clearAuthSession, loadAuthSession } from './api/auth';
import { AuthUser, ThemeMode, ViewType, TestResult } from './types';

export default function App() {
  // Read theme from localStorage or default to 'dark' for Cosmic Midnight Nebula vibe
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('inner_spectrum_theme');
    return (saved as ThemeMode) || 'light';
  });

  const [activeView, setActiveView] = useState<ViewType>('home');
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [bgRotation, setBgRotation] = useState(0);
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => loadAuthSession()?.user ?? null);

  // Home-to-Directory bridge parameter
  const [selectedMbti, setSelectedMbti] = useState<string | null>(null);

  // Sync theme with local storage & document element body color
  useEffect(() => {
    localStorage.setItem('inner_spectrum_theme', theme);
    if (theme === "light") {
      document.body.style.backgroundColor = "#0a0b1e";
    } else {
      document.body.style.backgroundColor = "#faf8f5";
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    setBgRotation((prev) => prev + 180);
  };

  const resetTest = () => {
    setTestResult(null);
  };

  const handleFinishTest = (result: TestResult) => {
    setTestResult(result);
    setActiveView('result');
  };

  const handleShareResult = () => {
    // Navigates user into comment field with their type prefilled!
    setActiveView('comments');
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setAuthUser(user);
    setActiveView('home');
  };

  const handleLogout = () => {
    clearAuthSession();
    setAuthUser(null);
    if (activeView === 'auth') {
      setActiveView('home');
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      id="app-root-container"
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 relative overflow-hidden ${
        isDark ? "bg-[#0a0b1e] text-stone-100" : "bg-[#faf8f5] text-stone-900"
      }`}
    >
      {/* Dynamic Background Twinkling Overlays */}
      {isDark ? (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Constellation lines effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,242,255,0.06),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.04),transparent_50%)]" />
          {/* Simulated starry glow */}
          <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />
          <div
            className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(34,211,238,0.7)]"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-blue-300 rounded-full animate-pulse shadow-[0_0_8px_rgba(147,197,253,0.6)]"
            style={{ animationDelay: "2.5s" }}
          />
          <div
            className="absolute top-3/4 right-1/5 w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"
            style={{ animationDelay: "1.5s" }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Sunlight golden gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(243,229,171,0.25),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.04),transparent_50%)]" />
        </div>
      )}

      {/* 主题背景图：固定于视窗中心，高度 100vh，层级高于底色、低于正文 */}
      <div
        aria-hidden
        className="fixed inset-0 z-[1] pointer-events-none flex items-center justify-center overflow-hidden"
      >
        <img
          src="/theme-bg-circle.webp"
          alt=""
          className="h-screen w-auto object-contain transition-transform duration-700 cubic-bezier(0.2, 0, 1, 0.8) mix-blend-lighten"
          style={{ transform: `rotate(${bgRotation}deg)` }}
        />
      </div>

      {/* Main Header navigation */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        activeView={activeView}
        setActiveView={setActiveView}
        resetTest={resetTest}
        authUser={authUser}
        onLogout={handleLogout}
      />

      {/* Primary dynamic view router layout */}
      <main
        id="app-main-content"
        className="flex-grow z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative"
      >
        <div className="relative z-10">
          {activeView === "home" && (
            <HomeView
              theme={theme}
              setActiveView={setActiveView}
              setSelectedMbti={setSelectedMbti}
            />
          )}

          {activeView === "types" && (
            <TypesView
              theme={theme}
              selectedMbti={selectedMbti}
              setSelectedMbti={setSelectedMbti}
              userMbti={testResult?.mbti}
            />
          )}

          {activeView === "test" && (
            <TestView theme={theme} onFinishTest={handleFinishTest} />
          )}

          {activeView === "result" && testResult && (
            <ResultView
              theme={theme}
              result={testResult}
              onRestart={() => setActiveView("test")}
              onExploreTypes={() => setActiveView("types")}
              onShareResult={handleShareResult}
            />
          )}

          {activeView === "comments" && (
            <CommentsView
              theme={theme}
              authUser={authUser}
              userMbtiTag={testResult?.mbti}
              onNavigateToAuth={() => setActiveView("auth")}
            />
          )}

          {activeView === "about" && <AboutView theme={theme} />}

          {activeView === "auth" && (
            <AuthView
              theme={theme}
              onLoginSuccess={handleLoginSuccess}
              onBack={() => setActiveView("home")}
            />
          )}
        </div>
      </main>

      {/* Shared Footer block */}

      <footer
        id="app-footer"
        className={`mt-20 border-t py-12 z-10 transition-colors duration-300 ${
          isDark
            ? "bg-[#060718]/60 border-cyan-500/10 text-stone-500"
            : "bg-[#faf8f5] border-[#ebdcc9] text-stone-500"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left */}
            <div className="md:col-span-5 space-y-3 text-center md:text-left">
              <div>
                <span
                  className={`text-md font-bold tracking-wider ${isDark ? "text-stone-300" : "text-stone-700"}`}
                >
                  PonyTI
                </span>
                <span
                  className={`text-xs ml-2 tracking-widest font-mono ${isDark ? "text-cyan-400" : "text-[#b3a076]"}`}
                >
                  CELESTIAL HARMONY
                </span>
              </div>
              <p className="text-xs leading-relaxed max-w-sm">
                发现与记录心智星图交汇的独立心理学测评平台。不含强迫判定，仅呈现优雅的个性倾向投影。
              </p>
              {/* 标红区域：小马宝莉二创免责声明 */}
              <p className="text-[10px] leading-relaxed max-w-sm opacity-70">
                本网站为《我的小马驹：友谊是魔法》（My Little Pony: Friendship
                is
                Magic）的非官方粉丝创作项目，与孩之宝（Hasbro）及其关联公司无关。所有相关角色、商标及知识产权归其各自所有者所有。本网站不用于任何商业用途，所有内容仅供爱好者交流使用。
              </p>
            </div>

            {/* Middle Nav connections */}
            <div className="md:col-span-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
              <button
                onClick={() => setActiveView("home")}
                className={`hover:underline ${isDark ? "text-stone-400 hover:text-white" : "text-stone-600 hover:text-stone-900"}`}
              >
                首页
              </button>
              <button
                onClick={() => setActiveView("types")}
                className={`hover:underline ${isDark ? "text-stone-400 hover:text-white" : "text-stone-600 hover:text-stone-900"}`}
              >
                角色目录
              </button>
              <button
                onClick={() => {
                  resetTest();
                  setActiveView("test");
                }}
                className={`hover:underline ${isDark ? "text-stone-400 hover:text-white" : "text-stone-600 hover:text-stone-900"}`}
              >
                立即测评
              </button>
              <button
                onClick={() => setActiveView("comments")}
                className={`hover:underline ${isDark ? "text-stone-400 hover:text-white" : "text-stone-600 hover:text-stone-900"}`}
              >
                留白留言
              </button>
              <button
                onClick={() => setActiveView("about")}
                className={`hover:underline ${isDark ? "text-stone-400 hover:text-white" : "text-stone-600 hover:text-stone-900"}`}
              >
                关于
              </button>
            </div>

            {/* Right Copyright */}
            <div className="md:col-span-3 text-center md:text-right text-xs space-y-1">
              <p>&copy; {new Date().getFullYear()} PonyTI SPECULUM.</p>
              <p className="text-[10px] font-mono select-none tracking-widest opacity-80 uppercase">
                MADE IN THE CELESTIAL ORBIT
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
