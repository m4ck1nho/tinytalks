'use client';

import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/supabase';
import { Class, ClassRequest } from '@/types';
import { formatDateLong, formatTime, formatDateTime } from '@/lib/dateUtils';
import Notification from '@/components/shared/Notification';
import { 
  CalendarIcon, 
  ClockIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  BellAlertIcon,
  InformationCircleIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  BookOpenIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';

const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type ScheduleItem = {
  id: string;
  primary: string;
  secondary?: string;
  time?: string;
  meta?: string;
  type: 'weekly' | 'preferred' | 'single';
};

const formatTimeDisplay = (time?: string | null) => {
  if (!time) return '';
  try {
    if (time.includes('T')) {
      return formatTime(time);
    }
    const [hourStr, minuteStr] = time.split(':');
    if (hourStr === undefined || minuteStr === undefined) return time;
    const date = new Date();
    date.setHours(Number(hourStr), Number(minuteStr), 0, 0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    console.error('Error formatting time:', error);
    return time;
  }
};

const formatDateDisplay = (dateStr?: string | null) => {
  if (!dateStr) return '';
  try {
    return formatDateLong(dateStr);
  } catch {
    try {
      const date = new Date(dateStr);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
    } catch {
      // ignore
    }
    return dateStr;
  }
};

const buildScheduleItems = (request: ClassRequest): ScheduleItem[] => {
  const items: ScheduleItem[] = [];

  if (request.weekly_schedule) {
    try {
      const schedule = JSON.parse(request.weekly_schedule);
      if (Array.isArray(schedule)) {
        schedule.forEach((slot: any, idx: number) => {
          if (slot == null) return;
          const rawDay = typeof slot.day_of_week === 'number' ? slot.day_of_week : Number(slot.day_of_week);
          const dayIndex = Number.isFinite(rawDay) ? ((rawDay % 7) + 7) % 7 : undefined;
          const dayName = dayIndex !== undefined ? weekdayNames[dayIndex] : 'Weekly Slot';
          const timeDisplay = slot.time ? formatTimeDisplay(slot.time) : undefined;

          items.push({
            id: `weekly-${idx}`,
            primary: dayName,
            secondary: 'Repeats weekly',
            time: timeDisplay,
            meta: timeDisplay ? undefined : 'Time not specified',
            type: 'weekly',
          });
        });
      }
    } catch (error) {
      console.error('Error parsing weekly schedule:', error);
    }
  }

  if (request.preferred_schedules) {
    try {
      const preferred = JSON.parse(request.preferred_schedules);
      if (Array.isArray(preferred)) {
        preferred.forEach((slot: any, idx: number) => {
          if (slot == null) return;
          const dateLabel = slot.date ? formatDateDisplay(slot.date) : 'Preferred date';
          let weekdayLabel: string | undefined;
          if (slot.date) {
            const date = new Date(slot.date);
            if (!Number.isNaN(date.getTime())) {
              weekdayLabel = date.toLocaleDateString(undefined, { weekday: 'long' });
            }
          }
          const timeDisplay = slot.time ? formatTimeDisplay(slot.time) : undefined;

          items.push({
            id: `preferred-${idx}`,
            primary: dateLabel,
            secondary: slot.time ? 'Student preferred slot' : 'Student preferred date',
            time: timeDisplay,
            meta: weekdayLabel && !dateLabel.includes(weekdayLabel) ? weekdayLabel : undefined,
            type: 'preferred',
          });
        });
      }
    } catch (error) {
      console.error('Error parsing preferred schedules:', error);
    }
  }

  if (!items.length && (request.preferred_date || request.preferred_time)) {
    const dateLabel = request.preferred_date ? formatDateDisplay(request.preferred_date) : 'Preferred date';
    let weekdayLabel: string | undefined;
    if (request.preferred_date) {
      const date = new Date(request.preferred_date);
      if (!Number.isNaN(date.getTime())) {
        weekdayLabel = date.toLocaleDateString(undefined, { weekday: 'long' });
      }
    }

    items.push({
      id: 'single-0',
      primary: dateLabel,
      secondary: 'Single requested date',
      time: request.preferred_time ? formatTimeDisplay(request.preferred_time) : undefined,
      meta: weekdayLabel,
      type: 'single',
    });
  }

  return items;
};

const scheduleTypeStyles: Record<
  ScheduleItem['type'],
  { container: string; badge: string; time: string; secondary: string; icon: string }
> = {
  weekly: {
    container: 'border-green-200 bg-white/80',
    badge: 'bg-green-100 text-green-700',
    time: 'bg-green-100 text-green-900',
    secondary: 'text-green-600',
    icon: '🔁',
  },
  preferred: {
    container: 'border-blue-200 bg-white/80',
    badge: 'bg-blue-100 text-blue-700',
    time: 'bg-blue-100 text-blue-900',
    secondary: 'text-blue-600',
    icon: '⭐',
  },
  single: {
    container: 'border-purple-200 bg-white/80',
    badge: 'bg-purple-100 text-purple-700',
    time: 'bg-purple-100 text-purple-900',
    secondary: 'text-purple-600',
    icon: '📍',
  },
};

export default function ScheduleManager({ onDataChange }: { onDataChange?: () => void }) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [classRequests, setClassRequests] = useState<ClassRequest[]>([]);
  const [users, setUsers] = useState<{ student_id: string; student_name: string; student_email: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [approvingRequest, setApprovingRequest] = useState<ClassRequest | null>(null);
  const [useExistingStudent, setUseExistingStudent] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [pendingRejectId, setPendingRejectId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ClassRequest | null>(null);
  const [editFormData, setEditFormData] = useState<{
    weekly_schedule?: string;
    total_lessons?: number;
    lessons_per_week?: number;
    payment_preference?: string;
    topic?: string;
    message?: string;
    admin_notes?: string;
  }>({});
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message?: string;
  } | null>(null);
  const triggerParentRefresh = () => {
    if (typeof onDataChange === 'function') {
      onDataChange();
    }
  };
  const [formData, setFormData] = useState({
    student_name: '',
    student_email: '',
    student_id: '',
    class_date: '',
    duration_minutes: 50,
    class_type: 'Individual',
    topic: '',
    notes: '',
    payment_amount: '',
  });

  const selectedRequestScheduleItems = useMemo(
    () => (selectedRequest ? buildScheduleItems(selectedRequest) : []),
    [selectedRequest]
  );

  const renderScheduleSection = (items: ScheduleItem[], request?: ClassRequest) => {
    if (!items.length) return null;

    return (
      <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-300 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="w-6 h-6 text-green-600" />
          <h4 className="font-bold text-green-900 text-lg">Schedule Overview</h4>
        </div>
        <div className="space-y-3">
          {items.map((item) => {
            const style = scheduleTypeStyles[item.type];
            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${style.container}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${style.badge}`}>
                    {style.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{item.primary}</div>
                    {item.meta && <div className="text-xs text-gray-500">{item.meta}</div>}
                    {item.secondary && (
                      <div className={`text-xs font-medium mt-1 ${style.secondary}`}>{item.secondary}</div>
                    )}
                  </div>
                </div>
                {item.time && (
                  <div
                    className={`px-3 py-1 rounded-lg text-sm font-semibold shadow-sm shadow-black/5 ${style.time}`}
                  >
                    {item.time}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 bg-white/60 rounded-lg border border-green-200">
          <p className="text-sm font-semibold text-green-900">⏱️ Each class: 50 minutes</p>
          {request?.lessons_per_week && (
            <p className="text-sm text-green-800 mt-1">
              📆 Lessons per week: <strong>{request.lessons_per_week}</strong>
            </p>
          )}
          {request?.total_lessons && (
            <p className="text-sm text-green-800 mt-1">
              📚 Total classes to generate: <strong>{request.total_lessons}</strong>
            </p>
          )}
          {request?.first_class_free && (
            <p className="text-sm text-green-800 mt-1">
              🎁 First class is <strong>FREE</strong>
            </p>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchClasses();
    fetchClassRequests();
    fetchUsers();

    const classesSubscription = db.subscribeToClasses(() => {
      fetchClasses();
    });

    const requestsSubscription = db.subscribeToClassRequests(() => {
      fetchClassRequests();
    });

    return () => {
      classesSubscription.unsubscribe();
      requestsSubscription.unsubscribe();
    };
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    const { data, error } = await db.getClasses();
    if (error) {
      console.error('Error fetching classes:', error);
    } else {
      setClasses(data || []);
    }
    setLoading(false);
  };

  const fetchClassRequests = async () => {
    const { data, error } = await db.getClassRequests();
    if (error) {
      console.error('Error fetching class requests:', error);
    } else {
      setClassRequests(data || []);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await db.getAllUsers();
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data || []);
    }
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
    const student = users.find(u => u.student_id === studentId);
    if (student) {
      setFormData({
        ...formData,
        student_id: student.student_id,
        student_name: student.student_name,
        student_email: student.student_email,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check availability if date is provided
    if (formData.class_date) {
      const dateTime = formData.class_date;
      const availability = await db.checkTeacherAvailability(dateTime, formData.duration_minutes || 50);
      
      if (!availability.available && !editingClass) {
        setNotification({
          type: 'error',
          title: 'Cannot Schedule Class',
          message: `${availability.reason}. Please check teacher availability.`
        });
        return;
      }
    }
    
    const classDateIso = formData.class_date ? new Date(formData.class_date).toISOString() : '';

    const classData = {
      ...formData,
      class_date: classDateIso,
      payment_amount: formData.payment_amount ? parseFloat(formData.payment_amount) : null,
      status: approvingRequest ? 'pending_payment' : 'scheduled',
      payment_status: approvingRequest ? 'pending' : 'unpaid',
    };

    try {
      if (editingClass) {
        await db.updateClass(editingClass.id, classData);
      } else {
        await db.createClass(classData);
      }
      
      // If this was from a request approval, mark the request as approved
      if (approvingRequest) {
        await db.updateClassRequest(approvingRequest.id, { status: 'awaiting_payment' });
      }
      
      if (approvingRequest) {
        setNotification({
          type: 'info',
          title: 'Payment Pending',
          message: 'Classes are queued and will appear on the calendar once the student confirms payment.',
        });
      } else {
        setNotification({
          type: 'success',
          title: editingClass ? 'Class Updated' : 'Class Scheduled',
          message: editingClass ? 'The class details have been updated.' : 'New class has been scheduled successfully.',
        });
      }
      resetForm();
      await fetchClasses();
      await fetchClassRequests();
      triggerParentRefresh();
    } catch (error) {
      console.error('Error saving class:', error);
      setNotification({
        type: 'error',
        title: 'Error Saving Class',
        message: 'Please try again or contact support if the issue persists.',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      student_name: '',
      student_email: '',
      student_id: '',
      class_date: '',
      duration_minutes: 50,
      class_type: 'Individual',
      topic: '',
      notes: '',
      payment_amount: '',
    });
    setUseExistingStudent(false);
    setSelectedStudentId('');
    setEditingClass(null);
    setApprovingRequest(null);
    setShowForm(false);
  };


  const handleRequestApproveClick = (request: ClassRequest) => {
    // For pending requests, first show details modal
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleConfirmFromDetails = () => {
    // Close details modal and open final confirmation
    setShowDetailsModal(false);
    setShowApproveConfirm(true);
  };

  const handleEditApprovedRequest = (request: ClassRequest) => {
    setSelectedRequest(request);
    // Pre-fill edit form with current request data
    setEditFormData({
      weekly_schedule: request.weekly_schedule || '',
      total_lessons: request.total_lessons || 4,
      lessons_per_week: request.lessons_per_week || 1,
      payment_preference: request.payment_preference || 'all_at_once',
      topic: request.topic || '',
      message: request.message || '',
      admin_notes: request.admin_notes || '',
    });
    setShowEditModal(true);
  };

  const handleSaveTeacherEdits = async () => {
    if (!selectedRequest) return;
    
    try {
      // Store teacher's edits as JSON
      const teacherEdits = {
        weekly_schedule: editFormData.weekly_schedule,
        total_lessons: editFormData.total_lessons,
        lessons_per_week: editFormData.lessons_per_week,
        payment_preference: editFormData.payment_preference,
        topic: editFormData.topic,
        message: editFormData.message,
        admin_notes: editFormData.admin_notes,
      };
      
      // Update request with teacher edits and set status to teacher_edited
      await db.updateClassRequest(selectedRequest.id, {
        status: 'teacher_edited',
        teacher_edits: JSON.stringify(teacherEdits),
        weekly_schedule: editFormData.weekly_schedule,
        total_lessons: editFormData.total_lessons,
        lessons_per_week: editFormData.lessons_per_week,
        payment_preference: editFormData.payment_preference,
        topic: editFormData.topic,
        message: editFormData.message,
        admin_notes: editFormData.admin_notes,
      });
      
      setNotification({
        type: 'success',
        title: 'Edits Sent!',
        message: 'Your edits have been sent to the student for approval.'
      });
      await fetchClassRequests();
      triggerParentRefresh();
      setShowEditModal(false);
      setSelectedRequest(null);
      setEditFormData({});
    } catch (error) {
      console.error('Error saving teacher edits:', error);
      setNotification({
        type: 'error',
        title: 'Error Saving Edits',
        message: 'Please try again.'
      });
    }
  };

  const handleRequestApproveConfirm = async () => {
    if (!selectedRequest) return;
    
    const request = selectedRequest;
    setShowApproveConfirm(false);
    if (!request.weekly_schedule) {
      setNotification({
        type: 'warning',
        title: 'Weekly Schedule Required',
        message: 'This request does not include a weekly schedule yet. Ask the student to submit their preferred weekly times before approving.'
      });
      setSelectedRequest(null);
      return;
    }

    try {
      const parsedSchedule = JSON.parse(request.weekly_schedule);
      const weeklySchedule = Array.isArray(parsedSchedule) ? parsedSchedule : [];

      if (!weeklySchedule.length) {
        setNotification({
          type: 'warning',
          title: 'Schedule Missing',
          message: 'No recurring schedule could be found for this request. Please edit the request to add at least one weekly slot.'
        });
        setSelectedRequest(null);
        return;
      }

      const normalizedSchedule = weeklySchedule
        .map((slot: any) => ({
          day_of_week: Number(slot.day_of_week),
          time: typeof slot.time === 'string' ? slot.time : '',
        }))
        .filter((slot) => Number.isInteger(slot.day_of_week) && slot.time);

      if (!normalizedSchedule.length) {
        setNotification({
          type: 'warning',
          title: 'Schedule Invalid',
          message: 'The weekly schedule is incomplete. Please ensure each slot has a valid day and time.'
        });
        setSelectedRequest(null);
        return;
      }

      const totalLessons = request.total_lessons || 4;

      // Check availability for each weekly schedule slot
      const today = new Date();
      for (const schedule of normalizedSchedule) {
        const daysUntilNext = (schedule.day_of_week - today.getDay() + 7) % 7 || 7;
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + daysUntilNext);
        const [slotHour, slotMinute] = schedule.time.split(':').map((value: string) => parseInt(value, 10));
        nextDate.setHours(slotHour, slotMinute, 0, 0);

        const dateTime = nextDate.toISOString();
        const availability = await db.checkTeacherAvailability(dateTime, 50);

        if (!availability.available) {
          const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          setNotification({
            type: 'error',
            title: 'Cannot Approve Request',
            message: `${dayNames[schedule.day_of_week]} at ${schedule.time} is not available: ${availability.reason}`
          });
          setSelectedRequest(null);
          return;
        }
      }

      const { data: generatedClasses, error } = await db.generateClassesFromWeeklySchedule(
        request.student_id,
        request.student_name,
        request.student_email,
        normalizedSchedule,
        totalLessons
      );

      if (error) {
        console.error('Error generating classes:', error);
        setNotification({
          type: 'error',
          title: 'Error Generating Classes',
          message: error.message || JSON.stringify(error)
        });
        setSelectedRequest(null);
        return;
      }

      if (!generatedClasses || generatedClasses.length === 0) {
        setNotification({
          type: 'error',
          title: 'No Classes Generated',
          message: 'No classes were generated for this request. Please review the schedule and try again.'
        });
        setSelectedRequest(null);
        return;
      }

      const updateResult = await db.updateClassRequest(request.id, { status: 'awaiting_payment' });

      if (updateResult.error) {
        console.error('Error updating request status:', updateResult.error);
        setNotification({
          type: 'warning',
          title: 'Partial Success',
          message: `Classes were generated but the request status failed to update: ${updateResult.error.message}`
        });
      } else {
        setNotification({
          type: 'success',
          title: 'Awaiting Payment',
          message: `Created ${generatedClasses.length} classes. Ask the student to complete payment before the schedule is confirmed.`
        });
      }

      await fetchClasses();
      await fetchClassRequests();
      triggerParentRefresh();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error approving request:', error);
      setNotification({
        type: 'error',
        title: 'Error Approving Request',
        message: error instanceof Error ? error.message : JSON.stringify(error)
      });
      setSelectedRequest(null);
    }
  };

  const handleRequestRejectClick = (request: ClassRequest) => {
    setSelectedRequest(request);
    setPendingRejectId(request.id);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!pendingRejectId) return;
    
    try {
      await db.updateClassRequest(pendingRejectId, { status: 'rejected' });
      await fetchClassRequests();
      triggerParentRefresh();
      setShowRejectModal(false);
      setPendingRejectId(null);
      setSelectedRequest(null);
      setNotification({
        type: 'info',
        title: 'Request Rejected',
        message: 'The student has been notified about the rejection.',
      });
    } catch (error) {
      console.error('Error rejecting request:', error);
      setNotification({
        type: 'error',
        title: 'Error Rejecting Request',
        message: 'Please try again in a moment.',
      });
    }
  };


  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setApprovingRequest(null); // Clear any pending request approval
    setFormData({
      student_name: classItem.student_name,
      student_email: classItem.student_email,
      student_id: classItem.student_id,
      class_date: classItem.class_date.slice(0, 16),
      duration_minutes: classItem.duration_minutes,
      class_type: classItem.class_type || 'Individual',
      topic: classItem.topic || '',
      notes: classItem.notes || '',
      payment_amount: classItem.payment_amount?.toString() || '',
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    
    try {
      await db.deleteClass(pendingDeleteId);
      await fetchClasses();
      triggerParentRefresh();
      setShowDeleteModal(false);
      setPendingDeleteId(null);
    } catch (error) {
      console.error('Error deleting class:', error);
      setNotification({
        type: 'error',
        title: 'Error Deleting Class',
        message: 'We could not delete this class. Please retry.',
      });
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await db.updateClass(id, { status });
      await fetchClasses();
      triggerParentRefresh();
    } catch (error) {
      console.error('Error updating status:', error);
      setNotification({
        type: 'error',
        title: 'Status Update Failed',
        message: 'Unable to update the class status. Please try again.',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Schedule</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Schedule New Class
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {editingClass ? 'Edit Class' : approvingRequest ? 'Approve Class Request' : 'Schedule New Class'}
            </h3>
            {approvingRequest && (
              <span className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                Approving Request
              </span>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingClass && !approvingRequest && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useExistingStudent}
                    onChange={(e) => setUseExistingStudent(e.target.checked)}
                    className="w-4 h-4 text-primary-500 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Select from registered students</span>
                </label>
                
                {useExistingStudent && users.length > 0 && (
                  <div className="mt-3">
                    <select
                      value={selectedStudentId}
                      onChange={(e) => handleStudentSelect(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Choose a student...</option>
                      {users.map((user) => (
                        <option key={user.student_id} value={user.student_id}>
                          {user.student_name} ({user.student_email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  disabled={useExistingStudent && selectedStudentId !== ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Email</label>
                <input
                  type="email"
                  required
                  value={formData.student_email}
                  onChange={(e) => setFormData({ ...formData, student_email: e.target.value })}
                  disabled={useExistingStudent && selectedStudentId !== ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.class_date}
                  onChange={(e) => setFormData({ ...formData, class_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                <input
                  type="number"
                  required
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Type</label>
                <select
                  value={formData.class_type}
                  onChange={(e) => setFormData({ ...formData, class_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option>Individual</option>
                  <option>Group</option>
                  <option>Trial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Grammar: Past Perfect Tense"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount (₽)</label>
              <input
                type="number"
                step="0.01"
                value={formData.payment_amount}
                onChange={(e) => setFormData({ ...formData, payment_amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="2500.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Any special notes for this class..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                {editingClass ? 'Update Class' : approvingRequest ? 'Approve & Schedule Class' : 'Schedule Class'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Class Requests */}
      {classRequests.filter(r => r.status === 'pending').length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <BellAlertIcon className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Class Requests ({classRequests.filter(r => r.status === 'pending').length})
            </h3>
          </div>
          <div className="space-y-3">
            {classRequests
              .filter(r => r.status === 'pending')
              .map((request) => {
                const scheduleItems = buildScheduleItems(request);
                return (
                  <div key={request.id} className="bg-white rounded-lg p-4 border border-yellow-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <UserIcon className="w-5 h-5 text-gray-600" />
                          <span className="font-semibold text-gray-900">{request.student_name}</span>
                          <span className="text-sm text-gray-500">({request.student_email})</span>
                        </div>
                        <div className="text-sm text-gray-700 mb-1">
                          <strong>Lessons per week:</strong> {request.lessons_per_week || '-'}
                        </div>
                        <div className="text-sm text-gray-700 mb-1">
                          <strong>Total lessons:</strong> {request.total_lessons || 4}{' '}
                          {request.first_class_free && '(First lesson is free!)'}
                        </div>
                        {request.topic && (
                          <div className="text-sm text-gray-700 mb-1">
                            <strong>Topic:</strong> {request.topic}
                          </div>
                        )}
                        {request.message && (
                          <div className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                            {request.message}
                          </div>
                        )}
                        {scheduleItems.length > 0 && (
                          <div className="mt-4">
                            {renderScheduleSection(scheduleItems, request)}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-3">
                          Requested: {new Date(request.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleRequestApproveClick(request)}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center gap-1.5 shadow-sm"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRequestRejectClick(request)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center gap-1.5 shadow-sm"
                        >
                          <XCircleIcon className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Awaiting Payment Requests */}
      {classRequests.filter(r => r.status === 'awaiting_payment').length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Awaiting Payment ({classRequests.filter(r => r.status === 'awaiting_payment').length})
            </h3>
          </div>
          <div className="space-y-3">
            {classRequests.filter(r => r.status === 'awaiting_payment').map((request) => (
              <div key={request.id} className="bg-white rounded-lg p-4 border border-green-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <UserIcon className="w-5 h-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">{request.student_name}</span>
                      <span className="text-sm text-gray-500">({request.student_email})</span>
                    </div>
                    {request.lessons_per_week && (
                      <div className="text-sm text-gray-700 mb-1">
                        <strong>Lessons per week:</strong> {request.lessons_per_week}
                      </div>
                    )}
                    {request.total_lessons && (
                      <div className="text-sm text-gray-700 mb-1">
                        <strong>Total lessons:</strong> {request.total_lessons} {request.first_class_free && '(First lesson is free!)'}
                      </div>
                    )}
                    {request.topic && (
                      <div className="text-sm text-gray-700 mb-1">
                        <strong>Topic:</strong> {request.topic}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      Awaiting Payment Since: {new Date(request.updated_at).toLocaleString()}
                    </div>
                    <div className="mt-3 p-3 bg-green-50 rounded border border-green-200 text-sm text-green-800">
                      Share payment instructions with the student. Classes will appear on the calendar once payment is confirmed.
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditApprovedRequest(request)}
                      className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-1.5 shadow-sm"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No classes scheduled yet
                  </td>
                </tr>
              ) : (
                classes.map((classItem) => (
                  <tr key={classItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{classItem.student_name}</div>
                          <div className="text-sm text-gray-500">{classItem.student_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(classItem.class_date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            {new Date(classItem.class_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {' '}({classItem.duration_minutes}min)
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{classItem.topic || '-'}</div>
                      <div className="text-xs text-gray-500">{classItem.class_type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={classItem.status}
                        onChange={(e) => updateStatus(classItem.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(classItem.status)}`}
                      >
                        <option value="pending_payment">Pending Payment</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-block text-xs px-2 py-1 rounded-full font-semibold ${getPaymentColor(classItem.payment_status)}`}>
                        {classItem.payment_status}
                      </div>
                      {classItem.payment_amount && (
                        <div className="text-sm text-gray-600 mt-1">₽{classItem.payment_amount}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(classItem)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(classItem.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
                <InformationCircleIcon className="w-7 h-7 text-blue-500" />
                Class Request Details
              </h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedRequest(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Student Information</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {selectedRequest.student_name}</p>
                  <p><strong>Email:</strong> {selectedRequest.student_email}</p>
                </div>
              </div>

              {renderScheduleSection(selectedRequestScheduleItems, selectedRequest)}

              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpenIcon className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-900">Class Details</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-white/70 rounded-lg">
                    <p><strong>Total Lessons:</strong> {selectedRequest.total_lessons || 4}</p>
                  </div>
                  <div className="p-3 bg-white/70 rounded-lg">
                    <p><strong>Lessons Per Week:</strong> {selectedRequest.lessons_per_week || 1}</p>
                  </div>
                  <div className="p-3 bg-white/70 rounded-lg">
                    <p><strong>First Class Free:</strong> {selectedRequest.first_class_free ? '✅ Yes' : 'No'}</p>
                  </div>
                  {selectedRequest.topic && (
                    <div className="p-3 bg-white/70 rounded-lg">
                      <p><strong>Topic:</strong> {selectedRequest.topic}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedRequest.payment_preference && (
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                  <div className="flex items-center gap-2 mb-3">
                    <CurrencyDollarIcon className="w-5 h-5 text-yellow-600" />
                    <h4 className="font-semibold text-yellow-900">Payment</h4>
                  </div>
                  <p className="text-sm">
                    <strong>Preference:</strong> {selectedRequest.payment_preference === 'weekly' ? 'Pay Weekly' : 'Pay All at Once'}
                  </p>
                </div>
              )}

              {selectedRequest.message && (
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">Student Message</h4>
                  </div>
                  <p className="text-sm text-gray-700">{selectedRequest.message}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedRequest(null);
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmFromDetails}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
              >
                <CheckCircleIcon className="w-5 h-5" />
                Approve Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {showApproveConfirm && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary-900">Final Approval Confirmation</h3>
                <p className="text-sm text-gray-600 mt-1">Review and confirm class generation</p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <p className="text-gray-900 mb-2">
                You are about to approve the class request for:
              </p>
              <p className="text-lg font-bold text-blue-900">
                {selectedRequest.student_name} ({selectedRequest.student_email})
              </p>
            </div>

            {selectedRequestScheduleItems.length > 0 && (
              <div className="mb-6">
                {renderScheduleSection(selectedRequestScheduleItems, selectedRequest)}
              </div>
            )}

            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-xl space-y-2">
              <p className="text-sm text-yellow-900 font-medium">
                ⚠️ Approving will generate {selectedRequest.total_lessons || 4} classes, but they stay hidden until payment is confirmed.
              </p>
              <p className="text-xs text-yellow-800">
                Share payment instructions with the student and confirm payment in the Payments tab once it is received.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowApproveConfirm(false);
                  setSelectedRequest(null);
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestApproveConfirm}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg shadow-green-500/30"
              >
                Yes, Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 max-w-md w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                <XCircleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary-900">Reject Class Request?</h3>
                <p className="text-sm text-gray-600 mt-1">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to reject this class request from <strong>{selectedRequest?.student_name}</strong>? The student will be notified of this decision.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setPendingRejectId(null);
                  setSelectedRequest(null);
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40"
              >
                Yes, Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Approved Request Modal */}
      {showEditModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
                <PencilIcon className="w-7 h-7 text-blue-500" />
                Edit Approved Request
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedRequest(null);
                  setEditFormData({});
                }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-gray-700">
                Edit the approved request details. Your changes will be sent to <strong>{selectedRequest.student_name}</strong> for approval.
              </p>

              {/* Weekly Schedule */}
              {selectedRequest.weekly_schedule && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Schedule (JSON)</label>
                  <textarea
                    value={editFormData.weekly_schedule || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, weekly_schedule: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder='[{"day_of_week": 1, "time": "10:00"}]'
                  />
                </div>
              )}

              {/* Total Lessons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Lessons</label>
                <input
                  type="number"
                  value={editFormData.total_lessons || 4}
                  onChange={(e) => setEditFormData({ ...editFormData, total_lessons: parseInt(e.target.value) || 4 })}
                  min="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Lessons Per Week */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lessons Per Week</label>
                <input
                  type="number"
                  value={editFormData.lessons_per_week || 1}
                  onChange={(e) => setEditFormData({ ...editFormData, lessons_per_week: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Payment Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Preference</label>
                <select
                  value={editFormData.payment_preference || 'all_at_once'}
                  onChange={(e) => setEditFormData({ ...editFormData, payment_preference: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all_at_once">Pay All at Once</option>
                  <option value="weekly">Pay Weekly</option>
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <input
                  type="text"
                  value={editFormData.topic || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, topic: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes for Student</label>
                <textarea
                  value={editFormData.admin_notes || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, admin_notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="Explain your changes to the student..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedRequest(null);
                  setEditFormData({});
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTeacherEdits}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/30"
              >
                Send to Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 max-w-md w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                <TrashIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary-900">Delete Class?</h3>
                <p className="text-sm text-gray-600 mt-1">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this class? All associated data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPendingDeleteId(null);
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40"
              >
                Delete Class
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

