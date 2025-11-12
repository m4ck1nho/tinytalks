'use client';

import { useState } from 'react';
import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

interface BlogSubscribeFormProps {
  variant?: 'default' | 'inline' | 'compact';
  className?: string;
}

export default function BlogSubscribeForm({ variant = 'default', className = '' }: BlogSubscribeFormProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/blog/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name: name || undefined }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setSuccess(true);
      setEmail('');
      setName('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 ${className}`}>
        <div className="flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('blog.subscribe.emailPlaceholder') || 'Enter your email'}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
            disabled={loading || success}
          />
        </div>
        <button
          type="submit"
          disabled={loading || success}
          className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? (t('blog.subscribe.subscribing') || 'Subscribing...') : (t('blog.subscribe.button') || 'Subscribe')}
        </button>
        {success && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 rounded-lg">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircleIcon className="w-5 h-5" />
              <span className="font-semibold">{t('blog.subscribe.success') || 'Subscribed!'}</span>
            </div>
          </div>
        )}
      </form>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-6 ${className}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-secondary-900 mb-2">
              {t('blog.subscribe.title') || 'Subscribe to Blog Updates'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('blog.subscribe.emailPlaceholder') || 'Enter your email'}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
              disabled={loading || success}
            />
          </div>
          {success ? (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircleIcon className="w-5 h-5" />
              <span className="font-semibold">{t('blog.subscribe.success') || 'Successfully subscribed!'}</span>
            </div>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (t('blog.subscribe.subscribing') || 'Subscribing...') : (t('blog.subscribe.button') || 'Subscribe')}
            </button>
          )}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
        </form>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-8 ${className}`}>
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <EnvelopeIcon className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-secondary-900 mb-2">
          {t('blog.subscribe.title') || 'Subscribe to Blog Updates'}
        </h3>
        <p className="text-gray-600 mb-6">
          {t('blog.subscribe.description') || 'Get notified when we publish new articles and tips!'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('blog.subscribe.namePlaceholder') || 'Your name (optional)'}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
              disabled={loading || success}
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('blog.subscribe.emailPlaceholder') || 'Enter your email'}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
              disabled={loading || success}
            />
          </div>
          
          {success ? (
            <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
              <CheckCircleIcon className="w-5 h-5" />
              <span className="font-semibold">{t('blog.subscribe.success') || 'Successfully subscribed!'}</span>
            </div>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (t('blog.subscribe.subscribing') || 'Subscribing...') : (t('blog.subscribe.button') || 'Subscribe')}
            </button>
          )}
          
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg text-left">
              {error}
            </div>
          )}
        </form>

        <p className="text-xs text-gray-500 mt-4">
          {t('blog.subscribe.privacy') || 'We respect your privacy. Unsubscribe at any time.'}
        </p>
      </div>
    </div>
  );
}

