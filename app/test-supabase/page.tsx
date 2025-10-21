'use client';

import { useEffect, useState } from 'react';
import { supabaseClient as supabase } from '@/lib/supabase';

export default function TestSupabase() {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [message, setMessage] = useState('Testing Supabase connection...');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test 1: Check if Supabase client is initialized
      console.log('Test 1: Checking Supabase client...');
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }
      console.log('✅ Supabase client initialized');

      // Test 2: Try to query blog_posts table
      console.log('Test 2: Querying blog_posts table...');
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .limit(1);

      if (error) {
        console.error('❌ Database error:', error);
        setStatus('error');
        setMessage('Database query failed');
        setDetails(error);
        return;
      }

      console.log('✅ Database query successful');
      setStatus('success');
      setMessage('Supabase connection working!');
      setDetails({
        postsFound: data?.length || 0,
        message: 'Connection successful! Your Supabase is properly configured.',
      });
    } catch (error: any) {
      console.error('❌ Connection test failed:', error);
      setStatus('error');
      setMessage('Connection failed');
      setDetails(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>

        <div className={`p-6 rounded-lg mb-6 ${
          status === 'testing' ? 'bg-blue-100' :
          status === 'success' ? 'bg-green-100' :
          'bg-red-100'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            {status === 'testing' && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            )}
            {status === 'success' && (
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {status === 'error' && (
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <h2 className="text-xl font-semibold">{message}</h2>
          </div>
        </div>

        {details && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Details:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(details, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 space-y-4">
          <h3 className="font-semibold">Checklist:</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span>1.</span>
              <span>Created Supabase project at supabase.com</span>
            </li>
            <li className="flex items-start gap-2">
              <span>2.</span>
              <span>Added NEXT_PUBLIC_SUPABASE_URL to .env.local</span>
            </li>
            <li className="flex items-start gap-2">
              <span>3.</span>
              <span>Added NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local</span>
            </li>
            <li className="flex items-start gap-2">
              <span>4.</span>
              <span>Ran the SQL script in Supabase SQL Editor</span>
            </li>
            <li className="flex items-start gap-2">
              <span>5.</span>
              <span>Restarted dev server (npm run dev)</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Homepage
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Test Again
          </button>
        </div>
      </div>
    </div>
  );
}

