'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, BookOpen, CreditCard, MessageSquare, Clock, CheckCircle } from 'lucide-react'

export function StudentDashboard() {
  // Mock data - in real app this would come from Supabase
  const upcomingLessons = [
    {
      id: 1,
      date: '2024-01-20',
      time: '14:00',
      topic: 'Grammar: Present Perfect',
      teacher: 'Ms. Johnson'
    },
    {
      id: 2,
      date: '2024-01-22',
      time: '16:00',
      topic: 'Speaking Practice',
      teacher: 'Ms. Johnson'
    }
  ]

  const pendingHomework = [
    {
      id: 1,
      title: 'Present Perfect Exercises',
      dueDate: '2024-01-19',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Vocabulary Review',
      dueDate: '2024-01-21',
      status: 'submitted'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600">Here's what's happening with your English learning.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Upcoming Classes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingLessons.length}</div>
            <p className="text-xs text-muted-foreground">
              Next class: {upcomingLessons[0]?.date}
            </p>
          </CardContent>
        </Card>

        {/* Pending Homework */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Homework</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingHomework.filter(h => h.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingHomework.filter(h => h.status === 'submitted').length} completed this week
            </p>
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Current</div>
            <p className="text-xs text-muted-foreground">
              Next payment due: Feb 1
            </p>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              New messages from teacher
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Upcoming Classes
              <Button variant="outline" size="sm" asChild>
                <Link href="/crm/student/schedule">View All</Link>
              </Button>
            </CardTitle>
            <CardDescription>
              Your next scheduled lessons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingLessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-tinytalks-orange" />
                    <div>
                      <p className="font-medium">{lesson.topic}</p>
                      <p className="text-sm text-gray-600">
                        {lesson.date} at {lesson.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {upcomingLessons.length === 0 && (
                <p className="text-gray-500 text-center py-4">No upcoming classes scheduled</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Homework */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Homework
              <Button variant="outline" size="sm" asChild>
                <Link href="/crm/student/homework">View All</Link>
              </Button>
            </CardTitle>
            <CardDescription>
              Your latest assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingHomework.map((homework) => (
                <div key={homework.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {homework.status === 'submitted' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <BookOpen className="h-5 w-5 text-tinytalks-orange" />
                    )}
                    <div>
                      <p className="font-medium">{homework.title}</p>
                      <p className="text-sm text-gray-600">
                        Due: {homework.dueDate}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    homework.status === 'submitted' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {homework.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks you can do right now
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="w-full">
              <Link href="/crm/student/requests">
                Request New Class
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/crm/student/homework">
                Submit Homework
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/crm/student/payments">
                Make Payment
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
