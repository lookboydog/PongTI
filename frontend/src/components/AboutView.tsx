/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, HelpCircle, Compass, Shield, BookOpen, Heart, Landmark, Info } from 'lucide-react';
import { ThemeMode } from '../types';

interface AboutViewProps {
  theme: ThemeMode;
}

export default function AboutView({ theme }: AboutViewProps) {
  const isDark = theme === 'dark';

  return (
    <div id="about-container" className="py-10 max-w-4xl mx-auto px-4 space-y-12">
      {/* 1. Header Details */}
      <div className="text-center space-y-4">
        <h1 className={`text-3xl md:text-5xl font-extrabold tracking-tight ${
          isDark ? 'text-white' : 'text-stone-900'
        }`}>
          关于谱系故事
        </h1>
        <p className={`text-base md:text-lg max-w-xl mx-auto leading-relaxed ${
          isDark ? 'text-stone-300' : 'text-[#645c52]'
        }`}>
          从浩渺宇宙到个体微光：解密人机交互与心智和谐谱系的非凡之旅。
        </p>
      </div>

      {/* 2. Brand Value Blocks */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div className={`p-6 md:p-8 rounded-3xl border ${
          isDark ? 'bg-[#111225]/45 border-cyan-500/15' : 'bg-white border-[#ebdcc9] shadow-md shadow-stone-100'
        }`}>
          <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${isDark ? 'text-white' : 'text-stone-850'}`}>
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>宇宙微光理论 (The Nebula Spectrum)</span>
          </h3>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-[#645c52]'}`}>
            我们深信，MBTI 的四大二分维度不应该成为将生动的灵魂囚禁其中的死板格子。在 PonyTI，我们视性格为流动的、由各种谐振倾向复合而成的星轨。每个人的心智都是一片独一无二的光谱（Spectrum），在其内部，‘皇家创造力’与‘神圣秩序力’可以同时在不同层面上和弦齐鸣。
          </p>
        </div>

        <div className={`p-6 md:p-8 rounded-3xl border ${
          isDark ? 'bg-[#111225]/45 border-cyan-500/15' : 'bg-white border-[#ebdcc9] shadow-md shadow-stone-100'
        }`}>
          <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${isDark ? 'text-white' : 'text-stone-850'}`}>
            <Heart className="w-5 h-5 text-rose-400" />
            <span>友谊和谐大一统 (Royal Friendship)</span>
          </h3>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-[#645c52]'}`}>
            不同星轨的交汇产生共鸣，亦产生剧烈的星体碰撞。我们的配套伴侣逻辑，是从彼此完全对立的互补态，或者具有共同‘星群圣火’的同步态中，为你精确提纯出跨越心智障壁的终身契合度。认识你是谁、认识你挚友是谁，是获得和谐人际的黄金之匙。
          </p>
        </div>
      </section>

      {/* 3. Detailed timeline card */}
      <section 
        id="about-roadmap"
        className={`p-6 md:p-8 rounded-3xl border ${
          isDark ? 'bg-[#111225]/45 border-cyan-500/15' : 'bg-white border-[#ebdcc9]/80 shadow-inner'
        }`}
      >
        <h3 className={`text-lg font-extrabold mb-6 flex items-center space-x-2 ${isDark ? 'text-white' : 'text-stone-850'}`}>
          <Info className="w-5 h-5 text-cyan-400" />
          <span>开发漫游手册与版本进化</span>
        </h3>

        <div className="space-y-6">
          {[
            { tag: "v1.0 (Celestial Core)", title: "基础谱系构建", desc: "搭建起完整的 16 星轨型格体系档案与精密的 20 维智能量化测评逻辑，奠定了最根本的神圣秩序系统。" },
            { tag: "v1.2 (Astral Theme Switcher)", title: "全景日夜交替完成", desc: "完美实现『日之黎明 - 和谐谱系』与『夜之深夜 - 寂蓝星轨』的动态双向同步，所有背景、边框、投影及点缀均完成微秒级响应过渡。" },
            { tag: "v2.0 (Echo Community)", title: "星笺留白互动系统", desc: "全新设计并投放了具有完全逻辑响应、likes 星光、mbti 型格标记与留言回复能力的『留白留言板』交互网，打造首个心智共享空间。" },
            { tag: "v1.0.0 (2026.6.9)", title:"修复的问题",  desc: "把界面图标统一，修复了QQ和微信快捷登入功能(要申请api，还要米，我也是服了)" },
            { tag: "v1.0.0 (2026.6.9)", title:"目前存在问题",  desc: "部分人物卡片展示不全，卡片中的相关信息太少,几何风格人物图片质量不达标,测试题目相关的情景太少.测试人物存在匹配度不准确的问题.几何风格人物图片质量不达标.测试题目相关的情景太少，测试人物存在匹配度不准确的问题"},
            { tag: "v1.0.1 (2026.6.10)", title:"修复的问题",  desc: "人物的mbti各项值，增添人物背景故事文本。优化了测试题目与小马宝莉的关联性，和测试结果准确度的问题。增添的页脚的免责声明。目前在做Q版的人物图片，期待下。"},
          ].map((item, idx) => (
            <div key={idx} className="flex space-x-4 items-start">
              <span className={`px-2.5 py-1 text-[10px] font-mono leading-none font-bold rounded-lg border ${
                isDark ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' : 'bg-stone-100 text-stone-700'
              }`}>
                {item.tag}
              </span>
              <div className="text-xs space-y-1">
                <h4 className={`font-bold text-sm ${isDark ? 'text-stone-200' : 'text-stone-850'}`}>{item.title}</h4>
                <p className={isDark ? 'text-stone-400 font-medium' : 'text-stone-600'}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </section>

      <div className="text-center pt-4">
        <p className="text-xs text-stone-500 font-mono tracking-widest uppercase">
          PONYTI PROJECT — ALL RIGHTS RESERVED
        </p>
      </div>
    </div>
  );
}
