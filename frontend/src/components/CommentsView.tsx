/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThumbsUp, Star, Send, MessageCircle, ChevronLeft, ChevronRight, X, Heart, Sparkles } from 'lucide-react';
import { AuthUser, ThemeMode, Comment } from '../types';
import { apiGet, apiPost, isApiEnabled } from '../api/client';
import { validateCommentContent } from '../utils/security';

interface CommentsViewProps {
  theme: ThemeMode;
  authUser: AuthUser | null;
  userMbtiTag?: string;
  onNavigateToAuth: () => void;
}

const PRESET_COMMENTS: Comment[] = [
  {
    id: "comment-1",
    author: "星海观测者_伽利略",
    avatarSeed: "galileo",
    content: "在这里测出的是 INTJ 皇家建筑师。分析结果中对于‘过度苛求、容易疏离他人情感维度’的暗影描述真的非常准确。在进行学术攻关时，我确实常常忽视了身边助手和家属的真切关怀。这一份星谱，是一面照亮我内在黑暗的镜子。",
    timestamp: "2026-06-03 14:15",
    likes: 42,
    stars: 18,
    mbtiTag: "INTJ",
    replies: [
      { id: "r-1", author: "星际漫步小精灵", content: "同为 INTJ！真的深有感触，有时不是不想共情，而是沉迷在逻辑模型中太深，出不来啦 🌌", timestamp: "2026-06-03 14:30" }
    ]
  },
  {
    id: "comment-2",
    author: "伊人森林旅客",
    avatarSeed: "forest",
    content: "森林调解者 (INFP) 报到！‘翡翠森林圣息，把温柔注入千疮百孔的红尘’这一段直接把我给看哭了……在快节奏、充满各种考核算计的世俗中，我们往往被视为‘脆弱的逃避者’。在这里，我的敏感和浪漫终于得到了最合理的、温柔的命名。谢谢 PonyTI！",
    timestamp: "2026-06-03 13:50",
    likes: 38,
    stars: 25,
    mbtiTag: "INFP"
  },
  {
    id: "comment-3",
    author: "时空领航员",
    avatarSeed: "captain",
    content: "作为 ESTJ 铁腕执行官，以前一直被别人吐槽是工作狂、太严肃教条，但在这里我明白了自己的‘神圣秩序力’是维持星云文明运转的脊梁！我也开始在学习怎么给同行的外交官 and 艺术家一些温柔的留白，感觉懂得了谱系克制和包容的美妙。",
    timestamp: "2026-06-03 12:10",
    likes: 19,
    stars: 5,
    mbtiTag: "ESTJ"
  },
  {
    id: "comment-4",
    author: "流光琴手_肖邦",
    avatarSeed: "chopin",
    content: "我是 浮光艺术家 (ISFP)，被星图解析出的‘月影浮水幻流’美到了。真的是我的写照，我不喜欢那些宏伟空洞的信息，只想用音符、光影和随遇而安的生活，去勾勒夜空下的流荧一瞬。测试太有美学层次了！",
    timestamp: "2026-06-03 11:32",
    likes: 29,
    stars: 14,
    mbtiTag: "ISFP"
  },
  {
    id: "comment-5",
    author: "至爱极光",
    avatarSeed: "aurora",
    content: "竞选者 (ENFP) 哈哈！果然本心就是自带一万个鬼点子的快乐大魔王！这个界面在深色深色模式下太酷炫了，亮色模式下又雅致得不行。两个主题的设计质感真的是无能出其右，不虚此测！",
    timestamp: "2026-06-03 10:05",
    likes: 56,
    stars: 31,
    mbtiTag: "ENFP"
  }
];

