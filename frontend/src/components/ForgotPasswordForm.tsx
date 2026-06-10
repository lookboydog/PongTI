import React, { useState } from 'react';
import { forgotPasswordUser } from '../api/auth';
import { AuthFormThemeMode, ActiveForm } from '../types';

interface ForgotPasswordFormProps {
  theme: AuthFormThemeMode;
  onFormSwitch: (form: ActiveForm) => void;
  showNotification: (text: string, type: 'success' | 'error' | 'info') => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

export default function ForgotPasswordForm({
  theme,
  onFormSwitch,
  showNotification,
  isLoading,
  setIsLoading,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showNotification('请先填写您的邮箱地址 Email', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('请输入格式正确的邮箱地址', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const message = await forgotPasswordUser({ email });
      showNotification(message, 'success');
      onFormSwitch('LOGIN');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '重置请求失败，请稍后重试';
      showNotification(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Base Class Themes mapping
  const inputWrapperClass = theme === 'DARK'
    ? 'border-white/10 bg-black/25 text-white placeholder-slate-500 cyan-glow'
    : 'border-[#f1e3a9]/60 bg-white/30 text-slate-800 placeholder-slate-400/80 gold-glow';

  const labelClass = theme === 'DARK'
    ? 'text-slate-300 font-manrope'
    : 'text-[#685e31] font-jakarta';

  const btnClass = theme === 'DARK'
    ? 'bg-[#425e94] hover:bg-[#7e99d3] text-white moon-glow'
    : 'bg-gradient-to-r from-[#f1e3a9] to-[#f3e5ab] text-[#685e31] border border-[#ccc6b7]/20 divine-glow';

  const linkClass = theme === 'DARK'
    ? 'text-[#adc6ff] hover:text-white'
    : 'text-[#685e31] hover:text-[#9c8b48]';

  return (
    <form className="flex flex-col gap-5 mt-4 w-full animate-fadeIn" onSubmit={handleSubmit}>
      <div className="text-center px-2">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
          {theme === 'DARK'
            ? '我们将自动为您生成一封安全重置邮件，协助您取回进入内心光谱领域的物理路径。'
            : '系统将校验您的神圣光谱邮箱，并下发重置密钥的唤醒星轨。'}
        </p>
      </div>

      {/* Email Input Field */}
      <div className="flex flex-col gap-1.5">
        <label className={`text-xs font-semibold tracking-wider flex justify-between items-center px-1 ${labelClass}`}>
          <span>您的电子邮箱 ACCOUNT EMAIL</span>
          <span className="material-symbols-outlined text-[15px] opacity-65">alternate_email</span>
        </label>
        <div className={`relative rounded-xl overflow-hidden border transition-all duration-300 w-full ${inputWrapperClass}`}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-none text-sm font-sans py-4 pl-4 pr-12 text-current outline-none focus:ring-0 focus:outline-none"
            placeholder={theme === 'DARK' ? 'username@spectrum.com' : 'Enter your email address'}
          />
        </div>
      </div>

      {/* Primary Submit Button */}
      <div className="pt-2 w-full">
        <button
          type="submit"
          disabled={isLoading}
          className={`cursor-pointer w-full py-4 rounded-full font-bold text-sm tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2 ${btnClass}`}
        >
          {isLoading ? (
            <span className={`w-5 h-5 border-2 rounded-full animate-spin ${theme === 'DARK' ? 'border-white border-t-transparent' : 'border-[#685e31] border-t-transparent'}`} />
          ) : (
            <>
              <span>重置密码 SEND RESET LINK</span>
              <span className="material-symbols-outlined text-[18px]">key</span>
            </>
          )}
        </button>
      </div>

      {/* Form Transition Prompt */}
      <div className="mt-3 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400 tracking-wide leading-relaxed">
          记起密码？{' '}
          <button
            type="button"
            onClick={() => onFormSwitch('LOGIN')}
            className={`cursor-pointer font-bold hover:underline bg-transparent border-none ${linkClass}`}
          >
            返回登入 SIGN IN
          </button>
        </p>
      </div>
    </form>
  );
}
