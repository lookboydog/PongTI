/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, X, Sparkles, Brain, Feather, Shield, Compass, 
  ArrowRight, Quote, Flame, Info, RotateCcw, HelpCircle, 
  User, Database, Layers, CheckCircle, Orbit
} from 'lucide-react';
import { ThemeMode, PersonalityGroup, PersonalityType } from '../types';
import { CHARACTER_DATA, CharacterCard } from '../data/characters';
import { PERSONALITIES } from '../data/personalities';

interface TypesViewProps {
  theme: ThemeMode;
  selectedMbti: string | null;
  setSelectedMbti: (id: string | null) => void;
  userMbti?: string | null;
}

export function getMbtiGroup(mbti: string): PersonalityGroup {
  const code = mbti.toUpperCase();
  if (code.includes('N') && code.includes('T')) return 'Analysts';
  if (code.includes('N') && code.includes('F')) return 'Diplomats';
  if (code.includes('S') && code.includes('J')) return 'Sentinels';
  return 'Explorers';
}

export function getCharProb(charId: string, mbti: string): number {
  let hash = 0;
  for (let i = 0; i < charId.length; i++) {
    hash = charId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return 1 + Math.abs(hash % 99); // Ensures stable unique distribution 1% - 100%
}

export function getProbabilityColorClass(prob: number): string {
  if (prob <= 17) return 'bg-[#a8a29e]'; // 0% - 17% Stone gray
  if (prob <= 34) return 'bg-[#829e88]'; // 17% - 34% Sage green
  if (prob <= 51) return 'bg-[#8ba5b3]'; // 34% - 51% Steel blue
  if (prob <= 68) return 'bg-[#aaa0db]'; // 51% - 68% Dust lavender
  if (prob <= 85) return 'bg-[#cca673]'; // 68% - 85% Autumn bronze
  return 'bg-[#c27885]'; // 85% - 100% Dusty rose
}

export function getMbtiGroupLabel(group: PersonalityGroup): string {
  if (group === 'Analysts') return '学者 (NT)';
  if (group === 'Diplomats') return '外交官 (NF)';
  if (group === 'Sentinels') return '卫士 (SJ)';
  if (group === 'Explorers') return '开拓者 (SP)';
  return group;
}

export function mapPersonalityToCharacterCard(p: PersonalityType): CharacterCard {
  const mbti = p.id;
  const isE = mbti[0] === 'E';
  const isS = mbti[1] === 'S';
  const isT = mbti[2] === 'T';
  const isJ = mbti[3] === 'J';

  return {
    id: p.id,
    name: p.name + ` (${p.englishName})`,
    mbti: p.id,
    group: "16个人格原型",
    title: p.title,
    description: p.description,
    avatar: p.avatar,
    traits: p.traits,
    stats: {
      E: isE ? 80 : 20,
      I: isE ? 20 : 80,
      S: isS ? 80 : 20,
      N: isS ? 20 : 80,
      T: isT ? 80 : 20,
      F: isT ? 20 : 80,
      J: isJ ? 80 : 20,
      P: isJ ? 20 : 80,
    },
    bestPartners: p.bestPartners,
    weakness: p.weakness,
    celestialForce: p.celestialForce,
    milestones: p.milestones || [],
    historicalFigures: p.historicalFigures || [],
  };
}

export default function TypesView({ theme, selectedMbti, setSelectedMbti, userMbti }: TypesViewProps) {
  const isDark = theme === 'dark';
  const [activeGroup, setActiveGroup] = useState<PersonalityGroup | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMbtiTag, setActiveMbtiTag] = useState<string>('All');
  const [activeDetailChar, setActiveDetailChar] = useState<CharacterCard | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const getAvatarBg = (mbti: string) => {
    const gr = getMbtiGroup(mbti);
    switch (gr) {
      case 'Analysts': return 'from-indigo-600 to-purple-850 shadow-indigo-500/10 text-indigo-100';
      case 'Diplomats': return 'from-pink-500 to-rose-700 shadow-rose-500/10 text-rose-100';
      case 'Sentinels': return 'from-blue-600 to-cyan-800 shadow-cyan-500/10 text-cyan-100';
      case 'Explorers': return 'from-amber-500 to-yellow-600 shadow-yellow-500/10 text-amber-955';
      default: return 'from-stone-700 to-stone-900 text-stone-100';
    }
  };

  const isImageUrl = (url: string | undefined | null) => {
    return !!url && typeof url === 'string' && (url.startsWith('/') || url.startsWith('http') || url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.svg') || url.endsWith('.webp'));
  };

  const getResonance = (charMbti: string) => {
    if (!userMbti) {
      const hash = charMbti.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      return Math.floor(82 + (hash % 16));
    }
    let matches = 0;
    const len = Math.min(charMbti.length, userMbti.length);
    for (let i = 0; i < len; i++) {
      if (charMbti[i].toUpperCase() === userMbti[i].toUpperCase()) {
        matches++;
      }
    }
    return Math.floor(60 + matches * 10);
  };

  // Lazy loading states
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // MBTI list for auxiliary fast filter
  const allMbtis = [
    "INTJ", "INTP", "ENTJ", "ENTP", 
    "INFJ", "INFP", "ENFJ", "ENFP", 
    "ISTJ", "ISFJ", "ESTJ", "ESFJ", 
    "ISTP", "ISFP", "ESTP", "ESFP"
  ];

  // If a specific MBTI is selected/passed from the result page, apply that filter immediately
  useEffect(() => {
    if (selectedMbti) {
      setActiveMbtiTag(selectedMbti.toUpperCase());
      // Find group of that MBTI
      const matchP = PERSONALITIES.find(p => p.id === selectedMbti.toUpperCase());
      if (matchP) {
        setActiveGroup(matchP.group);
      }
      setSelectedMbti(null); // Clear selected state
    }
  }, [selectedMbti, setSelectedMbti]);

  // Handle category groups
  const groups: { id: PersonalityGroup | 'All'; label: string; desc: string; icon: any }[] = [
    { id: 'All', label: '全部谱系', desc: '宏大星域里的 16 种人格光谱总览', icon: Sparkles },
    { id: 'Analysts', label: '学者 (NT)', desc: '理智冷静、专注于底层逻辑与战略重构的探求者', icon: Brain },
    { id: 'Diplomats', label: '外交官 (NF)', desc: '慈悲温存、致力于心灵谐振与道德光明的理想主义者', icon: Feather },
    { id: 'Sentinels', label: '卫士 (SJ)', desc: '笃实稳重、构筑社会家园与规则秩序的坚贞基石', icon: Shield },
    { id: 'Explorers', label: '开拓者 (SP)', desc: '活在当下、拥有过人感知与绝佳机变行动力的鉴赏家', icon: Compass },
  ];

  // Filtered dataset
  const filteredCharacters = CHARACTER_DATA.filter((char) => {
    // 1. Group filter
    const charGrp = getMbtiGroup(char.mbti);
    const matchesGroup = activeGroup === 'All' || charGrp === activeGroup;
    
    // 2. Specific MBTI Tag filter
    const matchesMbtiTag = activeMbtiTag === 'All' || char.mbti === activeMbtiTag;

    // 3. Search query filter
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      char.name.toLowerCase().includes(query) ||
      char.mbti.toLowerCase().includes(query) ||
      char.title.toLowerCase().includes(query) ||
      char.group.toLowerCase().includes(query) ||
      char.description.toLowerCase().includes(query) ||
      char.celestialForce.toLowerCase().includes(query) ||
      char.weakness.toLowerCase().includes(query) ||
      char.traits.some(t => t.toLowerCase().includes(query));

    return matchesGroup && matchesMbtiTag && matchesSearch;
  });

  // Filtered 16 Personality Archetypes
  const filteredPersonalities = PERSONALITIES.filter((p) => {
    // 1. Group filter
    const matchesGroup = activeGroup === 'All' || p.group === activeGroup;
    
    // 2. Specific MBTI Tag filter
    const matchesMbtiTag = activeMbtiTag === 'All' || p.id === activeMbtiTag;

    // 3. Search query filter
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.englishName.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query) ||
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.celestialForce.toLowerCase().includes(query) ||
      p.weakness.toLowerCase().includes(query) ||
      p.traits.some(t => t.toLowerCase().includes(query));

    return matchesGroup && matchesMbtiTag && matchesSearch;
  });

  // Load more function with delay to simulate real retrieval loading
  const triggerLoadMore = () => {
    if (isLoadingMore || visibleCount >= filteredCharacters.length) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 8, filteredCharacters.length));
      setIsLoadingMore(false);
    }, 600);
  };

  // Infinite Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      
      // If we are reaching close to the bottom (within 150px)
      if (scrollTop + clientHeight >= scrollHeight - 150) {
        triggerLoadMore();
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredCharacters.length, visibleCount, isLoadingMore]);

  // Reset pagination when filter or search changes
  useEffect(() => {
    setVisibleCount(8);
  }, [activeGroup, activeMbtiTag, searchQuery]);

  const getGroupBadgeStyles = (group: PersonalityGroup) => {
    switch (group) {
      case 'Analysts':
        return isDark ? 'bg-purple-500/10 text-purple-300 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.05)]' : 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Diplomats':
        return isDark ? 'bg-pink-500/10 text-pink-300 border-pink-500/20 shadow-[0_0_10px_rgba(236,72,153,0.05)]' : 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Sentinels':
        return isDark ? 'bg-blue-500/10 text-blue-300 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.05)]' : 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Explorers':
        return isDark ? 'bg-amber-500/10 text-amber-300 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]' : 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  // Get matching personality archetype information
  const getMbtiArchetype = (mbtiCode: string) => {
    return PERSONALITIES.find(p => p.id.toUpperCase() === mbtiCode.toUpperCase());
  };

  return (
    <div id="types-view-container" className="py-10 space-y-10" ref={containerRef}>
      {/* 1. Header description */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-bold leading-none select-none animate-pulse">
          <Database className="w-3.5 h-3.5" />
          <span>星轨共鸣 · 同步加载中</span>
        </div>
        <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${
          isDark ? 'text-white' : 'text-stone-900'
        }`}>
          宇宙共鸣 角色目录
        </h1>
        <p className={`text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${
          isDark ? 'text-stone-300 font-medium' : 'text-[#645c52]'
        }`}>
          每个人都是浩瀚星空下振荡的频段。在这里，我们用 MBTI 棱镜去折射宇宙星轨中那些璀璨的、鲜活的、传说中的宏大灵魂，寻找与你产生灵魂共振的宇宙回响。
        </p>
      </div>

      {/* 2. Search & Categories filters section */}
      <div 
        id="search-filter-section"
        className={`max-w-7xl mx-auto rounded-3xl p-6 border transition-all duration-300 ${
          isDark
            ? 'bg-[#111225]/40 border-cyan-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
            : 'bg-white border-[#ebdcc8]/80 shadow-[0_4px_25px_rgba(104,94,49,0.02)]'
        }`}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Search Box */}
            <div className="lg:col-span-4 relative">
              <Search className={`absolute left-4 top-3.5 w-5 h-5 ${
                isDark ? 'text-stone-500' : 'text-stone-400'
              }`} />
              <input
                id="char-search-input"
                type="text"
                placeholder="搜索角色名, 出处, MBTI, 关键词..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full py-3 pl-12 pr-4 rounded-xl border font-sans text-sm focus:outline-none transition-all duration-300 ${
                  isDark
                    ? 'bg-stone-950 border-stone-800 text-stone-100 placeholder-stone-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20'
                    : 'bg-stone-50 border-[#cbbea9]/60 text-stone-800 placeholder-stone-400 focus:border-[#b3a076] focus:ring-1 focus:ring-[#b3a076]/20'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-3.5 text-stone-400 hover:text-stone-100"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              )}
            </div>

            {/* Group Segment tabs */}
            <div className="lg:col-span-8 flex overflow-x-auto pb-1 lg:pb-0 scrollbar-none gap-2">
              {groups.map((group) => {
                const Icon = group.icon;
                const isActive = activeGroup === group.id;
                return (
                  <button
                    key={group.id}
                    id={`group-tab-${group.id}`}
                    onClick={() => {
                      setActiveGroup(group.id);
                      setActiveMbtiTag('All'); // Reset specific mbti when change root group
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap tracking-wide transition-all duration-300 flex items-center space-x-1.5 border ${
                      isActive
                        ? isDark
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40 shadow-[0_0_15px_rgba(0,242,255,0.1)]'
                          : 'bg-stone-800 text-stone-50 border-stone-800'
                        : isDark
                          ? 'bg-stone-900/30 border-stone-800 text-stone-400 hover:bg-stone-900/50 hover:text-stone-200'
                          : 'bg-stone-50 border-[#ebdcc8]/50 text-[#857964] hover:bg-[#ebdcc8]/20 hover:text-stone-900'
                    }`}
                    title={group.desc}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{group.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Auxiliary Tag Filtering Grid */}
          <div className="border-t border-stone-800/10 dark:border-stone-850/50 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <span className="text-[10px] font-black uppercase text-stone-550 dark:text-stone-400 tracking-wider flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5" />
                <span>星符精细过滤 / Sub-mbti Filter</span>
              </span>
              {(activeMbtiTag !== 'All' || activeGroup !== 'All' || searchQuery) && (
                <button
                  onClick={() => {
                    setActiveGroup('All');
                    setActiveMbtiTag('All');
                    setSearchQuery('');
                  }}
                  className="text-[10px] text-rose-500 font-extrabold hover:underline flex items-center space-x-1 cursor-pointer self-start"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>重置所有筛选</span>
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveMbtiTag('All')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest uppercase transition-all ${
                  activeMbtiTag === 'All'
                    ? isDark
                      ? 'bg-cyan-400 text-stone-950 font-black'
                      : 'bg-[#b3a076] text-white'
                    : isDark
                      ? 'bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                      : 'bg-stone-100 text-stone-605 hover:bg-stone-200'
                }`}
              >
                全部星向
              </button>
              {allMbtis.map((mbti) => {
                // Determine if this MBTI fits the activeGroup
                const archetype = getMbtiArchetype(mbti);
                const fitsGroup = activeGroup === 'All' || (archetype && archetype.group === activeGroup);
                
                if (!fitsGroup) return null;

                return (
                  <button
                    key={mbti}
                    onClick={() => setActiveMbtiTag(mbti)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono tracking-widest uppercase transition-all ${
                      activeMbtiTag === mbti
                        ? isDark
                          ? 'bg-cyan-400 text-stone-950 font-black'
                          : 'bg-[#b3a076] text-white font-black'
                        : isDark
                          ? 'bg-stone-900 text-stone-400 hover:bg-stone-850 hover:text-stone-200 border border-stone-800/40'
                          : 'bg-stone-50 text-stone-600 hover:bg-[#ebdcc8]/20 border border-stone-200/50'
                    }`}
                  >
                    {mbti}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Grid representation */}
      <div id="types-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(filteredCharacters.length > 0 || filteredPersonalities.length > 0) ? (
          <div className="space-y-16">
            {/* Section 1: 16 MBTI Personality Archetypes */}
            {filteredPersonalities.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-3 border-b border-stone-850/10 dark:border-stone-800/40">
                  <div className={`w-2.5 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-indigo-500`} />
                  <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    16人格原型光谱 / 16 MBTI Personality Archetypes
                  </h2>
                  <span className={`text-xs ml-2 px-2 py-0.5 rounded-full font-bold ${
                    isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {filteredPersonalities.length} 个维度
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredPersonalities.map((p, index) => {
                    const charObj = mapPersonalityToCharacterCard(p);
                    return (
                      <motion.div
                        key={p.id}
                        id={`personality-card-${p.id}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.3 }}
                        onClick={() => setActiveDetailChar(charObj)}
                        className={`group relative p-6 rounded-3xl border overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1.5 ${
                          isDark
                            ? 'bg-[#181935]/40 border-indigo-500/20 hover:border-indigo-400/55 hover:bg-[#1f2046]/50 hover:shadow-[0_12px_28px_rgba(168,85,247,0.06)]'
                            : 'bg-[#faf8f5] border-[#ebdcc9] hover:border-[#b3a076] hover:bg-[#fffefc] hover:shadow-[0_10px_22px_rgba(104,94,49,0.04)]'
                        }`}
                      >
                        {/* Glowing line representing spectrum group */}
                        <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${
                          p.group === 'Analysts' ? 'from-purple-500 to-indigo-500' :
                          p.group === 'Diplomats' ? 'from-pink-500 to-rose-400' :
                          p.group === 'Sentinels' ? 'from-blue-500 to-cyan-500' : 'from-amber-400 to-yellow-500'
                        }`} />

                        {/* Top metadata */}
                        <div className="flex justify-between items-start mb-5 pt-2">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br shadow-inner transition-transform group-hover:scale-110 duration-300 ${getAvatarBg(p.id)} overflow-hidden`}>
                            <span className="select-none">{p.avatar}</span>
                          </div>
                          <span className={`text-[10px] font-mono tracking-widest font-black px-2.5 py-1 rounded-md border ${getGroupBadgeStyles(p.group)}`}>
                            {p.id}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className={`text-lg font-black tracking-wide ${isDark ? 'text-white' : 'text-stone-850'}`}>
                              {p.name}
                            </h3>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              isDark ? 'bg-stone-950 text-stone-400' : 'bg-stone-100 text-stone-550'
                            }`}>
                              {getMbtiGroupLabel(p.group)}
                            </span>
                          </div>
                          <p className={`text-xs font-semibold tracking-wider ${isDark ? 'text-cyan-400' : 'text-[#b3a076]'}`}>
                            {p.title}
                          </p>
                        </div>

                        <p className={`text-xs mt-3.5 mb-5 leading-relaxed line-clamp-3 h-[54px] ${
                          isDark ? 'text-stone-400' : 'text-stone-600'
                        }`}>
                          {p.description}
                        </p>

                        <div className={`p-2.5 rounded-xl border text-[11px] leading-relaxed mb-4 flex flex-col space-y-1 ${
                          isDark ? 'bg-stone-950/50 border-stone-850/50 text-stone-400' : 'bg-stone-50 border-stone-100 text-stone-550'
                        }`}>
                          <div className="flex items-center space-x-1 text-[9px] font-extrabold text-cyan-500/85 uppercase">
                            <Sparkles className="w-3 h-3 shrink-0" />
                            <span>星向核心真理 / Celestial Core</span>
                          </div>
                          <span className="line-clamp-2">{p.celestialForce}</span>
                        </div>

                        {/* Key Traits badges */}
                        <div className="flex flex-wrap gap-1 mb-4 select-none">
                          {p.traits.map((trait, tIdx) => (
                            <span
                              key={tIdx}
                              className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${
                                isDark ? 'bg-stone-900/60 border-stone-800 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-600'
                              }`}
                            >
                              #{trait}
                            </span>
                          ))}
                        </div>

                        {/* Footer action */}
                        <div className={`pt-3 border-t flex items-center justify-between text-[11px] font-black transition-all duration-300 ${
                          isDark ? 'border-stone-850 text-cyan-400/85 group-hover:text-cyan-300' : 'border-stone-100 text-[#a39474] group-hover:text-stone-905'
                        }`}>
                          <span className="tracking-wide text-neutral-500 dark:text-neutral-400 font-medium">16型原生人格</span>
                          <div className="flex items-center space-x-1">
                            <span>核对智识细节</span>
                            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section 2: Resonant Characters */}
            {filteredCharacters.length > 0 && (
              <div className="space-y-6 pt-6">
                <div className="flex items-center space-x-3 pb-3 border-b border-stone-850/10 dark:border-stone-800/40">
                  <div className={`w-2.5 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-rose-450`} />
                  <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    特定谱系共振人物 / Resonant Characters Group
                  </h2>
                  <span className={`text-xs ml-2 px-2 py-0.5 rounded-full font-bold ${
                    isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-stone-100 text-stone-605'
                  }`}>
                    {filteredCharacters.length} 位角色
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredCharacters.slice(0, visibleCount).map((char, index) => (
                    <motion.div
                      key={char.id}
                      id={`char-card-${char.id}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.3 }}
                      onClick={() => setActiveDetailChar(char)}
                      className={`group relative p-4 rounded-3xl border overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1.5 ${
                        isDark
                          ? 'bg-stone-900/40 border-stone-800/80 hover:border-cyan-400/40 hover:bg-stone-950/60 hover:shadow-[0_12px_28px_rgba(0,242,255,0.05)]'
                          : 'bg-white border-[#ebdcc9]/90 hover:border-[#b3a076] hover:bg-[#fffdfa] hover:shadow-[0_10px_22px_rgba(104,94,49,0.04)]'
                      }`}
                    >
                      {/* Decorative glowing gradient top line representing probability spectrum */}
                      <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 ${
                        getProbabilityColorClass(getCharProb(char.id, char.mbti))
                      }`} />

                      {/* Top large image/avatar wrapper occupying exactly 90% space */}
                      <div className={`w-[90%] mx-auto aspect-square rounded-2xl flex items-center justify-center bg-gradient-to-br ${isDark ? 'shadow-inner' : ''} transition-transform group-hover:scale-[1.03] duration-300 ${getAvatarBg(char.mbti)} overflow-hidden mb-4 mt-2`}>
                        {isImageUrl(char.avatar) && !imgErrors[char.id] ? (
                          <img 
                            src={char.avatar} 
                            alt={char.name} 
                            className="w-full h-full object-cover border-0 border-transparent outline-none shadow-none" 
                            referrerPolicy="no-referrer"
                            onError={() => setImgErrors(prev => ({ ...prev, [char.id]: true }))}
                          />
                        ) : (
                          <span className="referrer-policy select-none text-5xl sm:text-6xl">{char.avatar || char.name[0]}</span>
                        )}
                      </div>

                      {/* Character major info & MBTI Classification */}
                      <div className="space-y-1 px-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`text-lg font-black tracking-wide ${isDark ? 'text-white' : 'text-stone-850'}`}>
                            {char.name}
                          </h3>
                          <span className={`text-[10px] font-mono tracking-widest font-black px-2 py-0.5 rounded-md border ${getGroupBadgeStyles(getMbtiGroup(char.mbti))}`}>
                            {char.mbti}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <p className={`font-semibold tracking-wider ${
                            isDark ? 'text-cyan-400' : 'text-[#b3a076]'
                          }`}>
                            {char.title}
                          </p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            isDark ? 'bg-stone-950 text-stone-400' : 'bg-stone-100 text-stone-550'
                          }`}>
                            {char.group}
                          </span>
                        </div>
                      </div>

                      {/* Description clipping */}
                      <p className={`text-xs mt-3 mb-3 leading-relaxed line-clamp-3 h-[54px] px-1 ${
                        isDark ? 'text-stone-400' : 'text-stone-600'
                      }`}>
                        {char.description}
                      </p>

                      {/* Key Traits badges shown below */}
                      <div className="flex flex-wrap gap-1 px-1 mb-4 select-none">
                        {char.traits.map((trait, tIdx) => (
                          <span
                            key={tIdx}
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${
                              isDark ? 'bg-stone-900/60 border-stone-800 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-606 animate-fade'
                            }`}
                          >
                            #{trait}
                          </span>
                        ))}
                      </div>

                      {/* Interaction bar footer */}
                      <div className={`pt-3 border-t flex items-center justify-between text-[11px] font-black transition-all duration-300 ${
                        isDark ? 'border-stone-850 text-cyan-400/85 group-hover:text-cyan-300' : 'border-stone-100 text-[#a39474] group-hover:text-stone-905'
                      }`}>
                        <span className="tracking-wide flex items-center space-x-1">
                          <span>测评概率 {getCharProb(char.id, char.mbti)}%</span>
                        </span>
                        <div className="flex items-center space-x-1">
                          <span>核对智识细节</span>
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Simulated Dynamic Infinite Scroll Loading Spinner */}
            {filteredCharacters.length > 0 && (
              <div className="flex flex-col items-center justify-center pt-8 pb-12">
                {isLoadingMore ? (
                  <div className="space-y-3.5 text-center">
                    <div className="inline-block w-8 h-8 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin"></div>
                    <p className={`text-xs font-mono tracking-widest uppercase animate-pulse ${
                      isDark ? 'text-cyan-400/80' : 'text-[#b3a076]'
                    }`}>
                      🪐 正在同步深空角色波段 (Retrieving Celestial Signal)...
                    </p>
                  </div>
                ) : visibleCount < filteredCharacters.length ? (
                  <div className="space-y-2 text-center max-w-xs">
                    <p className="text-[10px] text-stone-500 font-mono">
                      已载入 {Math.min(visibleCount, filteredCharacters.length)} / 共 {filteredCharacters.length} 位共振角色
                    </p>
                    <button
                      onClick={triggerLoadMore}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black border transition-all hover:scale-105 active:scale-95 ${
                        isDark 
                          ? 'border-cyan-500/20 text-cyan-350 hover:bg-cyan-500/10' 
                          : 'border-[#cbbea9] text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      向下滚动或点击加载更多
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-center text-stone-500 pb-4">
                    
                    <p className="text-[11px] font-black uppercase tracking-widest">
                      星空尽头：所有宇宙频段角色均已对齐
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl border border-dashed border-[#ebdcc9] dark:border-stone-800 max-w-md mx-auto space-y-4">
            <span className="text-4xl text-stone-500 block animate-bounce">🛸</span>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-stone-800'}`}>没有找到共振星轨的人格角色</h3>
            <p className="text-xs text-stone-400">试试其他的玄学检索词，或者重置检索选项吧</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveGroup('All'); setActiveMbtiTag('All'); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                isDark ? 'border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10' : 'border-[#cbbea9] text-stone-700 hover:bg-stone-100'
              }`}
            >
              一键重置筛选
            </button>
          </div>
        )}
      </div>

      {/* 4. Highly Polished Detail Modal popup */}
      <AnimatePresence>
        {activeDetailChar && (
          <motion.div
            id="detail-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveDetailChar(null)}
          >
            <motion.div
              id="detail-modal-body"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className={`relative w-full max-w-4xl rounded-3xl overflow-hidden border shadow-2xl ${
                isDark
                  ? 'bg-gradient-to-br from-[#12132b] via-[#0d0e26] to-[#080917] border-cyan-500/30 text-white'
                  : 'bg-[#fcfaf7] border-[#e2d8c9] text-stone-800 shadow-[0_20px_50px_rgba(104,94,49,0.15)]'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Colored top header indicator matching the group */}
              <div className={`h-2.5 w-full bg-gradient-to-r ${
                getMbtiGroup(activeDetailChar.mbti) === 'Analysts' ? 'from-purple-500 to-indigo-500' :
                getMbtiGroup(activeDetailChar.mbti) === 'Diplomats' ? 'from-pink-500 to-rose-400' :
                getMbtiGroup(activeDetailChar.mbti) === 'Sentinels' ? 'from-blue-500 to-cyan-500' : 'from-amber-400 to-yellow-500'
              }`} />

              {/* Close Button */}
              <button
                id="close-modal-button"
                onClick={() => setActiveDetailChar(null)}
                className={`absolute right-4 top-6 p-2 rounded-xl border transition-all duration-300 ${
                  isDark
                    ? 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                    : 'bg-white border-stone-200 text-stone-400 hover:text-stone-900 shadow-sm'
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 md:p-10 space-y-8">
                {/* A. Profile Row */}
                <div className="grid grid-cols-1 md:grid-cols-10 gap-8 items-center pb-8 border-b border-stone-800/10 dark:border-stone-800/30">
                  {/* Left Column: Image (approx. 30% width) */}
                  <div className="md:col-span-3 flex justify-center">
                    <div className={`w-44 h-44 md:w-52 md:h-52 rounded-3xl flex items-center justify-center text-7xl bg-gradient-to-br ${isDark ? 'shadow-inner' : ''} ${getAvatarBg(activeDetailChar.mbti)} overflow-hidden`}>
                      {isImageUrl(activeDetailChar.avatar) && !imgErrors[activeDetailChar.id] ? (
                        <img 
                          src={activeDetailChar.avatar} 
                          alt={activeDetailChar.name} 
                          className="w-full h-full object-cover border-0 border-transparent outline-none shadow-none" 
                          referrerPolicy="no-referrer"
                          onError={() => setImgErrors(prev => ({ ...prev, [activeDetailChar.id]: true }))}
                        />
                      ) : (
                        <span className="select-none">{activeDetailChar.avatar || activeDetailChar.name[0]}</span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Info & Bio (approx. 70% width) */}
                  <div className="md:col-span-7 space-y-4 text-left">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-stone-900'}`}>
                          {activeDetailChar.name}
                        </h2>
                        <span className={`text-xs font-mono font-black border px-3 py-1 rounded-full ${getGroupBadgeStyles(getMbtiGroup(activeDetailChar.mbti))}`}>
                          {activeDetailChar.mbti}
                        </span>
                      </div>
                      <p className={`text-xs md:text-sm font-extrabold uppercase tracking-wider ${
                        isDark ? 'text-cyan-400' : 'text-[#b3a076]'
                      }`}>
                        {activeDetailChar.title} • {activeDetailChar.group}
                      </p>
                    </div>

                    <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                      {activeDetailChar.description}
                    </p>
                  </div>
                </div>

                {/* B. Core Grid layout for different sections */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                  {/* Left Column - 7/12 width for Stats & Partners */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Stats Dimensions Gauges */}
                    <div className="space-y-4">
                      <h4 className={`text-[11px] font-bold tracking-wider uppercase flex items-center space-x-1.5 ${
                        isDark ? 'text-stone-400' : 'text-[#a28653]'
                      }`}>
                        <Database className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-[#bda274]'}`} />
                        <span>星心八维能量极谱 / CELESTIAL SPECTRUM</span>
                      </h4>
                      
                      <div className={`space-y-3 p-5 rounded-3xl border ${
                        isDark 
                          ? 'bg-stone-950/20 border-stone-850/40' 
                          : 'bg-[#f9f5ee] border-[#ebdcc9]/80'
                      }`}>
                        {/* E vs I */}
                        <div className="space-y-1.5 text-xs">
                           <div className="flex justify-between font-mono">
                            <span className={activeDetailChar.stats.E >= activeDetailChar.stats.I ? (isDark ? 'font-bold text-cyan-400' : 'font-bold text-[#b4995e]') : (isDark ? 'text-stone-550' : 'text-[#a59984]')}>E 外倾 ({activeDetailChar.stats.E}%)</span>
                            <span className={activeDetailChar.stats.I >= activeDetailChar.stats.E ? (isDark ? 'font-bold text-indigo-400' : 'font-bold text-[#83709b]') : (isDark ? 'text-stone-550' : 'text-[#a59984]')}>内倾 I ({activeDetailChar.stats.I}%)</span>
                          </div>
                          <div className={`h-2 w-full rounded-full overflow-hidden flex ${isDark ? 'bg-stone-900' : 'bg-stone-200/60'}`}>
                            <div style={{ width: `${activeDetailChar.stats.E}%` }} className={`h-full ${isDark ? 'bg-cyan-400' : 'bg-[#bda574]'}`} />
                            <div style={{ width: `${activeDetailChar.stats.I}%` }} className={`h-full ${isDark ? 'bg-indigo-500' : 'bg-[#988aa8]'}`} />
                          </div>
                        </div>

                        {/* S vs N */}
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between font-mono">
                            <span className={activeDetailChar.stats.S >= activeDetailChar.stats.N ? (isDark ? 'font-bold text-cyan-400' : 'font-bold text-[#b4995e]') : (isDark ? 'text-stone-550' : 'text-[#a59984]')}>S 实感 ({activeDetailChar.stats.S}%)</span>
                            <span className={activeDetailChar.stats.N >= activeDetailChar.stats.S ? (isDark ? 'font-bold text-indigo-400' : 'font-bold text-[#83709b]') : (isDark ? 'text-stone-550' : 'text-[#a59984]')}>直觉 N ({activeDetailChar.stats.N}%)</span>
                          </div>
                          <div className={`h-2 w-full rounded-full overflow-hidden flex ${isDark ? 'bg-stone-900' : 'bg-stone-200/60'}`}>
                            <div style={{ width: `${activeDetailChar.stats.S}%` }} className={`h-full ${isDark ? 'bg-cyan-400' : 'bg-[#bda574]'}`} />
                            <div style={{ width: `${activeDetailChar.stats.N}%` }} className={`h-full ${isDark ? 'bg-indigo-500' : 'bg-[#988aa8]'}`} />
                          </div>
                        </div>

                        {/* T vs F */}
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between font-mono">
                            <span className={activeDetailChar.stats.T >= activeDetailChar.stats.F ? (isDark ? 'font-bold text-cyan-400' : 'font-bold text-[#b4995e]') : (isDark ? 'text-stone-550' : 'text-[#a59984]')}>T 理智 ({activeDetailChar.stats.T}%)</span>
                            <span className={activeDetailChar.stats.F >= activeDetailChar.stats.T ? (isDark ? 'font-bold text-indigo-400' : 'font-bold text-[#83709b]') : (isDark ? 'text-stone-550' : 'text-[#a59984]')}>情感 F ({activeDetailChar.stats.F}%)</span>
                          </div>
                          <div className={`h-2 w-full rounded-full overflow-hidden flex ${isDark ? 'bg-stone-900' : 'bg-stone-200/60'}`}>
                            <div style={{ width: `${activeDetailChar.stats.T}%` }} className={`h-full ${isDark ? 'bg-cyan-400' : 'bg-[#bda574]'}`} />
                            <div style={{ width: `${activeDetailChar.stats.F}%` }} className={`h-full ${isDark ? 'bg-indigo-500' : 'bg-[#988aa8]'}`} />
                          </div>
                        </div>

                        {/* J vs P */}
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between font-mono">
                            <span className={activeDetailChar.stats.J >= activeDetailChar.stats.P ? (isDark ? 'font-bold text-cyan-400' : 'font-bold text-[#b4995e]') : (isDark ? 'text-stone-550' : 'text-[#a59984]')}>J 独立/判断 ({activeDetailChar.stats.J}%)</span>
                            <span className={activeDetailChar.stats.P >= activeDetailChar.stats.J ? (isDark ? 'font-bold text-indigo-400' : 'font-bold text-[#83709b]') : (isDark ? 'text-stone-550' : 'text-[#a59984]')}>知觉/弹性 P ({activeDetailChar.stats.P}%)</span>
                          </div>
                          <div className={`h-2 w-full rounded-full overflow-hidden flex ${isDark ? 'bg-stone-900' : 'bg-stone-200/60'}`}>
                            <div style={{ width: `${activeDetailChar.stats.J}%` }} className={`h-full ${isDark ? 'bg-cyan-400' : 'bg-[#bda574]'}`} />
                            <div style={{ width: `${activeDetailChar.stats.P}%` }} className={`h-full ${isDark ? 'bg-indigo-500' : 'bg-[#988aa8]'}`} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Perfect Partners list */}
                    {activeDetailChar.bestPartners && activeDetailChar.bestPartners.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-[11px] font-bold tracking-wider text-stone-500 dark:text-stone-400 uppercase flex items-center space-x-1.5">
                          <Orbit className="w-4 h-4 text-rose-500" />
                          <span>金兰共鸣契合搭档 / GOLDEN COMPATIBLE PARTNERS</span>
                        </h4>
                        <div className="flex flex-wrap gap-2 font-mono">
                          {activeDetailChar.bestPartners.map((partner) => (
                            <span
                              key={partner}
                              className={`text-xs px-3.5 py-1.5 rounded-full border font-bold transition-all ${
                                isDark 
                                  ? 'bg-[#111225]/45 border-pink-500/20 text-pink-300' 
                                  : 'bg-pink-50/50 border-pink-100 text-pink-805'
                              }`}
                            >
                              ღ {partner}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - 5/12 width for Milestones & Force/Flaw */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Celestial capacity descriptor */}
                    <div className="space-y-4">
                      <div className={`p-4 rounded-2xl border transition-all space-y-2 ${
                        isDark 
                          ? 'bg-stone-950/20 border-stone-850/40' 
                          : 'bg-[#faf6ee]/70 border-[#ebdcc9]/80'
                      }`}>
                        <h5 className={`text-[10px] font-black tracking-wider uppercase flex items-center space-x-1.5 ${
                          isDark ? 'text-cyan-400' : 'text-[#a28653]'
                        }`}>
                          <Flame className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-[#bda274]'}`} />
                          <span>CELESTIAL FORCE / 神格星心异能</span>
                        </h5>
                        <p className={`text-xs font-semibold leading-relaxed ${isDark ? 'text-cyan-350' : 'text-stone-700'}`}>
                          {activeDetailChar.celestialForce || '暂未显化'}
                        </p>
                      </div>

                      {/* Harmonious Flaw / Challenge */}
                      <div className={`p-4 rounded-2xl border transition-all space-y-2 ${
                        isDark 
                          ? 'bg-stone-950/20 border-stone-850/40' 
                          : 'bg-[#fdf9f9]/90 border-[#ebd9d9]'
                      }`}>
                        <h5 className={`text-[10px] font-black tracking-wider uppercase flex items-center space-x-1.5 ${
                          isDark ? 'text-rose-400' : 'text-[#b25757]'
                        }`}>
                          <Info className={`w-3.5 h-3.5 ${isDark ? 'text-rose-400' : 'text-[#c66868]'}`} />
                          <span style={isDark ? { color: '#ffa1ad' } : undefined}>SACRED FLAW / 谐律人格弱点考验</span>
                        </h5>
                        <p className={`text-xs font-semibold leading-relaxed ${isDark ? 'text-white' : 'text-stone-700'}`}>
                          {activeDetailChar.weakness || '无懈可击'}
                        </p>
                      </div>
                    </div>

                    {/* Milestones timeline */}
                    {activeDetailChar.milestones && activeDetailChar.milestones.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-[11px] font-bold tracking-wider text-stone-500 dark:text-stone-400 uppercase flex items-center space-x-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span>谐律成长里程碑 / GROWTH MILESTONES</span>
                        </h4>
                        <div className="flex flex-col space-y-2.5">
                          {activeDetailChar.milestones.map((milestone, mIdx) => (
                            <div key={mIdx} className="flex items-start space-x-2.5 text-xs">
                              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                                {mIdx + 1}
                              </span>
                              <span className={isDark ? 'text-stone-300' : 'text-stone-750'}>{milestone}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
