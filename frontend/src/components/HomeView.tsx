/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, ArrowRight, Heart, GraduationCap, Zap, Stars, TrendingUp, Users, Activity } from 'lucide-react';
import { ThemeMode, ViewType, Comment } from '../types';
import { PERSONALITIES } from '../data/personalities';
import { apiGet, apiPost, isApiEnabled } from '../api/client';

interface VisitStats {
  totalVisits: number;
  todayVisits: number;
}

const FALLBACK_VISIT_STATS: VisitStats = {
  totalVisits: 1280,
  todayVisits: 36,
};

function formatVisitCount(value: number): string {
  return value.toLocaleString('zh-CN');
}

interface HomeTestimony {
  id: string;
  author: string;
  mbti: string;
  comment: string;
  stars: number;
  likes: number;
}

const FALLBACK_TESTIMONY_COMMENTS: Comment[] = [
  {
    id: "comment-5",
    author: "至爱极光",
    avatarSeed: "aurora",
    content:
      "竞选者 (ENFP) 哈哈！果然本心就是自带一万个鬼点子的快乐大魔王！这个界面在深色模式下太酷炫了，亮色模式下又雅致得不行。两个主题的设计质感真的是无能出其右，不虚此测！",
    timestamp: "2026-06-03 10:05",
    likes: 56,
    stars: 5,
    mbtiTag: "ENFP",
  },
  {
    id: "comment-1",
    author: "星海观测者_伽利略",
    avatarSeed: "galileo",
    content:
      "在这里测出的是 INTJ 皇家建筑师。分析结果中对于‘过度苛求、容易疏离他人情感维度’的暗影描述真的非常准确。在进行学术攻关时，我确实常常忽视了身边助手和家属的真切关怀。这一份星谱，是一面照亮我内在黑暗的镜子。",
    timestamp: "2026-06-03 14:15",
    likes: 42,
    stars: 5,
    mbtiTag: "INTJ",
  },
];

function stripCommentsForCache(comments: Comment[]) {
  return comments.map(({ hasLiked, hasStarred, replies, ...rest }) => ({
    ...rest,
    replies: replies?.map(({ hasLiked: replyLiked, ...replyRest }) => replyRest),
  }));
}

function mapCommentsToTestimonies(comments: Comment[]): HomeTestimony[] {
  return [...comments]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 2)
    .map((c) => ({
      id: c.id,
      author: c.author,
      mbti: c.mbtiTag || "未知型格",
      comment: c.content,
      stars: Math.min(5, Math.max(1, c.stars || 5)),
      likes: c.likes || 0,
    }));
}

