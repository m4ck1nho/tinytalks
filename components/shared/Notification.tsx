'use client';

import { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface NotificationProps {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  onClose: () => void;
  duration?: number;
}

export default function Notification({ type, title, message, onClose, duration = 5000 }: NotificationProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100',
      border: 'border-green-300',
      icon: 'text-green-600',
      title: 'text-green-900',
      Icon: CheckCircleIcon,
    },
    error: {
      bg: 'bg-gradient-to-br from-red-50 to-red-100',
      border: 'border-red-300',
      icon: 'text-red-600',
      title: 'text-red-900',
      Icon: XCircleIcon,
    },
    info: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      border: 'border-blue-300',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      Icon: InformationCircleIcon,
    },
    warning: {
      bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      border: 'border-yellow-300',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      Icon: ExclamationTriangleIcon,
    },
  };

  const style = styles[type];
  const Icon = style.Icon;

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slide-in-right">
      <div className={`${style.bg} border ${style.border} rounded-2xl shadow-2xl p-4 max-w-md min-w-[320px] backdrop-blur-xl`}>
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-10 h-10 ${style.bg} rounded-full flex items-center justify-center border ${style.border}`}>
            <Icon className={`w-6 h-6 ${style.icon}`} />
          </div>
          <div className="flex-1 pt-0.5">
            <h4 className={`font-bold ${style.title} mb-1`}>{title}</h4>
            {message && (
              <p className="text-sm text-gray-700">{message}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

