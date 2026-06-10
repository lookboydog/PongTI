import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthFormThemeMode } from '../types';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface NotificationToastProps {
  message: ToastMessage | null;
  onClose: () => void;
  theme: AuthFormThemeMode;
}

export default function NotificationToast({ message, onClose, theme }: NotificationToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm pointer-events-none">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`pointer-events-auto p-4 rounded-xl flex items-start gap-3 shadow-2xl border ${
              theme === 'DARK'
                ? 'bg-slate-900/90 text-white border-white/10 backdrop-blur-md'
                : 'bg-white/90 text-slate-900 border-slate-200/50 backdrop-blur-md'
            }`}
          >
            <div className="mt-0.5 select-none">
              {message.type === 'success' && (
                <span className={`material-symbols-outlined !text-[20px] ${theme === 'DARK' ? 'text-green-400' : 'text-emerald-600'}`}>
                  check_circle
                </span>
              )}
              {message.type === 'error' && (
                <span className="material-symbols-outlined !text-[20px] text-red-500">
                  error
                </span>
              )}
              {message.type === 'info' && (
                <span className={`material-symbols-outlined !text-[20px] ${theme === 'DARK' ? 'text-cyan-400' : 'text-blue-600'}`}>
                  info
                </span>
              )}
            </div>
            <div className="flex-grow">
              <p className="font-sans text-sm font-medium leading-relaxed">
                {message.text}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined !text-[16px]">close</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
