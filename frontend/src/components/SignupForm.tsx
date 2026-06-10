import React, { useState } from 'react';
import { sendVerificationCode, signupUser } from '../api/auth';
import { AuthFormThemeMode, ActiveForm } from '../types';

interface SignupFormProps {
  theme: AuthFormThemeMode;
  onFormSwitch: (form: ActiveForm) => void;
  showNotification: (text: string, type: 'success' | 'error' | 'info') => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

export default function SignupForm({
  theme,
  onFormSwitch,
  showNotification,
  isLoading,
  setIsLoading,
}: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [codeSending, setCodeSending] = useState(false);
  const [countdown, setCountdown] = useState(0);

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

  const checkClass = theme === 'DARK'
    ? 'border-white/20 bg-black/40 text-[#425e94] focus:ring-0'
    : 'border-[#f1e3a9] bg-white text-[#685e31] focus:ring-0';

  const secondaryBtnClass = theme === 'DARK'
    ? 'bg-slate-800/60 border-white/10 text-[#adc6ff] hover:bg-slate-700/60'
    : 'bg-white/60 border-[#f1e3a9]/60 text-[#685e31] hover:bg-white';

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async () => {
    if (!email.trim()) {
      showNotification('请先填写邮箱地址', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('请输入格式正确的邮箱地址', 'error');
      return;
    }

    setCodeSending(true);
    try {
      const message = await sendVerificationCode({ email: email.trim() });
      showNotification(message, 'success');
      startCountdown();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '验证码发送失败';
      showNotification(msg, 'error');
    } finally {
      setCodeSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      showNotification('请输入您的真实姓名或绰号 Name', 'error');
      return;
    }
    if (!email) {
      showNotification('请输入您的电子邮箱 Email', 'error');
      return;
    }
    if (!verificationCode) {
      showNotification('请输入邮箱验证码', 'error');
      return;
    }
    if (!password) {
      showNotification('请输入安全密码 Password', 'error');
      return;
    }
    if (password.length < 6) {
      showNotification('安全密码长度不得低于 6 位', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showNotification('两次输入的密码不一致，请检查', 'error');
      return;
    }
    if (!acceptTerms) {
      showNotification('请阅读并勾选同意 InnerSpectrum 服务条款与隐私协议', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const message = await signupUser({
        email: email.trim(),
        password,
        name,
        verificationCode: verificationCode.trim(),
      });
      showNotification(message || '✨ 注册成功！欢迎加入内蕴光谱领域，请登录。', 'success');
      onFormSwitch('LOGIN');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '注册失败，请稍后重试';
      showNotification(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 mt-3 w-full animate-fadeIn" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5 animate-fadeIn">
        <label className={`text-xs font-semibold tracking-wider flex justify-between items-center px-1 ${labelClass}`}>
          <span>您的名称 NAME</span>
          <span className="material-symbols-outlined text-[15px] opacity-65">badge</span>
        </label>
        <div className={`relative rounded-xl overflow-hidden border transition-all duration-300 w-full ${inputWrapperClass}`}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent border-none text-sm font-sans py-3.5 px-4 text-current outline-none focus:ring-0 focus:outline-none"
            placeholder={theme === 'DARK' ? 'e.g. Voyager' : 'Your magical avatar nickname'}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={`text-xs font-semibold tracking-wider flex justify-between items-center px-1 ${labelClass}`}>
          <span>邮箱地址 EMAIL</span>
          <span className="material-symbols-outlined text-[15px] opacity-65">alternate_email</span>
        </label>
        <div className={`relative rounded-xl overflow-hidden border transition-all duration-300 w-full ${inputWrapperClass}`}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-none text-sm font-sans py-3.5 px-4 text-current outline-none focus:ring-0 focus:outline-none"
            placeholder={theme === 'DARK' ? 'username@spectrum.com' : 'traveler@mystic.com'}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={`text-xs font-semibold tracking-wider flex justify-between items-center px-1 ${labelClass}`}>
          <span>邮箱验证码 CODE</span>
          <span className="material-symbols-outlined text-[15px] opacity-65">mark_email_read</span>
        </label>
        <div className="flex gap-2">
          <div className={`relative rounded-xl overflow-hidden border transition-all duration-300 flex-1 ${inputWrapperClass}`}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-transparent border-none text-sm font-sans py-3.5 px-4 text-current tracking-widest outline-none focus:ring-0 focus:outline-none"
              placeholder="6 位验证码"
            />
          </div>
          <button
            type="button"
            disabled={codeSending || countdown > 0}
            onClick={handleSendCode}
            className={`shrink-0 px-4 py-3 rounded-xl text-xs font-bold border transition-all ${secondaryBtnClass} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {codeSending ? '发送中...' : countdown > 0 ? `${countdown}s` : '获取验证码'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={`text-xs font-semibold tracking-wider flex justify-between items-center px-1 ${labelClass}`}>
          <span>设置密码 PASSWORD</span>
          <span className="material-symbols-outlined text-[15px] opacity-65">lock</span>
        </label>
        <div className={`relative rounded-xl overflow-hidden border transition-all duration-300 w-full ${inputWrapperClass}`}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-none text-sm font-sans py-3.5 px-4 text-current tracking-wide outline-none focus:ring-0 focus:outline-none"
            placeholder={theme === 'DARK' ? '••••••••' : 'minimum 6 characters'}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={`text-xs font-semibold tracking-wider flex justify-between items-center px-1 ${labelClass}`}>
          <span>确认密码 RE-ENTER</span>
          <span className="material-symbols-outlined text-[15px] opacity-65">lock_reset</span>
        </label>
        <div className={`relative rounded-xl overflow-hidden border transition-all duration-300 w-full ${inputWrapperClass}`}>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-transparent border-none text-sm font-sans py-3.5 px-4 text-current tracking-wide outline-none focus:ring-0 focus:outline-none"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="flex items-start gap-2.5 px-1 my-1 select-none">
        <input
          type="checkbox"
          id="acceptTerms"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className={`mt-0.5 rounded w-4 h-4 cursor-pointer transition-all ${checkClass}`}
        />
        <label htmlFor="acceptTerms" className="text-xs text-slate-500 dark:text-slate-400 font-sans cursor-pointer leading-relaxed">
          {theme === 'DARK' ? (
            <span>
              我同意并接受 <span className="text-[#adc6ff] underline hover:text-white">《生命光谱探索守则》</span> 与 <span className="text-[#adc6ff] underline hover:text-white">《隐私条款》</span>
            </span>
          ) : (
            <span>
              同意并签订 <span className="text-[#685e31] font-bold underline">《生命光谱探索守则》</span> 协议文件
            </span>
          )}
        </label>
      </div>

      <div className="pt-1.5 w-full">
        <button
          type="submit"
          disabled={isLoading}
          className={`cursor-pointer w-full py-4 rounded-full font-bold text-sm tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2 ${btnClass}`}
        >
          {isLoading ? (
            <span className={`w-5 h-5 border-2 rounded-full animate-spin ${theme === 'DARK' ? 'border-white border-t-transparent' : 'border-[#685e31] border-t-transparent'}`} />
          ) : (
            <>
              <span>立即注册 SIGN UP</span>
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-2 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400 tracking-wide leading-relaxed">
          已有账号?{' '}
          <button
            type="button"
            onClick={() => onFormSwitch('LOGIN')}
            className={`cursor-pointer font-bold hover:underline bg-transparent border-none ${linkClass}`}
          >
            登入领域 SIGN IN
          </button>
        </p>
      </div>
    </form>
  );
}
