'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/supabase';
import { Class, PaymentNotification, ClassRequest } from '@/types';
import ScheduleManager from '@/components/admin/ScheduleManager';
import HomeworkManager from '@/components/admin/HomeworkManager';
import PaymentManager from '@/components/admin/PaymentManager';
import AvailabilityManager from '@/components/admin/AvailabilityManager';
import Calendar from '@/components/shared/Calendar';
import { 
  CalendarIcon, 
  BookOpenIcon, 
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

type Tab = 'calendar' | 'schedule' | 'availability' | 'homework' | 'payments';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('calendar');
  const [classes, setClasses] = useState<Class[]>([]);
  const [payments, setPayments] = useState<PaymentNotification[]>([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(0);

  const fetchData = useCallback(async () => {
    const { data: classesData } = await db.getClasses();
    const { data: paymentsData } = await db.getPaymentNotifications();
    const { data: requestsData } = await db.getClassRequests();
    
    setClasses(classesData || []);
    setPayments(paymentsData || []);
    
    // Count pending items
    const pendingRequests = (requestsData || []).filter((r: ClassRequest) => 
      r.status === 'pending' || r.status === 'teacher_edited' || r.status === 'awaiting_payment'
    ).length;
    const pendingPayments = (paymentsData || []).filter((p: PaymentNotification) => p.status === 'pending').length;
    
    setPendingRequestsCount(pendingRequests);
    setPendingPaymentsCount(pendingPayments);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const classesSubscription = db.subscribeToClasses(fetchData);
    const paymentsSubscription = db.subscribeToPaymentNotifications(fetchData);
    const requestsSubscription = db.subscribeToClassRequests(fetchData);

    return () => {
      classesSubscription?.unsubscribe?.();
      paymentsSubscription?.unsubscribe?.();
      requestsSubscription?.unsubscribe?.();
    };
  }, [fetchData]);

  const tabs = [
    { id: 'calendar' as Tab, name: 'Calendar', icon: CalendarDaysIcon },
    { id: 'schedule' as Tab, name: 'Classes', icon: CalendarIcon },
    { id: 'availability' as Tab, name: 'Availability', icon: ClockIcon },
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
                className={`relative flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-primary-500 border-primary-500'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.name}
                {/* Badge for pending items */}
                {tab.id === 'schedule' && pendingRequestsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full shadow-lg shadow-red-500/50 animate-pulse">
                    {pendingRequestsCount}
                  </span>
                )}
                {tab.id === 'payments' && pendingPaymentsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white text-xs font-bold rounded-full shadow-lg shadow-yellow-500/50 animate-pulse">
                    {pendingPaymentsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'calendar' && <Calendar classes={classes} payments={payments} />}
        {activeTab === 'schedule' && <ScheduleManager onDataChange={fetchData} />}
        {activeTab === 'availability' && <AvailabilityManager />}
        {activeTab === 'homework' && <HomeworkManager />}
        {activeTab === 'payments' && <PaymentManager onDataChange={fetchData} />}
      </div>
    </div>
  );
}

