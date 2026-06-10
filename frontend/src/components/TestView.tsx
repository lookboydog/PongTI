/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { ThemeMode, TestResult } from '../types';
import { QUESTIONS } from '../data/questions';
import { PERSONALITIES } from '../data/personalities';
import { CHARACTER_DATA } from '../data/characters';
import { loadAuthSession } from '../api/auth';
import { apiPost, isApiEnabled } from '../api/client';

interface TestViewProps {
  theme: ThemeMode;
  onFinishTest: (result: TestResult) => void;
}

export default function TestView({ theme, onFinishTest }: TestViewProps) {
  const isDark = theme === 'dark';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { value: string; score: number }>>({});

  const currentQuestion = QUESTIONS[currentIndex];
  const authSession = loadAuthSession();
  const displayName = authSession?.user.name;

  const handleSelectOption = (value: string, score: number) => {
    const updated = { ...answers, [currentQuestion.id]: { value, score } };
    setAnswers(updated);

    setTimeout(() => {
      if (currentIndex < QUESTIONS.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        computeAndSubmitResults(updated);
      }
    }, 350);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const computeAndSubmitResults = (finalAnswers: typeof answers) => {
    const dims = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    QUESTIONS.forEach((q) => {
      const ans = finalAnswers[q.id];
      if (ans) {
        const val = ans.value as keyof typeof dims;
        dims[val] += ans.score;
      }
    });

    const mbtiString = [
      dims.E >= dims.I ? 'E' : 'I',
      dims.S >= dims.N ? 'S' : 'N',
      dims.T >= dims.F ? 'T' : 'F',
      dims.J >= dims.P ? 'J' : 'P'
    ].join('');

    const foundType = PERSONALITIES.find(p => p.id === mbtiString) || PERSONALITIES[0];

    const getPercentage = (val1: number, val2: number) => {
      const total = val1 + val2;
      return total === 0 ? 50 : Math.round((val1 / total) * 100);
    };

    const userStats = {
      E: getPercentage(dims.E, dims.I),
      I: getPercentage(dims.I, dims.E),
      S: getPercentage(dims.S, dims.N),
      N: getPercentage(dims.N, dims.S),
      T: getPercentage(dims.T, dims.F),
      F: getPercentage(dims.F, dims.T),
      J: getPercentage(dims.J, dims.P),
      P: getPercentage(dims.P, dims.J)
    };

    const mbtiMatchedChars = CHARACTER_DATA.filter(
      char => char.mbti.toUpperCase() === mbtiString.toUpperCase()
    );

    let bestMatch = CHARACTER_DATA[0];
    let bestScore = -1;
    let worstMatch = CHARACTER_DATA[0];
    let worstScore = 999;

    const nameHash = displayName
      ? displayName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
      : authSession?.user.id ?? Date.now();

    CHARACTER_DATA.forEach((char) => {
      const dist = Math.sqrt(
        Math.pow(userStats.E - char.stats.E, 2) +
        Math.pow(userStats.S - char.stats.S, 2) +
        Math.pow(userStats.T - char.stats.T, 2) +
        Math.pow(userStats.J - char.stats.J, 2)
      );

      const sim = Math.round(100 - (dist / 200) * 100);

      if (sim < worstScore) {
        worstScore = sim;
        worstMatch = char;
      }
    });

    if (mbtiMatchedChars.length > 0) {
      bestMatch = mbtiMatchedChars[nameHash % mbtiMatchedChars.length];
      const dist = Math.sqrt(
        Math.pow(userStats.E - bestMatch.stats.E, 2) +
        Math.pow(userStats.S - bestMatch.stats.S, 2) +
        Math.pow(userStats.T - bestMatch.stats.T, 2) +
        Math.pow(userStats.J - bestMatch.stats.J, 2)
      );
      bestScore = Math.min(100, Math.round(100 - (dist / 200) * 100) + 3);
    } else {
      CHARACTER_DATA.forEach((char) => {
        const dist = Math.sqrt(
          Math.pow(userStats.E - char.stats.E, 2) +
          Math.pow(userStats.S - char.stats.S, 2) +
          Math.pow(userStats.T - char.stats.T, 2) +
          Math.pow(userStats.J - char.stats.J, 2)
        );
        const sim = Math.round(100 - (dist / 200) * 100);
        if (sim > bestScore) {
          bestScore = sim;
          bestMatch = char;
        }
      });
    }

    onFinishTest({
      mbti: mbtiString,
      nickname: displayName,
      typeInfo: foundType,
      dimensions: dims,
      matchedCharacter: bestMatch,
      shadowCharacter: worstMatch,
      similarityScore: bestScore
    });

    const syncTestRecord = async () => {
      if (!isApiEnabled()) return;

      try {
        const recordId = `record-${Date.now()}`;
        const nickname = displayName || '匿名旅人';
        await apiPost('/api/v1/test-records', {
          id: recordId,
          user: {
            id: authSession?.user.id,
            nickname,
            avatar_seed: nickname.substring(0, 3).toLowerCase()
          },
          mbti: mbtiString,
          stats: userStats
        });
      } catch (err) {
        console.warn('API Sync of test scores pending/inactive.', err);
      }
    };
    syncTestRecord();
  };

  const progressPercentage = Math.round((currentIndex / QUESTIONS.length) * 100);

  return (
    <div id="test-container" className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <button
          id="back-button"
          onClick={handleBack}
          disabled={currentIndex === 0}
          className={`flex items-center space-x-1.5 text-sm font-bold transition-all ${
            currentIndex === 0
              ? 'text-stone-500 opacity-30 cursor-not-allowed'
              : isDark
                ? 'text-cyan-400 hover:text-cyan-300'
                : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>上一页</span>
        </button>

        <div className="flex flex-col items-end">
          <span className={`text-xs font-mono font-extrabold tracking-widest ${
            isDark ? 'text-cyan-400' : 'text-[#b3a076]'
          }`}>
            和谱之卷 {currentIndex + 1} / {QUESTIONS.length}
          </span>
          <span className="text-[10px] text-stone-400">STATUS: INTERACTIVE TESTING</span>
        </div>
      </div>

      <div className={`h-2.5 w-full rounded-full overflow-hidden mb-12 ${
        isDark ? 'bg-stone-900 border border-stone-800' : 'bg-stone-200/50'
      }`}>
        <div
          className={`h-full transition-all duration-300 rounded-full bg-gradient-to-r ${
            isDark ? 'from-cyan-500 to-blue-500' : 'from-[#c2b291] to-stone-800'
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          id="question-card"
          className={`p-6 md:p-10 rounded-3xl border ${
            isDark
              ? 'bg-gradient-to-br from-[#12132e] via-[#0d0e26] to-[#08091a] border-cyan-500/25 shadow-xl shadow-cyan-500/5'
              : 'bg-white border-[#ebdcc9] shadow-[0_15px_30px_rgba(104,94,49,0.04)]'
          }`}
        >
          <div className="flex items-start space-x-4 mb-8">
            <span className={`p-2.5 rounded-xl text-xs font-mono font-extrabold flex-shrink-0 mt-0.5 ${
              isDark ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-[#ebd9c1]/20 text-[#b3a076]'
            }`}>
              Q.{currentIndex + 1}
            </span>
            <h2 className={`text-xl md:text-2xl font-bold font-sans leading-relaxed ${
              isDark ? 'text-white' : 'text-stone-900'
            }`}>
              {currentQuestion.text}
            </h2>
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => {
              const savedAns = answers[currentQuestion.id];
              const isSelected = savedAns && savedAns.value === option.value && savedAns.score === option.score;

              return (
                <button
                  key={idx}
                  id={`option-button-${idx}`}
                  onClick={() => handleSelectOption(option.value, option.score)}
                  className={`w-full p-5 rounded-2xl border text-left font-sans text-sm md:text-base leading-relaxed font-semibold transition-all duration-300 transform active:scale-98 flex items-center justify-between ${
                    isSelected
                      ? isDark
                        ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,242,255,0.1)]'
                        : 'bg-stone-100 border-[#b3a076] text-stone-900'
                      : isDark
                        ? 'bg-stone-950/40 border-stone-850 text-stone-300 hover:bg-stone-900/60 hover:border-cyan-500/30'
                        : 'bg-stone-50/60 border-stone-200 text-stone-700 hover:bg-white hover:border-[#b3a076]/60 hover:shadow-sm'
                  }`}
                >
                  <span className="max-w-[90%]">{option.text}</span>
                  {isSelected && (
                    <CheckCircle className={`w-5 h-5 shrink-0 ml-3 ${
                      isDark ? 'text-cyan-400' : 'text-stone-700'
                    }`} />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="text-center mt-8">
        <p className="text-xs text-stone-500 font-mono tracking-widest uppercase">
           CHORDAL COGNITIVE ALIGNMENT
        </p>
      </div>
    </div>
  );
}
