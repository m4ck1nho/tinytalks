'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/supabase';
import Link from 'next/link';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If on login page, skip auth check
    if (pathname === '/admin/login') {
      setLoading(false);
      setAuthenticated(false);
      return;
    }

    // Check current session with timeout
    let authCheckComplete = false;
    const timeoutId = setTimeout(() => {
      if (!authCheckComplete) {
        console.warn('Auth check timeout, showing login page');
        setLoading(false);
        setAuthenticated(false);
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      }
    }, 5000); // 5 second timeout

    auth.getUser().then(({ data: { user }, error }) => {
      authCheckComplete = true;
      clearTimeout(timeoutId);
      
      if (error) {
        console.error('Auth error:', error);
        setLoading(false);
        setAuthenticated(false);
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
        return;
      }

      if (user && 'email' in user) {
        // Check if user is admin
        const userRole = user.user_metadata?.role || 'student';
        if (userRole !== 'admin') {
          // Not an admin, redirect to student dashboard
          router.push('/dashboard');
          setLoading(false);
          return;
        }
        setAuthenticated(true);
        setUserEmail((user as { email?: string | null }).email || '');
        setLoading(false);
      } else {
        setAuthenticated(false);
        setLoading(false);
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      }
    }).catch((error) => {
      authCheckComplete = true;
      clearTimeout(timeoutId);
      console.error('Auth check failed:', error);
      setLoading(false);
      setAuthenticated(false);
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((user) => {
      if (pathname === '/admin/login') {
        return; // Don't handle auth changes on login page
      }

      if (user && typeof user === 'object' && 'email' in user) {
        // Check if user is admin
        const userRole = (user as { user_metadata?: { role?: string } }).user_metadata?.role || 'student';
        if (userRole !== 'admin') {
          // Not an admin, redirect to student dashboard
          router.push('/dashboard');
          return;
        }
        setAuthenticated(true);
        setUserEmail((user as { email?: string | null }).email || '');
        setLoading(false);
      } else {
        setAuthenticated(false);
        setLoading(false);
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      }
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [router, pathname]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Blog Posts', href: '/admin/blog', icon: DocumentTextIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authenticated && pathname !== '/admin/login') {
    return null;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-lg"
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center font-bold">
                TT
              </div>
              <div>
                <div className="font-bold text-lg">TinyTalks</div>
                <div className="text-sm text-gray-400">Admin Panel</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-800">
            <div className="mb-3 px-4 py-2 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-400">Logged in as</div>
              <div className="text-sm font-medium truncate">{userEmail || 'Admin'}</div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        <div className="p-8">
          {children}
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
