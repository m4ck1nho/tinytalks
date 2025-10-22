'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpenIcon, 
  CalendarIcon, 
  ChatBubbleBottomCenterTextIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';

export default function UserDashboard() {
  const [user, setUser] = useState<{ email?: string; user_metadata?: { full_name?: string } } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        router.push('/auth');
      } else {
        // Check if user is admin, redirect to admin dashboard
        const userRole = user.user_metadata?.role || 'student';
        if (userRole === 'admin') {
          router.push('/admin/dashboard');
          return;
        }
        setUser(user);
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-800 rounded-lg flex items-center justify-center font-bold text-white">
                  TT
                </div>
                <span className="text-xl font-bold text-gray-900">TinyTalks</span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-500 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-800 rounded-full flex items-center justify-center">
              <UserCircleIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}!</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpenIcon className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Lessons</h3>
            <p className="text-gray-600 text-sm mb-4">View your upcoming and completed lessons</p>
            <button className="text-primary-500 font-semibold hover:underline">
              View Lessons →
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
              <CalendarIcon className="w-6 h-6 text-secondary-900" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule</h3>
            <p className="text-gray-600 text-sm mb-4">Book your next English lesson</p>
            <button className="text-primary-500 font-semibold hover:underline">
              Book Lesson →
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Messages</h3>
            <p className="text-gray-600 text-sm mb-4">Chat with your teacher</p>
            <button className="text-primary-500 font-semibold hover:underline">
              View Messages →
            </button>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Journey</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
                <span className="text-sm font-semibold text-primary-500">Level: Beginner</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-primary-400 to-secondary-800 h-3 rounded-full" style={{ width: '35%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">35% to B1 Level</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-3xl font-bold text-primary-500 mb-1">12</div>
                <div className="text-sm text-gray-600">Lessons Completed</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-3xl font-bold text-secondary-900 mb-1">24</div>
                <div className="text-sm text-gray-600">Hours of Learning</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-600 mb-1">89%</div>
                <div className="text-sm text-gray-600">Assignment Score</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-3xl font-bold text-primary-500 mb-1">15</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-primary-500 to-secondary-900 rounded-2xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-2">Ready for your next lesson?</h3>
          <p className="mb-6 opacity-90">Continue your English learning journey today!</p>
          <button className="bg-white text-primary-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300">
            Book a Lesson
          </button>
        </div>
      </main>
    </div>
  );
}

