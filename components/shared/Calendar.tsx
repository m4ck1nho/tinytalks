'use client';

import { useState, useEffect } from 'react';
import { Class, PaymentNotification } from '@/types';
import { formatTime } from '@/lib/dateUtils';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';
import DailyScheduleView from './DailyScheduleView';

interface CalendarProps {
  classes: Class[];
  payments?: PaymentNotification[];
}

interface DayDetails {
  date: Date;
  classes: Class[];
  payments: PaymentNotification[];
}

export default function Calendar({ classes, payments = [] }: CalendarProps) {
  const { t, language } = useLanguage();
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayDetails | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date());
  }, []);

  const monthNames = language === 'ru' 
    ? ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = language === 'ru'
    ? ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  // Include all classes, including pending_payment
  const getClassesForDay = (day: number) => {
    if (!currentDate) return [];
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return classes.filter(c => {
      const classDate = new Date(c.class_date);
      return isSameDay(classDate, targetDate);
    });
  };

  const getPaymentsForDay = (day: number) => {
    if (!currentDate) return [];
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return payments.filter(p => {
      const paymentDate = new Date(p.payment_date);
      return isSameDay(paymentDate, targetDate);
    });
  };

  const handleDayClick = (day: number) => {
    if (!currentDate) return;
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayClasses = getClassesForDay(day);
    const dayPayments = getPaymentsForDay(day);

    // Always open day view, even if no events
    setSelectedDay({
      date: targetDate,
      classes: dayClasses,
      payments: dayPayments,
    });
  };

  const previousMonth = () => {
    if (!currentDate) return;
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    if (!currentDate) return;
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const renderCalendar = () => {
    if (!mounted || !currentDate) return null;
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const today = currentDate;

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayClasses = getClassesForDay(day);
      const dayPayments = getPaymentsForDay(day);
      const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = isSameDay(currentDayDate, today);
      const hasEvents = dayClasses.length > 0 || dayPayments.length > 0;
      
      // Check if there are unpaid classes
      const hasUnpaidClasses = dayClasses.some(c => 
        c.payment_status === 'unpaid' || 
        c.payment_status === 'pending' || 
        c.status === 'pending_payment'
      );
      const hasScheduledClasses = dayClasses.some(c => c.status === 'scheduled');

      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={`h-24 border border-gray-200 p-2 transition-all cursor-pointer hover:shadow-md ${
            hasUnpaidClasses 
              ? 'bg-red-50/50 hover:bg-red-50' 
              : hasScheduledClasses 
              ? 'bg-blue-50/30 hover:bg-blue-50' 
              : hasEvents 
              ? 'bg-blue-50/30 hover:bg-blue-50' 
              : 'bg-white hover:bg-gray-50'
          } ${isToday ? 'ring-2 ring-primary-500' : ''}`}
        >
          <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-primary-600' : 'text-gray-700'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayClasses.slice(0, 2).map((c, idx) => {
              // Color code: red for unpaid/pending, blue for scheduled (regardless of payment), blue for others
              const isUnpaid = c.payment_status === 'unpaid' || c.payment_status === 'pending' || c.status === 'pending_payment';
              const isScheduled = c.status === 'scheduled';
              const bgColor = isUnpaid ? 'bg-red-100 text-red-800' : isScheduled ? 'bg-blue-100 text-blue-800' : 'bg-blue-100 text-blue-800';
              
              return (
                <div key={idx} className={`text-xs px-1 py-0.5 ${bgColor} rounded truncate`}>
                  {mounted ? formatTime(c.class_date) : '--:--'} - {c.student_name}
                </div>
              );
            })}
            {dayPayments.slice(0, 1).map((p, idx) => (
              <div key={idx} className="text-xs px-1 py-0.5 bg-green-100 text-green-800 rounded truncate">
                ₽{p.amount} - {p.student_name}
              </div>
            ))}
            {(dayClasses.length + dayPayments.length) > 3 && (
              <div className="text-xs text-gray-500 font-semibold">
                +{dayClasses.length + dayPayments.length - 3} {t('calendar.more')}
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CalendarIcon className="w-7 h-7 text-primary-500" />
          {t('calendar.title')}
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-lg font-semibold text-gray-900 min-w-[150px] text-center">
            {currentDate ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}` : ''}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-0 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
        {renderCalendar()}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
          <span className="text-gray-600">{t('calendar.legend.scheduledClasses')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
          <span className="text-gray-600">{t('calendar.legend.unpaidClasses')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-gray-600">{t('calendar.legend.payments')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 ring-2 ring-primary-500 rounded"></div>
          <span className="text-gray-600">{t('calendar.legend.today')}</span>
        </div>
      </div>

      {/* Day Details Modal - Daily Schedule */}
      {selectedDay && (
        <DailyScheduleView
          date={selectedDay.date}
          classes={selectedDay.classes}
          payments={selectedDay.payments}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}