export default function CommentsView({ theme, authUser, userMbtiTag, onNavigateToAuth }: CommentsViewProps) {
  const isDark = theme === 'dark';
  const [comments, setComments] = useState<Comment[]>([]);
  const [newContent, setNewContent] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [replyValidationError, setReplyValidationError] = useState<Record<string, string | null>>({});

  const isLoggedIn = !!authUser;
  const authorName = authUser?.name || '';
  const mbtiTag = userMbtiTag || '';
  const replyAuthor = authUser?.name || '';
  const replyMbti = userMbtiTag || '';

  // Active reply target
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyRecipient, setReplyRecipient] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchCommentsFromWorker = async () => {
      if (!isApiEnabled()) {
        console.info('VITE_API_URL 未配置，使用本地留言数据。');
      } else {
        try {
          const res = await apiGet('/api/v1/comments');
          if (res.ok) {
            const cloudComments = await res.json();
            if (Array.isArray(cloudComments)) {
              setComments(cloudComments);
              localStorage.setItem('inner_spectrum_comments', JSON.stringify(cloudComments));
              return;
            }
          }
          console.warn('后端返回异常，降级到本地数据。', res.status);
        } catch (err) {
          console.warn('Backend Serverless sync pending/inactive. Reverting to local spectrum database.', err);
        }
      }

      // Local storage fallback
      const saved = localStorage.getItem('inner_spectrum_comments');
      if (saved) {
        try {
          setComments(JSON.parse(saved));
        } catch (e) {
          setComments(PRESET_COMMENTS);
        }
      } else {
        setComments(PRESET_COMMENTS);
        localStorage.setItem('inner_spectrum_comments', JSON.stringify(PRESET_COMMENTS));
      }
    };

    fetchCommentsFromWorker();
  }, []);

  const saveToStorage = (updatedList: Comment[]) => {
    setComments(updatedList);
    localStorage.setItem('inner_spectrum_comments', JSON.stringify(updatedList));
  };

  const handleContentChange = (val: string) => {
    setNewContent(val);
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleReplyChange = (val: string, commentId: string) => {
    setReplyText(val);
    if (replyValidationError[commentId]) {
      setReplyValidationError(prev => ({ ...prev, [commentId]: null }));
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !newContent.trim()) return;

    // Run security filter
    const validation = validateCommentContent(newContent);
    if (!validation.isValid) {
      setValidationError(validation.message);
      return;
    }
    setValidationError(null);

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: authorName.trim(),
      avatarSeed: authorName.trim().substring(0, 3).toLowerCase(),
      content: newContent.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      likes: 0,
      stars: 0,
      mbtiTag: mbtiTag.trim() || undefined,
      replies: []
    };

    const updated = [newComment, ...comments];
    saveToStorage(updated);
    
    // Clear inputs
    setNewContent('');
    setCurrentPage(1);

    // Sync to Cloudflare D1 via Workers API
    if (isApiEnabled()) {
      try {
        const res = await apiPost('/api/v1/comments', newComment);
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          console.warn('留言同步到数据库失败，已保留本地副本。', errBody);
        }
      } catch (err) {
        console.warn('Silent API Sync inoperable. Preserved locally in-memory/localStorage.', err);
      }
    }
  };

  const handleLike = async (id: string) => {
    const updated = comments.map(c => {
      if (c.id === id) {
        return {
          ...c,
          likes: c.hasLiked ? c.likes - 1 : c.likes + 1,
          hasLiked: !c.hasLiked
        };
      }
      return c;
    });
    saveToStorage(updated);

    if (isApiEnabled()) {
      try {
        await apiPost(`/api/v1/comments/${id}/like`);
      } catch (err) {
        console.warn('Like action pending edge database replication.', err);
      }
    }
  };

  const handleStar = async (id: string) => {
    const updated = comments.map(c => {
      if (c.id === id) {
        return {
          ...c,
          stars: c.hasStarred ? c.stars - 1 : c.stars + 1,
          hasStarred: !c.hasStarred
        };
      }
      return c;
    });
    saveToStorage(updated);

    if (isApiEnabled()) {
      try {
        await apiPost(`/api/v1/comments/${id}/star`);
      } catch (err) {
        console.warn('Star action pending edge database replication.', err);
      }
    }
  };

  const handleLikeReply = async (commentId: string, replyId: string) => {
    const updated = comments.map(c => {
      if (c.id === commentId && c.replies) {
        const updatedReplies = c.replies.map(r => {
          if (r.id === replyId) {
            return {
              ...r,
              likes: r.hasLiked ? (r.likes || 0) - 1 : (r.likes || 0) + 1,
              hasLiked: !r.hasLiked
            };
          }
          return r;
        });
        return {
          ...c,
          replies: updatedReplies
        };
      }
      return c;
    });
    saveToStorage(updated);

    if (isApiEnabled()) {
      try {
        await apiPost(`/api/v1/comments/${commentId}/replies/${replyId}/like`);
      } catch (err) {
        console.warn('Reply like pending edge replication.', err);
      }
    }
  };

  const handlePostReply = async (commentId: string) => {
    const finalAuthor = replyAuthor.trim();
    if (!finalAuthor) {
      alert("请先登录账号后再回复留言。");
      return;
    }
    if (!replyText.trim()) {
      alert("回复内容不能为空。");
      return;
    }

    // Run security filter
    const validation = validateCommentContent(replyText);
    if (!validation.isValid) {
      setReplyValidationError(prev => ({ ...prev, [commentId]: validation.message }));
      return;
    }
    setReplyValidationError(prev => ({ ...prev, [commentId]: null }));

    let contentWithRecipient = replyText.trim();
    if (replyRecipient) {
      contentWithRecipient = `回复 @${replyRecipient}：${contentWithRecipient}`;
    }
    const newReply = {
      id: `reply-${Date.now()}`,
      author: finalAuthor,
      content: contentWithRecipient,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      mbtiTag: replyMbti.trim() || undefined,
      likes: 0,
      hasLiked: false
    };

    const updated = comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [...(c.replies || []), newReply]
        };
      }
      return c;
    });

    saveToStorage(updated);
    setReplyText('');
    setReplyRecipient(null);
    setActiveReplyId(null);

    if (isApiEnabled()) {
      try {
        const res = await apiPost(`/api/v1/comments/${commentId}/replies`, newReply);
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          console.warn('回复同步到数据库失败，已保留本地副本。', errBody);
        }
      } catch (err) {
        console.warn('Reply action pending edge database replication.', err);
      }
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(comments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComments = comments.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div id="comments-view-container" className="py-10 max-w-4xl mx-auto px-4 space-y-12">
      {/* 1. Header description */}
      <div className="text-center space-y-4">
        <h1 className={`text-3xl md:text-5xl font-extrabold tracking-tight ${
          isDark ? 'text-white' : 'text-stone-900'
        }`}>
          留白留言板
        </h1>
        <p className={`text-base md:text-lg max-w-xl mx-auto leading-relaxed ${
          isDark ? 'text-stone-300' : 'text-[#645c52]'
        }`}>
          星汉永无尽，微芒有所依。在这里留下你的型格感触，或与不同心智轨道的漫游客轻声共鸣。
        </p>
      </div>

      {/* 2. 未登录引导 / 已登录留言表单 */}
      {!isLoggedIn ? (
        <div 
          id="locked-comment-guide"
          className={`p-8 md:p-10 rounded-3xl border text-center space-y-6 ${
            isDark
              ? 'bg-gradient-to-br from-[#12132e] to-[#0d0e26] border-cyan-500/20 shadow-xl shadow-cyan-500/5'
              : 'bg-white border-[#ebdcc9] shadow-[0_12px_28px_rgba(104,94,49,0.03)]'
          }`}
        >
          <div className="max-w-md mx-auto space-y-3">
            
            <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-stone-900'}`}>
              请先登录后再留言
            </h3>
            <p className={`text-xs md:text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-[#645c52]'}`}>
              星声回音极其庄宿。为了确保每一条感悟印记均出自真实账号，留言功能仅向已登录的旅人开放。登录后系统将自动使用您的账号名称，您只需填写留言内容即可。
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onNavigateToAuth}
              className={`px-6 py-3 rounded-xl font-bold text-xs tracking-widest flex items-center justify-center space-x-2 mx-auto transition-all duration-300 hover:scale-105 active:scale-95 ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/10'
                  : 'bg-stone-850 hover:bg-stone-900 text-stone-50 shadow-md'
              }`}
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>前往登录 · 解锁留言</span>
            </button>
          </div>
        </div>
      ) : (
        <div 
          id="write-comment-form"
          className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 ${
            isDark
              ? 'bg-gradient-to-br from-[#12132e] to-[#0d0e26] border-cyan-500/15 shadow-md shadow-cyan-500/5'
              : 'bg-white border-[#ebdcc9] shadow-[0_10px_25px_rgba(104,94,49,0.02)]'
          }`}
        >
          <h3 className={`text-lg font-bold mb-6 flex items-center space-x-2 ${isDark ? 'text-white' : 'text-stone-850'}`}>
            <Send className="w-5 h-5 text-cyan-400" />
            <span>书写你的星轨印记</span>
          </h3>

          <form onSubmit={handlePostComment} className="space-y-4">
            <div className={`p-4 rounded-2xl border flex flex-wrap items-center gap-3 ${
              isDark ? 'bg-stone-950/40 border-stone-800/80' : 'bg-stone-50/60 border border-stone-200'
            }`}>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">当前账号</span>
                <span className={`text-sm font-extrabold ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
                   {authorName}
                </span>
              </div>
              {userMbtiTag && (
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">心智星位</span>
                  <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-mono font-black border ${
                    isDark
                      ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                      : 'bg-[#ebdcd0]/70 text-[#7c6c4f] border-[#cbbea9]/60'
                  }`}>
                    ✨ {userMbtiTag}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-400 block">感悟共鸣内容 (Content)</label>
              <textarea
                id="comment-content-textarea"
                required
                rows={4}
                placeholder="分享你做完测试后的惊喜、困惑、自我拥抱，或任何对理想谱系的诗意随笔..."
                value={newContent}
                onChange={(e) => handleContentChange(e.target.value)}
                className={`w-full p-4 rounded-2xl border focus:outline-none transition-all ${
                  isDark
                    ? 'bg-stone-950 border-stone-800 text-stone-300 placeholder-stone-605 focus:border-cyan-400'
                    : 'bg-stone-50 border-stone-200 text-stone-800 placeholder-stone-400 focus:border-[#b3a076]'
                }`}
              />
            </div>

            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl text-xs font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-start gap-2.5 shadow-sm"
              >
                <span className="text-sm select-none leading-none pt-0.5">⚠️</span>
                <span className="leading-relaxed">{validationError}</span>
              </motion.div>
            )}

            <div className="flex justify-end pt-2">
              <button
                id="submit-comment-button"
                type="submit"
                className={`px-6 py-3 rounded-xl font-bold text-sm tracking-widest flex items-center space-x-2 transition-all ${
                  isDark
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/10'
                    : 'bg-stone-800 hover:bg-stone-900 text-stone-50 shadow-md shadow-stone-800/15'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>投放星笺</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Render feed list */}
      <div id="comments-feed-list" className="space-y-6">
        <h3 className={`text-md font-mono tracking-wider font-extrabold text-stone-400  pb-3 uppercase ${
          isDark ? 'border-stone-800' : 'border-stone-100'
        }`}>
          星声回音共鸣轴 ({comments.length} 条留言)
        </h3>

        <div className="space-y-6">
          {currentComments.map((comment) => (
            <div
              key={comment.id}
              id={comment.id}
              className={`p-6 rounded-2xl border transition-all ${
                isDark
                  ? 'bg-stone-900/40 border-stone-800/80 hover:border-cyan-500/10'
                  : 'bg-white border-[#ebdcc9] shadow-[0_4px_15px_rgba(104,94,49,0.01)]'
              }`}
            >
              {/* Comment Header */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center space-x-3.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold ${
                    isDark ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-stone-100 text-[#b3a076]'
                  }`}>
                    {comment.author[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <h4 className={`text-sm font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
                        {comment.author}
                      </h4>
                      {comment.mbtiTag && (
                        <span className={`text-[9px] font-mono leading-none font-black px-1.5 py-0.5 rounded-md ${
                          isDark 
                            ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' 
                            : 'bg-[#ebdcd0] text-[#7c6c4f]'
                        }`}>
                          {comment.mbtiTag}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-500 font-mono">{comment.timestamp}</span>
                  </div>
                </div>

                {/* Star-like highlights stats */}
                <div className="flex items-center space-x-2.5">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      comment.hasLiked
                        ? isDark
                          ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400'
                          : 'bg-stone-100 border-stone-800 text-stone-900'
                        : isDark
                          ? 'bg-stone-950/40 border-stone-850 text-stone-400 hover:text-stone-200'
                          : 'bg-[#faf8f5] border-stone-200 text-stone-605 hover:bg-stone-100'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{comment.likes}</span>
                  </button>

                  <button
                    onClick={() => handleStar(comment.id)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      comment.hasStarred
                        ? 'bg-amber-500/15 border-amber-500 text-amber-500 shadow-xs'
                        : isDark
                          ? 'bg-stone-950/40 border-stone-850 text-stone-400 hover:text-stone-200'
                          : 'bg-[#faf8f5] border-stone-200 text-stone-605 hover:bg-stone-100'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>{comment.stars}</span>
                  </button>
                </div>
              </div>

              {/* Character commentary */}
              <p className={`text-sm leading-relaxed mb-4 whitespace-pre-wrap ${
                isDark ? 'text-stone-300 font-medium' : 'text-[#443e37]'
              }`}>
                {comment.content}
              </p>

              {/* Replies Sub-view list */}
              {comment.replies && comment.replies.length > 0 && (
                <div className={`space-y-4 p-4 rounded-2xl border mb-4 ${
                  isDark ? 'bg-stone-950/60 border-stone-850' : 'bg-stone-50/80 border-[#ebdcc9]/40 shadow-inner'
                }`}>
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="text-xs space-y-2 group border-b border-stone-800/10 last:border-0 pb-3 last:pb-0">
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${
                            isDark ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : 'bg-stone-200 text-[#b3a076]'
                          }`}>
                            {reply.author[0].toUpperCase()}
                          </div>
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <span className={`font-bold ${isDark ? 'text-stone-200' : 'text-stone-850'}`}>
                              {reply.author}
                            </span>
                            {reply.mbtiTag && (
                              <span className={`text-[8px] font-mono leading-none px-1 py-0.5 rounded-sm font-black ${
                                isDark ? 'bg-cyan-500/15 text-cyan-400' : 'bg-[#ebdcd0] text-[#7c6c4f]'
                              }`}>
                                {reply.mbtiTag}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-500 font-mono">{reply.timestamp}</span>
                      </div>
                      <p className={`leading-relaxed pl-7 whitespace-pre-wrap ${isDark ? 'text-stone-300' : 'text-[#5d544b]'}`}>
                        {reply.content}
                      </p>
                      <div className="flex items-center space-x-4 pl-7 pt-1">
                        {/* Like Reply */}
                        <button
                          onClick={() => handleLikeReply(comment.id, reply.id)}
                          className={`flex items-center space-x-1 px-2 py-0.5 rounded transition-all hover:bg-stone-500/5 ${
                            reply.hasLiked 
                              ? 'text-rose-500 font-bold' 
                              : 'text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${reply.hasLiked ? 'fill-rose-500' : ''}`} />
                          <span className="text-[10px] font-mono">{reply.likes || 0}</span>
                        </button>

                        {/* Reply back tool - only activate if user is registered */}
                        {isLoggedIn && (
                          <button
                            onClick={() => {
                              setActiveReplyId(comment.id);
                              setReplyRecipient(reply.author);
                            }}
                            className={`flex items-center space-x-1 px-2 py-0.5 rounded text-stone-400 hover:text-cyan-400 transition-colors`}
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span className="text-[10px]">回复</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply trigger Form */}
              <div id="reply-block" className="pt-2">
                {!isLoggedIn ? (
                  <span className="text-[10px] text-stone-500 italic">
                    回复功能需登录后解锁。
                  </span>
                ) : activeReplyId === comment.id ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.99, y: 0 }}
                    className={`p-4 rounded-xl border space-y-4 ${
                      isDark ? 'bg-stone-955 border-stone-800' : 'bg-[#fffdfb] border-[#ebdcc9] shadow-sm'
                    }`}
                  >
                    {/* Header: replying status indicator */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-stone-400 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        {replyRecipient ? (
                          <span className="flex items-center space-x-1">
                            <span>正在回复 </span>
                            <span className="text-cyan-400 underline decoration-dotted bg-cyan-500/10 px-1.5 py-0.5 rounded">@{replyRecipient}</span>
                          </span>
                        ) : (
                          <span>撰写共鸣回复</span>
                        )}
                      </span>
                      {replyRecipient && (
                        <button 
                          onClick={() => setReplyRecipient(null)}
                          className="text-[10px] text-rose-450 hover:underline uppercase font-bold"
                        >
                          撤销针对性回复
                        </button>
                      )}
                    </div>

                    {/* Locked verification credentials badge for reply */}
                    <div className="p-3 rounded-xl border text-xs flex items-center space-x-2 bg-stone-950/30 border-stone-800/40">
                      <span className="text-stone-500 font-mono">回复人：</span>
                      <span className={`font-extrabold ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>👤 {authorName}</span>
                      {userMbtiTag && (
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono leading-none border ${isDark ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300' : 'bg-stone-100 border-stone-200 text-stone-605'}`}>
                          {userMbtiTag}
                        </span>
                      )}
                    </div>

                    {/* Cosmic Quick Expression Shortcuts */}
                    <div className="flex items-center space-x-1.5 py-1 select-none flex-wrap gap-y-1">
                      <span className="text-[10px] text-stone-500 font-bold mr-1">快捷共鸣粒子:</span>
                      {["🌌", "✨", "🔮", "🪐", "💫", "❤️", "🎯", "🔭", "🙌"].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            setReplyText(p => p + emoji);
                            if (replyValidationError[comment.id]) {
                              setReplyValidationError(prev => ({ ...prev, [comment.id]: null }));
                            }
                          }}
                          className={`px-2 py-0.5 text-xs rounded-md transition-all ${
                            isDark ? 'bg-stone-900 hover:bg-stone-800 text-stone-300' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    {replyValidationError[comment.id] && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg text-xs font-bold bg-rose-500/10 border border-rose-500/20 text-rose-450 flex items-start gap-2 shadow-xs"
                      >
                        <span className="pt-0.5 select-none text-xs">⚠️</span>
                        <span>{replyValidationError[comment.id]}</span>
                      </motion.div>
                    )}

                    {/* Rich Input & Submit Row */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="在此轻声回复旅人的印记..."
                        value={replyText}
                        onChange={(e) => handleReplyChange(e.target.value, comment.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handlePostReply(comment.id);
                          }
                        }}
                        className={`flex-1 p-2.5 text-xs rounded-lg border focus:outline-none focus:ring-1 ${
                          isDark
                            ? 'bg-stone-950 border-[#2a2d44] text-stone-100 focus:border-cyan-400 focus:ring-cyan-400/20'
                            : 'bg-[#faf8f5] border-stone-200 text-stone-800 focus:border-[#b3a076] focus:ring-[#b3a076]/20'
                        }`}
                      />
                      <button
                        onClick={() => handlePostReply(comment.id)}
                        className={`px-4 py-2 text-xs font-black rounded-lg uppercase tracking-wider transition-all ${
                          isDark 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 shadow-md shadow-cyan-500/10' 
                            : 'bg-stone-850 text-stone-50 hover:bg-stone-900 shadow-sm'
                        }`}
                      >
                        投放
                      </button>
                      <button
                        onClick={() => {
                          setActiveReplyId(null);
                          setReplyRecipient(null);
                        }}
                        className="p-2.5 border border-stone-700/20 hover:text-rose-400 hover:border-rose-455/30 rounded-lg transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveReplyId(comment.id);
                      setReplyRecipient(null);
                    }}
                    className={`flex items-center space-x-1.5 text-xs font-bold transition-colors ${
                      isDark ? 'text-stone-400 hover:text-cyan-400' : 'text-stone-500 hover:text-[#b3a076]'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>写回复</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 4. Pagination nav */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 pt-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-xl border transition-all ${
                currentPage === 1
                  ? 'opacity-30 cursor-not-allowed text-stone-500'
                  : isDark
                    ? 'border-stone-800 text-cyan-400 hover:bg-stone-800'
                    : 'border-stone-200 text-stone-750 hover:bg-stone-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className={`text-xs font-mono font-bold ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              PAGE {currentPage} OF {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-xl border transition-all ${
                currentPage === totalPages
                  ? 'opacity-30 cursor-not-allowed text-stone-500'
                  : isDark
                    ? 'border-stone-800 text-cyan-400 hover:bg-stone-800'
                    : 'border-stone-200 text-stone-750 hover:bg-stone-100'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
