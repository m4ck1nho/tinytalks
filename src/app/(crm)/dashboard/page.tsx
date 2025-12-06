'use client'

import { useAuth } from '@/hooks/useAuth'
import { StudentDashboard } from '@/components/crm/student/StudentDashboard'
import { TeacherDashboard } from '@/components/crm/teacher/TeacherDashboard'

export default function DashboardPage() {
  const { user } = useAuth()
  
  // Mock user role - in real app this would come from the database
  const userRole = 'student' // This should be fetched from user profile

  if (userRole === 'teacher') {
    return <TeacherDashboard />
  }

  return <StudentDashboard />
}
