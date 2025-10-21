'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/supabase';
import { 
  ChartBarIcon, 
  EnvelopeIcon, 
  DocumentTextIcon, 
  UsersIcon 
} from '@heroicons/react/24/outline';

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    totalPosts: 0,
    publishedPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch messages stats
        const { data: messages } = await db.getContactMessages();
        const totalMessages = messages?.length || 0;
        const unreadMessages = messages?.filter(m => !m.read).length || 0;

        // Fetch blog posts stats
        const { data: posts } = await db.getBlogPosts();
        const totalPosts = posts?.length || 0;
        const publishedPosts = posts?.filter(p => p.published).length || 0;

        setStats({
          totalMessages,
          unreadMessages,
          totalPosts,
          publishedPosts,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      name: 'Total Messages',
      value: stats.totalMessages,
      icon: EnvelopeIcon,
      color: 'blue',
      description: `${stats.unreadMessages} unread`,
    },
    {
      name: 'Unread Messages',
      value: stats.unreadMessages,
      icon: EnvelopeIcon,
      color: 'red',
      description: 'Require attention',
    },
    {
      name: 'Blog Posts',
      value: stats.totalPosts,
      icon: DocumentTextIcon,
      color: 'green',
      description: `${stats.publishedPosts} published`,
    },
    {
      name: 'Published Posts',
      value: stats.publishedPosts,
      icon: DocumentTextIcon,
      color: 'purple',
      description: 'Live on site',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Google Analytics Embed */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Site Analytics</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Google Analytics Integration
          </p>
          <p className="text-sm text-gray-500 mb-4">
            To view detailed analytics, please add your Google Analytics Measurement ID to the environment variables
            and embed the analytics dashboard here.
          </p>
          <a
            href="https://analytics.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open Google Analytics
          </a>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="/admin/blog"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-center"
          >
            <DocumentTextIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">Create Blog Post</div>
          </a>
          <a
            href="/admin/messages"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-all text-center"
          >
            <EnvelopeIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">View Messages</div>
          </a>
          <a
            href="/"
            target="_blank"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition-all text-center"
          >
            <UsersIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">View Public Site</div>
          </a>
        </div>
      </div>
    </div>
  );
}
