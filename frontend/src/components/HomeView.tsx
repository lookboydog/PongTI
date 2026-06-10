/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Compass, Heart, Landmark, Flame, Shield, HelpCircle, GraduationCap, Zap, Stars ,TrendingUp} from 'lucide-react';
import { ThemeMode, ViewType } from '../types';
import { PERSONALITIES } from '../data/personalities';

interface HomeViewProps {
  theme: ThemeMode;
  setActiveView: (view: ViewType) => void;
  setSelectedMbti: (id: string | null) => void;
}

export default function HomeView({ theme, setActiveView, setSelectedMbti }: HomeViewProps) {
  const isDark = theme === 'dark';

  const pillars = [
    {
      title: "共情沉浸 (Immersive Empathy)",
      desc: "超越冰冷的字母符号，以神圣的友谊魔法和星轨之能呼应你最真实的潜隐内心。",
      icon: Heart,
      color: "from-pink-500/20 to-rose-500/10",
      iconColor: "text-rose-400"
    },
    {
      title: "成长灵感 (Growth & Inspiration)",
      desc: "剖析自我局限后的成长阶梯，配合皇家演化里程碑，赋予追求卓越的高维演化原力。",
      icon: GraduationCap,
      color: "from-amber-500/20 to-yellow-500/10",
      iconColor: "text-amber-400"
    },
    {
      title: "社交契合 (Connection Dynamics)",
      desc: "精准厘定 16 种宏观轨道的磁场交互，勾勒出跨越星宿的永恒友谊与完美伴侣拼图。",
      icon: Stars,
      color: "from-cyan-500/20 to-blue-500/10",
      iconColor: "text-cyan-400"
    },
    {
      title: "澄澈视野 (Insight Clarity)",
      desc: "提纯纷繁错综的气质迷雾，帮助行者在现实星轨的抉择关隘建立定力与澄澈之眼。",
      icon: Zap,
      color: "from-purple-500/20 to-indigo-500/10",
      iconColor: "text-purple-400"
    }
  ];

  const [visibleCount, setVisibleCount] = React.useState<number>(() => {
    try {
      const saved = localStorage.getItem('star_eight_mbti_visible_count');
      return saved ? parseInt(saved, 10) : 4;
    } catch {
      return 4;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('star_eight_mbti_visible_count', visibleCount.toString());
    } catch (e) {
      console.warn('Failed to save visibleCount to localStorage', e);
    }
  }, [visibleCount]);

  const getGroupConfig = (group: string) => {
    switch (group) {
      case 'Analysts':
        return {
          badgeColor: isDark 
            ? 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20 ' 
            : 'border-[#abdefa] text-[#2c7ea1] bg-cyan-950/20 ',
          hoverText: isDark ? 'group-hover:text-cyan-400' : 'group-hover:text-[#2c7ea1]',
          topBarGradient: isDark ? 'from-cyan-500 to-blue-500' : 'from-[#2c7ea1] to-[#7acbf5]',
          exploreText: isDark ? 'text-cyan-400 group-hover:text-cyan-300' : 'text-[#2c7ea1] group-hover:text-[#195773]'
        };
      case 'Diplomats':
        return {
          badgeColor: isDark 
            ? 'border-pink-500/30 text-pink-400 bg-pink-950/20 ' 
            : 'border-[#fad3e9] text-[#b03a7d] bg-pink-950/20 ',
          hoverText: isDark ? 'group-hover:text-pink-400' : 'group-hover:text-[#b03a7d]',
          topBarGradient: isDark ? 'from-pink-500 to-rose-500' : 'from-[#b03a7d] to-[#fad3e9]',
          exploreText: isDark ? 'text-pink-400 group-hover:text-pink-300' : 'text-[#b03a7d] group-hover:text-[#822157]'
        };
      case 'Sentinels':
        return {
          badgeColor: isDark 
            ? 'border-amber-500/30 text-amber-400 bg-amber-950/20 ' 
            : 'border-[#ebdcc9] text-[#a0713b] bg-amber-950/20 ',
          hoverText: isDark ? 'group-hover:text-amber-500' : 'group-hover:text-[#a0713b]',
          topBarGradient: isDark ? 'from-amber-500 to-orange-500' : 'from-[#a0713b] to-[#ebdcc9]',
          exploreText: isDark ? 'text-amber-500 group-hover:text-amber-400' : 'text-stone-700 group-hover:text-[#a0713b]'
        };
      case 'Explorers':
      default:
        return {
          badgeColor: isDark 
            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20 ' 
            : 'border-[#c6ecd3] text-[#2d8d52] bg-emerald-950/20 ',
          hoverText: isDark ? 'group-hover:text-emerald-400' : 'group-hover:text-[#2d8d52]',
          topBarGradient: isDark ? 'from-emerald-500 to-teal-500' : 'from-[#2d8d52] to-[#c6ecd3]',
          exploreText: isDark ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-[#2d8d52] group-hover:text-[#1c5f35]'
        };
    }
  };

  const [testimonies] = React.useState<any[]>(() => {
    let allComments: any[] = [];
    try {
      const saved = localStorage.getItem('inner_spectrum_comments');
      if (saved) {
        allComments = JSON.parse(saved);
      }
    } catch {
      allComments = [];
    }
    
    if (!allComments || allComments.length === 0) {
      allComments = [
        {
          id: "comment-5",
          author: "至爱极光",
          avatarSeed: "aurora",
          content: "竞选者 (ENFP) 哈哈！果然本心就是自带一万个鬼点子的快乐大魔王！这个界面在深色模式下太酷炫了，亮色模式下又雅致得不行。两个主题的设计质感真的是无能出其右，不虚此测！",
          timestamp: "2026-06-03 10:05",
          likes: 56,
          stars: 5,
          mbtiTag: "ENFP"
        },
        {
          id: "comment-1",
          author: "星海观测者_伽利略",
          avatarSeed: "galileo",
          content: "在这里测出的是 INTJ 皇家建筑师。分析结果中对于‘过度苛求、容易疏离他人情感维度’的暗影描述真的非常准确。在进行学术攻关时，我确实常常忽视了身边助手和家属的真切关怀。这一份星谱，是一面照亮我内在黑暗的镜子。",
          timestamp: "2026-06-03 14:15",
          likes: 42,
          stars: 5,
          mbtiTag: "INTJ"
        }
      ];
    }
    
    return [...allComments]
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 2)
      .map(c => ({
        author: c.author,
        mbti: c.mbtiTag || '未知型格',
        comment: c.content,
        stars: Math.min(5, Math.max(1, c.stars || 5)),
        likes: c.likes || 0
      }));
  });

  const handleFeaturedClick = (id: string) => {
    setSelectedMbti(id);
    setActiveView('types');
  };

  return (
    <div id="home-view" className="space-y-24 py-10">
      {/* 1. Hero Showcase Section */}
      <section id="hero-section" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative rounded-3xl overflow-hidden border p-8 md:p-16 transition-all duration-300 ${
          isDark
            ? 'bg-gradient-to-br from-[#111225] via-[#0d0e26] to-[#070817] border-cyan-500/20 shadow-[inset_0_1px_3px_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.5)]'
            : 'bg-white/10 border-[#e2d8c9]  shadow-[0_10px_35px_rgba(104,94,49,0.04)]'
        }`}>
          {/* Decorative floating grids */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          {isDark && (
            <div className="absolute top-10 right-20 w-72 h-72 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
          )}

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide ${
                isDark ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : 'bg-black/5 text-stone-700 border border-stone-200 '
              }`}>
                <TrendingUp className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className={isDark ? "text-cyan-300" : "text-stone-700"}>
                  开启灵性人格的心智迁跃
                </span>
              </div>

              <h1 className={`text-4xl md:text-6xl font-extrabold tracking-tight font-sans leading-tight ${
                isDark 
                  ? 'bg-gradient-to-br from-white via-stone-100 to-cyan-300 bg-clip-text text-transparent' 
                  : 'text-stone-900'
              }`}>
                探索真实的自我<br />
                <span className={isDark ? 'text-cyan-400' : 'text-[#b3a076]'}> PonyTI</span>
              </h1>

              <p className={`text-lg md:text-xl max-w-xl font-medium leading-relaxed ${
                isDark ? 'text-stone-300' : 'text-[#645c52]'
              }`}>
                这是一场穿越深夜星轨的自我发现之旅。深入探讨您性格中隐藏的宇宙光谱，揭示深邃的自察密码、人际谐振与个人不朽的进化里程碑。
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  id="hero-start-test"
                  onClick={() => setActiveView('test')}
                  className={`px-8 py-4 rounded-xl text-md font-bold tracking-wider flex items-center justify-center space-x-3 transition-all duration-300 ${
                    isDark
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_4px_25px_rgba(6,182,212,0.45)] hover:shadow-[0_4px_30px_rgba(6,182,212,0.6)] transform hover:-translate-y-0.5'
                      : 'bg-stone-800 hover:bg-stone-900 text-stone-50 shadow-[0_6px_20px_rgba(28,25,23,0.15)] hover:shadow-[0_8px_25px_rgba(28,25,23,0.25)] transform hover:-translate-y-0.5'
                  }`}
                >
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span>立即开启测评</span>
                </button>
                <button
                  id="hero-view-types"
                  onClick={() => setActiveView('types')}
                  className={`px-8 py-4 rounded-xl text-md font-bold tracking-wider flex items-center justify-center space-x-2 transition-all duration-300 border ${
                    isDark
                      ? 'bg-white/5 border-white/10 hover:bg-white/10 text-stone-200'
                      : 'bg-black/5 border-[#cbbea9] hover:bg-black/10 text-stone-700 '
                  }`}
                >
                  <span>探索所有类型</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right decorative visual card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[360px] aspect-square rounded-3xl p-6 flex flex-col justify-between overflow-hidden border [perspective:800px]">
                {/* Visual Glassmorphism elements */}
                <div className={`absolute inset-0 transition-colors duration-300 ${
                  isDark 
                    ? 'bg-gradient-to-tr from-cyan-500/20 via-indigo-500/10 to-transparent border-cyan-500/30' 
                    : 'bg-gradient-to-tr from-[#eadbc8]/40 via-[#eae1d4]/30 to-transparent border-[#cbbea9]/50 '
                } border rounded-3xl -md`} />
                
                {/* Floating cosmic clock */}
                <div className="relative z-10 w-full h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className={`text-xs font-mono tracking-widest ${isDark ? 'text-cyan-400' : 'text-[#a39474]'}`}>ACTIVE SPECULUM</p>
                      <h4 className={`text-md font-bold ${isDark ? 'text-white' : 'text-stone-800'}`}>和弦星野轨道</h4>
                    </div>
                    
                  </div>

                  <div className="my-auto flex flex-col items-center justify-center space-y-4 py-8">
                    <div className={`relative w-28 h-28 rounded-full flex items-center justify-center animate-spin-slow ${
                      isDark ? 'bg-cyan-500/10 border border-cyan-400/40 shadow-[0_0_20px_rgba(0,242,255,0.15)]' : 'bg-[#eedbc5]/50 border border-[#cbbea9]/60 '
                    }`}>
                      <div className={`w-20 h-20 rounded-full border border-dashed flex items-center justify-center ${
                        isDark ? 'border-cyan-300/30' : 'border-[#b3a076]/40'
                      }`}>
                        <Sparkles className={`w-8 h-8 ${isDark ? 'text-cyan-400' : 'text-[#b3a076]'}`} />
                      </div>
                    </div>
                    <span className={`text-xs font-mono transition-colors ${isDark ? 'text-stone-400' : 'text-[#645c52]'}`}>
                      CHORDAL HARMONY STATUS
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono tracking-wider">
                    <span className={isDark ? 'text-stone-500' : 'text-stone-400'}>LAT: 45.19 UTC</span>
                    <span className={isDark ? 'text-cyan-400' : 'text-[#b3a076]'}>CALM ORBIT LIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. What is MBTI? Section */}
      <section id="what-is-mbti-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-stone-900'
          }`}>
            什么是 PonyTI 谱系测评?
          </h2>
          <p className={`text-lg leading-relaxed ${
            isDark ? 'text-stone-300' : 'text-[#645c52]'
          }`}>
            基于荣格心理学（MBTI 核心维度的延伸），融合象征主义，将晦涩的心理学符号解构为更亲民、更富启发性的生命哲学向导。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:transform hover:-translate-y-1 ${
                  isDark
                    ? 'bg-[#111225]/40 border-cyan-500/10 hover:border-cyan-500/30 hover:bg-[#111225]/60 hover:shadow-[0_10px_30px_rgba(0,242,255,0.05)]'
                    : 'bg-black/5 border-[#e2d8c9] hover:bg-black/10 hover:shadow-[0_10px_25px_rgba(104,94,49,0.05)] '
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br ${pillar.color}`}>
                  <Icon className={`w-6 h-6 ${pillar.iconColor}`} />
                </div>
                <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-stone-800'}`}>
                  {pillar.title}
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-400' : 'text-[#645c52]'}`}>
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Featured 16 Personalities Section */}
      <section id="featured-personalities-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-xl space-y-4">
            <h2 className={`text-3xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-stone-900'
            }`}>
              16 型星辉型格解析
            </h2>
            <p className={`text-lg ${isDark ? 'text-stone-400' : 'text-[#645c52]'}`}>
              四大精神星族（学者、外交官、卫士、开拓者）的顶峰代表，看是否有你的灵魂缩影：
            </p>
          </div>
          <button
            onClick={() => setActiveView('types')}
            className={`px-6 py-3 rounded-xl font-bold tracking-wide flex items-center space-x-2 transition-all duration-300 border self-start ${
              isDark
                ? 'bg-transparent border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400'
                : 'bg-black/5 border-[#cbbea9] text-stone-700 hover:bg-black/10 hover:text-stone-900 '
            }`}
          >
            <span>探索所有 16 种型格</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PERSONALITIES.slice(0, visibleCount).map((item) => {
            const config = getGroupConfig(item.group);
            const chineseName = item.title.split(' (')[0];
            return (
              <div
                key={item.id}
                onClick={() => handleFeaturedClick(item.id)}
                className={`group relative p-6 rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 ${
                  isDark
                    ? 'bg-stone-900/40 border-stone-800 hover:border-cyan-400/50 hover:bg-stone-950/80 shadow-md shadow-black/20'
                    : 'bg-black/5 border-[#e6decf] hover:border-[#b3a076] hover:bg-black/10 shadow-sm '
                }`}
              >
                {/* Card visual glowing border accent on hover */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${
                  config.topBarGradient
                }`} />

                <div className="flex justify-between items-start mb-6">
                  <span className="text-4xl">{item.avatar}</span>
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${config.badgeColor}`}>
                    {item.id}
                  </span>
                </div>

                <h3 className={`text-lg font-bold mb-1 transition-colors duration-300 ${isDark ? 'text-white' : 'text-stone-800'} ${config.hoverText}`}>
                  {chineseName}
                </h3>
                <p className={`text-xs font-mono font-medium mb-3 tracking-widest ${
                  isDark ? 'text-stone-400' : 'text-[#a39474]'
                }`}>
                  THE {item.englishName.toUpperCase()}
                </p>
                
                <p className={`text-sm leading-relaxed mb-6 ${
                  isDark ? 'text-stone-400' : 'text-[#645c52]'
                }`}>
                  {item.description}
                </p>

                <div className={`flex items-center space-x-1.5 text-xs font-bold transition-all duration-300 ${
                  config.exploreText
                }`}>
                  <span>深入谱系原力</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {visibleCount < 16 && (
          <div className="flex justify-center pt-6">
            <button
              onClick={() => setVisibleCount(prev => Math.min(prev + 4, 16))}
              className={`px-8 py-3.5 rounded-xl text-sm font-bold tracking-wider transition-all duration-300 border flex items-center space-x-2 ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/20 hover:border-cyan-400 shadow-[0_4px_15px_rgba(6,182,212,0.15)] shadow-cyan-500/5'
                  : 'bg-black/5 border-[#cbbea9] text-stone-700 hover:bg-black/10 hover:text-stone-900 '
              } transform hover:-translate-y-0.5 active:translate-y-0`}
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>加载更多型格 ({visibleCount} / 16)</span>
            </button>
          </div>
        )}
      </section>

      {/* 4. Join The Discovery / CTA Banner Section */}
      <section id="cta-banner-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative rounded-3xl overflow-hidden p-8 md:p-14 border text-center ${
          isDark
            ? 'bg-gradient-to-r from-indigo-950 via-[#111225] to-blue-950 border-cyan-500/20 shadow-xl'
            : 'bg-black/5 border-[#cbbea9] shadow-md '
        }`}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,242,255,0.06),transparent_60%)] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className={`text-3xl md:text-5xl font-extrabold tracking-tight font-sans ${
              isDark ? 'text-white' : 'text-stone-800'
            }`}>
              立即开启你的发现之旅
            </h2>
            <p className={`text-base md:text-lg leading-relaxed ${
              isDark ? 'text-stone-300' : 'text-[#645c52] font-medium'
            }`}>
              全套测试仅需 8 到 12 分钟，我们不给您评判好坏，仅仅展开您心智光谱的多维和弦图卷。
            </p>
            <div className="pt-4">
              <button
                id="cta-start-test"
                onClick={() => setActiveView('test')}
                className={`mx-auto px-8 py-4 rounded-xl text-md font-bold tracking-wider flex items-center justify-center space-x-2 transition-all duration-300 transform hover:-translate-y-0.5 shadow-xl ${
                  isDark
                    ? 'bg-white hover:bg-stone-100 text-stone-950 shadow-white/5 hover:shadow-cyan-400/20'
                    : 'bg-stone-800 hover:bg-stone-900 text-stone-50 hover:shadow-stone-900/20'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span>立即开启测试</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Celestial Travellers Testimonials */}
      <section id="testimonials-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-stone-900'
          }`}>
            星迹见证
          </h2>
          <p className={`text-sm ${isDark ? 'text-stone-400' : 'text-[#645c52]'}`}>
            来自已经找寻到自我拼图、记录于“留白留言”板上的真实反馈：
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonies.map((item, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl border flex flex-col justify-between ${
                isDark
                  ? 'bg-[#111225]/45 border-cyan-500/10'
                  : 'bg-black/5 border-[#e2d8c9] shadow-[0_4px_15px_rgba(104,94,49,0.02)] '
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-md font-semibold ${
                      isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-black/10 text-[#b3a076] '
                    }`}>
                      {item.author[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-stone-800'}`}>
                        {item.author}
                      </h4>
                      <p className="text-xs text-stone-400">心智星位：{item.mbti}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(item.stars)].map((_, index) => (
                      <Stars key={index} className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                </div>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-[#645c52]'}`}>
                  “{item.comment}”
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs font-mono">
                <span className="text-stone-400">来自 留白留言 板首发</span>
                <span className={`px-2.5 py-1 rounded-full ${
                  isDark ? 'bg-cyan-500/10 text-cyan-300' : 'bg-black/10 text-stone-700 '
                }`}>
                  ♡ {item.likes} 人赞同了该共鸣
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => setActiveView('comments')}
            className={`px-6 py-3 rounded-lg font-bold tracking-wide transition-all duration-300 ${
              isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-[#9a8d76] hover:text-stone-800'
            }`}
          >
            <span>进入“留白留言”查看与撰写更多感受</span>
          </button>
        </div>
      </section>
    </div>
  );
}