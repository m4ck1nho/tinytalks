'use client';

import { useMemo } from 'react';
import { Class } from '@/types';
import { formatDateLong } from '@/lib/dateUtils';
import { 
  ClockIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  UserIcon
} from '@heroicons/react/24/outline';
interface DailyScheduleViewProps {
  date: Date;
  classes: Class[];
  onClose: () => void;
}

export default function DailyScheduleView({ date, classes, onClose }: DailyScheduleViewProps) {
  const sortedClasses = useMemo(() => {
    return [...classes].sort(
      (a, b) => new Date(a.class_date).getTime() - new Date(b.class_date).getTime()
    );
  }, [classes]);

  const formatTimeForDisplay = (dateString: string) => {
    const classDate = new Date(dateString);
    const hours = classDate.getHours();
    const minutes = classDate.getMinutes().toString().padStart(2, '0');
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-secondary-900">
              {formatDateLong(date, 'ru')}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Расписание на день</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="space-y-4">
          {sortedClasses.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              Нет занятий
            </div>
          ) : (
            sortedClasses.map((classItem) => {
              const isUnpaid =
                classItem.payment_status === 'unpaid' ||
                classItem.payment_status === 'pending' ||
                classItem.status === 'pending_payment';
              const isScheduled = classItem.status === 'scheduled';
              const cardBg = isUnpaid
                ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-300'
                : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300';
              const iconColor = isUnpaid ? 'text-red-600' : isScheduled ? 'text-blue-600' : 'text-blue-600';
              const textColor = isUnpaid ? 'text-red-900' : 'text-blue-900';

              return (
                <div
                  key={classItem.id || classItem.class_date}
                  className={`p-4 rounded-xl border ${cardBg}`}
                >
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className="flex items-center gap-2 min-w-[140px]">
                      <ClockIcon className={`w-5 h-5 ${iconColor}`} />
                      <div>
                        <div className={`font-semibold ${textColor}`}>
                          {formatTimeForDisplay(classItem.class_date)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {classItem.duration_minutes || 50} минут
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <UserIcon className={`w-5 h-5 ${iconColor}`} />
                          <div>
                            <div className="font-semibold text-gray-900">{classItem.student_name}</div>
                            <div className="text-sm text-gray-600">{classItem.student_email}</div>
                          </div>
                        </div>
                        {classItem.topic && (
                          <div className="text-sm text-gray-700 bg-white/70 px-3 py-1 rounded-lg">
                            {classItem.topic}
                          </div>
                        )}
                        {classItem.class_type && (
                          <div className="text-xs text-gray-600 bg-white/70 px-2 py-1 rounded">
                            {classItem.class_type}
                          </div>
                        )}
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            classItem.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : classItem.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : classItem.status === 'pending_payment'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {classItem.status === 'completed' ? 'Завершено' :
                           classItem.status === 'cancelled' ? 'Отменено' :
                           classItem.status === 'pending_payment' ? 'Ожидает оплаты' :
                           classItem.status === 'scheduled' ? 'Запланировано' :
                           classItem.status === 'pending' ? 'Ожидает' :
                           classItem.status}
                        </span>
                      </div>

                      {classItem.notes && (
                        <div className="text-xs text-gray-600 bg-white/50 px-3 py-2 rounded-lg">
                          <span className="font-medium">Заметки: </span>
                          {classItem.notes}
                        </div>
                      )}

                      {classItem.payment_amount !== null && classItem.payment_amount !== undefined && (
                        <div className="flex items-center gap-2 text-sm">
                          <CurrencyDollarIcon
                            className={`w-4 h-4 ${
                              classItem.payment_status === 'paid'
                                ? 'text-green-600'
                                : classItem.payment_status === 'pending' || classItem.status === 'pending_payment'
                                ? 'text-red-600'
                                : 'text-red-600'
                            }`}
                          />
                          <span
                            className={`font-semibold ${
                              classItem.payment_status === 'paid'
                                ? 'text-green-600'
                                : classItem.payment_status === 'pending' || classItem.status === 'pending_payment'
                                ? 'text-red-600'
                                : 'text-red-600'
                            }`}
                          >
                            ₽{classItem.payment_amount}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              classItem.payment_status === 'paid'
                                ? 'bg-green-100 text-green-700'
                                : classItem.payment_status === 'pending' || classItem.status === 'pending_payment'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {classItem.payment_status === 'paid'
                              ? 'Оплачено'
                              : classItem.payment_status === 'pending' || classItem.status === 'pending_payment'
                              ? 'Ожидает подтверждения'
                              : 'Не оплачено'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

