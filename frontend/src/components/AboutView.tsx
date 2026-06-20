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
    <div
      id="about-container"
      className="py-10 max-w-4xl mx-auto px-4 space-y-12"
    >
      {/* 1. Header Details */}
      <div className="text-center space-y-4">
        <h1
          className={`text-3xl md:text-5xl font-extrabold tracking-tight ${
            isDark ? "text-white" : "text-stone-900"
          }`}
        >
          关于开发过程
        </h1>
        <p
          className={`text-base md:text-lg max-w-xl mx-auto leading-relaxed ${
            isDark ? "text-stone-300" : "text-[#645c52]"
          }`}
        >
          从起初的想法，到一步步的实现过程
        </p>
      </div>

      {/* 2. Brand Value Blocks */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div
          className={`p-6 md:p-8 rounded-3xl border ${
            isDark
              ? "bg-[#111225]/45 border-cyan-500/15"
              : "bg-white border-[#ebdcc9] shadow-md shadow-stone-100"
          }`}
        >
          <h3
            className={`text-lg font-bold mb-4 flex items-center space-x-2 ${isDark ? "text-white" : "text-stone-850"}`}
          >
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>开发相关的工具</span>
          </h3>
          <p
            className={`text-sm leading-relaxed ${isDark ? "text-stone-300" : "text-[#645c52]"}`}
          >
            UI界面是提交了上百次的promit和换了三套设计才敲定，转变前端代码还是效果没能实现。用的是Google
            Stitch和Google Ai Studio
            su一体化生成的。最后的后端代码实现是用的Antigravity + Remotion
          </p>
        </div>

        <div
          className={`p-6 md:p-8 rounded-3xl border ${
            isDark
              ? "bg-[#111225]/45 border-cyan-500/15"
              : "bg-white border-[#ebdcc9] shadow-md shadow-stone-100"
          }`}
        >
          <h3
            className={`text-lg font-bold mb-4 flex items-center space-x-2 ${isDark ? "text-white" : "text-stone-850"}`}
          >
            <Heart className="w-5 h-5 text-rose-400" />
            <span>一些话</span>
          </h3>
          <p
            className={`text-sm leading-relaxed ${isDark ? "text-stone-300" : "text-[#645c52]"}`}
          >
            掌握一门技术从不是只靠一味的埋头苦干就能成的，它不仅仅只是需要勤奋，还需要一些资源和一些独到的见解。特别喜欢蛊中的“我们都是小人物，哭是没有用的，喊也是没人听的，只能自己坚持
            坚持下去，直至成就伟大，脱离平凡，或者迎接自己的死亡”，与其听网上可能一行代码都没敲过的人来评价计算机，不如按照自己的想法再坚持一直走下去，亲眼看见技术"上限"的感觉，一定比整天惶恐生在"楚门的世界"的感觉更棒。
          </p>
        </div>
      </section>

      {/* 3. Detailed timeline card */}
      <section
        id="about-roadmap"
        className={`p-6 md:p-8 rounded-3xl border ${
          isDark
            ? "bg-[#111225]/45 border-cyan-500/15"
            : "bg-white border-[#ebdcc9]/80 shadow-inner"
        }`}
      >
        <h3
          className={`text-lg font-extrabold mb-6 flex items-center space-x-2 ${isDark ? "text-white" : "text-stone-850"}`}
        >
          <Info className="w-5 h-5 text-cyan-400" />
          <span>网站开发情况和近况版本的更新</span>
        </h3>

        <div className="space-y-6">
          {[
            {
              tag: "v1.0.0 (2026.6.9)",
              title: "修复的问题",
              desc: "把界面图标统一，修复了QQ和微信快捷登入功能(要申请api，还要米，我也是服了)",
            },
            {
              tag: "v1.0.0 (2026.6.9)",
              title: "目前存在问题",
              desc: "部分人物卡片展示不全，卡片中的相关信息太少,几何风格人物图片质量不达标,测试题目相关的情景太少.测试人物存在匹配度不准确的问题.几何风格人物图片质量不达标.测试题目相关的情景太少，测试人物存在匹配度不准确的问题",
            },
            {
              tag: "v1.0.1 (2026.6.10)",
              title: "修复的问题",
              desc: "人物的mbti各项值，增添人物背景故事文本。优化了测试题目与小马宝莉的关联性，和测试结果准确度的问题。增添的页脚的免责声明。目前在做Q版的人物图片，期待下。",
            },
            {
              tag: "v2.0.1 (2026.6.20)",
              title: "后期的更新和维护",
              desc: "这个项目85%是由ai主导完成的，可以看出react的语法比vue更受ai的青睐。后续上手完react后，会尝试加入一些新的功能，比如账号信息的自定义，还有很多人期待的小马头像，回复的设计表情包等。",
            },
          ].map((item, idx) => (
            <div key={idx} className="flex space-x-4 items-start">
              <span
                className={`px-2.5 py-1 text-[10px] font-mono leading-none font-bold rounded-lg border ${
                  isDark
                    ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
                    : "bg-stone-100 text-stone-700"
                }`}
              >
                {item.tag}
              </span>
              <div className="text-xs space-y-1">
                <h4
                  className={`font-bold text-sm ${isDark ? "text-stone-200" : "text-stone-850"}`}
                >
                  {item.title}
                </h4>
                <p
                  className={
                    isDark ? "text-stone-400 font-medium" : "text-stone-600"
                  }
                >
                  {item.desc}
                </p>
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