function loadLocalComments(): Comment[] {
  try {
    const saved = localStorage.getItem("inner_spectrum_comments");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return FALLBACK_TESTIMONY_COMMENTS;
}

interface HomeViewProps {
  theme: ThemeMode;
  setActiveView: (view: ViewType) => void;
  setSelectedMbti: (id: string | null) => void;
}

export default function HomeView({ theme, setActiveView, setSelectedMbti }: HomeViewProps) {
  const isDark = theme === 'dark';

  const pillars = [
    {
      title: "共情沉浸 / EMPATHY",
      desc: "帮助理解自我与他人的情感模式，在真实互动中增强共情与觉察。",
      icon: Heart,
      color: "from-pink-500/20 to-rose-500/10",
      iconColor: "text-rose-400",
    },
    {
      title: "成长灵感 / GROWTH & INSPIRATION",
      desc: "超越四个字母的简单标签，揭示认知偏好背后的发展路径，激发潜能与成长。",
      icon: GraduationCap,
      color: "from-amber-500/20 to-yellow-500/10",
      iconColor: "text-amber-400",
    },
    {
      title: "社交契合 / CONNECTION DYNAMICS",
      desc: "解析性格倾向在人际关系中的表现，勾勒出更契合的互动模式与社交网络。",
      icon: Stars,
      color: "from-cyan-500/20 to-blue-500/10",
      iconColor: "text-cyan-400",
    },
    {
      title: "澄澈视野 / INSIGHT & CLARITY",
      desc: "厘清 16 种人格类型的内在逻辑，提供清晰的自我认知框架与行动参考。",
      icon: Zap,
      color: "from-purple-500/20 to-indigo-500/10",
      iconColor: "text-purple-400",
    },
  ];

  const [visitStats, setVisitStats] = React.useState<VisitStats>(FALLBACK_VISIT_STATS);
  const [visitStatsLoading, setVisitStatsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchVisitStats = async () => {
      if (!isApiEnabled()) {
        setVisitStatsLoading(false);
        return;
      }

      try {
        const res = await apiPost('/api/v1/stats/visits');
        if (res.ok) {
          const data = (await res.json()) as VisitStats;
          setVisitStats({
            totalVisits: data.totalVisits ?? 0,
            todayVisits: data.todayVisits ?? 0,
          });
        } else {
          const fallbackRes = await apiGet('/api/v1/stats/visits');
          if (fallbackRes.ok) {
            const data = (await fallbackRes.json()) as VisitStats;
            setVisitStats({
              totalVisits: data.totalVisits ?? 0,
              todayVisits: data.todayVisits ?? 0,
            });
          }
        }
      } catch (err) {
        console.warn('访问量统计暂不可用，使用本地占位数据。', err);
      } finally {
        setVisitStatsLoading(false);
      }
    };

    fetchVisitStats();
  }, []);

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

  const [testimonies, setTestimonies] = React.useState<HomeTestimony[]>([]);
  const [testimoniesLoading, setTestimoniesLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTestimonies = async () => {
      if (isApiEnabled()) {
        try {
          const res = await apiGet("/api/v1/comments");
          if (res.ok) {
            const cloudComments = (await res.json()) as Comment[];
            if (Array.isArray(cloudComments)) {
              setTestimonies(mapCommentsToTestimonies(cloudComments));
              localStorage.setItem(
                "inner_spectrum_comments",
                JSON.stringify(stripCommentsForCache(cloudComments)),
              );
              return;
            }
          }
          console.warn("首页留言墙：后端返回异常，降级到本地数据。", res.status);
        } catch (err) {
          console.warn("首页留言墙：请求失败，降级到本地数据。", err);
        }
      } else {
        console.info("VITE_API_URL 未配置，首页留言墙使用本地数据。");
      }

      setTestimonies(mapCommentsToTestimonies(loadLocalComments()));
    };

    fetchTestimonies().finally(() => setTestimoniesLoading(false));
  }, []);

  const handleFeaturedClick = (id: string) => {
    setSelectedMbti(id);
    setActiveView('types');
  };

  return (
    <div id="home-view" className="space-y-24 py-10">
      {/* 1. Hero Showcase Section */}
      <section
        id="hero-section"
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div
          className={`relative rounded-3xl overflow-hidden border p-8 md:p-16 transition-all duration-300 ${
            isDark
              ? "bg-gradient-to-br from-[#111225] via-[#0d0e26] to-[#070817] border-cyan-500/20 shadow-[inset_0_1px_3px_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.5)]"
              : "bg-white/80 border-[#e2d8c9]  shadow-[0_10px_35px_rgba(104,94,49,0.04)]"
          }`}
        >
          {/* Decorative floating grids */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          {isDark && (
            <div className="absolute top-10 right-20 w-72 h-72 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
          )}

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div
                className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide ${
                  isDark
                    ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                    : "bg-white/80 text-stone-700 border border-stone-200 "
                }`}
              >
                <TrendingUp className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className={isDark ? "text-cyan-300" : "text-stone-700"}>
                  开启小马MBTI的测试
                </span>
              </div>

              <h1
                className={`text-4xl md:text-6xl font-extrabold tracking-tight font-sans leading-tight ${
                  isDark
                    ? "bg-gradient-to-br from-white via-stone-100 to-cyan-300 bg-clip-text text-transparent"
                    : "text-stone-900"
                }`}
              >
                探索真实的自我
                <br />
                <span className={isDark ? "text-cyan-400" : "text-[#b3a076]"}>
                  {" "}
                  PonyTI
                </span>
              </h1>

              <p
                className={`text-lg md:text-xl max-w-xl font-medium leading-relaxed ${
                  isDark ? "text-stone-300" : "text-[#645c52]"
                }`}
              >
                这是一场穿越深夜星轨的自我发现之旅。深入探讨您性格中隐藏的宇宙光谱，揭示深邃的自察密码、人际谐振与个人不朽的进化里程碑。
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  id="hero-start-test"
                  onClick={() => setActiveView("test")}
                  className={`px-8 py-4 rounded-xl text-md font-bold tracking-wider flex items-center justify-center space-x-3 transition-all duration-300 ${
                    isDark
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_4px_25px_rgba(6,182,212,0.45)] hover:shadow-[0_4px_30px_rgba(6,182,212,0.6)] transform hover:-translate-y-0.5"
                      : "bg-stone-800 hover:bg-stone-900 text-stone-50 shadow-[0_6px_20px_rgba(28,25,23,0.15)] hover:shadow-[0_8px_25px_rgba(28,25,23,0.25)] transform hover:-translate-y-0.5"
                  }`}
                >
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span>立即开启测评</span>
                </button>
                <button
                  id="hero-view-types"
                  onClick={() => setActiveView("types")}
                  className={`px-8 py-4 rounded-xl text-md font-bold tracking-wider flex items-center justify-center space-x-2 transition-all duration-300 border ${
                    isDark
                      ? "bg-white/80 border-white/10 hover:bg-white40/ text-stone-200"
                      : "bg-white/80 border-[#cbbea9] hover:bg-white/100 text-stone-700 "
                  }`}
                >
                  <span>探索所有类型</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right decorative visual card */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <div className="relative w-full max-w-[360px] rounded-3xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
                {/* Visual Glassmorphism elements */}
                <div
                  className={`absolute inset-0 transition-colors duration-300 rounded-3xl pointer-events-none ${
                    isDark
                      ? " border border-cyan-500/30"
                      : " border border-[#cbbea9]/50"
                  }`}
                />

                <div className="relative z-10 w-full flex flex-col gap-3 sm:gap-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1 min-w-0">
                      <p
                        className={`text-[10px] sm:text-xs font-mono tracking-widest uppercase ${
                          isDark ? "text-cyan-400" : "text-[#a39474]"
                        }`}
                      >
                        SITE TRAFFIC
                      </p>
                      <h4
                        className={`text-sm sm:text-md font-bold truncate ${
                          isDark ? "text-white" : "text-stone-800"
                        }`}
                      >
                        网站访问量
                      </h4>
                    </div>
                    <div
                      className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-mono font-bold border ${
                        isDark
                          ? "bg-cyan-500/10 border-cyan-500/25 text-cyan-300"
                          : "bg-[#f5efe6] border-[#cbbea9]/70 text-[#7c6c4f]"
                      }`}
                    >
                      LIVE
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-4 w-full">
                    <div
                      className={`rounded-2xl border p-3 sm:p-5 flex flex-col justify-between min-h-[92px] sm:min-h-[108px] transition-colors duration-300 ${
                        isDark
                          ? "bg-stone-950/45 border-cyan-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                          : "bg-white/80 border-[#cbbea9]/60 shadow-[0_8px_20px_rgba(104,94,49,0.05)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <span
                          className={`text-[10px] sm:text-xs font-bold tracking-wide leading-tight ${
                            isDark ? "text-stone-300" : "text-[#645c52]"
                          }`}
                        >
                          总访问量
                        </span>
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isDark
                              ? "bg-cyan-500/10 border border-cyan-500/20"
                              : "bg-[#f3ebe0] border border-[#e2d8c9]"
                          }`}
                        >
                          <Users
                            className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-[#b3a076]"}`}
                          />
                        </div>
                      </div>
                      <p
                        className={`text-xl sm:text-3xl font-extrabold font-mono tracking-tight leading-none ${
                          isDark
                            ? "bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent"
                            : "text-stone-900"
                        }`}
                      >
                        {visitStatsLoading
                          ? "—"
                          : formatVisitCount(visitStats.totalVisits)}
                      </p>
                      <span
                        className={`mt-1.5 sm:mt-2 text-[9px] sm:text-[10px] font-mono leading-tight ${
                          isDark ? "text-stone-500" : "text-[#a39474]"
                        }`}
                      >
                        累计足迹
                      </span>
                    </div>

                    <div
                      className={`rounded-2xl border p-3 sm:p-5 flex flex-col justify-between min-h-[92px] sm:min-h-[108px] transition-colors duration-300 ${
                        isDark
                          ? "bg-stone-950/45 border-cyan-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                          : "bg-white/80 border-[#cbbea9]/60 shadow-[0_8px_20px_rgba(104,94,49,0.05)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <span
                          className={`text-[10px] sm:text-xs font-bold tracking-wide leading-tight ${
                            isDark ? "text-stone-300" : "text-[#645c52]"
                          }`}
                        >
                          今日访问量
                        </span>
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isDark
                              ? "bg-cyan-500/10 border border-cyan-500/20"
                              : "bg-[#f3ebe0] border border-[#e2d8c9]"
                          }`}
                        >
                          <Activity
                            className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-[#b3a076]"}`}
                          />
                        </div>
                      </div>

                      <p
                        className={`text-xl sm:text-3xl font-extrabold font-mono tracking-tight leading-none ${
                          isDark ? "text-cyan-400" : "text-[#b3a076]"
                        }`}
                      >
                        {visitStatsLoading
                          ? "—"
                          : formatVisitCount(visitStats.todayVisits)}
                      </p>
                      <span
                        className={`mt-1.5 sm:mt-2 text-[9px] sm:text-[10px] font-mono leading-tight ${
                          isDark ? "text-stone-500" : "text-[#a39474]"
                        }`}
                      >
                        当日新到访
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono tracking-wider gap-3">
                    <span
                      className={`truncate ${isDark ? "text-stone-500" : "text-stone-400"}`}
                    >
                      数据已同步
                    </span>
                    <span
                      className={`shrink-0 ${isDark ? "text-cyan-400" : "text-[#b3a076]"}`}
                    >
                      ORBIT METRICS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. What is MBTI? Section */}
      <section
        id="what-is-mbti-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16"
      >
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2
            className={`text-3xl md:text-4xl font-extrabold tracking-tight ${
              isDark ? "text-white" : "text-stone-900"
            }`}
          >
            什么是 PongTI？
          </h2>
          <p
            className={`text-lg leading-relaxed ${
              isDark ? "text-stone-300" : "text-[#645c52]"
            }`}
          >
            基于 MBTI
            核心维度的性格分析工具，将抽象的心理学概念转化为更易理解、更富启发性的自我认知向导。
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
                    ? "bg-[#111225]/40 border-cyan-500/10 hover:border-cyan-500/30 hover:bg-[#111225]/60 hover:shadow-[0_10px_30px_rgba(0,242,255,0.05)]"
                    : "bg-white/80 border-[#e2d8c9] hover:bg-white/100 hover:shadow-[0_10px_25px_rgba(104,94,49,0.05)] "
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br ${pillar.color}`}
                >
                  <Icon className={`w-6 h-6 ${pillar.iconColor}`} />
                </div>
                <h3
                  className={`text-lg font-bold mb-3 ${isDark ? "text-white" : "text-stone-800"}`}
                >
                  {pillar.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${isDark ? "text-stone-400" : "text-[#645c52]"}`}
                >
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Featured 16 Personalities Section */}
      <section
        id="featured-personalities-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-xl space-y-4">
            <h2
              className={`text-3xl font-extrabold tracking-tight ${
                isDark ? "text-white" : "text-stone-900"
              }`}
            >
              16 种人格类型
            </h2>
            <p
              className={`text-lg ${isDark ? "text-stone-400" : "text-[#645c52]"}`}
            >
              四大群组（NT、NF、SJ、SP）中 16
              种类型的认知功能与行为特征解析，对照自身偏好进行探索。
            </p>
          </div>
          <button
            onClick={() => setActiveView("types")}
            className={`px-6 py-3 rounded-xl font-bold tracking-wide flex items-center space-x-2 transition-all duration-300 border self-start ${
              isDark
                ? "bg-transparent border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
                : "bg-white/80 border-[#cbbea9] text-stone-700 hover:bg-white/100 hover:text-stone-900 "
            }`}
          >
            <span>查看全部 16 种类型 </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PERSONALITIES.slice(0, visibleCount).map((item) => {
            const config = getGroupConfig(item.group);
            const chineseName = item.title.split(" (")[0];
            return (
              <div
                key={item.id}
                onClick={() => handleFeaturedClick(item.id)}
                className={`group relative p-6 rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 ${
                  isDark
                    ? "bg-stone-900/40 border-stone-800 hover:border-cyan-400/50 hover:bg-stone-950/80 shadow-md shadow-black/20"
                    : "bg-white/80 border-[#e6decf] hover:border-[#b3a076] hover:bg-white/100 shadow-sm "
                }`}
              >
                {/* Card visual glowing border accent on hover */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${
                    config.topBarGradient
                  }`}
                />

                <div className="flex justify-between items-start mb-6">
                  <span className="text-4xl">{item.avatar}</span>
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${config.badgeColor}`}
                  >
                    {item.id}
                  </span>
                </div>

                <h3
                  className={`text-lg font-bold mb-1 transition-colors duration-300 ${isDark ? "text-white" : "text-stone-800"} ${config.hoverText}`}
                >
                  {chineseName}
                </h3>
                <p
                  className={`text-xs font-mono font-medium mb-3 tracking-widest ${
                    isDark ? "text-stone-400" : "text-[#a39474]"
                  }`}
                >
                  THE {item.englishName.toUpperCase()}
                </p>

                <p
                  className={`text-sm leading-relaxed mb-6 ${
                    isDark ? "text-stone-400" : "text-[#645c52]"
                  }`}
                >
                  {item.description}
                </p>

                <div
                  className={`flex items-center space-x-1.5 text-xs font-bold transition-all duration-300 ${
                    config.exploreText
                  }`}
                >
                  <span>对应人格小马</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {visibleCount < 16 && (
          <div className="flex justify-center pt-6">
            <button
              onClick={() => setVisibleCount((prev) => Math.min(prev + 4, 16))}
              className={`px-8 py-3.5 rounded-xl text-sm font-bold tracking-wider transition-all duration-300 border flex items-center space-x-2 ${
                isDark
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/20 hover:border-cyan-400 shadow-[0_4px_15px_rgba(6,182,212,0.15)] shadow-cyan-500/5"
                  : "bg-white/80 border-[#cbbea9] text-stone-700 hover:bg-white/100 hover:text-stone-900 "
              } transform hover:-translate-y-0.5 active:translate-y-0`}
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>加载更多型格 ({visibleCount} / 16)</span>
            </button>
          </div>
        )}
      </section>

      {/* 4. Join The Discovery / CTA Banner Section */}
      <section
        id="cta-banner-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div
          className={`relative rounded-3xl overflow-hidden p-8 md:p-14 border text-center ${
            isDark
              ? "bg-gradient-to-r from-indigo-950 via-[#111225] to-blue-950 border-cyan-500/20 shadow-xl"
              : "bg-white/80 border-[#cbbea9] shadow-md "
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,242,255,0.06),transparent_60%)] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2
              className={`text-3xl md:text-5xl font-extrabold tracking-tight font-sans ${
                isDark ? "text-white" : "text-stone-800"
              }`}
            >
              立即开启你的发现之旅
            </h2>
            <p
              className={`text-base md:text-lg leading-relaxed ${
                isDark ? "text-stone-300" : "text-[#645c52] font-medium"
              }`}
            >
              全套测试仅需 8 到 12
              分钟，我们不给您评判好坏，仅仅展开您心智光谱的多维和弦图卷。
            </p>
            <div className="pt-4">
              <button
                id="cta-start-test"
                onClick={() => setActiveView("test")}
                className={`mx-auto px-8 py-4 rounded-xl text-md font-bold tracking-wider flex items-center justify-center space-x-2 transition-all duration-300 transform hover:-translate-y-0.5 shadow-xl ${
                  isDark
                    ? "bg-white/80 over:bg-stone-100 text-stone-950 shadow-white/5 hover:shadow-cyan-400/20"
                    : "bg-stone-800 hover:bg-stone-900 text-stone-50 hover:shadow-stone-900/20"
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
      <section
        id="testimonials-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12"
      >
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2
            className={`text-2xl md:text-3xl font-extrabold tracking-tight ${
              isDark ? "text-white" : "text-stone-900"
            }`}
          >
            留言墙
          </h2>
          <p
            className={`text-sm ${isDark ? "text-stone-400" : "text-[#645c52]"}`}
          >
            来自已经找寻到自我拼图、记录于“留白留言”板上的真实反馈：
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimoniesLoading ? (
            <div
              className={`md:col-span-2 text-center py-10 text-sm ${
                isDark ? "text-stone-400" : "text-[#645c52]"
              }`}
            >
              正在加载留言墙…
            </div>
          ) : testimonies.length === 0 ? (
            <div
              className={`md:col-span-2 text-center py-10 text-sm ${
                isDark ? "text-stone-400" : "text-[#645c52]"
              }`}
            >
              暂无留言，前往留白留言板写下第一条感受吧
            </div>
          ) : (
            testimonies.map((item) => (
            <div
              key={item.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between ${
                isDark
                  ? "bg-[#111225]/45 border-cyan-500/10"
                  : "bg-white/80 border-[#e2d8c9] shadow-[0_4px_15px_rgba(104,94,49,0.02)] "
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-md font-semibold ${
                        isDark
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "bg-white/100 text-[#b3a076] "
                      }`}
                    >
                      {item.author[0].toUpperCase()}
                    </div>
                    <div>
                      <h4
                        className={`text-sm font-bold ${isDark ? "text-white" : "text-stone-800"}`}
                      >
                        {item.author}
                      </h4>
                      <p className="text-xs text-stone-400">
                        心智星位：{item.mbti}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(item.stars)].map((_, index) => (
                      <Stars
                        key={index}
                        className="w-4.5 h-4.5 text-amber-500 fill-amber-500"
                      />
                    ))}
                  </div>
                </div>
                <p
                  className={`text-sm leading-relaxed ${isDark ? "text-stone-300" : "text-[#645c52]"}`}
                >
                  “{item.comment}”
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs font-mono">
                <span className="text-stone-400">来自 留白留言 板首发</span>
                <span
                  className={`px-2.5 py-1 rounded-full ${
                    isDark
                      ? "bg-cyan-500/10 text-cyan-300"
                      : "bg-white/100 text-stone-700 "
                  }`}
                >
                  ♡ {item.likes} 人赞同了该共鸣
                </span>
              </div>
            </div>
          ))
          )}
        </div>

        <div className="text-center">
          <button
            onClick={() => setActiveView("comments")}
            className={`px-6 py-3 rounded-lg font-bold tracking-wide transition-all duration-300 ${
              isDark
                ? "text-cyan-400 hover:text-cyan-300"
                : "text-[#9a8d76] hover:text-stone-800"
            }`}
          >
            <span>进入“留白留言”查看与撰写更多感受</span>
          </button>
        </div>
      </section>
    </div>
  );
}