'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';
import { Class, PaymentNotification } from '@/types';
import ScheduleManager from '@/components/admin/ScheduleManager';
import HomeworkManager from '@/components/admin/HomeworkManager';
import PaymentManager from '@/components/admin/PaymentManager';
import Calendar from '@/components/shared/Calendar';
import { 
  CalendarIcon, 
  BookOpenIcon, 
  CurrencyDollarIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

type Tab = 'calendar' | 'schedule' | 'homework' | 'payments';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('calendar');
  const [classes, setClasses] = useState<Class[]>([]);
  const [payments, setPayments] = useState<PaymentNotification[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: classesData } = await db.getClasses();
    const { data: paymentsData } = await db.getPaymentNotifications();
    
    setClasses(classesData || []);
    setPayments(paymentsData || []);
  };

  const tabs = [
    { id: 'calendar' as Tab, name: 'Calendar', icon: CalendarDaysIcon },
    { id: 'schedule' as Tab, name: 'Classes', icon: CalendarIcon },
    { id: 'homework' as Tab, name: 'Homework', icon: BookOpenIcon },
    { id: 'payments' as Tab, name: 'Payments', icon: CurrencyDollarIcon },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Dashboard</h1>
        <p className="text-gray-600">Manage your classes, homework, and payments</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-primary-500 border-primary-500'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'calendar' && <Calendar classes={classes} payments={payments} />}
        {activeTab === 'schedule' && <ScheduleManager />}
        {activeTab === 'homework' && <HomeworkManager />}
        {activeTab === 'payments' && <PaymentManager />}
      </div>
    </div>
  );
}

