'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { LogOut, User } from 'lucide-react'

export function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/tinytalkslogo.png"
            alt="TinyTalks Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-xl font-bold text-tinytalks-blue">TinyTalks</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            href="/#about" 
            className="text-sm font-medium text-gray-600 hover:text-tinytalks-blue transition-colors"
          >
            About Us
          </Link>
          <Link 
            href="/#courses" 
            className="text-sm font-medium text-gray-600 hover:text-tinytalks-blue transition-colors"
          >
            Courses
          </Link>
          <Link 
            href="/blog" 
            className="text-sm font-medium text-gray-600 hover:text-tinytalks-blue transition-colors"
          >
            Blog
          </Link>
          <Link 
            href="/#contact" 
            className="text-sm font-medium text-gray-600 hover:text-tinytalks-blue transition-colors"
          >
            Contact Us
          </Link>
          
          {/* Language Switcher */}
          <select className="text-sm bg-transparent border-none cursor-pointer text-gray-600">
            <option value="en">EN</option>
            <option value="ru">RU</option>
          </select>
        </div>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="bg-tinytalks-orange hover:bg-tinytalks-orange/90">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
