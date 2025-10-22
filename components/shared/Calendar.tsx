'use client';

import { useState } from 'react';
import { Class, PaymentNotification } from '@/types';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

interface CalendarProps {
  classes: Class[];
  payments?: PaymentNotification[];
  isAdmin?: boolean;
}

interface DayDetails {
  date: Date;
  classes: Class[];
  payments: PaymentNotification[];
}

export default function Calendar({ classes, payments = [], isAdmin = false }: CalendarProps) {
  const { t, language } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayDetails | null>(null);

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

  const getClassesForDay = (day: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return classes.filter(c => {
      const classDate = new Date(c.class_date);
      return isSameDay(classDate, targetDate);
    });
  };

  const getPaymentsForDay = (day: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return payments.filter(p => {
      const paymentDate = new Date(p.payment_date);
      return isSameDay(paymentDate, targetDate);
    });
  };

  const handleDayClick = (day: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayClasses = getClassesForDay(day);
    const dayPayments = getPaymentsForDay(day);

    if (dayClasses.length > 0 || dayPayments.length > 0) {
      setSelectedDay({
        date: targetDate,
        classes: dayClasses,
        payments: dayPayments,
      });
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const today = new Date();

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

      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={`h-24 border border-gray-200 p-2 transition-all ${
            hasEvents ? 'cursor-pointer hover:bg-blue-50 hover:shadow-md' : 'bg-white'
          } ${isToday ? 'ring-2 ring-primary-500' : ''}`}
        >
          <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-primary-600' : 'text-gray-700'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayClasses.slice(0, 2).map((c, idx) => (
              <div key={idx} className="text-xs px-1 py-0.5 bg-blue-100 text-blue-800 rounded truncate">
                {new Date(c.class_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {c.student_name}
              </div>
            ))}
            {dayPayments.slice(0, 1).map((p, idx) => (
              <div key={idx} className="text-xs px-1 py-0.5 bg-green-100 text-green-800 rounded truncate">
                ${p.amount} - {p.student_name}
              </div>
            ))}
            {(dayClasses.length + dayPayments.length) > 3 && (
              <div className="text-xs text-gray-500 font-semibold">
                +{dayClasses.length + dayPayments.length - 3} more
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
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
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
      <div className="mt-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
          <span className="text-gray-600">{t('calendar.legend.classes')}</span>
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

      {/* Day Details Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedDay.date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Classes */}
            {selectedDay.classes.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-500" />
                  {t('calendar.detail.classes')} ({selectedDay.classes.length})
                </h4>
                <div className="space-y-3">
                  {selectedDay.classes.map((classItem) => (
                    <div key={classItem.id} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-gray-900">{classItem.student_name}</div>
                          <div className="text-sm text-gray-600">{classItem.student_email}</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          classItem.status === 'completed' ? 'bg-green-100 text-green-800' :
                          classItem.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {t(`dashboard.status.${classItem.status}`)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-700">
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {new Date(classItem.class_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div>{classItem.duration_minutes} {t('dashboard.minutes')}</div>
                        {classItem.topic && <div className="font-medium">{classItem.topic}</div>}
                      </div>
                      {classItem.payment_amount && (
                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
                          <span className={`font-semibold ${
                            classItem.payment_status === 'paid' ? 'text-green-600' :
                            classItem.payment_status === 'pending' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            ${classItem.payment_amount} - {t(`dashboard.${classItem.payment_status}`)}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payments */}
            {selectedDay.payments.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-green-500" />
                  {t('calendar.detail.payments')} ({selectedDay.payments.length})
                </h4>
                <div className="space-y-3">
                  {selectedDay.payments.map((payment) => (
                    <div key={payment.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-gray-900">{payment.student_name}</div>
                          <div className="text-sm text-gray-600">{payment.student_email}</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          payment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-green-600 mb-2">
                        ${payment.amount}
                      </div>
                      <div className="text-sm text-gray-700">
                        {payment.payment_method && <div>Method: {payment.payment_method}</div>}
                        {payment.reference_number && <div>Ref: {payment.reference_number}</div>}
                        {payment.message && <div className="mt-2 text-gray-600">{payment.message}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

