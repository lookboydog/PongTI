/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { AuthUser, ThemeMode, toAuthFormTheme } from '../types';
import InnerSpectrumFormCard from './InnerSpectrumFormCard';

interface AuthViewProps {
  theme: ThemeMode;
  onLoginSuccess: (user: AuthUser) => void;
  onBack: () => void;
}

export default function AuthView({ theme, onLoginSuccess, onBack }: AuthViewProps) {
  const isDark = theme === 'dark';

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full flex flex-col items-center"
      >
        <button
          type="button"
          onClick={onBack}
          className={`mb-6 inline-flex items-center gap-2 text-sm font-medium transition-colors ${
            isDark
              ? 'text-stone-400 hover:text-cyan-300'
              : 'text-stone-600 hover:text-[#685e31]'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          返回探索首页
        </button>

        <InnerSpectrumFormCard
          theme={toAuthFormTheme(theme)}
          onLoginSuccess={(user) => onLoginSuccess(user)}
        />
      </motion.div>
    </div>
  );
}
