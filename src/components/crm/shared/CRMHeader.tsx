'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'

export function CRMHeader() {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 rounded-full bg-tinytalks-orange"></div>
          <div>
            <h1 className="text-xl font-semibold text-tinytalks-blue">TinyTalks CRM</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-tinytalks-orange/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-tinytalks-blue" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
