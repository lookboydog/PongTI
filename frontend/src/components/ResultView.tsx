/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, RefreshCw, BookOpen, Compass, ChevronRight, Award, Zap, Heart, Flame, Shield, ArrowRight, CheckCircle, User, Layers } from 'lucide-react';
import { ThemeMode, TestResult } from '../types';
import { CHARACTER_DATA } from '../data/characters';

interface ResultViewProps {
  theme: ThemeMode;
  result: TestResult;
  onRestart: () => void;
  onExploreTypes: () => void;
  onShareResult: () => void;
}

export default function ResultView({
  theme,
  result,
  onRestart,
  onExploreTypes,
  onShareResult
}: ResultViewProps) {
  const isDark = theme === 'dark';
  const { mbti, typeInfo, dimensions, matchedCharacter, shadowCharacter, similarityScore } = result;

  // Compute percentages for MBTI dimensions
  const getPercentage = (val1: number, val2: number) => {
    const total = val1 + val2;
    if (total === 0) return 50;
    return Math.round((val1 / total) * 100);
  };

  const ePct = getPercentage(dimensions.E, dimensions.I);
  const iPct = 100 - ePct;

  const sPct = getPercentage(dimensions.S, dimensions.N);
  const nPct = 100 - sPct;

  const tPct = getPercentage(dimensions.T, dimensions.F);
  const fPct = 100 - tPct;

  const jPct = getPercentage(dimensions.J, dimensions.P);
  const pPct = 100 - jPct;

  const mbtiDetails = [
    { label: '精力来源 / Attunement', left: '外倾 Extraversion', right: '内倾 Introversion', leftPct: ePct, rightPct: iPct },
    { label: '信息认知 / Perception', left: '实感 Sensing', right: '直觉 Intuition', leftPct: sPct, rightPct: nPct },
    { label: '决策理综 / Judgment', left: '理智 Thinking', right: '情感 Feeling', leftPct: tPct, rightPct: fPct },
    { label: '生活维度 / Execution', left: '规则 Judging', right: '随性 Perceiving', leftPct: jPct, rightPct: pPct },
  ];

  // Helper to determine MBTI group
  const getMbtiGroup = (charMbti: string) => {
    const code = charMbti.toUpperCase();
    if (code.includes('N') && code.includes('T')) return 'Analysts';
    if (code.includes('N') && code.includes('F')) return 'Diplomats';
    if (code.includes('S') && code.includes('J')) return 'Sentinels';
    return 'Explorers';
  };

  const isImageUrl = (url: string | undefined | null) => {
    return !!url && typeof url === 'string' && (url.startsWith('/') || url.startsWith('http') || url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.svg') || url.endsWith('.webp'));
  };

  // Safe fallback if not pre-computed (e.g. initial static state or backward compatibility)
  let matchedChar = matchedCharacter;
  let shadowChar = shadowCharacter;
  let simScore = similarityScore;

  if (!matchedChar && CHARACTER_DATA && CHARACTER_DATA.length > 0) {
    let bestMatch = CHARACTER_DATA[0];
    let bestScore = -1;
    let worstMatch = CHARACTER_DATA[0];
    let worstScore = 999;

    CHARACTER_DATA.forEach((char) => {
      const dist = Math.sqrt(
        Math.pow(ePct - char.stats.E, 2) +
        Math.pow(sPct - char.stats.S, 2) +
        Math.pow(tPct - char.stats.T, 2) +
        Math.pow(jPct - char.stats.J, 2)
      );
      let sim = Math.round(100 - (dist / 200) * 100);
      if (char.mbti.toUpperCase() === mbti.toUpperCase()) {
        sim = Math.min(100, sim + 3);
      }
      if (sim > bestScore) {
        bestScore = sim;
        bestMatch = char;
      }
      if (sim < worstScore) {
        worstScore = sim;
        worstMatch = char;
      }
    });

    matchedChar = bestMatch;
    shadowChar = worstMatch;
    simScore = bestScore;
  }

  return (
    <div id="result-view-container" className="py-10 space-y-12">
      {/* 1. Stunning Banner Header */}
      <section id="result-hero" className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <Award className="w-4 h-4" />
          <span>星象型格契合达成</span>
        </div>

        <div className="space-y-4">
          <h1 className={`text-3xl md:text-5xl font-extrabold pb-2 ${
            isDark 
              ? 'bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent' 
              : 'text-stone-900 shadow-2xs'
          }`}>
            ~ {typeInfo.title} ~
          </h1>
          <p className={`text-base font-mono font-extrabold tracking-widest uppercase ${
            isDark ? 'text-cyan-400' : 'text-[#b3a076]'
          }`}>
            CONSTELLATION HARMONY PROFILE: {mbti}
          </p>
        </div>

        <div className="text-6xl md:text-7xl py-4 block animate-bounce-slow">
          {typeInfo.avatar}
        </div>

        <p className={`text-base md:text-lg max-w-xl mx-auto leading-relaxed ${
          isDark ? 'text-stone-300' : 'text-[#645c52]'
        }`}>
          {typeInfo.description}
        </p>

        {/* Share & actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onRestart}
            className={`px-6 py-3.5 rounded-xl font-bold text-sm tracking-wider flex items-center space-x-2 transition-all duration-300 ${
              isDark
                ? 'bg-[#111225] border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
                : 'bg-white border border-[#cbbea9] text-stone-700 hover:bg-stone-50'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>重新载入星盘 </span>
          </button>

          <button
            onClick={onShareResult}
            className={`px-6 py-3.5 rounded-xl font-bold text-sm tracking-wider flex items-center space-x-2 transition-all duration-300 ${
              isDark
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_4px_15px_rgba(6,182,212,0.4)]'
                : 'bg-stone-800 text-stone-50 hover:bg-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>撰写此形态留言</span>
          </button>
        </div>
      </section>

      {/* GLORIOUS MLP SOULMATE MATCH CARD */}
      {matchedChar && (
        <section id="mlp-match-section" className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span>Soulmate Match Resonance</span>
            </div>
            <h2 className={`text-2xl md:text-3xl font-black flex items-center justify-center space-x-2 ${
              isDark ? 'text-white' : 'text-stone-850'
            }`}>
              <span>您的和美谐律共鸣小马</span>
            </h2>
            <p className="text-xs text-stone-400 mt-1.5 uppercase tracking-widest font-mono">
              Your My Little Pony Soul Resonance Profile
            </p>
          </div>

          <div className={`p-6 md:p-10 rounded-3xl border overflow-hidden relative group transition-all duration-500 ${
            isDark
              ? 'bg-gradient-to-br from-[#0e1026]/90 via-[#0a0c1e]/95 to-[#060714]/98 border-stone-800/50 shadow-2xl shadow-cyan-500/5'
              : 'bg-[#fcfbfa] border-[#e8dfd3] shadow-[0_20px_40px_rgba(104,94,49,0.06)]'
          }`}>
            {/* Top color indicator line matching the group */}
            <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${
              getMbtiGroup(matchedChar.mbti) === 'Analysts' ? 'from-indigo-500 via-purple-500 to-indigo-600' :
              getMbtiGroup(matchedChar.mbti) === 'Diplomats' ? 'from-pink-500 via-rose-500 to-pink-600' :
              getMbtiGroup(matchedChar.mbti) === 'Sentinels' ? 'from-blue-500 via-cyan-500 to-blue-600' : 
              'from-amber-400 via-yellow-500 to-amber-500'
            }`} />

            {/* Glowing background highlights in dark mode */}
            {isDark && (
              <div className="absolute top-10 right-10 w-72 h-72 rounded-full filter blur-[120px] opacity-10 pointer-events-none transition-all duration-700 bg-gradient-to-br from-indigo-500 to-cyan-500" />
            )}

            {/* Main grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10 pt-2">
              
              {/* Left Core Profile & Resonance Stats */}
              <div className="md:col-span-5 flex flex-col items-center text-center space-y-6">
                
                {/* Character collectible ID / Top text inside card */}
                <div className="w-full flex justify-between items-center px-1 font-mono text-[10px] tracking-widest text-stone-500 border-b border-stone-800/20 dark:border-stone-500/10 pb-2">
                  <span>PONY REZ SYSTEM v2.0</span>
                  <span className="font-bold text-cyan-500/80">NO. {matchedChar.id.toUpperCase()}</span>
                </div>

                {/* Avatar simplified - only display image/placeholder with rounded corners and no outer decorations */}
                <div className="w-[90%] mx-auto aspect-square relative rounded-3xl overflow-hidden mt-1">
                  {isImageUrl(matchedChar.avatar) ? (
                    <img
                      src={matchedChar.avatar}
                      alt={matchedChar.name}
                      className="w-full h-full object-cover rounded-3xl"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={`w-full h-full rounded-3xl flex items-center justify-center text-7xl md:text-8xl ${
                      isDark ? 'bg-stone-900 text-stone-300' : 'bg-stone-100 text-stone-700'
                    }`}>
                      <span className="select-none">{matchedChar.avatar}</span>
                    </div>
                  )}
                </div>

                {/* Info block arranged below the image */}
                <div className="space-y-4 w-full px-2">
                  <div className="flex flex-col items-center space-y-2">
                    <h3 className={`text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-stone-850'}`}>
                      {matchedChar.name}
                    </h3>
                    
                    {/* Nice badging system representing category, style and title */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <span className={`text-[12px] font-mono tracking-widest font-black px-3 py-1 rounded-full border shadow-sm ${
                        getMbtiGroup(matchedChar.mbti) === 'Analysts' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' :
                        getMbtiGroup(matchedChar.mbti) === 'Diplomats' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                        getMbtiGroup(matchedChar.mbti) === 'Sentinels' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                        'bg-amber-500/10 border-amber-500/30 text-amber-500'
                      }`}>
                        {matchedChar.mbti}
                      </span>
                      
                      <span className={`text-[11px] px-3 py-1 rounded-full font-bold border ${
                        isDark ? 'bg-stone-900 border-stone-800 text-stone-300' : 'bg-stone-100 border-stone-200 text-stone-600'
                      }`}>
                        {matchedChar.group}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1.5 justify-center text-xs font-semibold tracking-wider">
                    <span className={isDark ? 'text-cyan-400 font-bold' : 'text-[#87785c] font-black'}>{matchedChar.title}</span>
                  </div>
                  
                  {/* Persona Traits mini badges list */}
                  {matchedChar.traits && matchedChar.traits.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-1.5 py-1">
                      {matchedChar.traits.map((tr: string) => (
                        <span key={tr} className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                          isDark 
                            ? 'bg-stone-900/40 border-stone-800 text-stone-400' 
                            : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}>
                          #{tr}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Resonance Level with interactive matching index bar */}
                <div className="w-[90%] mx-auto space-y-2.5 pt-4 border-t border-stone-800/10 dark:border-stone-500/10">
                  <div className="flex justify-between text-xs font-black">
                    <span className={isDark ? 'text-stone-300' : 'text-stone-600'}>灵魂共鸣契合度 (Resonance)</span>
                    <span className={`font-mono text-lg font-black tracking-tight ${isDark ? 'text-cyan-400' : 'text-[#b3a076]'}`}>{simScore}%</span>
                  </div>
                  <div className={`h-3 w-full rounded-full overflow-hidden p-[2px] ${isDark ? 'bg-stone-950 border border-stone-800' : 'bg-stone-250/50'}`}>
                    <div
                      className={`h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shadow-md`}
                      style={{ width: `${simScore}%` }}
                    />
                  </div>
                </div>

                {/* Standard Dimensions percentages comparison */}
                <div className={`w-[90%] mx-auto space-y-2.5 pt-3.5 font-mono text-[11px] p-4 rounded-2xl border ${
                  isDark 
                    ? 'text-stone-400 bg-stone-950/25 border-stone-500/10' 
                    : 'text-[#645c52] bg-[#fffdfa] border-[#ebdcc9] shadow-inner'
                }`}>
                  <div className="flex justify-between items-center pb-1.5 border-b border-stone-800/10 dark:border-stone-500/5 text-[9px] text-stone-500 font-bold uppercase tracking-widest">
                    <span>Dimension</span>
                    <span>Spectrum Index</span>
                    <span>Dimension</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className={matchedChar.stats.E >= matchedChar.stats.I ? (isDark ? 'font-black text-cyan-400' : 'font-black text-cyan-700') : (isDark ? 'text-stone-500' : 'text-stone-400')}>E 外倾 {matchedChar.stats.E}%</span>
                      <span className={matchedChar.stats.I >= matchedChar.stats.E ? (isDark ? 'font-black text-cyan-400' : 'font-black text-cyan-700') : (isDark ? 'text-stone-500' : 'text-stone-400')}>{matchedChar.stats.I}% 内倾 I</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={matchedChar.stats.S >= matchedChar.stats.N ? (isDark ? 'font-black text-cyan-400' : 'font-black text-cyan-700') : (isDark ? 'text-stone-500' : 'text-stone-400')}>S 实感 {matchedChar.stats.S}%</span>
                      <span className={matchedChar.stats.N >= matchedChar.stats.S ? (isDark ? 'font-black text-cyan-400' : 'font-black text-cyan-700') : (isDark ? 'text-stone-500' : 'text-stone-400')}>{matchedChar.stats.N}% 直觉 N</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={matchedChar.stats.T >= matchedChar.stats.F ? (isDark ? 'font-black text-cyan-400' : 'font-black text-cyan-700') : (isDark ? 'text-stone-500' : 'text-stone-400')}>T 理智 {matchedChar.stats.T}%</span>
                      <span className={matchedChar.stats.F >= matchedChar.stats.T ? (isDark ? 'font-black text-rose-400' : 'font-black text-rose-700') : (isDark ? 'text-stone-500' : 'text-stone-400')}>{matchedChar.stats.F}% 情感 F</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={matchedChar.stats.J >= matchedChar.stats.P ? (isDark ? 'font-black text-cyan-400' : 'font-black text-cyan-700') : (isDark ? 'text-stone-500' : 'text-stone-400')}>J 规则 {matchedChar.stats.J}%</span>
                      <span className={matchedChar.stats.P >= matchedChar.stats.J ? (isDark ? 'font-black text-yellow-400 animate-pulse' : 'font-black text-amber-700') : (isDark ? 'text-stone-500' : 'text-stone-400')}>{matchedChar.stats.P}% 随性 P</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Detailed Profiles, styled beautifully matching the ACGTI elegant profile */}
              <div className="md:col-span-7 space-y-7">
                
                {/* Description */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-black tracking-widest text-stone-500 dark:text-stone-400 uppercase flex items-center space-x-2 border-b border-stone-800/10 dark:border-stone-500/10 pb-2">
                    <BookOpen className="w-4 h-4 shrink-0 text-cyan-500/80" />
                    <span>谐律型格自传 / COGNITIVE PROFILE</span>
                  </h4>
                  <div className={`p-5 rounded-2xl border text-sm leading-relaxed relative ${
                    isDark ? 'bg-stone-900/20 border-stone-800 text-stone-300' : 'bg-stone-50/50 border-[#ebe1d5] text-stone-750 font-medium'
                  }`}>
                    {/* Quote mark backgrounds */}
                    <div className="absolute top-1 left-2 font-serif text-5xl opacity-10 select-none text-stone-400">“</div>
                    <p className="relative z-10 pl-3">
                      {matchedChar.description}
                    </p>
                  </div>
                </div>

                {/* Force of Magic / Celestial Force */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-black tracking-widest text-stone-500 dark:text-stone-400 uppercase flex items-center space-x-2 border-b border-stone-800/10 dark:border-stone-500/10 pb-2">
                    <Sparkles className="w-4 h-4 shrink-0 text-amber-500 animate-pulse" />
                    <span>神格魔法异能 / CELESTIAL FORCE</span>
                  </h4>
                  <div className={`p-4 rounded-2xl border text-xs leading-relaxed transition-colors ${
                    isDark ? 'bg-cyan-950/10 border-cyan-500/15' : 'bg-[#fffdf7] border-[#ebe1d5]'
                  }`}>
                    <p className={`font-black text-[14px] mb-1.5 text-cyan-400 flex items-center space-x-1.5`}>
                      <span>✨ {matchedChar.celestialForce || '暂无显化'}</span>
                    </p>
                    <p className="text-stone-400 leading-normal pl-4 border-l-2 border-cyan-500/40 mt-1">
                      这是蕴藏在星盘本源底层的谐律能量源，指引着持有此种人格波段的小马在逆境中爆发奇迹之光。
                    </p>
                  </div>
                </div>

                {/* Flaw Testing */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-black tracking-widest text-rose-500 uppercase flex items-center space-x-2 border-b border-stone-800/10 dark:border-stone-500/10 pb-2">
                    <Flame className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>本源幽暗试炼 / COGNITIVE SHADOW FLAW</span>
                  </h4>
                  <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                    isDark ? 'bg-[#ff0055]/5 border-[#ff0055]/10 text-rose-300' : 'bg-rose-50/40 border-rose-100 text-rose-900'
                  }`}>
                    <p className="font-extrabold text-[14px] mb-1.5 text-rose-400 flex items-center space-x-1.5">
                      <span>💔 {matchedChar.weakness || '无懈可击'}</span>
                    </p>
                    <p className="text-stone-400 leading-normal pl-4 border-l-2 border-rose-500/40 mt-1">
                      每个人格都有其影子背面。通过了解此弱点，您能更好地修补灵魂裂痕，最终迈向心智境界的高阶跃迁。
                    </p>
                  </div>
                </div>

                {/* Best Partners info */}
                <div className="space-y-3.5">
                  <h4 className="text-[11px] font-black tracking-widest text-stone-500 dark:text-stone-400 uppercase flex items-center space-x-2 border-b border-stone-800/10 dark:border-stone-500/10 pb-2">
                    <Heart className="w-4 h-4 shrink-0 text-pink-500" />
                    <span>金兰谐律伙伴 / COMPATIBLE HARMONY PARTNERS</span>
                  </h4>
                  <div className={`p-4 rounded-2xl border ${isDark ? 'bg-stone-950/10 border-[#1c1d3a]' : 'bg-[#fffdf7] border-[#ebe1d5]'}`}>
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {matchedChar.bestPartners?.map((partner: string) => (
                        <span
                          key={partner}
                          className={`text-xs px-4 py-2 rounded-full border font-black flex items-center space-x-1.5 transition-all duration-300 hover:scale-[1.04] ${
                            isDark 
                              ? 'bg-stone-900 border-pink-500/20 text-pink-300' 
                              : 'bg-white border-pink-100 text-pink-800 shadow-3xs'
                          }`}
                        >
                          <span>💖 {partner}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Growth Journey timeline */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-[11px] font-black tracking-widest text-stone-500 dark:text-stone-400 uppercase flex items-center space-x-2 border-b border-stone-800/10 dark:border-stone-500/10 pb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <span>和谐漫长旅程里程碑 / GROWTH JOURNEY PATH</span>
                  </h4>
                  <div className="flex flex-col space-y-3.5 font-sans mt-2 pl-2">
                    {matchedChar.milestones?.map((milestone: string, mIdx: number) => (
                      <div key={mIdx} className="flex items-start space-x-3 text-xs">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-extrabold flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-xs">
                          {mIdx + 1}
                        </span>
                        <div className="space-y-0.5 pt-0.5">
                          <span className={isDark ? 'text-stone-200 font-bold leading-relaxed' : 'text-stone-750 font-semibold'}>
                            {milestone}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
            
            {/* Shadow self teaser box in footer */}
            {shadowChar && (
              <div className={`mt-10 pt-8 border-t font-sans ${
                isDark ? 'border-stone-800/65' : 'border-stone-200/50'
              }`}>
                <div className={`p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 text-xs transition-colors ${
                  isDark ? 'bg-black/25 border border-stone-800 text-stone-300' : 'bg-stone-50 border border-stone-250 text-stone-600'
                }`}>
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center space-x-1.5 text-purple-400 font-black uppercase text-[10px] tracking-widest">
                      <Compass className="w-4 h-4 shrink-0 animate-spin-slow text-purple-400" />
                      <span>镜中投影影子心智 / MYSTERIOUS SHADOW SELF</span>
                    </div>
                    <p className="leading-relaxed text-stone-440 text-[11.5px]">
                      代表了您最不容易在世人面前展露出的心智形态。对方与你的性格结构恰恰呈互补的反向投影。
                    </p>
                  </div>
                  <div className={`flex items-center space-x-3.5 shrink-0 self-start sm:self-center p-3.5 rounded-xl border ${
                    isDark ? 'bg-stone-900/10 border-stone-800/10 dark:border-stone-500/5' : 'bg-[#fffdf7] border-[#ebe1d5]'
                  }`}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-stone-800 to-stone-950 border border-stone-700/50 flex items-center justify-center text-xl shadow-inner select-none bg-stone-950 overflow-hidden shrink-0">
                      {isImageUrl(shadowChar.avatar) ? (
                        <img src={shadowChar.avatar} alt={shadowChar.name} className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                      ) : (
                        shadowChar.avatar
                      )}
                    </div>
                    <div>
                      <p className={`font-black tracking-wide text-sm ${isDark ? 'text-white' : 'text-stone-800'}`}>
                        {shadowChar.name}
                      </p>
                      <p className="font-mono text-[9px] text-stone-500 tracking-wider">
                        OPPOSITE STYLE: {shadowChar.mbti}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </section>
      )}
      <section id="result-analytics" className="max-w-4xl mx-auto px-4">
        <div className={`p-6 md:p-8 rounded-3xl border ${
          isDark
            ? 'bg-[#12132e]/55 border-cyan-500/20'
            : 'bg-white border-[#ebdcc9] shadow-[0_10px_25px_rgba(104,94,49,0.03)]'
        }`}>
          <h3 className={`text-md font-mono tracking-wider font-extrabold mb-6 text-stone-400 uppercase`}>
            光谱倾向比例 (Spectrogram Analysis)
          </h3>

          <div className="space-y-6">
            {mbtiDetails.map((dim, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-stone-400">
                  <span>{dim.label}</span>
                </div>
                <div className="flex items-center justify-between font-bold text-xs sm:text-sm">
                  {/* Left Label */}
                  <span className={`${dim.leftPct >= 50 ? (isDark ? 'text-cyan-400' : 'text-stone-955') : 'text-stone-400'}`}>
                    {dim.left} <span className="font-mono">{dim.leftPct}%</span>
                  </span>

                  {/* Meter Track */}
                  <div className={`h-3 flex-1 mx-4 rounded-full overflow-hidden ${
                    isDark ? 'bg-stone-900' : 'bg-stone-200/50'
                  }`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDark ? 'bg-[#00f2ff]' : 'bg-[#c1b191]'
                      }`}
                      style={{ width: `${dim.leftPct}%` }}
                    />
                  </div>

                  {/* Right Label */}
                  <span className={`${dim.rightPct > 51 ? (isDark ? 'text-cyan-400' : 'text-stone-955') : 'text-stone-400'}`}>
                    <span className="font-mono">{dim.rightPct}%</span> {dim.right}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 4. Action CTA Card */}
      <section id="result-cta" className="max-w-4xl mx-auto px-4 text-center">
        <div className={`p-8 rounded-3xl border ${
          isDark 
            ? 'bg-gradient-to-r from-cyan-950/20 via-[#111225] to-blue-955 border-cyan-500/20' 
            : 'bg-[#ebdcd0]/30 border-[#cbbea9]/60 shadow-xs'
        }`}>
          <h2 className={`text-xl font-extrabold mb-3 ${isDark ? 'text-white' : 'text-stone-800'}`}>
            想要探看谱系星盘的其他角落吗?
          </h2>
          <p className={`text-sm max-w-lg mx-auto mb-6 ${isDark ? 'text-stone-300' : 'text-[#645c52]'}`}>
            你可以进入“角色目录”页面翻阅各个主星座的经典共鸣角色。或者浏览大家讨论星空原力交汇的留言。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onExploreTypes}
              className={`px-5 py-3 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all duration-300 ${
                isDark 
                  ? 'bg-transparent border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10' 
                  : 'bg-white border-[#cbbea9] text-stone-700 hover:bg-stone-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>去翻阅共鸣角色目录</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
