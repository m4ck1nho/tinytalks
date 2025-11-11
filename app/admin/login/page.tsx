'use client';

import { useState } from 'react';
import { auth } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('dummy')) {
        setError('Supabase is not configured. Please check your environment variables.');
        setLoading(false);
        console.error('Supabase configuration error:', { supabaseUrl, supabaseKey });
        return;
      }

      console.log('Attempting to sign in...');
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        console.error('Auth error:', error);
        throw error;
      }
      
      console.log('Sign in successful, checking user role...');
      
      // Verify user is admin
      const userRole = data?.user?.user_metadata?.role || 'student';
      if (userRole !== 'admin') {
        await auth.signOut();
        setError('Access denied. Only administrators can access this panel.');
        setLoading(false);
        return;
      }
      
      console.log('Admin verified, redirecting...');
      router.push('/admin/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Invalid email or password';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.toString().includes('Failed to fetch')) {
        errorMessage = 'Failed to connect to server. Please check your internet connection and Supabase configuration.';
      } else if (error?.toString().includes('Network')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-800 rounded-xl font-bold text-2xl text-white mb-4">
              TT
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2">Sign in to access the admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="admin@tinytalks.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <Link href="/" className="text-primary-500 hover:underline">
              ← Back to main site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
