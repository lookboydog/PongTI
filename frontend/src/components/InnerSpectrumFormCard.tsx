import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveForm, AuthFormThemeMode, AuthUser } from '../types';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import NotificationToast, { ToastMessage } from './NotificationToast';

interface InnerSpectrumFormCardProps {
  /** 由全站导航栏主题切换控制 */
  theme: AuthFormThemeMode;
  onLoginSuccess: (user: AuthUser) => void;
}

export default function InnerSpectrumFormCard({
  theme,
  onLoginSuccess,
}: InnerSpectrumFormCardProps) {
  const [activeForm, setActiveForm] = useState<ActiveForm>('LOGIN');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showNotification = (
    text: string,
    type: 'success' | 'error' | 'info',
  ) => {
    setToast({
      id: Math.random().toString(),
      type,
      text,
    });
  };

  return (
    <div className="w-full max-w-[460px] relative p-1 z-10 font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={`auth-${theme}-${activeForm}`}
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -15 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`w-full transition-all duration-500 overflow-hidden relative border ${
            theme === "DARK"
              ? "glass-card-dark rounded-[24px] p-8 md:p-10 shadow-[0_24px_50px_rgba(0,0,0,0.4)]"
              : "glass-card-light rounded-[24px] p-8 md:p-10 shadow-[0_20px_40px_rgba(104,94,49,0.06)]"
          }`}
        >
          <div className="text-center flex flex-col mb-4">
            {theme === "DARK" ? (
              <>
                <h1 className="font-manrope text-xl font-bold text-[#adc6ff] tracking-tight">
                  {activeForm === "LOGIN" && "登录 LOGIN"}
                  {activeForm === "SIGNUP" && "立刻注册 SIGN UP"}
                  {activeForm === "FORGOT_PASSWORD" && "密码重置 RESET"}
                </h1>
                <p className="font-sans text-xs text-slate-400 mt-1.5">
                  {activeForm === "LOGIN" && "当前是深色主题色的登入界面"}
                  {activeForm === "SIGNUP" && "当前是深色主题色的注册界面"}
                  {activeForm === "FORGOT_PASSWORD" &&
                    "请注意你邮箱中的重置链接"}
                </p>
              </>
            ) : (
              <>
                <h1 className="font-playfair text-xl font-semibold text-[#685e31]">
                  {activeForm === "LOGIN" && "登入 LOGIN"}
                  {activeForm === "SIGNUP" && "立刻注册 SIGN UP"}
                  {activeForm === "FORGOT_PASSWORD" && "密码重置 RESET"}
                </h1>
                <p className="font-sans text-xs text-slate-500 mt-1.5 font-medium leading-relaxed">
                  {activeForm === "LOGIN" && "当前是亮色主题色的登入界面"}
                  {activeForm === "SIGNUP" && "当前是亮色主题色的注册界面"}
                  {activeForm === "FORGOT_PASSWORD" &&
                    "请注意你邮箱中的重置链接"}
                </p>
              </>
            )}
          </div>

          {activeForm === "LOGIN" && (
            <LoginForm
              theme={theme}
              onFormSwitch={setActiveForm}
              onLoginSuccess={onLoginSuccess}
              showNotification={showNotification}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}

          {activeForm === "SIGNUP" && (
            <SignupForm
              theme={theme}
              onFormSwitch={setActiveForm}
              showNotification={showNotification}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}

          {activeForm === "FORGOT_PASSWORD" && (
            <ForgotPasswordForm
              theme={theme}
              onFormSwitch={setActiveForm}
              showNotification={showNotification}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <NotificationToast
        message={toast}
        onClose={() => setToast(null)}
        theme={theme}
      />
    </div>
  );
}
