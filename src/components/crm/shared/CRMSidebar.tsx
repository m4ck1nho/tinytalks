'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Calendar,
  Users,
  BookOpen,
  CreditCard,
  MessageSquare,
  Settings,
  UserPlus
} from 'lucide-react'

export function CRMSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  // Mock user role - in real app this would come from the database
  const userRole = 'student' // This should be fetched from user profile

  const studentNavItems = [
    { href: '/crm/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/crm/student/schedule', label: 'My Schedule', icon: Calendar },
    { href: '/crm/student/requests', label: 'Class Requests', icon: UserPlus },
    { href: '/crm/student/homework', label: 'Homework', icon: BookOpen },
    { href: '/crm/student/payments', label: 'Payments', icon: CreditCard },
    { href: '/crm/student/settings', label: 'Settings', icon: Settings },
  ]

  const teacherNavItems = [
    { href: '/crm/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/crm/teacher/classes', label: 'My Classes', icon: Calendar },
    { href: '/crm/teacher/students', label: 'Students', icon: Users },
    { href: '/crm/teacher/requests', label: 'Requests', icon: UserPlus },
    { href: '/crm/teacher/homework', label: 'Homework', icon: BookOpen },
    { href: '/crm/teacher/payments', label: 'Payments', icon: CreditCard },
    { href: '/crm/teacher/messages', label: 'Messages', icon: MessageSquare },
    { href: '/crm/teacher/settings', label: 'Settings', icon: Settings },
  ]

  const navItems = userRole === 'teacher' ? teacherNavItems : studentNavItems

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-tinytalks-orange/10 text-tinytalks-orange'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
