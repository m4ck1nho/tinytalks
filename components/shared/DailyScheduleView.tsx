'use client';

import { useState, useEffect } from 'react';
import { Class, PaymentNotification } from '@/types';
import { db } from '@/lib/supabase';
import { formatDateLong } from '@/lib/dateUtils';
import { 
  ClockIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  CheckCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

interface DailyScheduleViewProps {
  date: Date;
  classes: Class[];
  payments: PaymentNotification[];
  onClose: () => void;
}

interface TimeSlot {
  time: string;
  hour: number;
  minute: number;
  isBooked: boolean;
  classItem?: Class;
  isAvailable: boolean;
}

export default function DailyScheduleView({ date, classes, payments, onClose }: DailyScheduleViewProps) {
  const { t, language } = useLanguage();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const loadTimeSlots = async () => {
        await generateTimeSlots();
      };
      loadTimeSlots();
    }
  }, [date, classes, mounted]);

  const generateTimeSlots = async () => {
    setLoading(true);
    const slots: TimeSlot[] = [];
    
    // Generate time slots from 8 AM to 8 PM (20:00) in 50-minute intervals
    // Pattern: 8:00, 8:50, 9:40, 10:30, 11:20, 12:10, 13:00, 13:50, etc.
    let currentHour = 8;
    let currentMinute = 0;
    
    while (currentHour < 20 || (currentHour === 20 && currentMinute === 0)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      const slotDate = new Date(date);
      slotDate.setHours(currentHour, currentMinute, 0, 0);
      
      // Skip if slot would end after 8 PM
      const slotEnd = new Date(slotDate.getTime() + 50 * 60000);
      if (slotEnd.getHours() > 20 || (slotEnd.getHours() === 20 && slotEnd.getMinutes() > 0)) {
        break;
      }
        
        // Check if this slot is booked
        const bookedClass = classes.find(c => {
          const classDate = new Date(c.class_date);
          const classEnd = new Date(classDate.getTime() + (c.duration_minutes || 50) * 60000);
          
          // Check if slot overlaps with class
          return (
            (slotDate >= classDate && slotDate < classEnd) ||
            (slotDate.getTime() + 50 * 60000 > classDate.getTime() && slotDate.getTime() + 50 * 60000 <= classEnd.getTime()) ||
            (slotDate <= classDate && slotDate.getTime() + 50 * 60000 >= classEnd.getTime())
          );
        });

        // Check teacher availability for this time
        // If no availability is set, default to available (8 AM - 8 PM)
        const dateTimeString = slotDate.toISOString();
        let availability = { available: true, reason: '' }; // Default to available
        try {
          const availabilityCheck = await db.checkTeacherAvailability(dateTimeString, 50);
          availability = availabilityCheck;
        } catch (error) {
          console.error('Error checking availability:', error);
          // On error, default to available if within 8 AM - 8 PM
          if (currentHour >= 8 && currentHour < 20) {
            availability = { available: true, reason: '' };
          } else {
            availability = { available: false, reason: 'Outside available hours' };
          }
        }
        
        slots.push({
          time: timeString,
          hour: currentHour,
          minute: currentMinute,
          isBooked: !!bookedClass,
          classItem: bookedClass,
          isAvailable: availability.available && !bookedClass,
        });
      
      // Move to next 50-minute slot
      currentMinute += 50;
      if (currentMinute >= 60) {
        currentMinute -= 60;
        currentHour += 1;
      }
    }
    
    setTimeSlots(slots);
    setLoading(false);
  };

  const formatTimeForDisplay = (time: string) => {
    if (language === 'ru') {
      return time;
    }
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${period}`;
  };

  const getClassForSlot = (slot: TimeSlot) => {
    if (!slot.isBooked || !slot.classItem) return null;
    return slot.classItem;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-secondary-900">
              {formatDateLong(date, language)}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{t('calendar.daily.title')}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Time Slots */}
            {timeSlots.map((slot, index) => {
              const classItem = getClassForSlot(slot);
              
              // Determine background color based on payment status for booked classes
              let slotBgColor = '';
              let slotBorderColor = '';
              let slotIconColor = '';
              let slotTextColor = '';
              
              if (slot.isBooked && classItem) {
                const isUnpaid = classItem.payment_status === 'unpaid' || classItem.payment_status === 'pending' || classItem.status === 'pending_payment';
                const isScheduled = classItem.status === 'scheduled';
                if (isUnpaid) {
                  slotBgColor = 'bg-gradient-to-r from-red-50 to-red-100';
                  slotBorderColor = 'border-red-300';
                  slotIconColor = 'text-red-600';
                  slotTextColor = 'text-red-900';
                } else if (isScheduled) {
                  slotBgColor = 'bg-gradient-to-r from-blue-50 to-blue-100';
                  slotBorderColor = 'border-blue-300';
                  slotIconColor = 'text-blue-600';
                  slotTextColor = 'text-blue-900';
                } else {
                  slotBgColor = 'bg-gradient-to-r from-blue-50 to-blue-100';
                  slotBorderColor = 'border-blue-300';
                  slotIconColor = 'text-blue-600';
                  slotTextColor = 'text-blue-900';
                }
              } else if (slot.isAvailable) {
                slotBgColor = 'bg-gradient-to-r from-green-50 to-green-100';
                slotBorderColor = 'border-green-300';
                slotIconColor = 'text-green-600';
                slotTextColor = 'text-green-900';
              } else {
                slotBgColor = 'bg-gray-50';
                slotBorderColor = 'border-gray-200';
                slotIconColor = 'text-gray-400';
                slotTextColor = 'text-gray-500';
              }

              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border transition-all ${
                    slot.isBooked || slot.isAvailable
                      ? `${slotBgColor} ${slotBorderColor} ${!slot.isAvailable ? '' : 'hover:shadow-md'}`
                      : 'opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <ClockIcon className={`w-5 h-5 ${slotIconColor}`} />
                        <span className={`font-semibold ${slotTextColor}`}>
                          {formatTimeForDisplay(slot.time)}
                        </span>
                      </div>
                      
                      {slot.isBooked && classItem ? (
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                              <UserIcon className={`w-5 h-5 ${slotIconColor}`} />
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
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <ClockIcon className="w-4 h-4" />
                          <span>
                            {classItem.duration_minutes || 50} {t('dashboard.minutes')}
                          </span>
                            </div>
                            {classItem.class_type && (
                              <div className="text-xs text-gray-600 bg-white/70 px-2 py-1 rounded">
                                {classItem.class_type}
                              </div>
                            )}
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                              classItem.status === 'completed' ? 'bg-green-100 text-green-800' :
                              classItem.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              classItem.status === 'pending_payment' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {t(`dashboard.status.${classItem.status}`)}
                            </span>
                          </div>
                          {classItem.notes && (
                            <div className="text-xs text-gray-600 bg-white/50 px-3 py-2 rounded-lg">
                              <span className="font-medium">{t('calendar.daily.notes')}: </span>
                              {classItem.notes}
                            </div>
                          )}
                          {classItem.payment_amount !== null && classItem.payment_amount !== undefined && (
                            <div className="flex items-center gap-2 text-sm">
                              <CurrencyDollarIcon className={`w-4 h-4 ${
                                classItem.payment_status === 'paid' ? 'text-green-600' : 
                                classItem.payment_status === 'pending' || classItem.status === 'pending_payment' ? 'text-red-600' : 
                                'text-red-600'
                              }`} />
                              <span className={`font-semibold ${
                                classItem.payment_status === 'paid' ? 'text-green-600' : 
                                classItem.payment_status === 'pending' || classItem.status === 'pending_payment' ? 'text-red-600' : 
                                'text-red-600'
                              }`}>₽{classItem.payment_amount}</span>
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
                                  ? t('dashboard.paid')
                                  : classItem.payment_status === 'pending' || classItem.status === 'pending_payment'
                                  ? t('dashboard.paymentPending')
                                  : t('dashboard.unpaid')}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : slot.isAvailable ? (
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircleIcon className="w-5 h-5" />
                          <span className="font-medium">{t('calendar.daily.available')}</span>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">{t('calendar.daily.notAvailable')}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {!loading && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="text-2xl font-bold text-blue-900">{classes.length}</div>
                <div className="text-sm text-gray-700">{t('calendar.daily.summary.total')}</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="text-2xl font-bold text-green-900">
                  {timeSlots.filter(s => s.isAvailable).length}
                </div>
                <div className="text-sm text-gray-700">{t('calendar.daily.summary.available')}</div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">
                  {timeSlots.filter(s => s.isBooked).length}
                </div>
                <div className="text-sm text-gray-700">{t('calendar.daily.summary.booked')}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

