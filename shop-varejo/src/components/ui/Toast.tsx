'use client';

import { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number; // ms
}

export function Toast({ message, type = 'success', duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const bgColor = {
    success: 'bg-black',
    error: 'bg-red-500',
    info: 'bg-brand-primary',
  }[type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 right-4 z-50 ${bgColor} text-white font-mono text-sm px-4 py-3 shadow-lg animate-fade-up`}
    >
      {message}
    </div>
  );
}

// Hook para gerenciar toasts
import { useCallback } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: string }>>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const ToastContainer = () => (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className={`${toast.type === 'success' ? 'bg-black' : toast.type === 'error' ? 'bg-red-500' : 'bg-brand-primary'} text-white font-mono text-sm px-4 py-3 shadow-lg animate-fade-up`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );

  return { showToast, ToastContainer };
}
