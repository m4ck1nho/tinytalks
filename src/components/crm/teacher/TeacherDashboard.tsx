'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Clock, DollarSign, AlertCircle, CheckCircle } from 'lucide-react'

export function TeacherDashboard() {
  // Mock data - in real app this would come from Supabase
  const todaysClasses = [
    {
      id: 1,
      time: '10:00',
      student: 'Maria Rodriguez',
      topic: 'Grammar: Past Simple',
      status: 'upcoming'
    },
    {
      id: 2,
      time: '14:00',
      student: 'Ahmed Hassan',
      topic: 'Speaking Practice',
      status: 'completed'
    }
  ]

  const pendingRequests = [
    {
      id: 1,
      student: 'Elena Popova',
      date: '2024-01-23',
      time: '16:00',
      status: 'pending'
    },
    {
      id: 2,
      student: 'James Wilson',
      date: '2024-01-24',
      time: '11:00',
      status: 'pending'
    }
  ]

  const pendingHomework = [
    {
      id: 1,
      student: 'Sofia Kim',
      title: 'Present Perfect Exercises',
      submittedAt: '2024-01-18'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-600">Manage your classes, students, and teaching activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Classes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysClasses.length}</div>
            <p className="text-xs text-muted-foreground">
              {todaysClasses.filter(c => c.status === 'upcoming').length} upcoming
            </p>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingRequests.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting your approval
            </p>
          </CardContent>
        </Card>

        {/* Total Students */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +3 from last month
            </p>
          </CardContent>
        </Card>

        {/* Pending Homework */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Homework to Review</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingHomework.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Submissions waiting
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Today's Schedule
              <Button variant="outline" size="sm" asChild>
                <Link href="/crm/teacher/classes">View Calendar</Link>
              </Button>
            </CardTitle>
            <CardDescription>
              Your classes for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-tinytalks-orange" />
                    <div>
                      <p className="font-medium">{classItem.student}</p>
                      <p className="text-sm text-gray-600">
                        {classItem.time} - {classItem.topic}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    classItem.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {classItem.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Class Requests
              <Button variant="outline" size="sm" asChild>
                <Link href="/crm/teacher/requests">View All</Link>
              </Button>
            </CardTitle>
            <CardDescription>
              Student requests requiring approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-tinytalks-blue" />
                    <div>
                      <p className="font-medium">{request.student}</p>
                      <p className="text-sm text-gray-600">
                        {request.date} at {request.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="text-green-600 border-green-600">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
              {pendingRequests.length === 0 && (
                <p className="text-gray-500 text-center py-4">No pending requests</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Homework Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Homework Submissions
            <Button variant="outline" size="sm" asChild>
              <Link href="/crm/teacher/homework">Review All</Link>
            </Button>
          </CardTitle>
          <CardDescription>
            Homework waiting for your review and feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingHomework.map((homework) => (
              <div key={homework.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-tinytalks-orange" />
                  <div>
                    <p className="font-medium">{homework.title}</p>
                    <p className="text-sm text-gray-600">
                      Submitted by {homework.student} on {homework.submittedAt}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Review
                </Button>
              </div>
            ))}
            {pendingHomework.length === 0 && (
              <p className="text-gray-500 text-center py-4">No homework submissions to review</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common teaching tasks you can do right now
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button asChild className="w-full">
              <Link href="/crm/teacher/requests">
                Review Requests
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/crm/teacher/classes">
                Schedule Class
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/crm/teacher/homework">
                Assign Homework
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/crm/teacher/students">
                Manage Students
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
