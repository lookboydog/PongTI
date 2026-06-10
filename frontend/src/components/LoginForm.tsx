import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import { AuthFormThemeMode, ActiveForm, AuthUser } from '../types';

interface LoginFormProps {
  theme: AuthFormThemeMode;
  onFormSwitch: (form: ActiveForm) => void;
  onLoginSuccess: (user: AuthUser) => void;
  showNotification: (text: string, type: 'success' | 'error' | 'info') => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

export default function LoginForm({
  theme,
  onFormSwitch,
  onLoginSuccess,
  showNotification,
  isLoading,
  setIsLoading,
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showNotification('请输入您的电子邮箱地址 Email Address', 'error');
      return;
    }
    if (!password) {
      showNotification('请输入安全密码 Password', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('请输入格式正确的邮箱地址 (e.g. user@domain.com)', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const session = await loginUser({ email, password });
      showNotification('🔮 登录成功！正在同频心灵光谱领域...', 'success');
      onLoginSuccess(session.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : '登录失败，请稍后重试';
      showNotification(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialClick = (platform: string) => {
    showNotification(`🌌 正在跳转第三方认证: ${platform}...`, 'info');
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

  const socialBtnClass = theme === 'DARK'
    ? 'glass-card-dark border-white/10 text-white/80 hover:bg-white/5 hover:border-white/20'
    : 'glass-card-light border-slate-200/50 text-slate-600 hover:bg-white/60';

  const linkClass = theme === 'DARK'
    ? 'text-[#adc6ff] hover:text-white'
    : 'text-[#685e31] hover:text-[#9c8b48]';

  const secondaryBtnClass = theme === 'DARK'
    ? 'text-slate-400 hover:text-white'
    : 'text-[#685e31] hover:text-[#9c8b48]';

  const dividerClass = theme === 'DARK' ? 'bg-white/10' : 'bg-[#f1e3a9]/60';

  return (
    <form className="flex flex-col gap-5 mt-4 w-full animate-fadeIn" onSubmit={handleSubmit}>
      {/* Email Input Field */}
      <div className="flex flex-col gap-1.5">
        <label className={`text-xs font-semibold tracking-wider flex justify-between items-center px-1 ${labelClass}`}>
          <span>电子邮箱 EMAIL</span>
          <span className="material-symbols-outlined text-[15px] opacity-60">mail</span>
        </label>
        <div className={`relative rounded-xl overflow-hidden border transition-all duration-300 w-full ${inputWrapperClass}`}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-none text-sm font-sans py-4 pl-4 pr-12 text-current outline-none focus:ring-0 focus:outline-none"
            placeholder={theme === 'DARK' ? 'inner@spectrum.com' : 'Enter your email address'}
          />
        </div>
      </div>

      {/* Password Input Field */}
      <div className="flex flex-col gap-1.5">
        <label className={`text-xs font-semibold tracking-wider flex justify-between items-center px-1 ${labelClass}`}>
          <span>密码 PASSWORD</span>
          <span className="material-symbols-outlined text-[15px] opacity-60">lock</span>
        </label>
        <div className={`relative rounded-xl overflow-hidden border transition-all duration-300 w-full ${inputWrapperClass}`}>
          <input
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-none text-sm font-sans py-4 pl-4 pr-12 text-current tracking-wide outline-none focus:ring-0 focus:outline-none"
            placeholder={theme === 'DARK' ? '••••••••' : 'Enter your password'}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              {showPass ? 'visibility' : 'visibility_off'}
            </span>
          </button>
        </div>

        {/* Forgot password row aligned right */}
        <div className="flex justify-end px-1 mt-0.5">
          <button
            type="button"
            onClick={() => onFormSwitch('FORGOT_PASSWORD')}
            className={`text-xs font-bold bg-transparent border-none cursor-pointer tracking-wider ${secondaryBtnClass}`}
          >
            忘记密码? FORGOT PASSWORD
          </button>
        </div>
      </div>

      {/* Primary Submit Action */}
      <div className="pt-2 relative group w-full">
        <button
          type="submit"
          disabled={isLoading}
          className={`cursor-pointer w-full py-4 rounded-full font-bold text-sm tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2 ${btnClass}`}
        >
          {isLoading ? (
            <span className={`w-5 h-5 border-2 rounded-full animate-spin ${theme === 'DARK' ? 'border-white border-t-transparent' : 'border-[#685e31] border-t-transparent'}`} />
          ) : (
            <>
              <span>立即登录 SIGN IN</span>
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                {theme === 'DARK' ? 'auto_awesome' : 'arrow_forward'}
              </span>
            </>
          )}
        </button>
      </div>

  
      {/* Form Transition Prompt */}
      <div className="mt-3 text-center">
        <p className="text-xs text-slate-400 dark:text-slate-350 tracking-wide leading-relaxed">
          没有账户?{' '}
          <button
            type="button"
            onClick={() => onFormSwitch('SIGNUP')}
            className={`cursor-pointer font-bold hover:underline bg-transparent border-none ${linkClass}`}
          >
            开启探索 SIGN UP
          </button>
        </p>
      </div>
    </form>
  );
}
